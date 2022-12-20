class DraggableSlider {
  constructor() {
    this.container = document.querySelector(".js-experience-slider");
    this.proxy = this.container.querySelector(".proxy");
    this.slider = document.querySelector(".js-experience-slider__inner");
    this.sliderContent = document.querySelector(
      ".js-experience-slider__content"
    );
    this.slides = [...this.container.querySelectorAll(".js-experience-slide")];
    this.slidesNumb = this.slides.length;
    this.sliderWidth = 0;

    this.draggable = null;

    this.current = 0;
    this.last = 0;

    this.init();
  }

  setBounds() {
    this.sliderWidth = this.slides[0].offsetWidth * this.slidesNumb + 1;

    TweenMax.set([this.slider, this.proxy], {
      width: this.sliderWidth,
      x: "+=0",
      skewType: "simple",
    });
  }

  createDraggable() {
    var slider = this.slider,
      tracker = ThrowPropsPlugin.track(slider, "x"),
      pressedTop;
    this.draggable = Draggable.create(this.proxy, {
      type: "x",
      edgeResistance: 0.75,
      onPress: function (e) {
        var bounds = this.target.getBoundingClientRect();
        pressedTop = e.clientY < bounds.y + bounds.height / 2;

        this.offset = this.x - slider._gsTransform.x;
        TweenLite.killTweensOf(slider);
        TweenLite.to(slider, 0.2, {
          skewX: 0,
        });
      },
      onDrag: function () {
        TweenLite.to(slider, 0.8, {
          x: this.x - this.offset,
          ease: Power2.easeOut,
        });
      },
      onRelease: function () {
        if (this.tween && Math.abs(tracker.getVelocity("x")) > 20) {
          TweenLite.to(slider, this.tween.duration(), {
            throwProps: {
              x: {
                end: this.endX,
              },
            },
            ease: Power3.easeOut,
          });
        }
        TweenLite.to(slider, 0.5, {
          skewX: 0,
          ease: Power1.easeOut,
        });
      },
      //dragResistance: 0.5,
      bounds: this.container,
      throwProps: true,
    })[0];
  }

  scrollwheel() {
    var slider = this.slider;
    var container = this.container;

    this.container.addEventListener("wheel", function (e) {
      e.preventDefault();

      TweenLite.to(slider, 0.5, {
        x: "+=" + -e.deltaY * 2,
        ease: Power3.easeOut,
        modifiers: {
          x: function (x) {
            if (x > 0) {
              x = 0;
            } else if (x < -(slider.clientWidth - container.clientWidth)) {
              x = -(slider.clientWidth - container.clientWidth);
            }
            return x;
          },
        },
      });
    });
  }

  destroy() {
    this.draggable.kill();
  }

  init() {
    this.setBounds();
    this.createDraggable();
    this.scrollwheel();
  }
}

const slider = new DraggableSlider();
