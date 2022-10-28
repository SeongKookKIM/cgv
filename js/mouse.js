class CanvasCursor {
  constructor() {
    this.bindMethods();

    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");

    this.bounds = {
      w: window.innerWidth,
      h: window.innerHeight,
    };

    this.size = {
      radius: 50,
      w: 0,
      h: 0,
    };

    this.angle = {
      start: -0.5,
      end: -0.5,
    };

    this.mouse = {
      current: {
        x: 0,
        y: 0,
      },

      last: {
        x: 0,
        y: 0,
      },

      ease: 0.15,
    };

    this.init();
  }

  bindMethods() {
    ["draw", "onResize", "getPos", "onPress", "onRelease"].forEach(
      (method) => (this[method] = this[method].bind(this))
    );
  }

  setBounds() {
    this.canvas.style.height = `${this.bounds.h}px`;
    this.canvas.style.width = `${this.bounds.w}px`;

    this.canvas.height = this.bounds.h;
    this.canvas.width = this.bounds.w;

    this.size.h = this.canvas.height;
    this.size.w = this.canvas.width;
  }

  draw() {
    const { radius, w, h } = this.size;
    const { current, last, ease } = this.mouse;
    const { start, end } = this.angle;

    this.ctx.clearRect(last.x - 100, last.y - 100, radius + 200, radius + 200);

    last.x += (current.x - last.x) * ease;
    last.y += (current.y - last.y) * ease;

    this.ctx.beginPath();
    this.ctx.arc(last.x, last.y, radius - 4, 0, 2 * Math.PI);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(last.x, last.y, radius - 4, start * Math.PI, end * Math.PI);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "pink";
    this.ctx.stroke();
    this.ctx.closePath();

    requestAnimationFrame(this.draw);
  }

  onResize() {
    this.setBounds();
    this.draw();
  }

  onPress() {
    TweenMax.to(this.size, 0.75, {
      radius: 20,
      ease: Expo.easeOut,
    });

    TweenMax.to(this.angle, 0.75, {
      end: 3.5,
      start: 1.5,
      ease: Power3.easeOut,
    });
  }

  onRelease() {
    TweenMax.to(this.size, 1, {
      radius: 50,
      ease: Elastic.easeOut,
    });

    TweenMax.to(this.angle, 1, {
      end: -0.5,
      start: -0.5,
      ease: Power3.easeOut,
    });
  }

  getPos(e) {
    Object.assign(this.mouse.current, {
      x: e.clientX,
      y: e.clientY,
    });
  }

  addListeners() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.getPos);
    window.addEventListener("mousedown", this.onPress);
    window.addEventListener("mouseup", this.onRelease);
  }

  init() {
    this.addListeners();
    this.setBounds();

    requestAnimationFrame(this.draw);
  }
}

const canvasCursor = new CanvasCursor();
