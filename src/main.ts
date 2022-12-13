const canvas: HTMLCanvasElement = document.getElementById('main') as HTMLCanvasElement;
const xxxx = 970;
canvas.width = xxxx;
canvas.height = xxxx;
const radius = 0.1;

const { clientWidth, clientHeight } = canvas;
console.log(canvas);
console.log(clientWidth, clientHeight);

class CanvasHandler {
  private ctx: CanvasRenderingContext2D;
  public constructor(private target: HTMLCanvasElement) {
    this.ctx = target.getContext('2d');
  }
  drawPoint(p: Point) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  clear() {
    this.ctx.clearRect(0, 0, clientWidth, clientHeight);
  }
}
class MainGame {
  basePoints: [Point, Point, Point];
  rpg: () => Point;
  currentPoint: Point;
  padding = 20;

  constructor(private height: number, private width: number, private handler: CanvasHandler) {
    this.basePoints = [
      new Point(0 + this.padding, height - this.padding),
      new Point(this.width - this.padding, height - this.padding),
      new Point(width / 2, 0 + this.padding),
    ];
    this.rpg = () => this.basePoints[Math.floor(Math.random() * this.basePoints.length)];
    this.currentPoint = new Point(80, 80);
  }

  drawInitial() {
    this.handler.clear();
    this.handler.drawPoint(this.basePoints[0]);
    this.handler.drawPoint(this.basePoints[1]);
    this.handler.drawPoint(this.basePoints[2]);
  }

  calc(times: number) {
    while (--times >= 0) {
      this.calcNextPoint();
    }
  }

  private calcNextPoint(): void {
    this.currentPoint = this.rpg().avg(this.currentPoint);
    this.handler.drawPoint(this.currentPoint);
  }
}

class Point {
  constructor(public x: number, public y: number) {}
  public avg(other: Point): Point {
    return new Point((this.x + other.x) / 2, (this.y + other.y) / 2);
  }
}

function main() {
  const x = new CanvasHandler(canvas);
  const g = new MainGame(clientHeight, clientWidth, x);
  g.drawInitial();
  let total = 1_000_000;

  let animation = () => {
    g.calc(500);
    console.log('Hello');

    if (--total < 0) return;
    window.requestAnimationFrame(animation);
  };
  window.requestAnimationFrame(animation);
  console.log('Works');
}

main();
