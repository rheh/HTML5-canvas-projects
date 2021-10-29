
const canvas = document.querySelector('#scene');
const ctx = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let width = canvas.clientWidth;
let height = canvas.clientHeight;
let cubes = [];
let guides = [];

let PROJECTION_CENTER_X = width / 2;
let PROJECTION_CENTER_Y = height / 2;
let FIELD_OF_VIEW = width * 0.8;
const CUBE_LINES = [
  [0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]
];

const CUBE_VERTICES = [
  [-1, -1, -1],
  [1, -1, -1],
  [-1, 1, -1],
  [1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [-1, 1, 1],
  [1, 1, 1]
];

class Item {
  constructor(x, y, z) {
    this.x = (Math.random() - 0.5) * width;
    this.y = (Math.random() - 0.5) * width;
    this.z = (Math.random() - 0.5) * width;
  }

  // Do some math to project the 3D position into the 2D canvas
  project(x, y, z) {
    const sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW + z);
    const xProject = (x * sizeProjection) + PROJECTION_CENTER_X;
    const yProject = (y * sizeProjection) + PROJECTION_CENTER_Y;
    return {
      size: sizeProjection,
      x: xProject,
      y: yProject
    }
  }
}

class Axis extends Item {
  constructor(x, y, z) {
    super(x, y, z);
  }

  // Draw the dot on the canvas
  draw() {
    // Do not render a cube that is in front of the camera
    let v1Project = this.project(0 - width / 2, 0, 0);
    let v2Project = this.project(width / 2, 0, 0);

    ctx.beginPath();
    ctx.moveTo(v1Project.x, v1Project.y);
    ctx.lineTo(v2Project.x, v2Project.y);
    ctx.stroke();

    v1Project = this.project(0, 0 - height / 2, 0);
    v2Project = this.project(0, height / 2, 0);

    ctx.beginPath();
    ctx.moveTo(v1Project.x, v1Project.y);
    ctx.lineTo(v2Project.x, v2Project.y);
    ctx.stroke();

    v1Project = this.project(0, 0, -2000);
    v2Project = this.project(0, 0, 2000);

    ctx.beginPath();
    ctx.moveTo(v1Project.x, v1Project.y);
    ctx.lineTo(v2Project.x, v2Project.y);
    ctx.stroke();
  }
  update() {
    this.draw();
  }
}

class Cube extends Item {
  constructor(x, y, z) {
    super(x, y, z);
    this.directionY = 1;
    this.directionX = 1;
    this.radius = Math.floor(Math.random() * 12 + 10);
  }

  // Draw the dot on the canvas
  draw() {
    // Do not render a cube that is in front of the camera
    if (this.z < -FIELD_OF_VIEW + this.radius) {
      return;
    }

    for (let i = 0; i < CUBE_LINES.length; i++) {
      const v1 = {
        x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][0]),
        y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][1]),
        z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][2])
      };

      const v2 = {
        x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][0]),
        y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][1]),
        z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][2])
      };

      const v1Project = this.project(v1.x, v1.y, v1.z);
      const v2Project = this.project(v2.x, v2.y, v2.z);

      ctx.beginPath();
      ctx.moveTo(v1Project.x, v1Project.y);
      ctx.lineTo(v2Project.x, v2Project.y);
      ctx.stroke();
    }
  }
  update() {
    if (this.radius > 50) {
      this.directionX = -this.directionX;
      this.radius = -50;
    }

    if (this.radius < -50) {
      this.directionY = this.directionY;
      this.radius = 50;
    }

    this.radius += this.directionX;
    this.draw();
  }
}

function init() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  PROJECTION_CENTER_X = width / 2;
  PROJECTION_CENTER_Y = height / 2;
  FIELD_OF_VIEW = width * 0.8;

  cubes = [];

  // Create a new dot based on the amount needed
  for (let i = 0; i < 75; i++) {
    cubes.push(new Cube());
  }

  guides = new Axis();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < cubes.length; i++) {
    cubes[i].update();
  }

  guides.update();

  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", function() {
  init();
});