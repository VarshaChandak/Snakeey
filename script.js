let dom_replay = document.querySelector("#replay");
let dom_score = document.querySelector("#score");
let dom_canvas = document.createElement("canvas");
document.querySelector("#canvas").appendChild(dom_canvas);
let CTX = dom_canvas.getContext("2d");

const W = (dom_canvas.width = 400);
const H = (dom_canvas.height = 400);

let snake,
  food,
  currentHue,
  cells = 20,
  cellSize,
  isGameOver = false,
  tails = [],
  score = 00,
  maxScore = window.localStorage.getItem("maxScore") || undefined,
  particles = [],
  splashingParticleCount = 20,
  cellsCount,
  requestID;
  let helpers = {
    Vec: class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
      }
      mult(v) {
        if (v instanceof helpers.Vec) {
          this.x *= v.x;
          this.y *= v.y;
          return this;
        } else {
          this.x *= v;
          this.y *= v;
          return this;
        }
      }
    },
    isCollision(v1, v2) {
        return v1.x == v2.x && v1.y == v2.y;
      },
      garbageCollector() {
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].size <= 0) {
            particles.splice(i, 1);
          }
        }
      },
      drawGrid() {
        CTX.lineWidth = 1.1;
        CTX.strokeStyle = "#232332";
        CTX.shadowBlur = 0;
        for (let i = 1; i < cells; i++) {
          let f = (W / cells) * i;
          CTX.beginPath(); CTX.moveTo(f, 0); CTX.lineTo(f, H); CTX.stroke();
          CTX.beginPath(); CTX.moveTo(0, f); CTX.lineTo(W, f); CTX.stroke();
        }
      },
      randHue() {
        return Math.floor(Math.random() * 360);
      },
      hsl2rgb(hue, saturation, lightness) {
        if (hue == null) return [0, 0, 0];
        let chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        let hp = hue / 60;
        let x = chroma * (1 - Math.abs((hp % 2) - 1));
        let [r, g, b] = hp < 1 ? [chroma, x, 0]
          : hp < 2 ? [x, chroma, 0]
          : hp < 3 ? [0, chroma, x]
          : hp < 4 ? [0, x, chroma]
          : hp < 5 ? [x, 0, chroma]
          : [chroma, 0, x];
        let m = lightness - chroma / 2;
        return [r + m, g + m, b + m].map(v => Math.round(v * 255));
      },
      lerp(start, end, t) {
        return start * (1 - t) + end * t;
      }
    };
    let KEY = {
        ArrowUp: false,
        ArrowRight: false,
        ArrowDown: false,
        ArrowLeft: false,
        resetState() {
          this.ArrowUp = this.ArrowRight = this.ArrowDown = this.ArrowLeft = false;
        },
        listen() {
          addEventListener("keydown", e => {
            if ((e.key === "ArrowUp" && this.ArrowDown) ||
                (e.key === "ArrowDown" && this.ArrowUp) ||
                (e.key === "ArrowLeft" && this.ArrowRight) ||
                (e.key === "ArrowRight" && this.ArrowLeft)) return;
            this.resetState();
            if (this.hasOwnProperty(e.key)) this[e.key] = true;
          });
        }
      };
      class Snake {
        constructor() {
          this.pos = new helpers.Vec(W / 2, H / 2);
          this.dir = new helpers.Vec(0, 0);
          this.delay = 5;
          this.size = W / cells;
          this.color = "white";
          this.history = [];
          this.total = 1;
        }
        draw() {
          CTX.fillStyle = this.color;
          CTX.shadowBlur = 20;
          CTX.shadowColor = "rgba(255,255,255,0.3)";
          CTX.fillRect(this.pos.x, this.pos.y, this.size, this.size);
          CTX.shadowBlur = 0;
          this.history.forEach(p => CTX.fillRect(p.x, p.y, this.size, this.size));
        }
      }
      Snake.prototype.walls = function() {
        if (this.pos.x >= W) this.pos.x = 0;
        if (this.pos.y >= H) this.pos.y = 0;
        if (this.pos.x < 0) this.pos.x = W - this.size;
        if (this.pos.y < 0) this.pos.y = H - this.size;
      };
      Snake.prototype.controlls = function() {
        let s = this.size;
        if (KEY.ArrowUp) this.dir = new helpers.Vec(0, -s);
        if (KEY.ArrowDown) this.dir = new helpers.Vec(0, s);
        if (KEY.ArrowLeft) this.dir = new helpers.Vec(-s, 0);
        if (KEY.ArrowRight) this.dir = new helpers.Vec(s, 0);
      };
      Snake.prototype.selfCollision = function() {
        this.history.forEach(p => {
          if (helpers.isCollision(this.pos, p)) isGameOver = true;
        });
      };
      Snake.prototype.update = function() {
        this.walls(); this.draw(); this.controlls();
        if (--this.delay === 0) {
          if (helpers.isCollision(this.pos, food.pos)) {
            incrementScore(); particleSplash(); food.spawn(); this.total++;
          }
          this.history.push(new helpers.Vec(this.pos.x, this.pos.y));
          if (this.history.length > this.total) this.history.shift();
          this.pos.add(this.dir);
          this.delay = 5;
          if (this.total > 1) this.selfCollision();
        }
      };
      class Food {
        constructor() {
          this.size = cellSize = W / cells;
          this.spawn();
        }
        draw() {
          CTX.fillStyle = this.color;
          CTX.shadowBlur = 20;
          CTX.shadowColor = this.color;
          CTX.fillRect(this.pos.x, this.pos.y, this.size, this.size);
          CTX.shadowBlur = 0;
        }
      }
      Food.prototype.spawn = function() {
        let x, y;
        do {
          x = Math.floor(Math.random() * cells) * cellSize;
          y = Math.floor(Math.random() * cells) * cellSize;
        } while (snake.history.some(p => helpers.isCollision(p, { x, y })));
        this.pos = new helpers.Vec(x, y);
        this.color = `hsl(${helpers.randHue()},100%,50%)`;
        currentHue = this.color;
      };
      class Particle {
        constructor(pos, color) {
          this.pos = new helpers.Vec(pos.x, pos.y);
          this.color = color;
          this.size = cellSize / 2;
          this.vel = new helpers.Vec((Math.random()*6-3), (Math.random()*6-3));
        }
        draw() {
          CTX.fillStyle = this.color;
          CTX.fillRect(this.pos.x, this.pos.y, this.size, this.size);
        }
        update() {
          this.size -= 0.3;
          this.pos.add(this.vel);
          this.draw();
        }
      }