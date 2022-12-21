Game.ball = {
  dx: 0,
  dy: 0,
  frame: 0,
  velocity: 3,
  x: 320,
  y: 280,
  width: 20,
  height: 20,
  start() {
    this.dy = -this.velocity;
    this.dx = Game.random(-this.velocity, this.velocity);
    this.animate();
  },
  animate() {
    setInterval(() => {
      this.frame += 1;
      if (this.frame > 3) {
        this.frame = 0;
      }
    }, 100);
  },
  move() {
    if (this.dy) {
      this.y += this.dy
    }
    if (this.dx) {
      this.x += this.dx
    }
  },
  collide(element) {
    let newElement = false;

    if (this.x + this.dx + this.width > element.x &&
      this.x + this.dx < element.x + element.width &&
      this.y + this.dy + this.height > element.y &&
      this.y + this.dy < element.y + element.height) {
      newElement = true;
    }
    return newElement;
  },
  bumpBlock(block) {
    this.dy *= -1;
    block.active = false;
  },
  bumpPlatform(platform) {
    if (platform.dx) {
      this.x += platform.dx
    }
    if (this.dy > 0) {
      this.dy = -this.velocity;
      let touchX = this.x + this.width / 2;
      this.dx = this.velocity * platform.getTouchOffset(touchX);
      Game.sounds.bump.play();
    }
  },
  collideWorldBounds() {
    const x = this.x + this.dx;
    const y = this.y + this.dy;

    const ballLeft = x;
    const ballRight = x + this.width;
    const ballTop = y;
    const ballBottom = y + this.height;

    const worldLeft = 0;
    const worldRight = Game.width;
    const worldTop = 0;
    const worldBottom = Game.height;

    if (ballLeft < worldLeft) {
      this.x = 0;
      this.dx = this.velocity;
      Game.sounds.bump.play();
    } else if (ballRight > worldRight) {
      this.x = worldRight - this.width;
      this.dx = -this.velocity;
      Game.sounds.bump.play();
    } else if (ballTop < worldTop) {
      this.y = 0;
      this.dy = this.velocity;
      Game.sounds.bump.play();
    } else if (ballBottom > worldBottom) {
      Game.end('Game Over')
    }
  }
}
