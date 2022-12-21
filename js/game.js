const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32,
}

const Game = {
  running: true,
  ctx: null,
  platform: null,
  ball: null,
  blocks: [],
  rows: 4,
  cols: 8,
  width: 640,
  height: 360,
  score: 0,
  sprites: {
    ball: null,
    background: null,
    platform: null,
    block: null,
  },
  sounds: {
    bump: null,
  },

  init() {
    this.ctx = document.getElementById('myCanvas').getContext('2d');
    this.ctx.fillStyle = '#FFFFFFFF';
    this.ctx.font = '20px Arial';
    this.setEvents();
  },
  setEvents() {
    window.addEventListener('keydown', (event) => {
      if (event.keyCode === KEYS.SPACE) {
        this.platform.fire();
      } else if (event.keyCode === KEYS.LEFT || event.keyCode === KEYS.RIGHT) {
        this.platform.start(event.keyCode);
      }
    })
    window.addEventListener('keyup', (event) => {
      if (event.keyCode === KEYS.LEFT || event.keyCode === KEYS.RIGHT) {
        this.platform.end();
      }
    })
  },
  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;
    required += Object.keys(this.sounds).length;

    let onResourceLoad = () => {
      ++loaded;
      if (loaded >= required) {
        callback();
      }
    };
    this.preloadSprites(onResourceLoad);
    this.preloadAudio(onResourceLoad)
  },
  preloadSprites(onResourceLoad) {
    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = "img/" + key + ".png";
      this.sprites[key].addEventListener("load", onResourceLoad);
    }
  },
  preloadAudio(onResourceLoad) {
    for (let key in this.sounds) {
      this.sounds[key] = new Audio('sounds/' + key + '.mp3');
      this.sounds[key].addEventListener('canplaythrough', onResourceLoad, {once: true});
    }
  },
  create() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          active: true,
          width: 60,
          height: 20,
          x: 64 * col + 65,
          y: 24 * row + 35
        });
      }
    }
  },
  update() {
    this.collideBlocks();
    this.collidePlatform();
    this.ball.collideWorldBounds();
    this.platform.collideWorldPlatform();
    this.ball.move();
  },
  end(message) {
    alert(message)
    this.running = false;
    window.location.reload()
  },
  addScore() {
    this.score += 1;
    if (this.score >= this.blocks.length) {
      this.running = false;
      this.end('You Victory')
    }
  },
  collideBlocks() {
    for (let block of this.blocks) {
      if (block.active && this.ball.collide(block)) {
        this.ball.bumpBlock(block);
        this.addScore();
        this.sounds.bump.play();
      }
    }
  },
  collidePlatform() {
    if (this.ball.collide(this.platform)) {
      this.ball.bumpPlatform(this.platform);
    }
  },
  run() {
    if (this.running) {
      window.requestAnimationFrame(() => {
        this.update();
        this.render();
        this.run();
      });
    }
  },
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.sprites.background, 0, 0);
    this.ctx.drawImage(this.sprites.ball, this.ball.frame * this.ball.width, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    this.renderBlocks();
    this.ctx.fillText("Score: " + this.score, 15, 20)
  },
  renderBlocks() {
    for (let block of this.blocks) {
      if (block.active) {
        this.ctx.drawImage(this.sprites.block, block.x, block.y);
      }
    }
  },
  start() {
    this.init()
    this.preload(() => {
      this.create();
      this.run();
    })
  },

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
};

window.addEventListener('load', () => {
  Game.start();
});
