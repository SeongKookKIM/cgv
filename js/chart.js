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
      pressedTop; //when the users presses down, if the mouse is in the top half of the image, pressedTop will be true. We use this to make the skewing more natural, like the mouse is "pulling" that part of the image
    this.draggable = Draggable.create(this.proxy, {
      type: "x",
      edgeResistance: 0.75,
      onPress: function (e) {
        var bounds = this.target.getBoundingClientRect();
        pressedTop = e.clientY < bounds.y + bounds.height / 2;
        //keep track of how far apart the proxy is from the slider because when the user presses down, we want to IMMEDIATELY stop any motion, thus this offset value becomes baked in until release.
        this.offset = this.x - slider._gsTransform.x;
        TweenLite.killTweensOf(slider); //in case it's moving
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
        //if the user just presses down and releases without really moving much at all, there's no need to do a throwProps tween.
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
