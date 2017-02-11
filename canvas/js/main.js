(function($){
	canvas.loadImages();

	var pageInt = setInterval(function() {
      if (canvas && canvas.canvas) {
          if (canvas.canvas.loaded) {
              clearInterval(pageInt);
              canvas.canvas.start();
          }
      }
  }, 100);
})(jQuery);