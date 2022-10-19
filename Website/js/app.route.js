(function () {
    'use strict';

    var app = angular.module('uiApp');

    app.service('_reloadState_', ['$rootScope', '$state', '$window', function ($rootScope, $state, $window) {
        var once = $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            console.log('$state reload by redirect: ', toState);
            once(); // de-register first
            let target = $state.href(toState, toParams, {
                absolute: false
            });
            $window.location.href = target;
            // do not change $state, just redirect & reload page.
            return event.preventDefault();
        });
    }]);

    app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider',
        function ($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
            // use the HTML5 History API
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise(function ($injector, $location) {
                let state = $injector.get('$state');
                state.go('notfound', {
                    url: $location.path()
                });
                return $location.path();
            });
            console.log('config, app_base-controller.states');
            ///////////////////////////
            // State Configurations ///
            ///////////////////////////

            $stateProvider
                .state('root', {
                    url: '/',
                    template: '<h2>Welcome, vui lòng chọn mục lục làm việc.</h2>',
                    resolve: {
                        _menu_: ['myAppConfig', function (myAppConfig) {
                            return myAppConfig.getSysMenu();
                        }]
                    },
                    controller: ['$scope', '_menu_', function ($scope, _menu_) {
                        // get first element
                        var menu = _menu_.find(() => true);
                        for (let limit = 0; limit < 3; limit++) {
                            if (!menu || !menu.Children || menu.Children.length <= 0) {
                                break;
                            } else {
                                // get first child
                                menu = menu.Children.find(() => true);
                            }
                        }

                        if (!menu) {
                            console.log('Ko có trang mặc định khả dụng (0)');
                        } else if (menu.UrlState) {
                            console.log('Change state to: ', menu);
                            let sparams = JSON.parse(menu.Params || '{}');
                            $scope.$state.go(menu.UrlState, sparams);
                        } else if (menu.Action) {
                            console.log('Change state to: ', menu);
                            let sparams = {};
                            let state = menu.Action.replace(/\(.*?\)$/, '');
                            try {
                                sparams = JSON.parse(menu.Params || '{}');
                            } catch (err) {
                                console.error("Cấu hình chức năng chưa đúng `Params`: ", menu);
                            }
                            $scope.$state.go(state, sparams);
                        }
                    }]
                })
                .state('notfound', {
                    url: '/not-found?url',
                    templateUrl: '/partials/notfound.html',
                    controller: ['$scope', function ($scope) {
                        $scope.notFoundUrl = $scope.$stateParams.url;
                    }]
                })
                .state('ChucNang', {
                    url: '/ChucNang',
                    abstract: true,
                    template: '<div ui-view="" />',
                })
                .state('DanhMuc', {
                    url: '/DanhMuc',
                    abstract: true,
                    template: '<div ui-view="" />',
                })
                .state('HeThong', {
                    url: '/HeThong',
                    abstract: true,
                    template: '<div ui-view="" />',
                })
                .state('ThongKe', {
                    url: '/ThongKe',
                    abstract: true,
                    template: '<div ui-view="" />',
                })
            //////////////////////////////////////////////////////////////////////////////////////
            // FIX for trailing slashes. Gracefully "borrowed"                                  //
            // from https://github.com/angular-ui/ui-router/issues/50                           //
            // Then all routes in app/scripts/app.js must be redefined with trailing /.         //
            // Note that routes such as /things/:id become /things/:id/ as well.                //
            //////////////////////////////////////////////////////////////////////////////////////
            $urlRouterProvider.rule(function ($injector, $location) {
                if ($location.protocol() === 'file')
                    return;

                var path = $location.path()
                    // Note: misnomer. This returns a query object, not a search string
                    ,
                    search = $location.search(),
                    params;

                // check to see if the path already ends in '/'
                if (path[path.length - 1] === '/') {
                    return;
                }

                // If there was no search string / query params, return with a `/`
                if (Object.keys(search).length === 0) {
                    return path + '/';
                }

                // Otherwise build the search string and return a `/?` prefix
                params = [];
                angular.forEach(search, function (v, k) {
                    params.push(k + '=' + v);
                });
                return path + '/?' + params.join('&');
            });

        }
    ]);
    app.controller('LeftNavCtrl', ['$scope', '$rootScope', 'myAppConfig', function ($scope, $rootScope, myAppConfig) {
        myAppConfig.getSysMenu().then((menu) => {
            $rootScope.menu_ = menu;
            $scope.menus = menu;
            setTimeout(() => {
                $scope.$apply();
                $('#side-menu').metisMenu();
            }, 1000);
        });
        $scope.checkActiveMenu = function (item) {
            try {
                if (item.IsParent) {
                    if (_.some(item.Children, x => x == $rootScope.stateMenu)) return 'active';
                } else {
                    if (item == $rootScope.stateMenu) return 'active';
                }
            } catch (error) {
                console.log('$lỗi menu: ', item, error);
            }

        }
    }]);
})();
