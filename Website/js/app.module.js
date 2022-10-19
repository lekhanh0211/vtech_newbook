(function () {
    'use strict';
    var app = angular.module('uiApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.mask',
        'ui.select',
        'ui.sortable',
        'toaster',
        'ngProgress',
        'ui.router',
        'ui.tinymce',
        'stateFiles',
        'toggle-switch',
        'cfp.hotkeys',
        'ngDragDrop',
        'LocalStorageModule',
        'angucomplete-alt',
        'common',
        'ui.codemirror',
        //'ui.bootstrap',
    ]).factory('authInterceptor', function () {
        return {
            request: function (config) {
                var vUrl = config.url;
                if (vUrl && (
                    // html bắt đầu với `/partials` là static files của dự án
                    (vUrl.endsWith('.html') && /^\/(partials|js)/.test(vUrl))
                    || ['.css', '.js'].some(x => vUrl.endsWith(x))
                )) {
                    config.url = vUrl + '?v=' + _version;
                }
                return config;
            }
        }
    }).config(['$httpProvider', 'uiSelectConfig', function ($httpProvider, uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
        $httpProvider.interceptors.push('authInterceptor');
    }]).run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.user = _userProfile;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.closePopup = function (id, options) {
            if (typeof id === 'string') {
                if (!/^[#.]/.test(id)) {
                    id = '#' + id;
                }
                $(id).bPopup(options || {}).close();
            }
        }

        $rootScope.openPopup = function (id, options, idFocus) {
            if (typeof id === 'string') {
                if (typeof options === 'string') {
                    var tmp = options;
                    options = idFocus;
                    idFocus = tmp;
                }

                if (!/^[#.]/.test(id)) {
                    id = '#' + id;
                }

                var opts = Object.assign({
                    escClose: false,
                    modalClose: false
                }, options)

                $(id).bPopup(opts).show()

                if (typeof idFocus === 'string') {
                    $(idFocus).focus();
                }
            }
        }

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            console.log('$state change: ', fromState, toState);
            if (toState.parent) {
                $(".popup").remove();
                $(".bModal").remove();
            }
            $(".iframePrintPage").remove();
            if ($rootScope.menu_) {
                try {
                    _.forEach($rootScope.menu_, item => {
                        if (item.IsParent) {
                            _.forEach(item.Children, x => {
                                if (x.UrlState ? $rootScope.$state.includes(x.UrlState, JSON.parse(x.Params)) : $rootScope.$state.includes(x.Action)) {
                                    $rootScope.stateMenu = x;
                                    throw new Error();
                                }
                            })
                        } else {
                            if (item.UrlState ? $rootScope.$state.includes(item.UrlState, JSON.parse(item.Params)) : $rootScope.$state.includes(item.Action)) {
                                $rootScope.stateMenu = item;
                                throw new Error();
                            }
                        }
                    });
                } catch (e) { }
            }
        });
    }]).factory('myAppConfig', function ($http, localStorageService) {
        if (_userProfile && _userProfile.GhiChu) {
            _userProfile.Claim = Base64.decode(_userProfile.GhiChu).split(',');
        }
        return {
            user: _userProfile,
            getSysMenu: function () {
                return Promise.resolve()
                    .then(() => {
                        if (!IsDaDangNhap()) {
                            return [];
                        }
                        // try to get menu from cache storage
                        let menu = localStorageService.get('_menu');
                        let userProfile = _userProfile;
                        if (!menu || menu.length === 0) {
                            return new Promise((resolve, reject) => {
                                $http({
                                    method: 'GET',
                                    url: '/api/menus/roles/' + userProfile.IdRole
                                }).success(function (menu) {
                                    localStorageService.set('_menu', menu);
                                    resolve(menu);
                                }).error(function (err) {
                                    reject(err);
                                });
                            });
                        } else {
                            return menu;
                        }
                    })
                    .then((menu) => {
                        return menu || [];
                    });
            },
        }
    });
})();