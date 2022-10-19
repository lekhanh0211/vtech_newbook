(function ($) {
  "use strict";
  
  /* remove active class on click other parts of the body */
  $('body').on('click', function(){
    $("#offcanvas-menu").removeClass("active");
    $(".body-wrapper").removeClass("active-overlay");
    $("body").removeClass("overflow-hidden");
  });

  /* background image set */
  //var bgSelector = $(".bg-img");
  //bgSelector.each(function (index, elem) {
  //    var element = $(elem),
  //        bgSource = element.data('bg');
  //    element.css('background-image', 'url(' + bgSource + ')');
  //});

  /* slick slider activation */
  $('.welcome-slider-wrapper').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000
  });
  
  /* price range */

  $('#price-range-slider').ionRangeSlider({
		type: 'double',
        skin: 'round',
		hide_min_max: true,
		min: 0,
		max: 500,
		from: 50,
		to: 440
    });

    
    /* cart plus minus */
    
    var CartPlusMinus = $('.cart-plus-minus');
    CartPlusMinus.prepend('<div class="dec qtybutton">-</div>');
    CartPlusMinus.append('<div class="inc qtybutton">+</div>');
    $(".qtybutton").on("click", function() {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        if ($button.text() === "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 1;
            }
        }
        $button.parent().find("input").val(newVal);
    });
    


})(jQuery);