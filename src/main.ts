const canvas: HTMLCanvasElement = document.getElementById('main') as HTMLCanvasElement;

const radius = 0.05;
const first_point = 80;
const point_padding = 20;
const canvas_size = 970;

const total_points_to_draw = 1_000_000;
const points_to_draw_per_animation = 1_000;

class CanvasHandler {
  private ctx: CanvasRenderingContext2D;
  public constructor(
    private clientWidth: number,
    private clientHeight: number,
    target: HTMLCanvasElement
  ) {
    this.ctx = target.getContext('2d');
  }
  drawPoint(p: Point) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
  }
}

class MainGame {
  basePoints: [Point, Point, Point];
  randomPointGetter: () => Point;
  currentPoint: Point;

  constructor(height: number, width: number, private handler: CanvasHandler) {
    this.basePoints = [
      new Point(0 + point_padding, height - point_padding),
      new Point(width - point_padding, height - point_padding),
      new Point(width / 2, 0 + point_padding),
    ];
    this.randomPointGetter = () =>
      this.basePoints[Math.floor(Math.random() * this.basePoints.length)];
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
    this.currentPoint = this.randomPointGetter().avg(this.currentPoint);
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
  canvas.width = canvas_size;
  canvas.height = canvas_size;

  const { clientWidth, clientHeight } = canvas;
  const canvasHandler = new CanvasHandler(clientWidth, clientHeight, canvas);
  const drawer = new MainGame(clientHeight, clientWidth, canvasHandler);

  drawer.drawInitial();

  let total = total_points_to_draw;
  let animation = () => {
    if (--total < 0) return;

    drawer.calc(points_to_draw_per_animation);
    window.requestAnimationFrame(animation);
  };

  window.requestAnimationFrame(animation);
}

main();
