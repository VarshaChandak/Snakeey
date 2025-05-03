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
    