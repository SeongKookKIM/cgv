$(document).ready(function () {
  elementAlign();
  function elementAlign() {
    var imageHolderSize = $(window).width() / 2;
    var halfWindowHeight = $(window).height() / 2;
    var halfWindowWidth = $(window).width() / 2;
    $(".imageHolder")
      .css("width", imageHolderSize)
      .css("height", imageHolderSize);
    $(".imageHolder").css("margin-top", halfWindowHeight - imageHolderSize / 2);
    $(".imageHolder").css("margin-left", halfWindowWidth - imageHolderSize / 2);
  }
  $(window).on("resize", function () {
    elementAlign();
  });
});
$(document).on("mousemove", function (event) {
  var window_height = $(this).height();
  var window_width = $(this).width();
  var mouseXpos = event.clientX;
  var mouseYpos = event.clientY;
  var YrotateDeg = (window_width / 2 - mouseXpos) * 0.005;
  var XrotateDeg = (window_height / 2 - mouseYpos) * -0.005;
  $(".main_video").css(
    "transform",
    "rotateX(" + XrotateDeg + "deg) rotateY(" + YrotateDeg + "deg)"
  );
});
