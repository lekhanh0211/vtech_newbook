var app = angular.module('myApp', ['toaster', 'ngProgress']);

app.directive('iChecks', function () {
    return {
        scope: {
            isRight: '=',
            ngModel: '='
        },
        restrict: 'C',
        link: function (scope, tElement, attr) {
            let vId = attr.id;
            if (!vId) {
                vId = newGuid();
                tElement.attr("id", vId);
            }
            var template = "<label class='side-label" + (scope.isRight ? ' right' : '') + "' for='" + vId + "' style='" + (tElement.attr("data-style") || '') + "'> "
                + (attr.title || '') + "&nbsp;</label>";
            tElement.after(template);
            if (attr.hasOwnProperty('unCheck')) {
                tElement.on("click", (e) => {
                    if (scope.ngModel == e.target.value) {
                        scope.ngModel = null;
                        scope.$apply();
                    }
                });
            }
        }
    };
});

app.controller('loginCtrl', function ($scope, $http, ngProgress, toaster) {
    localStorage.removeItem('ls._menu');
    var urlObj = $.deparam.querystring();
    $scope.LoginData = {
        UserName: '',
        Password: ''
    }
    $scope.Login = function () {
        ngProgress.start(true);
        $http({
            method: 'POST',
            url: '/oauth/token',
            headers: {
                'content-type': 'application/json'
            },
            data: $scope.LoginData,
        }).then(function mySuccess(result) {
            ngProgress.complete(true);
            if (result && result.data && result.data.Id) {
                toaster.pop('success', 'Đăng nhập thành công!');
                localStorage.setItem('currentUser', JSON.stringify(result.data));
                location.href = urlObj.ReturnUrl || '/';
            } else {
                toaster.pop('error', 'Đăng nhập thất bại!');
            }
        }, function myError(data) {
            ngProgress.complete(true);
            console.error('Login error: ', data);
            toaster.pop('error', 'Đăng nhập thất bại!', data.status == 400 ? data.data : '');
        });
    }
});