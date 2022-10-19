var app = angular.module('uiApp');

app.directive('capitalize', function ($timeout) {
    return {
        scope: {
            trigger1: '@capitalize'
        },
        link: function (scope, element) {
            function replace($t, txt) {
                $t.val(txt);
            };

            function capitalize(n, $t, txt) {
                txt = txt.toUpperCase();
                replace($t, txt);
            };

            function capitalizeLetter(e) {
                var currentValue = element.val();
                if (!currentValue) {
                    return;
                }

                txt = element.val();

                if (e.type == 'keypress') {
                    var key = e.keyCode;

                    capitalize(0, element, txt);
                    scope.$apply();
                }
                else { // blur
                    capitalize(0, element, txt);
                    scope.$apply();
                }
            }
            scope.$watch('trigger1', function (value) {
                if (value == '' || value === 'true' || value == true) {
                    $timeout(function () {
                        element.bind('blur', capitalizeLetter);
                        element.bind('keypress', capitalizeLetter);
                    });
                } else {
                    $timeout(function () {
                        element.off('blur', capitalizeLetter);
                        element.off('keypress', capitalizeLetter);
                    });
                }
            });
        }
    };
});

app.directive("capitalizeEach",
    function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs) {

                function replace($t, txt) {
                    txt[(txt.length - 1)] = lword;
                    $t.val(txt.join(' '));
                };
                function capitalize(n, $t, txt) {
                    lword = lword.charAt(n).toUpperCase() + lword.slice(n + 1);
                    replace($t, txt);
                };

                function capitalizeFirstLetter(e) {
                    var currentValue = element.val();
                    if (!currentValue) {
                        return;
                    }

                    txt = element.val().split(' '),
                        lword = txt[(txt.length - 1)];

                    if (e.type == 'keypress') {
                        var key = e.keyCode;
                        if (key === 32) {
                            capitalize(0, element, txt);
                            scope.$apply();
                        }
                    }
                    else { // blur
                        capitalize(0, element, txt);
                        scope.$apply();
                    }
                }

                element.bind('blur', capitalizeFirstLetter);
                element.bind('keypress', capitalizeFirstLetter);
            }
        };
    }
);

app.directive("capitalizeFirst",
    function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs) {
                var wasCapitalized = false;

                function capitalizeFirstLetter() {
                    var currentValue = element.val();
                    if (!currentValue) {
                        return;
                    }

                    if (wasCapitalized) {
                        return;
                    }

                    if (currentValue.length === 1) {
                        var newValue = capitalize(currentValue);
                        wasCapitalized = true;

                        element.val(newValue);
                        scope.$apply();
                    }
                }

                function capitalize(item) {
                    return itemIsLowerCaseLetter(item) ? item.toUpperCase() : item;
                }

                function itemIsLowerCaseLetter(item) {
                    return item.toUpperCase().toLowerCase() === item;
                }

                element.bind('keypress', capitalizeFirstLetter);
            }
        };
    }
);

