var app = angular.module('myApp', ['toaster', 'ngProgress', 'ui.select', 'ngSanitize']);
app.run(['$rootScope', 'toaster', function ($rootScope, toaster) {
    $rootScope.user = _userProfile;
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
        if ($rootScope.user.isBanSi) {
            if (danhmuc) location.href = `/ban-si/${danhmuc}?sSearch=${str || ''}&order=${order || ''}`
            else location.href = `/ban-si?sSearch=${str || ''}&order=${order || ''}`;
        } else {
            if (danhmuc) location.href = `/shop/${danhmuc}?sSearch=${str || ''}&order=${order || ''}`
            else location.href = `/shop?sSearch=${str || ''}&order=${order || ''}`;
        }
    }
}])
.directive('setBg', [function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var bg = attrs.setbg;
            $(element).css('background-image', 'url(' + bg + ')');
        }
    };
}]);
app.directive('proQty', [function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var proQty = $(element);
            proQty.prepend('<span class="dec qtybtn">-</span>');
            proQty.append('<span class="inc qtybtn">+</span>');
            proQty.on('click', '.qtybtn', function () {
                var $button = $(this);
                var $input = $button.parent().find('input');
                var oldValue = $input.val();
                if ($button.hasClass('inc')) {
                    var newVal = parseFloat(oldValue) + 1;
                } else {
                    // Don't allow decrementing below zero
                    if (oldValue > 0) {
                        var newVal = parseFloat(oldValue) - 1;
                    } else {
                        newVal = 0;
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