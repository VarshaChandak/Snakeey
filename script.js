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
    