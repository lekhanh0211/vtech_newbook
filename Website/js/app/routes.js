(function () {
    'use strict';

    var app = angular.module('uiApp');

    app.config([
        '$stateProvider',
        function ($stateProvider) {
            console.log('config, app-controller.states');

            ///////////////////////////
            // State Configurations : app_ehr ///
            ///////////////////////////
            $stateProvider
                .state('myAccount', {
                    url: '/my-account/',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/ac-my-account.html',
                    controller: 'MyAccountCtrl as vm'
                })
                .state('changePassword', {
                    url: '/change-password/',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/ac-change-password.html',
                    controller: 'MyAccountCtrl as vm'
                })
                .state('HT101_dm_role', {
                    url: '/HT101_dm_role/',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/HT101_dm_role.html',
                    controller: 'HTRoleCtrl'
                })
                .state('HT111_dm_menu', {
                    url: '/HT111_dm_menu/',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/HT111_dm_menu.html',
                    controller: 'HTMenuCtrl'
                })
                .state('HT130_dm_tu_dien', {
                    url: '/HT130_dm_tu_dien/?ma',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/HT130_dm_tu_dien.html',
                    controller: 'DMTuDienCtrl'
                })
                .state('HT131_dm_loai_tu_dien', {
                    url: '/HT131_dm_loai_tu_dien/',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/HT131_dm_loai_tu_dien.html',
                    controller: 'DMLoaiTuDienCtrl'
                })
                .state('DMTaiKhoan', {
                    title: 'Quản lý tài khoản',
                    url: '/DMTaiKhoan/',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/DMTaiKhoan.html',
                    controller: 'DMTaiKhoanCtrl'
                })
                .state('ThongTinDonVi', {
                    url: '/ThongTinDonVi/',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/ThongTinDonVi.html',
                    controller: 'HTConfigCtrl'
                })
                .state('DMMauPhieuIn', {
                    title: 'Quản Lý Mẫu Phiếu In',
                    url: '/DMMauPhieuIn/',
                    parent: 'HeThong',
                    templateUrl: '/partials/HeThong/DMMauPhieuIn.html',
                    controller: 'DMMauPhieuInCtrl'
                })
                .state('DMTrangTinh', {
                    url: '/DMTrangTinh/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/Website/DMTrangTinh.html',
                    controller: 'DMTrangTinhCtrl'
                })
                .state('DMBanTin', {
                    url: '/DMBanTin/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/Website/DMBanTin.html',
                    controller: 'DMBanTinCtrl'
                })
                .state('DMBanner', {
                    url: '/DMBanner/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/Website/DMBanner.html',
                    controller: 'DMBannerCtrl'
                })
                .state('DMDoiTac', {
                    url: '/DMDoiTac/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/Website/DMDoiTac.html',
                    controller: 'DMDoiTacCtrl'
                })
                .state('DMLoaiSanPham', {
                    url: '/DMLoaiSanPham/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DanhMuc/DMLoaiSanPham.html',
                    controller: 'DMLoaiSanPhamCtrl'
                })
                .state('DMSanPham', {
                    url: '/DMSanPham/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DanhMuc/DMSanPham.html',
                    controller: 'DMSanPhamCtrl'
                })
                .state('DMTinhThanh', {
                    url: '/DMTinhThanh/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DanhMuc/DMTinhThanh.html',
                    controller: 'DMTinhThanhCtrl'
                })
                .state('DMMaGiamGia', {
                    url: '/DMMaGiamGia/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DanhMuc/DMMaGiamGia.html',
                    controller: 'DMMaGiamGiaCtrl'
                })
                .state('DSNguoiDung', {
                    url: '/DSNguoiDung/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DanhMuc/DMNguoiDung.html',
                    controller: 'DMNguoiDungCtrl'
                })
                .state('DSDonHang', {
                    url: '/DSDonHang/',
                    parent: 'ThongKe',
                    templateUrl: '/partials/ThongKe/DSDonHang.html',
                    controller: 'DMDonHangCtrl'
                })
                .state('DMPhongGD', {
                    url: '/DMPhongGD/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DatSach/DMPhongGD.html',
                    controller: 'DMPhongGDCtrl'
                })
                .state('DMTruong', {
                    url: '/DMTruong/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DatSach/DMTruong.html',
                    controller: 'DMTruongCtrl'
                })
                .state('DMKhoi', {
                    url: '/DMKhoi/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DatSach/DMKhoi.html',
                    controller: 'DMKhoiCtrl'
                })
                .state('DMLop', {
                    url: '/DMLop/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DatSach/DMLop.html',
                    controller: 'DMLopCtrl'
                })
                .state('DMHocSinh', {
                    url: '/DMHocSinh/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DatSach/DMHocSinh.html',
                    controller: 'DMHocSinhCtrl'
                })
                .state('DMGiaoVien', {
                    url: '/DMGiaoVien/',
                    parent: 'DanhMuc',
                    templateUrl: '/partials/DatSach/DMGiaoVien.html',
                    controller: 'DMGiaoVienCtrl'
                })
        }

    ]);
})();