app.directive('keyTrap', function () {
    return function (scope, elem) {
        elem.bind('keydown', function (event) {
            scope.$broadcast('keydown', { code: event.keyCode, type: elem.attr('Id') });
        });
    };
});
app.directive('toggle', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (attrs.toggle == "tooltip") {
                $(element).tooltip();
            }
            if (attrs.toggle == "popover") {
                $(element).popover();
            }
        }
    };
});
app.directive('myClickOnce', function ($timeout) {
    var delay = 500;   // min milliseconds between clicks

    return {
        restrict: 'A',
        priority: -1,   // cause out postLink function to execute before native `ngClick`'s
        // ensuring that we can stop the propagation of the 'click' event
        // before it reaches `ngClick`'s listener
        link: function (scope, elem) {
            var disabled = false;

            function onClick(evt) {
                if (disabled) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                } else {
                    disabled = true;
                    $timeout(function () { disabled = false; }, delay, false);
                }
            }

            scope.$on('$destroy', function () { elem.off('click', onClick); });
            elem.on('click', onClick);
        }
    };
});
app.directive('confirmOnExit', function () {
    /**
    * @name confirmOnExit
    * 
    * @description
    * Prompts user while he navigating away from the current route (or, as long as this directive 
    * is not destroyed) if any unsaved form changes present.
    * @example
    * Usage:
    * Example Controller: (using controllerAs syntax in this example)
    * 
    *      angular.module('AppModule', []).controller('pageCtrl', [function () {
    *          this.isDirty = function () {
    *              // do your logic and return 'true' to display the prompt, or 'false' otherwise.
    *              return true;
    *          };
    *      }]);
    * 
    * Template:
    * 
    *      <div confirm-on-exit="pageCtrl.isDirty()" 
    *          confirm-message-window="All your changes will be lost."
    *          confirm-message-route="All your changes will be lost. Are you sure you want to do this?">
    * 
    * @see
    * http://stackoverflow.com/a/28905954/340290
    * 
    * @author Manikanta G
    */
    return {
        scope: {
            confirmOnExit: '&',
            confirmMessageWindow: '@',
            confirmMessageRoute: '@',
            confirmMessage: '@'
        },
        link: function ($scope, elem, attrs) {
            window.onbeforeunload = function () {
                if ($scope.confirmOnExit()) {
                    return $scope.confirmMessageWindow || $scope.confirmMessage;
                }
            }
            var $locationChangeStartUnbind = $scope.$on('$locationChangeStart', function (event, next, current) {
                if ($scope.confirmOnExit()) {
                    if (!confirm($scope.confirmMessageRoute || $scope.confirmMessage)) {
                        event.preventDefault();
                    }
                }
            });

            $scope.$on('$destroy', function () {
                window.onbeforeunload = null;
                $locationChangeStartUnbind();
            });
        }
    };
});

app.directive('processField', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {},
        link: function (scope, element, ctrl) {
            var template = $compile('<i ng-show="enabled" ng-mousedown="reset()" style="color:red;" class="fa fa-spinner"></i>')(scope);
            element.after(template);

            element.bind('blur', function () {
                scope.enabled = true;
                scope.$apply();
            });

            scope.reset = function () {
                ctrl.$setViewValue(null);
                ctrl.$render();
                $timeout(function () {
                    element[0].focus();
                }, 0, false);
            };
        }
    };
}]);

