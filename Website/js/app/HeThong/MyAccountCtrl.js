'use strict';
var app = angular.module('uiApp');

app.controller('MyAccountCtrl', ['$scope', 'ngProgress', '$http', function myfunction($scope, ngProgress, $http) {
    var vm = this;

    vm.user = _userProfile;

    vm.resetStatus = function () {
        vm.IsError = false;
        vm.IsSuccess = false;
        vm.StrMss = "";
    }

    vm.updateProfile = {
        password: '',
        newPassword: '',
        confirmPassword: '',
    }

    vm.resetView = function () {
        vm.updateProfile = {
            password: '',
            newPassword: '',
            confirmPassword: '',
        }
    }

    vm.updateUserPassword = function updateUserPassword() {
        if (!vm.updateProfile.password) {
            vm.IsError = true;
            vm.StrMss = 'Nhập vào mật khẩu cũ'
        } else if (!vm.updateProfile.newPassword) {
            vm.IsError = true;
            vm.StrMss = 'Nhập vào mật khẩu mới';
        } else if (vm.updateProfile.newPassword != vm.updateProfile.confirmPassword) {
            vm.IsError = true;
            vm.StrMss = 'Mật khẩu không trùng nhau';
        } else {
            ngProgress.start(true);
            $http.post('/oauth/ChangePassword', vm.updateProfile).then((d) => {
                ngProgress.complete(true);
                if (d.data == "1") {
                    vm.IsError = true;
                    vm.StrMss = "Mật khẩu không chính xác";
                } else if (d.data == "0") {
                    vm.IsError = true;
                    vm.StrMss = "Mật khẩu không trùng nhau";
                } else {
                    vm.IsError = false;
                    vm.IsSuccess = true;
                    vm.StrMss = 'Đổi mật khẩu thành công!';
                    vm.resetView();
                }
                setTimeout(() => {
                    vm.resetStatus();
                }, 2000)
            }, (err) => {
                ngProgress.complete(true);
                vm.IsError = true;
                vm.StrMss = 'Đổi mật khẩu thất bại! Vui lòng kiểm tra lại.';
                setTimeout(() => {
                    vm.resetStatus();
                }, 5000)
            });
        }
    };


}]);

app.controller('DMTaiKhoanCtrl', ['$scope', 'hotkeys', 'ngProgress', 'toaster', 'myAppConfig', 'svUsers', 'svRole'
    , function myfunction($scope, hotkeys, ngProgress, toaster, myAppConfig, svUsers, svRole) {
        if (!_.some(myAppConfig.user.Claim, x => x === EClaimRole.Admin)) {
            //$scope.$state.go('notfound');
        }

        $scope.DsDanhMuc = [];
        $scope.ViewDanhMuc = true;
        $scope.mClaimRole = Object.values(EClaimRole);
        svRole.query().$promise.then(d => {
            $scope.DsRole = d;
        });


        var isChange = false;

        $scope.ChangeData = function () {
            isChange = true;
        }

        $scope.refreshData = function (pageindex) {
            ngProgress.start();
            $scope.iPageIndex = pageindex;
            svUsers.query().$promise.then(function (d) {
                $scope.DsDanhMuc = d;
                ngProgress.complete();
            }, function (err) {
                ngProgress.complete();
            }
            );
        }

        $scope.OpenMasterForm = function () {
            $scope.ViewDanhMuc = true;
            $('#myModal-detail').modal('hide');
            $scope.refreshData();
        }

        $scope.OpenDetailForm = function (d) {
            isChange = false;
            if (d) {
                $scope.mDanhMuc = d;
                $scope.mDanhMuc.mRoles = [];
                if (d.GhiChu) {
                    $scope.mDanhMuc.mRoles = Base64.decode(d.GhiChu).split(',');
                }
            } else {
                $scope.mDanhMuc = { Active: true, NgayTao: moment().format(EFormat.DateISO) };
                $scope.mDanhMuc.mRoles = [];
            }
            $scope.ViewDanhMuc = false;
            $('#myModal-detail').modal({
                keyboard: false,
                backdrop: 'static'
            });
        }
        $scope.CheckSave = function () {
            if (isChange) {
                confirmPopup('Cảnh báo', 'Dữ liệu chưa được lưu, đồng ý thoát ?', function () {
                    $scope.OpenMasterForm();
                    $scope.$apply()
                }, function () {
                    return;
                });
            }
            else {
                $scope.OpenMasterForm();
            }
        }
        $scope.CreateOrUpdate = function () {
            if (!$scope.mDanhMuc.UserName) {
                toaster.pop('warning', 'Cảnh báo', 'Chưa nhập UserName');
                return false;
            }
            if (!$scope.mDanhMuc.Password) {
                toaster.pop('warning', 'Cảnh báo', 'Chưa nhập Password');
                return false;
            }
            $scope.mDanhMuc.GhiChu = Base64.encode($scope.mDanhMuc.mRoles.toString());
            ngProgress.start();
            svUsers.createOrUpdate($scope.mDanhMuc).$promise.then(function (d) {
                toaster.pop('success', 'Thông báo', 'Cập nhật dữ liệu thành công');
                ngProgress.complete();
                $scope.OpenMasterForm();
            }, function (err) {
                // toaster.pop('info', 'Cảnh báo', err.data);
                ngProgress.complete();
            });
        };

        $scope.Delete = function (Id) {
            if (Id) {
                confirmPopup('Cảnh báo', 'Anh/chị chắc chắn xóa chưa ạ?', function () {
                    ngProgress.start();
                    svUsers.delete({ id: Id }).$promise.then(function (d) {
                        toaster.pop('success', 'Thông báo', 'Đã xóa thành công');
                        ngProgress.complete();
                        $scope.refreshData();
                    }, function (err) {
                        toaster.pop('warning', 'Lỗi! Không xoá được', 'Bạn có thể chọn tắt hoạt động');
                        ngProgress.complete();
                    });
                }, function () { return; });


            }
        };
        $scope.refreshData();

        hotkeys.add({
            combo: 'ctrl+enter',
            description: 'Lưu dữ liệu',
            allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
            callback: function (e) {
                e.preventDefault();
                if ($scope.ViewDanhMuc) return;
                $scope.CreateOrUpdate();
            }
        });
        hotkeys.add({
            combo: 'ctrl+s',
            description: 'Lưu dữ liệu',
            allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
            callback: function (e) {
                e.preventDefault();
                if ($scope.ViewDanhMuc) return;
                $scope.CreateOrUpdate();
            }
        });

        hotkeys.add({
            combo: 'esc',
            description: 'Thoát ra danh mục',
            allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
            callback: function () {
                if ($scope.ViewDanhMuc) return;
                $scope.CheckSave();
            }
        });
        hotkeys.add({
            combo: 'ctrl+m',
            description: 'Thêm mới ',
            allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
            callback: function () {
                if (!$scope.ViewDanhMuc) return;
                $scope.OpenDetailForm();
            }
        });
    }]);
