Game.platform = {
  velocity: 6,
  dx: 0,
  x: 280,
  y: 300,
  width: 100,
  height: 14,
  ball: Game.ball,
  fire() {
    if (this.ball) {
      this.ball.start();
      this.ball = null;
    }
  },
  start(direction) {
    if (direction === KEYS.LEFT) {
      this.dx = -this.velocity;
    } else if (direction === KEYS.RIGHT) {
      this.dx = this.velocity;
    }
  },
  end() {
    this.dx = 0;
  },
  move() {
    if (this.dx) {
      this.x += this.dx;
      if (this.ball) {
        this.ball.x += this.dx;
      }
    }
  },
  getTouchOffset(x) {
    const diff = (this.x + this.width) - x;
    const offset = this.width - diff;
    const result = 2 * offset / this.width;

    return result - 1;
  },
  collideWorldPlatform() {
    const x1 = this.x + this.dx;
    const x2 = this.x + this.dx + this.width;

    const worldLeft = 0;
    const worldRight = Game.width;

    if (worldLeft < x1 && worldRight > x2) {
      this.move()
    }
  }
}
