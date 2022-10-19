(function () {
    'use strict';
    var app = angular.module('uiApp', [
        'ngSanitize',
        'toaster',
        'ngProgress',
        'ngTouch',
        'ui.router'
    ]).factory('authInterceptor', function ($q) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = localStorage.getItem('bearerToken') || '';
                if (token && !config.headers.Authorization) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                var vUrl = config.url;
                if (vUrl && (
                    // html bắt đầu với `/partials` là static files của dự án
                    (vUrl.endsWith('.html') && /^\/(partials|js)/.test(vUrl))
                    || ['.css', '.js'].some(x => vUrl.endsWith(x))
                )) {
                    config.url = vUrl + '?v=' + _version;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    location.href = "/Login";
                }
                return response || $q.when(response);
            },
            responseError: function (rejectionResponse) {
                var deferred = $q.defer();
                if (rejectionResponse.status === 401 || rejectionResponse.status === 403) {
                    location.href = "/Login";
                } else {
                    deferred.reject(rejectionResponse);
                }
                return deferred.promise;
            }
        }
    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]).run(['$rootScope', '$state', '$stateParams', 'toaster', function ($rootScope, $state, $stateParams, toaster) {
        $rootScope.UrlApp = _webapp;
        $rootScope.user = JSON.parse(localStorage.getItem('currentUser') || '{}') || {};

        if ($rootScope.user.Role == 'BanSi') {
            $rootScope.user.isBanSi = true;
        } else {
            $rootScope.user.isBanSi = false;
        }
        $rootScope.getDonGiaBan = function (sp, sl) {
            if ($rootScope.user.isBanSi) {
                if (strIsNotNull(sp.CauHinhGiaSi)) {
                    var lGiaSi = JSON.parse(sp.CauHinhGiaSi);
                    var giaGan = _.max(_.filter(lGiaSi, x => x.SoLuong <= sl), y => y.SoLuong);
                    if (giaGan != -Infinity) {
                        return giaGan.GiaSi;
                    }
                }
                return sp.GiaSi;
            }
            return sp.GiaBan;
        }
        $rootScope.IsDaDangNhap = function IsDaDangNhap() {
            if ($rootScope.user && $rootScope.user.Id && $rootScope.user.Id != _idEmpty) return true;
            return false;
        };
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.GioHang = JSON.parse(localStorage.getItem(EStorageKey.GioHang) || '{"DsSanPham":[],"SoSanPham":0,"TongTien":0}');
        $rootScope.addToCart = function (sp, soluong, thuoctinh) {
            var sanpham = _.find($rootScope.GioHang.DsSanPham, x => x.Id === sp.Id && x.ThuocTinh == thuoctinh);
            const sl = soluong || 1;
            if (sanpham) {
                sanpham.SoLuong = parseInt(sanpham.SoLuong) + parseInt(sl);
                sanpham.GiaBan = $rootScope.getDonGiaBan(sanpham);
                $rootScope.GioHang.TongTien = 0;
                _.each($rootScope.GioHang.DsSanPham, x => {
                    $rootScope.GioHang.TongTien += x.GiaBan * x.SoLuong;
                });
            } else {
                sanpham = {
                    IdTrack: newGuid(),
                    Id: sp.Id,
                    Ten: sp.Ten,
                    UrlHinhAnh: sp.UrlHinhAnh,
                    GiaBan: $rootScope.getDonGiaBan(sp, sl),
                    GiaGoc: sp.GiaGoc,
                    GiaSi: sp.GiaSi,
                    CauHinhGiaSi: sp.CauHinhGiaSi,
                    SoLuong: sl,
                    ThuocTinh: thuoctinh
                };
                $rootScope.GioHang.DsSanPham.push(sanpham);
                $rootScope.GioHang.SoSanPham += 1;
                $rootScope.GioHang.TongTien += sanpham.GiaBan * parseInt(sl);
            };
            localStorage.setItem(EStorageKey.GioHang, JSON.stringify($rootScope.GioHang));
            toaster.pop('success', 'Đã thêm vào giỏ hàng', sp.Ten);
        }
        $rootScope.delCart = function (sp, index) {
            $rootScope.GioHang.DsSanPham.splice(index, 1);
            $rootScope.GioHang.SoSanPham -= 1;
            $rootScope.GioHang.TongTien -= sp.GiaBan * sp.SoLuong;
            localStorage.setItem(EStorageKey.GioHang, JSON.stringify($rootScope.GioHang));
            toaster.pop('success', 'Đã xoá khỏi giỏ hàng', sp.Ten);
        }

        $rootScope.YeuThich = JSON.parse(localStorage.getItem(EStorageKey.YeuThich) || '{"DsSanPham":[],"SoSanPham":0}');
        $rootScope.addToHeart = function (sp) {
            var sanpham = _.find($rootScope.YeuThich.DsSanPham, x => x.Id === sp.Id);
            if (!sanpham) {
                sanpham = {
                    Id: sp.Id,
                    Ten: sp.Ten,
                    UrlHinhAnh: sp.UrlHinhAnh,
                    Url: sp.Url,
                    GiaBan: $rootScope.user.isBanSi ? sp.GiaSi : sp.GiaBan,
                    GiaGoc: sp.GiaGoc
                }
                $rootScope.YeuThich.DsSanPham.push(sanpham);
                $rootScope.YeuThich.SoSanPham += 1;
                localStorage.setItem(EStorageKey.YeuThich, JSON.stringify($rootScope.YeuThich));
                toaster.pop('success', 'Đã thêm vào yêu thích', sp.Ten);
            } else {
                toaster.pop('warning', 'Sản phẩm này đã có trong danh sách yêu thích');
            }
        }
        $rootScope.TimKiemSanPham = function (str, danhmuc, order) {
            var param = {};
            if (guidIsNotNuLL(danhmuc)) param.id = danhmuc;
            if (strIsNotNull(str)) param.s = str;
            if (strIsNotNull(order)) param.order = order;
            $state.go('Shop', param);
        }
        $rootScope.logout = function () {
            localStorage.removeItem('bearerToken');
            localStorage.removeItem('currentUser');
            $rootScope.user = {};
            console.log('session destroyed');
            $state.go('Login');
        }
        $rootScope.$on('$stateChangeStart', () => startLoader2());
        $rootScope.$on('$stateChangeSuccess', () => setTimeout(() => { stopLoader2(); $("html, body").animate({ scrollTop: 0 }, "fast"); }, 500));
        $rootScope.$on('$stateChangeError', () => stopLoader2());
    }]).service('_reloadState_', ['$rootScope', '$state', '$window', function ($rootScope, $state, $window) {
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
    }]).config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider',
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

        $stateProvider.state('Home', {
            url: '/',
            templateUrl: '/partials/Home.html',
            controller: 'HomeCtrl'
        })
        $stateProvider.state('Login', {
            url: '/Login?user',
            templateUrl: '/partials/Login.html',
            controller: 'LoginCtrl'
        })
        $stateProvider.state('Register', {
            url: '/Register?url',
            templateUrl: '/partials/Register.html',
            controller: 'RegisterCtrl'
        })
        $stateProvider.state('Shop', {
            url: '/Shop?s&id&order',
            templateUrl: '/partials/Shop.html',
            controller: 'ShopCtrl'
        })
        $stateProvider.state('Product', {
            url: '/Product?id',
            templateUrl: '/partials/Product.html',
            controller: 'ProductCtrl'
        })
        $stateProvider.state('Cart', {
            url: '/Cart',
            templateUrl: '/partials/Cart.html',
            controller: 'CartCtrl'
        })
        $stateProvider.state('CheckOut', {
            url: '/CheckOut',
            templateUrl: '/partials/CheckOut.html',
            controller: 'CheckOutCtrl'
        })
        $stateProvider.state('ThankYou', {
            url: '/ThankYou?ma&id',
            templateUrl: '/partials/ThankYou.html',
            controller: ['$scope', function ($scope) {
                $scope.MaDonHang = $scope.$stateParams.ma || '';
                $scope.IdDonHang = $scope.$stateParams.id || '';
            }]
        })
        $stateProvider.state('Wishlist', {
            url: '/Wishlist',
            templateUrl: '/partials/Wishlist.html',
            controller: 'WishlistCtrl'
        })
        $stateProvider.state('Event', {
            url: '/Event',
            templateUrl: '/partials/Event.html',
            controller: 'EventCtrl'
        })
        $stateProvider.state('EventDetail', {
            url: '/Event/:id',
            templateUrl: '/partials/EventDetail.html',
            controller: 'EventDetailCtrl'
        })
        $stateProvider.state('Profile', {
            url: '/Profile',
            templateUrl: '/partials/Profile.html',
            controller: 'ProfileCtrl'
        })
        $stateProvider.state('EditProfile', {
            url: '/EditProfile',
            templateUrl: '/partials/EditProfile.html',
            controller: 'EditProfileCtrl'
        })
        $stateProvider.state('LichSuMuaHang', {
            url: '/LichSuMuaHang?tt',
            templateUrl: '/partials/LichSuMuaHang.html',
            controller: 'LichSuMuaHangCtrl'
        })
        $stateProvider.state('CTDonHang', {
            url: '/CTDonHang?id',
            templateUrl: '/partials/CTDonHang.html',
            controller: 'CTDonHangCtrl'
        })
        $stateProvider.state('Contact', {
            url: '/Contact',
            templateUrl: '/partials/Contact.html',
        })
        $stateProvider.state('GioiThieu', {
            url: '/GioiThieu/:id',
            templateUrl: '/partials/GioiThieu.html',
            controller: 'GioiThieuCtrl'
        })
        .state('notfound', {
            url: '/not-found?url',
            templateUrl: '/partials/notfound.html',
            controller: ['$scope', function ($scope) {
                $scope.notFoundUrl = $scope.$stateParams.url;
            }]
        })
        .state('HeThong', {
            url: '/HeThong',
            abstract: true,
            template: '<div ui-view="" />',
        });     
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

    }]);
})();