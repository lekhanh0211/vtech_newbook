var app = angular.module('uiApp');

app.factory('svApi', [function () {
    var vm = {};
    vm.uploadfile = function (info, dsFiles) {
        var data = new FormData();
        _.each(dsFiles, (x) => data.append('files', x));
        return new Promise((resolve, reject) => {
            var ajaxRequest = $.ajax({
                url: `/api/files/upload/${info.folder}?delFile=${info.delFile || ''}`,
                type: 'POST',
                dataType: 'json',
                contentType: false,
                processData: false,
                data: data,
            });
            ajaxRequest.done(resolve);
            ajaxRequest.fail(reject);
        });
    }
    return vm;
}]);

app.directive('bgImg', [function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var bg = attrs.bg;
            $(element).css('background-image', 'url(' + bg + ')');
        }
    };
}]);
app.directive('cartPlusMinus', [function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var proQty = $(element);
            proQty.prepend('<div class="dec qtybutton">-</div>');
            proQty.append('<div class="inc qtybutton">+</div>');
            proQty.on('click', '.qtybutton', function () {
                var $button = $(this);
                var $input = $button.parent().find('input');
                var oldValue = $input.val();
                if ($button.hasClass('inc')) {
                    var newVal = parseFloat(oldValue) + 1;
                } else {
                    // Don't allow decrementing below zero
                    if (oldValue > 1) {
                        var newVal = parseFloat(oldValue) - 1;
                    } else {
                        newVal = 1;
                    }
                }
                $input.val(newVal);
                setTimeout(function () {
                    $input.trigger('input'); // Use for Chrome/Firefox/Edge
                    $input.trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                    angular.element($input).triggerHandler('input');
                });
            });
        }
    };
}]);
app.directive('headerSearchInput', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            $(element).on("focus", function () {
                $("#search-keyword-box").slideDown();
            });

            $(element).on("focusout", function () {
                $("#search-keyword-box").slideUp();
            });
        }
    };
});
app.directive('headerMenuTrigger', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            /* offcanvas menu active */
            $(element).on("click", function (e) {
                e.stopPropagation();
                $("#offcanvas-menu").toggleClass("active");
                $(".body-wrapper").toggleClass("active-overlay");
                $("body").toggleClass("overflow-hidden");
            });

        }
    };
});
app.directive('injectable', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            SVGInject($(element));
        }
    };
});