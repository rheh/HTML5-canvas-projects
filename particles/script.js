const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80)
};

window.addEventListener("mousemove", function(e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("mouseout", function(e) {
  mouse.x = undefined;
  mouse.y = undefined;
});

window.addEventListener("resize", function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = ((canvas.width / 80) * (canvas.height / 80));
  init();
});

class Particle {
  constructor(x, y, directionX, directionY, size, colour) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.colour = colour;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, Math.PI * 2, false);
    ctx.fillStyle = '#8C5523';
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }

    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }

      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }

      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }

      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

function init() {
  particles = [];
  let numberOfParticles = (canvas.height * canvas.width) / 8000;

  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 5) + 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2))  + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2))  + size * 2);
    let directionX = (Math.random() * 5) - 2.5;
    let directionY = (Math.random() * 5) - 2.5;
    let colour = '#8C5523'

    particles.push(new Particle(x, y, directionX, directionY, size, colour));
  }
}

function connect() {
  let opacity = 1;
  let connectors = [];

  for (let a = 0; a < particles.length; a++) {
    for (let b = 0; b < particles.length; b++) {
      let distance = (
        (particles[a].x - particles[b].x) *
        (particles[a].x - particles[b].x) +
        (particles[a].y - particles[b].y) *
        (particles[a].y - particles[b].y)
      );

      if (distance < ((canvas.width / 7) * canvas.height / 7)) {
        opacity = 1 - (distance / 20000);
        ctx.strokeStyle = 'rgba(140, 85, 31, ' + opacity + ')';
        ctx.lineWidth = 1;
        ctx.beginPath()
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }

  connect();
}

init();
animate();

// Credit: https://www.youtube.com/watch?v=d620nV6bp0A&t=1051s