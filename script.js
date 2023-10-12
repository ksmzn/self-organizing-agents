class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.angle = Math.random() * 2 * Math.PI;
    this.viewRange = 50; // エージェントが他のエージェントを認識する範囲
  }

  // 整列: 近くのエージェントと同じ方向に移動する。
  align(neighbors) {
    if (neighbors.length === 0) return;

    let avgAngle = 0;
    for (let neighbor of neighbors) {
      avgAngle += neighbor.angle;
    }
    avgAngle /= neighbors.length;

    this.angle = avgAngle;
  }

  // 集合: 近くのエージェントに向かって移動する。
  cohesion(neighbors) {
    if (neighbors.length === 0) return;

    let centerX = 0;
    let centerY = 0;
    for (let neighbor of neighbors) {
      centerX += neighbor.x;
      centerY += neighbor.y;
    }
    centerX /= neighbors.length;
    centerY /= neighbors.length;

    this.angle = Math.atan2(centerY - this.y, centerX - this.x);
  }

  // 分離: 他のエージェントとの距離を保つために、近すぎるエージェントから離れる。
  separation(neighbors) {
    if (neighbors.length === 0) return;

    let moveX = 0;
    let moveY = 0;
    for (let neighbor of neighbors) {
      if (
        Math.hypot(this.x - neighbor.x, this.y - neighbor.y) <
        this.viewRange / 2
      ) {
        moveX += this.x - neighbor.x;
        moveY += this.y - neighbor.y;
      }
    }

    this.angle += Math.atan2(moveY, moveX);
  }

  getNeighbors(agents) {
    let neighbors = [];
    for (let agent of agents) {
      if (
        agent !== this &&
        Math.hypot(this.x - agent.x, this.y - agent.y) < this.viewRange
      ) {
        neighbors.push(agent);
      }
    }
    return neighbors;
  }

  update(agents) {
    const neighbors = this.getNeighbors(agents);

    this.align(neighbors);
    this.cohesion(neighbors);
    this.separation(neighbors);

    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);

    // 境界処理: エージェントが画面の境界を超えないようにする
    if (this.x < 0) {
      this.x = 0;
      this.angle = -this.angle + Math.PI; // 反射のために角度を反転
    }
    if (this.x > canvas.width) {
      this.x = canvas.width;
      this.angle = -this.angle + Math.PI;
    }
    if (this.y < 0) {
      this.y = 0;
      this.angle = -this.angle;
    }
    if (this.y > canvas.height) {
      this.y = canvas.height;
      this.angle = -this.angle;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const numAgents = 100;
const agents = [];

for (let i = 0; i < numAgents; i++) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  agents.push(new Agent(x, y));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let agent of agents) {
    agent.update(agents); // ここでagents配列を渡しています。
    agent.draw(ctx);
  }

  requestAnimationFrame(animate);
}

// 初期化
document
  .getElementById("initButton")
  .addEventListener("click", initializeAgents);

function initializeAgents() {
  agents.length = 0; // 既存のエージェントをクリアします
  for (let i = 0; i < numAgents; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    agents.push(new Agent(x, y));
  }
}

animate();
