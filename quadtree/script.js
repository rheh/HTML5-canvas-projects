class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(point) {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.height
    );
  }

  intersects(range) {
    return !(
      range.x > this.x + this.width ||
      range.x + range.width < this.x ||
      range.y > this.y + this.height ||
      range.y + range.height < this.y
    );
  }
}

let id = 0

class QuadTree {
  constructor(boundary, capacity = 4, maxDepth = 10, depth = 0) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.maxDepth = maxDepth; // Maximum depth of the tree
    this.depth = depth; // Current depth of the node
    this.id = id++;

    console.log(`Created ${this.id} capacity ${this.capacity}, points ${this.points.length}`);
  }

  dump() {
    for (const point of this.points) {
      console.log(`${id} own `, point);
    }
  }

  subdivide() {
    console.log(`${this.id} is subdividing`);

    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.width / 2;
    const h = this.boundary.height / 2;

    this.northeast = new QuadTree(new Rectangle(x + w, y, w, h), this.capacity, this.maxDepth, this.depth + 1);
    this.northwest = new QuadTree(new Rectangle(x, y, w, h), this.capacity, this.maxDepth, this.depth + 1);
    this.southeast = new QuadTree(new Rectangle(x + w, y + h, w, h), this.capacity, this.maxDepth, this.depth + 1);
    this.southwest = new QuadTree(new Rectangle(x, y + h, w, h), this.capacity, this.maxDepth, this.depth + 1);

    for (const point of this.points) {
      this.northeast.insert(point) ||
        this.northwest.insert(point) ||
        this.southeast.insert(point) ||
        this.southwest.insert(point);
    }

    this.points = [];
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.depth >= this.maxDepth) {
      this.points.push(point);
      return true;
    }

    if (!this.divided && this.points.length < this.capacity) {
      console.log(`${this.id} is adding`, point);

      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.northeast.insert(point) ||
      this.northwest.insert(point) ||
      this.southeast.insert(point) ||
      this.southwest.insert(point)
    );
  }

  draw(ctx) {
    // Draw boundary
    ctx.strokeStyle = "#000";
    ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.width, this.boundary.height);

    // Draw points
    ctx.fillStyle = "#f00";
    for (const point of this.points) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.divided) {
      this.northeast.draw(ctx);
      this.northwest.draw(ctx);
      this.southeast.draw(ctx);
      this.southwest.draw(ctx);
    }
  }

  remove(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    const index = this.points.findIndex(p => p.x === point.x && p.y === point.y);
    if (index !== -1) {
      this.points.splice(index, 1);
      return true;
    }

    // If the node is divided, try to remove the point from the children
    if (this.divided) {
      return (
        this.northeast.remove(point) ||
        this.northwest.remove(point) ||
        this.southeast.remove(point) ||
        this.southwest.remove(point)
      );
    }

    return false;
  }

  nearestNeighbor(queryPoint, best = null) {
    if (!this.boundary.contains(queryPoint)) {
      return best;
    }

    for (const point of this.points) {
      const distance = Math.hypot(point.x - queryPoint.x, point.y - queryPoint.y);
      if (!best || distance < Math.hypot(best.x - queryPoint.x, best.y - queryPoint.y)) {
        best = point;
      }
    }

    if (this.divided) {
      best = this.northeast.nearestNeighbor(queryPoint, best);
      best = this.northwest.nearestNeighbor(queryPoint, best);
      best = this.southeast.nearestNeighbor(queryPoint, best);
      best = this.southwest.nearestNeighbor(queryPoint, best);
    }

    return best;
  }
}

// Canvas setup
const canvas = document.getElementById("tree");
const ctx = canvas.getContext("2d");

// Create QuadTree
const boundary = new Rectangle(0, 0, canvas.width, canvas.height);
const quadTree = new QuadTree(boundary, 4, 5);

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  quadTree.draw(ctx);
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  quadTree.insert(new Point(x, y));
  redraw();
});

redraw();