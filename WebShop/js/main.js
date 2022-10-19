/*  ---------------------------------------------------
    Template Name: Fashi
    Description: Fashi eCommerce HTML Template
    Author: Colorlib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

var _userProfile = JSON.parse(localStorage.getItem('currentUser') || '{}') || {};
function IsDaDangNhap() {
    if (_userProfile && _userProfile.Id && _userProfile.Id != _idEmpty) return true;
    return false;
}
var _idEmpty = '00000000-0000-0000-0000-000000000000';
//var urlFile = new URL(document.location.origin + document.currentScript.getAttribute('src'));
//var _version = urlFile.searchParams.get("v") || '20211206102136';

var EStorageKey = {
    GioHang: '_shop.Cart',
    YeuThich: '_shop.Heart'
}

var EFormat = {
    DateInView: "DD/MM/YYYY",
    DateInViewAll: "HH:mm DD/MM/YYYY",
    DateInViewStartDay: "00:00 DD/MM/YYYY",
    DateInViewEndDay: "23:59 DD/MM/YYYY",
    DateInViewLong: "HH [giờ] mm [phút, ngày] DD/MM/YYYY",
    DateInViewNgay: "[Ngày] DD [tháng] MM [năm] YYYY",
    DateToServer: "MM/DD/YYYY",
    DateToServerAll: "HH:mm MM/DD/YYYY",
    DateNull: "0001-01-01T00:00:00",
    DateISO: "YYYY-MM-DD[T]HH:mm:ss",
    DayISO: "YYYY-MM-DD[T00:00:00]",
    DayInView: "DD",
    MonthInView: "MM",
    YearInView: "YYYY",
    Time: "HH:mm"
};

function guidIsNuLL(str) {
    if (!str || str === "" || str === _idEmpty) return true;
    return false;
}

function guidIsNotNuLL(str) {
    if (str && str !== "" && str !== _idEmpty) return true;
    return false;
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function newGuid() {
    // then to call it, plus stitch in '4' in the third group
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function strIsNotNull(str) {
    if (str && str != "") return true;
    return false;
}

function strIsNull(str) {
    if (str && str != "") return false;
    return true;
}

function startLoader() {
    $('#loader').fadeIn("fast");
    $('#loader-progress').show();
};
function stopLoader() {
    $('#loader-progress').hide();
    $('#loader').fadeOut();
};

'use strict';
(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

    /*------------------
        Background Set
    --------------------*/
    //$('.set-bg').each(function () {
    //    var bg = $(this).data('setbg');
    //    $(this).css('background-image', 'url(' + bg + ')');
    //});

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*------------------
        Hero Slider
    --------------------*/
    $(".hero-items").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
    });

    /*------------------
        Product Slider
    --------------------*/
   //$(".product-slider").owlCarousel({
   //     loop: true,
   //     margin: 25,
   //     nav: true,
   //     //items: 10,
   //     dots: true,
   //     navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
   //     smartSpeed: 1200,
   //     autoHeight: false,
   //     autoplay: true,
   //     responsive: {
   //         0: {
   //             items: 2,
   //         },
   //         576: {
   //             items: 3,
   //         },
   //         992: {
   //             items: 4,
   //         },
   //         1200: {
   //             items: 5,
   //         }
   //     }
   // });

    /*------------------
       logo Carousel
    --------------------*/
    $(".logo-carousel").owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        items: 6,
        dots: false,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        mouseDrag: false,
        autoplay: true,
        responsive: {
            0: {
                items: 3,
            },
            768: {
                items: 5,
            }
        }
    });

    /*-----------------------
       Product Single Slider
    -------------------------*/
    $(".ps-slider").owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        items: 3,
        dots: false,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
    });
    
        
    /*----------------------------------------------------
     Language Flag js 
    ----------------------------------------------------*/
    $(document).ready(function(e) {
    //no use
    try {
        var pages = $("#pages").msDropdown({on:{change:function(data, ui) {
            var val = data.value;
            if(val!="")
                window.location = val;
        }}}).data("dd");

        var pagename = document.location.pathname.toString();
        pagename = pagename.split("/");
        pages.setIndexByValue(pagename[pagename.length-1]);
        $("#ver").html(msBeautify.version.msDropdown);
    } catch(e) {
        // console.log(e);
    }
    $("#ver").html(msBeautify.version.msDropdown);

    //convert
    $(".language_drop").msDropdown({roundedBorder:false});
        $("#tech").data("dd");
    });
    /*-------------------
		Range Slider
	--------------------- */
	var rangeSlider = $(".price-range"),
		minamount = $("#minamount"),
		maxamount = $("#maxamount"),
		minPrice = rangeSlider.data('min'),
		maxPrice = rangeSlider.data('max');
	    rangeSlider.slider({
		range: true,
		min: minPrice,
        max: maxPrice,
		values: [minPrice, maxPrice],
		slide: function (event, ui) {
			minamount.val('$' + ui.values[0]);
			maxamount.val('$' + ui.values[1]);
		}
	});
	minamount.val('$' + rangeSlider.slider("values", 0));
    maxamount.val('$' + rangeSlider.slider("values", 1));

    /*-------------------
		Radio Btn
	--------------------- */
    $(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").on('click', function () {
        $(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").removeClass('active');
        $(this).addClass('active');
    });
    
    /*-------------------
		Nice Select
    --------------------- */
    //$('.sorting, .p-show').niceSelect();

    /*------------------
		Single Product
	--------------------*/
	$('.product-thumbs-track .pt').on('click', function(){
		$('.product-thumbs-track .pt').removeClass('active');
		$(this).addClass('active');
		var imgurl = $(this).data('imgbigurl');
		var bigImg = $('.product-big-img').attr('src');
		if(imgurl != bigImg) {
			$('.product-big-img').attr({src: imgurl});
			$('.zoomImg').attr({src: imgurl});
		}
	});

    $('.product-pic-zoom').zoom();
    
    /*-------------------
		Quantity change
	--------------------- */
 //   var proQty = $('.pro-qty');
	//proQty.prepend('<span class="dec qtybtn">-</span>');
	//proQty.append('<span class="inc qtybtn">+</span>');
	//proQty.on('click', '.qtybtn', function () {
	//	var $button = $(this);
	//	var oldValue = $button.parent().find('input').val();
	//	if ($button.hasClass('inc')) {
	//		var newVal = parseFloat(oldValue) + 1;
	//	} else {
	//		// Don't allow decrementing below zero
	//		if (oldValue > 0) {
	//			var newVal = parseFloat(oldValue) - 1;
	//		} else {
	//			newVal = 0;
	//		}
	//	}
 //       $button.parent().find('input').val(newVal);
 //       $button.parent().find('input').trigger('input'); // Use for Chrome/Firefox/Edge
 //       $button.parent().find('input').trigger('change'); // Use for Chrome/Firefox/Edge + IE11
 //   });

    var t = $("#topcontrol");
    var header = $(".navbar-fixed-top");
    $(window).scroll(function () {
        $(this).scrollTop() > 100 ? t.addClass("active") : t.removeClass("active");
        $(this).scrollTop() > 185 ? header.addClass("navbar-scroll") : header.removeClass("navbar-scroll");
    }),
    t.click(function () {
        return $("html, body").animate({
            scrollTop: "0px"
        }, 800),
            !1
    })

})(jQuery);