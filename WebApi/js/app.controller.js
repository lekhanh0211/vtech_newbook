
app.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.loadSanPham = function (dm1, dm) {
        $http({
            method: 'GET',
            url: `/api/sanpham/showpage?sSearch=&idLoai=${dm.Id}&iPageIndex=1&iPageSize=10`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                dm1.DsSanPham = result.data.List;
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
                $scope.ListDanhMucNoiBat = _.filter(lDanhMuc, x => x.IsNoiBat);
                $scope.ListDanhMuc = _.filter(lDanhMuc, x => x.IsHienThiTrangChu);
                _.each($scope.ListDanhMuc, (x, i) => {
                    $scope.loadSanPham(x, x);
                });
                setTimeout(() => {
                    $('.category-slider-wrapper').slick({
                        slidesToShow: 5,
                        slidesToScroll: 5,
                        dots: false,
                        arrows: false,
                        autoplay: false,
                        infinite: true,
                        responsive: [

                            {
                                breakpoint: 370,
                                settings: {
                                    slidesToShow: 3
                                }
                            }
                        ]
                    });
                }, 10);
                
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
                setTimeout(() => {
                    $('.hero-slider-wrapper').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 5000
                    });
                }, 10);
            }
        });
    }

    setTimeout(() => {
        $scope.LoadDsDanhMuc();
        $scope.LoadDsBaner();
    }, 0);
    
}]);
app.controller('ShopCtrl', ['$scope', '$http', 'ngProgress', function ($scope, $http, ngProgress) {
    var urlObj = $scope.$stateParams;
    $scope.sSearch = urlObj.s || '';
    $scope.iPageIndex = 1;
    $scope.loadSanPham = function (index) {
        ngProgress.start();
        $scope.iPageIndex = index || 1;
        $http({
            method: 'GET',
            url: `/api/sanpham/showpage?sSearch=${$scope.sSearch}&idLoai=${$scope.mDanhMuc ? $scope.mDanhMuc.Id : ''}&iPageIndex=${$scope.iPageIndex}&iPageSize=20`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                if ($scope.iPageIndex > 1) {
                    $scope.DsSanPham = $scope.DsSanPham.concat(result.data.List);
                } else {
                    $scope.DsSanPham = result.data.List;
                }
                $scope.total = result.data.Total || 0;
                $scope.totalPage = Math.floor(($scope.total - 1) / 20) + 1;
            }
            ngProgress.complete();
        }, function myError(data) {
            ngProgress.complete();
        });
    }

    $scope.LoadDanhMuc = function (id) {
        $http({
            method: 'GET',
            url: '/api/danhmuc/' + id,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.mDanhMuc = result.data;
                if ($scope.mDanhMuc.Cap < 3) {
                    $scope.LoadDsDanhMuc($scope.mDanhMuc);
                }
                $scope.loadSanPham(1);
            }
        });
    }
    $scope.LoadDsDanhMuc = function (dm) {
        $http({
            method: 'GET',
            url: dm ? `/api/danhmuc/bycaptren?id=${dm.Id}&cap=${dm.Cap + 1}` : '/api/danhmuc/bycap?cap=1',
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.ListDanhMuc = result.data;
                setTimeout(() => {
                    $('.category-slider-wrapper').slick({
                        slidesToShow: 5,
                        slidesToScroll: 5,
                        dots: false,
                        arrows: false,
                        autoplay: false,
                        infinite: true,
                        responsive: [

                            {
                                breakpoint: 370,
                                settings: {
                                    slidesToShow: 3
                                }
                            }
                        ]
                    });
                }, 10);
            }
        });
    }

    setTimeout(() => {
        if (urlObj.id) {
            $scope.LoadDanhMuc(urlObj.id);
        } else {
            $scope.LoadDsDanhMuc();
            $scope.loadSanPham(1);
        }
    });

    setTimeout(() => {
        /* shop filter menu active */
        $("#filter-trigger").on("click", function (e) {
            e.stopPropagation();
            $("#shop-filter-menu").slideToggle();
        });

        $("#shop-filter-slideup").on("click", function (e) {
            e.stopPropagation();
            $("#shop-filter-menu").slideUp();
        });
    }, 100);

}]);
app.controller('ProductCtrl', ['$scope', '$http', function ($scope, $http) {
    var urlObj = $scope.$stateParams;
    $scope.loadDsSanPham = function (id, s, add) {
        $http({
            method: 'GET',
            url: `/api/sanpham/showpage?sSearch=${s || ''}&idLoai=${id || ''}&iPageIndex=1&iPageSize=12`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                if (add) {
                    $scope.DsSanPham = $scope.DsSanPham.concat(result.data.List);
                } else {
                    $scope.DsSanPham = result.data.List;
                }
            }
        });
    }
    $scope.LoadSanPham = function (id) {
        $http({
            method: 'GET',
            url: '/api/sanpham/' + id,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.mSanPham = result.data;
                $scope.mSanPham.SoLuong = 1;
                $scope.mSanPham.mGiaSi = $scope.mSanPham.GiaSi;
                if ($scope.mSanPham.DanhSachHinhAnh) {
                    $scope.mlha = $scope.mSanPham.DanhSachHinhAnh.split(',');
                }
                if ($scope.mSanPham && $scope.mSanPham.ThuocTinh) {
                    $scope.mThuocTinh = JSON.parse($scope.mSanPham.ThuocTinh);
                }
                setTimeout(() => {
                    $('.product-image-slider-wrapper').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        arrows: false
                    });
                }, 10);
                $scope.loadDsSanPham($scope.mSanPham.IdLoai);
            } else {
                location.href = "/not-found";
            }
        });
    };
    setTimeout(() => {
        var header = $(".header-wrapper.hidden");
        $(window).scroll(function () {
            if ($(this).scrollTop() < 350) {
                $(this).scrollTop() > 20 ? header.addClass("show") : header.removeClass("show");
                header.css("opacity", $(this).scrollTop() / 300);
            }
        });
        $scope.LoadSanPham(urlObj.id);
    });

    $scope.changeSoLuong = function () {
        $scope.mSanPham.mGiaSi = $scope.getDonGiaBan($scope.mSanPham, $scope.mSanPham.SoLuong);
    }

    $scope.addToGioHang = function (goCart) {
        if ($scope.mSanPham.SoLuong < 0) {
            toaster.pop('warning', 'Số lượng sản phẩm phải lớn hơn 0');
            return;
        }
        let lThuocTinh = '';
        let isContinue = true;
        _.each($scope.mThuocTinh, x => {
            if (!x.GiaTri) {
                toaster.pop('warning', 'Chưa chọn thuộc tính của sản phẩm');
                isContinue = false;
                return false;
            }
            lThuocTinh += `${x.TenThuocTinh}: ${x.GiaTri},`;
        });
        if (isContinue) {
            $scope.addToCart($scope.mSanPham, $scope.mSanPham.SoLuong, lThuocTinh);
            if (goCart) {
                $scope.$state.go('Cart');
            }
        }
    }
    
}]);
app.controller('CartCtrl', ['$scope', 'toaster', function ($scope, toaster) {

    $scope.goToShop = function () {
        $scope.$state.go('Shop');
    }

    $scope.changeSoLuong = function (sp) {
        sp.GiaBan = $scope.getDonGiaBan(sp, sp.SoLuong);
        let vTotal = 0;
        _.each($scope.GioHang.DsSanPham, x => {
            vTotal += (x.GiaBan * x.SoLuong);
        });
        $scope.GioHang.TongTien = vTotal;
    }

    $scope.updateCart = function () {
        localStorage.setItem(EStorageKey.GioHang, JSON.stringify($scope.GioHang));
        toaster.pop('success', 'Đã cập nhật giỏ hàng');
    }

}]);
app.controller('CheckOutCtrl', ['$scope', '$http', 'toaster', 'ngProgress', function ($scope, $http, toaster, ngProgress) {
    $scope.mDonHang = {
        TrangThai: 0,
        SoLuongSanPham: 0,
        TongTienhang: $scope.GioHang.TongTien,
        TienVanChuyen: 0,
        TongTien: $scope.GioHang.TongTien,
        TTLoai: 0,
        TTTrangThai: 0
    };
    $scope.IsEdit = true;
    
    $scope.saveDonHang = function () {
        if ($scope.GioHang.DsSanPham.length == 0) {
            toaster.pop('warning', 'Không có sản phẩm trong giỏ hàng.');
            return;
        }
        if (strIsNull($scope.mDonHang.TenNguoiNhan) || strIsNull($scope.mDonHang.SoDienThoai) || strIsNull($scope.mDonHang.DiaChi)
            || guidIsNuLL($scope.mDonHang.IdTinhThanh) || guidIsNuLL($scope.mDonHang.IdQuanHuyen) || guidIsNuLL($scope.mDonHang.IdXaPhuong)) {
            toaster.pop('warning', 'Vui lòng điền đủ thuôn tin bắt buộc.');
            return;
        }
        let dssp = [];
        _.each($scope.GioHang.DsSanPham, (x, $index) => {
            dssp.push({
                IdSanPham: x.Id,
                TenSanPham: x.Ten,
                SoLuong: x.SoLuong,
                ThuocTinh: x.ThuocTinh,
                GiaGoc: x.GiaGoc,
                GiaBan: x.GiaBan,
                ThuTu: $index
            });
        });
        if ($scope.IsEdit) {
            $scope.mDonHang.DiaChiFull = `${$scope.mDonHang.DiaChi}, ${$scope.mDonHang.XaPhuong}, ${$scope.mDonHang.QuanHuyen}, ${$scope.mDonHang.TinhThanh}`;
        }
        $scope.mDonHang.NgayDatHang = moment().format(EFormat.DateISO);
        $scope.mDonHang.NgayTao = moment().format(EFormat.DateISO);
        $scope.mDonHang.DsSanPham = dssp;
        $scope.mDonHang.SoLuongSanPham = dssp.length;
        ngProgress.start(true);
        $http({
            method: 'POST',
            url: `/api/donhang`,
            headers: {
                'content-type': 'application/json'
            },
            data: $scope.mDonHang
        }).then(function mySuccess(result) {
            if (result && result.data) {
                ngProgress.complete(true);
                toaster.pop('success', 'Tạo đơn hàng thành công.');
                // reset Gio hang
                $scope.GioHang = { "DsSanPham": [], "SoSanPham": 0, "TongTien": 0 };
                localStorage.setItem(EStorageKey.GioHang, JSON.stringify($scope.GioHang));
                $scope.$state.go('ThankYou', { ma: result.data.MaDonHang, id: result.data.id });
            }
        }, function myError(data) {
            ngProgress.complete(true);
            toaster.pop('error', 'Không tạo được đơn hàng, vui lòng thử lại sau.');
        });
    }

    $scope.LoadTinhThanh = function (getPhi) {
        $http({
            method: 'GET',
            url: `/api/tinhthanh/cap/1`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.DsTinhThanh = result.data;
                if (getPhi && guidIsNotNuLL($scope.mDonHang.IdTinhThanh)) {
                    let tinh = _.find($scope.DsTinhThanh, x => x.Id == $scope.mDonHang.IdTinhThanh);
                    $scope.LoadQuanHuyen(tinh, getPhi);
                }
            }
        }, function myError(data) {
        });
    }
    $scope.LoadQuanHuyen = function (th, getPhi) {
        $scope.mDonHang.TienVanChuyen = th.PhiShip;
        $scope.mDonHang.TongTien = $scope.mDonHang.TongTienhang + th.PhiShip;
        $http({
            method: 'GET',
            url: `/api/tinhthanh/${th.Id}/diaphuong`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.DsQuanHuyen = result.data;
                if (getPhi && guidIsNotNuLL($scope.mDonHang.IdQuanHuyen)) {
                    let huyen = _.find($scope.DsQuanHuyen, x => x.Id == $scope.mDonHang.IdQuanHuyen);
                    $scope.LoadXaPhuong(huyen, getPhi);
                } else {
                    $scope.mDonHang.IdQuanHuyen = null;
                    $scope.DsXaPhuong = [];
                }
            }
        }, function myError(data) { });
    }
    $scope.LoadXaPhuong = function (qh, getPhi) {
        if (qh.PhiShip > 0) {
            $scope.mDonHang.TienVanChuyen = qh.PhiShip;
            $scope.mDonHang.TongTien = $scope.mDonHang.TongTienhang + qh.PhiShip;
        }
        $http({
            method: 'GET',
            url: `/api/tinhthanh/${qh.Id}/diaphuong`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.DsXaPhuong = result.data;
                if (!getPhi) {// Không phải
                    $scope.mDonHang.IdXaPhuong = null;
                }
            }
        }, function myError(data) { });
    }
    $scope.changeTinhThanh = function (id) {
        let tinh = _.find($scope.DsTinhThanh, x => x.Id === id);
        $scope.LoadQuanHuyen(tinh);
    }
    $scope.changeQuanHuyen = function (id) {
        let huyen = _.find($scope.DsQuanHuyen, x => x.Id === id);
        $scope.LoadXaPhuong(huyen);
    }

    setTimeout(() => {
        if (guidIsNotNuLL($scope.user.Id)) {
            $scope.IsDangNhap = true;
            $scope.mDonHang.IdNguoiDung = $scope.user.Id;
            $scope.mDonHang.TenNguoiNhan = $scope.user.HoTen;
            $scope.mDonHang.DiaChi = $scope.user.DiaChi;
            $scope.mDonHang.IdTinhThanh = $scope.user.IdTinhThanh;
            $scope.mDonHang.IdQuanHuyen = $scope.user.IdHuyenTP;
            $scope.mDonHang.IdXaPhuong = $scope.user.IdXaPhuong;
            $scope.mDonHang.DiaChiFull = $scope.user.FullDiaChi;
            $scope.mDonHang.SoDienThoai = $scope.user.DienThoai;
            $scope.mDonHang.Email = $scope.user.Email;
            if (strIsNull($scope.mDonHang.TenNguoiNhan) || strIsNull($scope.mDonHang.SoDienThoai) || strIsNull($scope.mDonHang.DiaChi)
                || guidIsNuLL($scope.mDonHang.IdTinhThanh) || guidIsNuLL($scope.mDonHang.IdQuanHuyen) || guidIsNuLL($scope.mDonHang.IdXaPhuong)) {
                $scope.IsEdit = true;
            } else {
                $scope.IsEdit = false;
            }
            $scope.LoadTinhThanh(true);
        } else {
            $scope.LoadTinhThanh();
        }
    }, 10);
}]);
app.controller('WishlistCtrl', ['$scope', 'toaster', function ($scope, toaster) {
    $scope.delHeart = function (sp, index) {
        $scope.YeuThich.DsSanPham.splice(index, 1);
        $scope.YeuThich.SoSanPham -= 1;
        localStorage.setItem(EStorageKey.YeuThich, JSON.stringify($scope.YeuThich));
        toaster.pop('success', 'Đã xoá khỏi sản phảm yêu thích', sp.Ten);
    }
}]);
app.controller('EventCtrl', ['$scope', '$http', 'ngProgress', function ($scope, $http, ngProgress) {
    $scope.iPageIndex = 1;
    $scope.loadData = function (index) {
        ngProgress.start();
        $scope.iPageIndex = index || 1;
        $http({
            method: 'GET',
            url: `/api/bantin/list?sSearch=&index=${$scope.iPageIndex}&size=20`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                if ($scope.iPageIndex > 1) {
                    $scope.ListDatas = $scope.ListDatas.concat(result.data.List);
                } else {
                    $scope.ListDatas = result.data.List;
                }
                const total = result.data.Total || 0;
                $scope.totalPage = Math.floor((total - 1) / 20) + 1;
            }
            ngProgress.complete();
        }, function myError(data) {
            ngProgress.complete();
        });
    }

    setTimeout(() => {
        $scope.loadData(1);
    });

}]);
app.controller('EventDetailCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
    var urlObj = $scope.$stateParams;
    $scope.LoadData = function (id) {
        $http({
            method: 'GET',
            url: '/api/bantin/' + id,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.gt = result.data;
                $scope.trustedContent = $sce.trustAsHtml($scope.gt.NoiDung);
            }
        });
    }
    setTimeout(() => {
        $scope.LoadData(urlObj.id);
    }, 10);
}]);
app.controller('GioiThieuCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
    var urlObj = $scope.$stateParams;
    $scope.LoadData = function (id) {
        $http({
            method: 'GET',
            url: '/api/gioithieu/' + id,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.gt = result.data;
                $scope.trustedContent = $sce.trustAsHtml($scope.gt.NoiDung);
            }
        });
    }
    setTimeout(() => {
        $scope.LoadData(urlObj.id);
    }, 10);
}]);
app.controller('LoginCtrl', ['$scope', '$rootScope', '$http', 'ngProgress', 'toaster', function ($scope, $rootScope, $http, ngProgress, toaster) {
    var urlObj = $scope.$stateParams;
    $scope.RegisterSuccess = false;
    $scope.user = {
        grant_type: 'password',
        username: '',
        password: ''
    };
    if (urlObj.user) {
        $scope.user.username = urlObj.user;
        $scope.RegisterSuccess = true;
    }

    $scope.Login = function() {
        // Step 1: Connect to Authorize Server to get token.
        ngProgress.start(true);
        return new Promise((resolve, reject) => {
            $http({
                method: 'POST',
                url:'/token',
                headers: {
                    'content-type': 'application/json'
                },
                data: $scope.user,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (data) {
                ngProgress.complete(true);
                // leaving here to supports old version
                toaster.pop('success', 'Đăng nhập thành công!');
                $http({
                    method: 'GET',
                    url: '/api/user/' + $scope.user.username,
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
                }).success(function (user) {
                    // Extend data
                    localStorage.setItem('bearerToken', data.access_token);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    // Get user menu to add localStorage
                    $rootScope.user = user;
                    if ($rootScope.user.Role == 'BanSi') {
                        $rootScope.user.isBanSi = true;
                    } else {
                        $rootScope.user.isBanSi = false;
                    }
                    $scope.$state.go('Home')
                }).error(function (err) {
                    console.log(err);
                    toaster.pop('error', 'Không lấy được thông tin tài khoản');
                });
            }).error(function (data) {
                ngProgress.complete(true);
                toaster.pop('error', 'Đăng nhập thất bại!', data.status == 400 ? data.data : '');
            });
        });
    }

    if ($scope.IsDaDangNhap()) {
        localStorage.removeItem('bearerToken');
        localStorage.removeItem('currentUser');
        $rootScope.user = {};
    }

}]);
app.controller('RegisterCtrl', ['$scope', '$http', 'ngProgress', 'toaster', function ($scope, $http, ngProgress, toaster) {
    if ($scope.IsDaDangNhap()) {
        $scope.$state.go('Home');
    }
    $scope.mUser = {
        UserName: '',
        Password: '',
        Password2: ''
    }
    $scope.IsErrorUserName = true;
    $scope.IsErrorPass = true;

    $scope.CreateAcc = function () {
        if (!$scope.mUser.UserName) return;
        if (checkSDT($scope.mUser.UserName)) {
            $scope.mUser.DienThoai = $scope.mUser.UserName;
        } else if (ValidateEmail($scope.mUser.UserName)) {
            $scope.mUser.Email = $scope.mUser.UserName;
        } else {
            $scope.mssErrorUserName = 'Số điện thoại / Email không đúng định dạng';
            $scope.IsErrorUserName = true;
            return;
        }
        if ($scope.IsErrorUserName || $scope.IsErrorPass) return;
        ngProgress.start(true);
        $http({
            method: 'POST',
            url: '/api/user',
            headers: {
                'content-type': 'application/json'
            },
            data: $scope.mUser,
        }).then(function mySuccess(result) {
            ngProgress.complete(true);
            if (result && result.data && result.data.Id) {
                $scope.$state.go('Login', { user: $scope.mUser.UserName });
            }
        }, function myError(data) {
            ngProgress.complete(true);
            console.error('Login error: ', data);
            toaster.pop('error', 'Không tạo được tài khoản', 'Vui lòng kiểm tra thông tin và thử lại sau');
        });
    };

    $scope.CheckUsername = function (str) {
        if ($scope.mUser.UserName) {
            $http({
                method: 'POST',
                url: '/api/user/checkUsername/' + str,
                headers: {
                    'content-type': 'application/json'
                },
            }).then(function (data, status, headers, config) {
                $scope.IsErrorUserName = false;
                $scope.mssErrorUserName = '';
            }, function (data, status, headers, config) {
                $scope.mssErrorUserName = 'Tài khoản này đã được dùng';
                $scope.IsErrorUserName = true;
            });
        } else {
            $scope.IsErrorUserName = true;
        }
    };

    $scope.CheckPass = function () {
        if ($scope.mUser.Password != $scope.mUser.Password2) {
            $scope.IsErrorPass = true;
            return;
        }
        $scope.IsErrorPass = false;
    };

}]);
app.controller('ProfileCtrl', ['$scope', '$http', function ($scope, $http) {
    if (!$scope.IsDaDangNhap()) $scope.$state.go('Login');
    $scope.mtt = 0;
    $scope.LoadData = function (id) {
        $http({
            method: 'GET',
            url: '/api/donhang/thongke',
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.lTrangThaiDH = result.data;
                for (var i = 0; i < $scope.lTrangThaiDH.length; i++) {
                    if ($scope.lTrangThaiDH[i].SoDonHang > 0) {
                        $scope.mtt = $scope.lTrangThaiDH[i].Ma;
                        break;
                    }
                }
            }
        });
    }
    setTimeout(() => {
        $scope.LoadData();
    }, 10);
}]);
app.controller('EditProfileCtrl', ['$scope', '$rootScope', '$http', 'ngProgress', 'toaster', 'svApi', function ($scope, $rootScope, $http, ngProgress, toaster, svApi) {
    if (!$scope.IsDaDangNhap()) $scope.$state.go('Login');

    $scope.mUser = _.extend({}, $scope.user);
    var input = $("#myFile").get(0);
    input.value = '';

    $scope.saveData = function (obj, back) {
        ngProgress.start(true);
        $http({
            method: 'POST',
            url: `/api/user/update`,
            headers: {
                'content-type': 'application/json'
            },
            data: obj
        }).then(function (result) {
            ngProgress.complete(true);
            // Get user menu to add localStorage
            $rootScope.user = result.data;
            localStorage.setItem('currentUser', JSON.stringify($rootScope.user));
            if (back) {
                toaster.pop('success', 'Đã cập nhật thông tin tài khoản');
                $scope.$state.go('Profile')
            }
        }, function myError(result) {
            ngProgress.complete(true);
            toaster.pop('error', 'Không cập nhật thông tin!');
        });
    }

    $scope.updateData = function () {
        if (!strIsNull($scope.mUser.DienThoai) && !checkSDT($scope.mUser.DienThoai)) {
            toaster.pop('warning', 'Số điện thoại không đúng định dạng', 'Vui lòng kiểm tra lại');
        }
        if (!strIsNull($scope.mUser.Email) && !ValidateEmail($scope.mUser.Email)) {
            toaster.pop('warning', 'Email không đúng định dạng', 'Vui lòng kiểm tra lại')
        }
        $scope.mUser.FullDiaChi = '';
        if (strIsNotNull($scope.mUser.DiaChi)) {
            $scope.mUser.FullDiaChi = $scope.mUser.DiaChi + ', ';
        }
        if (guidIsNotNuLL($scope.mUser.IdTinhThanh)) {
            if (guidIsNotNuLL($scope.mUser.IdHuyenTP)) {
                if (guidIsNotNuLL($scope.mUser.IdXaPhuong)) {
                    let xa = _.find($scope.DsXaPhuong, x => x.Id === $scope.mUser.IdXaPhuong);
                    $scope.mUser.FullDiaChi += xa.Ten + ', ';
                }
                let quan = _.find($scope.DsQuanHuyen, x => x.Id === $scope.mUser.IdHuyenTP);
                $scope.mUser.FullDiaChi += quan.Ten + ', ';
            }
            let tinh = _.find($scope.DsTinhThanh, x => x.Id === $scope.mUser.IdTinhThanh);
            $scope.mUser.FullDiaChi += tinh.Ten;
        }
        $scope.saveData($scope.mUser, true)
    }

    $scope.LoadTinhThanh = function () {
        $http({
            method: 'GET',
            url: `/api/tinhthanh/cap/1`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.DsTinhThanh = result.data;
                if (guidIsNotNuLL($scope.mUser.IdTinhThanh)) {
                    $scope.LoadQuanHuyen($scope.mUser.IdTinhThanh, true);
                }
            }
        }, function myError(data) {
        });
    }
    $scope.LoadQuanHuyen = function (id, isload) {
        $http({
            method: 'GET',
            url: `/api/tinhthanh/${id}/diaphuong`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.DsQuanHuyen = result.data;
                if (isload && guidIsNotNuLL($scope.mUser.IdHuyenTP)) {
                    $scope.LoadXaPhuong($scope.mUser.IdHuyenTP, true);
                } else {
                    $scope.mUser.IdHuyenTP = null;
                    $scope.DsXaPhuong = [];
                }
            }
        }, function myError(data) { });
    }
    $scope.LoadXaPhuong = function (id, isload) {
        $http({
            method: 'GET',
            url: `/api/tinhthanh/${id}/diaphuong`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.DsXaPhuong = result.data;
                if (!isload) {
                    $scope.mUser.IdXaPhuong = null;
                }
            }
        }, function myError(data) { });
    }

    $scope.ChonAnh = async function () {
        if (input.files && input.files[0]) {
            if (input.files[0].type != "image/jpeg" && input.files[0].type != "image/png") {
                input.value = '';
                setTimeout(function () {
                    $.gritter.add({
                        title: 'Thông báo',
                        text: 'Yêu cầu chọn ảnh có định dạnh jpg hoặc png',
                        time: 2000
                    });
                }, 2000);
                return;
            }
            let reDsHinh = await svApi.uploadfile({
                folder: 'User',
                delFile: $scope.mUser.Avatar || ''
            }, input.files);
            var mUser = _.extend({}, $scope.user);
            mUser.Avatar = reDsHinh[0];
            $scope.mUser.Avatar = reDsHinh[0];
            $scope.saveData(mUser, false);
        }
    };

    setTimeout(() => {
        $scope.LoadTinhThanh();
    }, 10);

}]);
app.controller('LichSuMuaHangCtrl', ['$scope', '$http', 'ngProgress', function ($scope, $http, ngProgress) {
    if (!$scope.IsDaDangNhap()) $scope.$state.go('Login');
    var urlObj = $scope.$stateParams;
    $scope.mTT = urlObj.tt || 0;
    $scope.iPageIndex = 1;
    $scope.loadData = function (index) {
        ngProgress.start();
        $scope.iPageIndex = index || 1;
        $http({
            method: 'GET',
            url: '/api/donhang/danhsach?tt=' + $scope.mTT + `&index=${$scope.iPageIndex}`,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                if ($scope.iPageIndex > 1) {
                    $scope.ListDatas = $scope.ListDatas.concat(result.data.List);
                } else {
                    $scope.ListDatas = result.data.List;
                }
                const total = result.data.Total || 0;
                $scope.totalPage = Math.floor((total - 1) / 20) + 1;
            }
            ngProgress.complete();
        }, function myError(data) {
            ngProgress.complete();
        });
    }

    $scope.chonTrangThai = function (tt) {
        $scope.mTT = tt;
        $scope.loadData(1);
    }

    setTimeout(() => {
        $http({
            method: 'GET',
            url: '/api/donhang/dmtranghtai',
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.lTrangThaiDH = result.data;
            }
        });
        $scope.loadData(1);
    }, 10);
}]);
app.controller('CTDonHangCtrl', ['$scope', '$http', 'toaster', 'ngProgress', function ($scope, $http, toaster, ngProgress) {
    var urlObj = $scope.$stateParams;
    $scope.LoadData = function (id) {
        $http({
            method: 'GET',
            url: '/api/donhang/' + id,
            headers: {
                'content-type': 'application/json'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                $scope.dh = result.data;
                if ($scope.dh.LichSuDonHang) {
                    $scope.lichSu = JSON.parse($scope.dh.LichSuDonHang);
                }
            }
        });
    }
    $scope.IsDangHuy = false;
    $scope.HuyDonHang = function () {
        if ($scope.IsDangHuy || !$scope.dh || !$scope.dh.Active) return;
        $scope.IsDangHuy = true;
        ngProgress.start(true);
        $http({
            method: 'POST',
            url: `/api/donhang/huy`,
            headers: {
                'content-type': 'application/json'
            },
            data: $scope.dh
        }).then(function mySuccess(result) {
            ngProgress.complete(true);
            if (result && result.data) {
                toaster.pop('success', 'Đã huỷ đơn hàng');
                $("#myModalHuy").modal('hide');
                $scope.$state.reload();
            } else {
                toaster.pop('error', 'Huỷ thất bại', 'Quý khách vui lòng thử lại sau');
            }
        }, () => {
            toaster.pop('error', 'Huỷ thất bại', 'Quý khách vui lòng thử lại sau');
            $scope.IsDangHuy = false;
            ngProgress.complete(true);
            $("#myModalHuy").modal('hide');
        });
    }
    $scope.openPopupHuy = function () {
        $("#myModalHuy").modal();
        $scope.IsDangHuy = false;
        setTimeout(() => {
            $("#input-lydohuy").focus();
        }, 10);
    };
    setTimeout(() => {
        $scope.LoadData(urlObj.id);
    }, 10);
}]);