app.directive('focus',
    function ($timeout) {
        return {
            scope: {
                trigger: '@focus'
            },
            link: function (scope, element) {
                scope.$watch('trigger', function (value) {
                    if (value === "true") {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    }
);
app.directive('aDisabled', function () {
    return {
        compile: function (tElement, tAttrs, transclude) {
            //Disable ngClick
            tAttrs["ngClick"] = "!(" + tAttrs["aDisabled"] + ") && (" + tAttrs["ngClick"] + ")";

            //Toggle "disabled" to class when aDisabled becomes true
            return function (scope, iElement, iAttrs) {
                scope.$watch(iAttrs["aDisabled"], function (newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });

                //Disable href on click
                iElement.on("click", function (e) {
                    if (scope.$eval(iAttrs["aDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
});

app.directive('iChecks', function () {
    return {
        restrict: 'AC',
        link: function (scope, tElement, attr) {
            var dataId = newGuid();
            tElement.attr("id", dataId);
            var template = "<label class='side-label' for='" + dataId + "' style='" + tElement.attr("data-style") + "'> "
                + (attr.title || '') + "</label>";
            tElement.after(template);
            if (attr.mathml && typeof MathJax != "undefined") {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, template]);
            }
        }
    };
});

app.directive('denCau', function () {
    return {
        restrict: 'A',
        link: function (scope, tElement, attr) {
            tElement.on("click", function (e) {
                var id = tElement.attr("href");
                var offset = 80;
                var target = $(id).offset().top - offset;
                $('html, body').animate({
                    scrollTop: target
                }, 500, "easeInOutExpo");
                e.preventDefault();
            });
        }
    };
});

app.directive('uiDateVn', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs) {
            if (attrs.uiDateVn == "dateTime") {
                element.datetimepicker({
                    format: attrs.format || 'HH:mm DD/MM/YYYY',
                    dayViewHeaderFormat: 'MMMM - YYYY',
                    showTodayButton: true,
                    showClose: true,
                });
            }
            else if (attrs.uiDateVn == "Time") {
                element.datetimepicker({
                    format: 'HH:mm',
                    dayViewHeaderFormat: 'HH:mm'
                });
            }
            else {
                element.datetimepicker({
                    format: attrs.format || 'DD/MM/YYYY',
                    dayViewHeaderFormat: 'MMMM - YYYY'
                });
            }
            element.bind('change', function () {
                scope.$apply();
            });
        }
    };
});
app.directive('myDate', function () {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngChange: '&',
            ngDisabled: '=?',
        },
        template: function (elem, attrs) {
            let mask = '99/99/9999';
            let model = '';
            let format = '';
            if (attrs.format === 'dateTime') {
                model = 'dateTime';
                mask = '99:99 99/99/9999';
            } else if (attrs.format === 'date2') {
                mask = '99 / 99 / 9999';
                format = 'DD / MM / YYYY';
            } else if (attrs.format === 'dateTime2') {
                mask = '99 : 99 99 / 99 / 9999';
                format = 'HH : mm DD / MM / YYYY';
            } else if (attrs.format === 'dateNgay') {
                mask = 'Ngày 99 tháng 99 năm 9999';
                return `<input type="text" class="${attrs.class}" ui-mask="${mask}" ui-mask-placeholder-char="space "
                ng-model="mValue" ng-change="changeValue(mValue)" ng-model-options="{updateOn : 'change blur'}" ng-disabled="ngDisabled" />`;
            } else if (attrs.format === 'dateLong') {
                mask = '99 giờ 99 phút, Ngày 99 / 99 / 9999';
                return `<input type="text" class="${attrs.class}" ui-mask="${mask}" ui-mask-placeholder-char="space "
                ng-model="mValue" ng-change="changeValue(mValue)" ng-model-options="{updateOn : 'change blur'}" ng-disabled="ngDisabled" />`;
            }
            return `<input type="text" class="${attrs.class}" ui-mask="${mask}" model-view-value="true" ui-mask-placeholder-char="space "
        ui-date-vn="${model}" format="${format}" ng-model="mValue" ng-change="changeValue(mValue)" ng-model-options="{updateOn : 'change blur'}" ng-disabled="ngDisabled" placeholder="${attrs.placeholder || ''}"/>`;
        },
        link: function ($scope, element, attrs) {
            var isChange = false;
            let format = 'DD/MM/YYYY';
            if (attrs.format == 'dateTime') {
                format = 'HH:mm DD/MM/YYYY';
            } else if (attrs.format === 'date2') {
                format = 'DD / MM / YYYY';
            } else if (attrs.format === 'dateTime2') {
                format = 'HH : mm DD / MM / YYYY';
            } else if (attrs.format === 'dateNgay') {
                format = '[Ngày] DD [tháng] MM [năm] YYYY';
            } else if (attrs.format === 'dateLong') {
                format = 'HH [giờ] mm [phút, ngày] DD / MM / YYYY';
            }

            $scope.changeValue = function (newVal) {
                isChange = true;
                if (!newVal) {
                    $scope.ngModel = undefined;
                } else {
                    $scope.ngModel = moment(newVal, format).format('YYYY-MM-DD[T]HH:mm:ss');
                }
                setTimeout(() => {
                    $scope.ngChange({ $event: $scope.ngModel });
                    isChange = false;
                }, 1);
            };

            $scope.$watch('ngModel', function (newVal, oldVal) {
                if (isChange)
                    return;
                if (!dateIsNull(newVal)) {
                    $scope.mValue = moment(newVal).format(format);
                } else {
                    $scope.mValue = '';
                }
            });
        }
    };
});
app.directive('myDatetime', function () {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngChange: '&',
        },
        template: `<a style="display: block;" ng-click="OpenPopupThoiGian()">{{ngModel.Text}} <i class="pull-right fa fa-calendar"></i></a>
<div class="modal inmodal" id="{{id}}" tabindex="-1"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-footer"> <table class="table text-left"> <thead> <tr> <th>Theo ngày</th> <th>Theo tuần</th> <th>Theo tháng</th> <th>Theo quý</th> <th>Theo năm</th> </tr></thead> <tbody> <tr> <td><a ng-click="ChonThoiGian('HomNay')">Hôm nay</a></td><td><a ng-click="ChonThoiGian('TuanNay')">Tuần này</a></td><td><a ng-click="ChonThoiGian('ThangNay')">Tháng này</a></td><td><a ng-click="ChonThoiGian('QuyNay')">Quý này</a></td><td><a ng-click="ChonThoiGian('NamNay')">Năm nay</a></td></tr><tr> <td><a ng-click="ChonThoiGian('HomQua')">Hôm qua</a></td><td><a ng-click="ChonThoiGian('TuanTruoc')">Tuần trước</a></td><td><a ng-click="ChonThoiGian('ThangTruoc')">Tháng trước</a></td><td><a ng-click="ChonThoiGian('QuyTruoc')">Quý trước</a></td><td><a ng-click="ChonThoiGian('NamTruoc')">Nam trước</a></td></tr><tr> <td></td><td><a ng-click="ChonThoiGian('7Ngay')">7 ngày qua</a></td><td><a ng-click="ChonThoiGian('30Ngay')">30 ngày qua</a></td><td></td><td></td></tr></tbody> </table> </div><div class="modal-footer"> <div class="form-group"> <div class="col-sm-8"> <div class="input-group"> <span class="input-group-addon">Khoảng từ </span> <my-date data-class="form-control" ng-model="thoiGian.from" ng-change="ChangeData()"></my-date> <span class="input-group-addon"> đến </span> <my-date data-class="form-control" ng-model="thoiGian.to" ng-change="ChangeData()"></my-date> </div></div><div class="col-sm-4"> <button type="button" class="btn btn-success" ng-click="ChonThoiGian('FromTo');"> <span class="fa fa-search"></span> Tìm kiếm </button> </div></div></div></div></div></div>`,
        link: function ($scope, element, attrs) {
            $scope.id = newGuid();
            $scope.thoiGian = {
                from: moment().format(EFormat.DayISO),
                to: moment().format(EFormat.DayISO)
            }
            $scope.ngModel = {
                Text: 'Tháng này',
                Type: 'ThangNay',
                From: moment().startOf('month').format(EFormat.DayISO),
                To: moment().endOf('month').format(EFormat.DayISO)
            };
            if (attrs.format == 'showDate') {
                $scope.ngModel.Text = moment($scope.ngModel.From).format(EFormat.DateInView) + '-' + moment($scope.ngModel.To).format(EFormat.DateInView);
            }

            $scope.OpenPopupThoiGian = function (d) {
                $("#" + $scope.id).modal();
            }

            $scope.closePopupThoiGian = function () {
                $("#" + $scope.id).modal('hide');
            };

            $scope.ChonThoiGian = function (type) {
                $scope.ngModel.Type = type;
                switch (type) {
                    case 'HomNay':
                        $scope.ngModel.Text = 'Hôm nay';
                        $scope.ngModel.From = moment().format(EFormat.DayISO);
                        $scope.ngModel.To = moment().format(EFormat.DayISO);
                        break;
                    case 'TuanNay':
                        $scope.ngModel.Text = 'Tuần nay';
                        $scope.ngModel.From = moment().startOf('week').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().endOf('week').format(EFormat.DayISO);
                        break;
                    case 'ThangNay':
                        $scope.ngModel.Text = 'Tháng nay';
                        $scope.ngModel.From = moment().startOf('month').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().endOf('month').format(EFormat.DayISO);
                        break;
                    case 'QuyNay':
                        $scope.ngModel.Text = 'Quý nay';
                        $scope.ngModel.From = moment().startOf('quarter').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().endOf('quarter').format(EFormat.DayISO);
                        break;
                    case 'NamNay':
                        $scope.ngModel.Text = 'Năm nay';
                        $scope.ngModel.From = moment().startOf('year').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().endOf('year').format(EFormat.DayISO);
                        break;
                    case 'HomQua':
                        $scope.ngModel.Text = 'Hôm qua';
                        $scope.ngModel.From = moment().add(-1, 'd').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().add(-1, 'd').format(EFormat.DayISO);
                        break;
                    case 'TuanTruoc':
                        $scope.ngModel.Text = 'Tuần trước';
                        $scope.ngModel.From = moment().add(-1, 'w').startOf('week').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().add(-1, 'w').endOf('week').format(EFormat.DayISO);
                        break;
                    case 'ThangTruoc':
                        $scope.ngModel.Text = 'Tháng trước';
                        $scope.ngModel.From = moment().add(-1, 'M').startOf('month').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().add(-1, 'M').endOf('month').format(EFormat.DayISO);
                        break;
                    case 'QuyTruoc':
                        $scope.ngModel.Text = 'Quý trước';
                        $scope.ngModel.From = moment().add(-1, 'Q').startOf('quarter').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().add(-1, 'Q').endOf('quarter').format(EFormat.DayISO);
                        break;
                    case 'NamTruoc':
                        $scope.ngModel.Text = 'Năm trước';
                        $scope.ngModel.From = moment().add(-1, 'y').startOf('year').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().add(-1, 'y').endOf('year').format(EFormat.DayISO);
                        break;
                    case '7Ngay':
                        $scope.ngModel.Text = '7 ngày qua';
                        $scope.ngModel.From = moment().add(-7, 'd').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().format(EFormat.DayISO);
                        break;
                    case '30Ngay':
                        $scope.ngModel.Text = '30 ngày qua';
                        $scope.ngModel.From = moment().add(-30, 'd').format(EFormat.DayISO);
                        $scope.ngModel.To = moment().format(EFormat.DayISO);
                        break;
                    case 'FromTo':
                        $scope.ngModel.Text = moment($scope.thoiGian.from).format(EFormat.DateInView) + '-' + moment($scope.thoiGian.to).format(EFormat.DateInView);
                        $scope.ngModel.From = moment($scope.thoiGian.from).format(EFormat.DayISO);
                        $scope.ngModel.To = moment($scope.thoiGian.to).format(EFormat.DayISO);
                    default:
                }
                if (attrs.format == 'showDate') {
                    $scope.ngModel.Text = moment($scope.ngModel.From).format(EFormat.DateInView) + '-' + moment($scope.ngModel.To).format(EFormat.DateInView);
                }
                $scope.closePopupThoiGian();
                setTimeout(() => {
                    $scope.ngChange({ $event: $scope.ngModel });
                }, 10);
            }
        }
    };
});
app.directive('collapseLink', function () {
    return {
        restrict: 'C',
        compile: function (tElement) {
            tElement.on("click", function (e) {
                var ibox = $(tElement).closest('div.ibox');
                var button = $(tElement).find('i');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                setTimeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            });
        }
    };
});

app.directive('expandLink', function () {
    return {
        restrict: 'C',
        compile: function (tElement) {
            tElement.on("click", function (e) {
                var body = $('body');
                //e.preventDefault();
                var ibox = $(tElement).closest('div.ibox');
                var button = $(tElement).find('i');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('expanded');
                body.toggleClass('body-expanded');
                var timeout = 0;
                if (body.hasClass('body-expanded')) {
                    timeout = 100;
                }
                setTimeout(function () {
                    ibox.toggleClass('expanded-padding');
                }, timeout);
                setTimeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, timeout + 50);
            });
        }
    };
});

app.directive('navbarMinimalize', function () {
    return {
        restrict: 'C',
        compile: function (tElement) {
            tElement.on("click", function (e) {
                if ($('body').hasClass("mini-navbar")) {
                    $("body").removeClass("mini-navbar");
                    setCookie('menu_state', 'N', 8);
                } else {
                    $("body").addClass("mini-navbar");
                    setCookie('menu_state', 'Y', 8);
                }
                SmoothlyMenu();
            });
        }
    };
});

app.filter('numberFixedLen', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = '' + num;
        while (num.length < len) {
            num = '0' + num;
        }
        return num;
    };
});
// Dùng cùng ng-bind-html | trusted để có được cả css, và các thẻ đặt biệt
app.filter('trusted', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html)
    }
})

app.directive("mathjaxBind", function () {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs",
            function ($scope, $element, $attrs) {
                $scope.$watch($attrs.mathjaxBind, function (texExpression) {
                    texExpression = texExpression || "";
                    texExpression = texExpression.replace(/^\<p\>/, "").replace(/\<\/p\>$/, "");
                    $element.html(texExpression);
                    if (typeof MathJax != "undefined") {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                    }
                });
            }]
    };
});

app.directive('numberInput', function () {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return ConverTienCoDauPhay2(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/,/g, '');
                elem.val(ConverTienCoDauPhay2(plainNumber));
                return plainNumber;
            });
        }
    };
});