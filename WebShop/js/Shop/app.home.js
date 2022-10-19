
app.directive('productSlider', function () {
    return {
        restrict: 'C',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function (element) {
                // init carousel
                $(element).owlCarousel({
                    loop: true,
                    margin: 25,
                    nav: true,
                    //items: 10,
                    dots: true,
                    navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
                    smartSpeed: 1200,
                    autoHeight: false,
                    autoplay: true,
                    responsive: {
                        0: {
                            items: 2,
                        },
                        576: {
                            items: 3,
                        },
                        992: {
                            items: 4,
                        },
                        1200: {
                            items: 5,
                        }
                    }
                });
            };
        }
    };
})
.directive('ngProductItem', [function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {
            // wait for the last item in the ng-repeat then call init
            if (scope.$last) {
                setTimeout(() => { scope.initCarousel(element.parent()); }, 100);
            }
        }
    };
}]);
app.controller('HomeCtrl', ['$scope', '$http', 'ngProgress', 'toaster', function ($scope, $http, ngProgress, toaster) {
    $scope.LoadDsBanTin = function () {
        $http({
            method: 'GET',
            url: '/api/bantin/list?sSearch=&index=1&size=3',
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.ListDatas = result.data.List;
            }
        });
    }

    $scope.LoadDMCapDuoi = function (iDanhMuc) {
        $http({
            method: 'GET',
            url: '/api/danhmuc/bycaptren?cap=2&id=' + iDanhMuc.Id,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                iDanhMuc.DMCapDuoi = _.filter(result.data, x => x.IsHienThiTrangChu);
            }
        });
    }

    $scope.loadSanPham = function (dm1, dm) {
        $http({
            method: 'GET',
            url: `/api/sanpham/showpage?sSearch=&idLoai=${dm.Id}&iPageIndex=1&iPageSize=10`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                dm1.IdDanhMuc = dm.Id;
                dm1.UrlDanhMuc = dm.Url;
                dm1.DsSanPham = [result.data.List];
            }
        });
    }

    $scope.LoadDsDanhMuc = function () {
        $http({
            method: 'GET',
            url: '/api/danhmuc/bycap?cap=1',
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                var lDanhMuc = result.data;
                $scope.ListDanhMucNoiBat = _.filter(lDanhMuc, x => x.IsNoiBat).slice(0, 3);
                var dsHienThi = _.filter(lDanhMuc, x => x.IsHienThiTrangChu);
                $scope.ListDanhMuc = [];
                _.each(dsHienThi, (x, i) => {
                    $scope.LoadDMCapDuoi(x);
                    $scope.loadSanPham(x, x);
                    if (i === 0) $scope.DanhMuc1 = x;
                    else $scope.ListDanhMuc.push(x);
                });
            }
        });
    }

    $scope.LoadDsBaner = function () {
        $http({
            method: 'GET',
            url: '/api/banner',
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.ListBanner = result.data;
            }
        });
    }

    setTimeout(() => {
        $scope.LoadDsBanTin();
        $scope.LoadDsDanhMuc();
    });
}]);