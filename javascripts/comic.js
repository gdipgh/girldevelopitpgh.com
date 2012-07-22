$(document).ready(function() {
  var max_width = Math.min(703, $(window).width() - 120);

  if(Modernizr.mq('only screen and (-webkit-min-device-pixel-ratio: 1.5)') ||
     Modernizr.mq('only screen and (min-device-pixel-ratio: 1.5)')) {
    var retina_src = $("#comic").attr("src").replace(".png", "@2x.png");
    $("#comic").attr("src", retina_src);
  }


  $('img#comic').imgplayer({
    maxHeight: 471,
    maxWidth: max_width,
    scalableUp: false,
    scalableDown: true,
    frames: [
      [5, 5, 212, 240, {}],
      [5, 219, 241, 240, {}],
      [5, 458, 241, 240, {}],
      [244, 5, 454, 205, {}],
      [286, 11, 141, 158, {}],
      [286, 154, 141, 158, {}],
      [286, 298, 154, 158, {}],
      [244, 458, 241, 205, {}],
      [0, 0, 703, 471, {}]
    ]
  });

  $("#comic-left").on("click", function() {
    $.imgplayer.gotoPrev();
  });

  $("#comic-right").on("click", function() {
    $.imgplayer.gotoNext();
  });
});