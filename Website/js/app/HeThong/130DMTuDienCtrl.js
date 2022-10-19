'use strict';
var app = angular.module('uiApp');

app.controller('DMTuDienCtrl', ['$scope', '$resource', 'hotkeys'
    , 'ngProgress', 'toaster', '$compile', 'svTuDien', 'svLoaiTuDien'
    , function myfunction($scope, $resource, hotkeys, ngProgress, toaster, $compile, svTuDien, svLoaiTuDien) {
        $scope.mLoaiTuDien = '';
        $scope.DmLoaiTuDien = [];
        $scope.ViewDanhMuc = true;
        $scope.type = '';
        $scope.sSearch = '';
        $scope.iPageIndex = '1';
        $scope.iPageSize = '10';
        $scope.isActive = '';
        $scope.maLoai = '';
        var isChange =  false;

        $scope.ChangeData = function(){
             isChange = true;
         }

        svLoaiTuDien.showPage({
            sSearch: "",
            iPageIndex: -1,
            iPageSize: -1,
        }).$promise.then(function (d) {
            $scope.DsLoaiTuDien = d.List;
        }, function (err) {
        });


        $scope.refreshData = function (pageindex) {
            ngProgress.start();
            $scope.iPageIndex = pageindex;
            svTuDien.showPage({
                isActive: $scope.isActive,
                type: $scope.mLoaiTuDien,
                sSearch: $scope.sSearch,
                iPageIndex: $scope.iPageIndex,
                iPageSize: $scope.iPageSize,
            }).$promise.then(function (d) {
                $scope.DsTuDien = d.List;
                $scope.total = d.total != null ? d.total : 0;
                $scope.totalPage = Math.floor(($scope.total - 1) / $scope.iPageSize) + 1;
                var totalPage = GetlstPage($scope.totalPage, $scope.iPageIndex, 'refreshData');
                $("#lstPage").html($compile(totalPage)($scope));
                ngProgress.complete();
            }, function (err) {
                ngProgress.complete();
            }
                );
        }


        var urlObj = $scope.$stateParams;
        if (urlObj.ma) {
            $scope.mLoaiTuDien = urlObj.ma;
            $scope.refreshData(1);
        } else {
            $scope.refreshData(1);
        }

        $scope.OpenMasterForm = function () {
            $scope.ViewDanhMuc = true;
            $scope.refreshData(1);
        }

        $scope.OpenDetailForm = function (d) {
            isChange = false;
            $scope.TuDien = { active: true, };
            if (d) {
                $scope.TuDien = d;
            }
            $scope.ViewDanhMuc = false;
        }
        $scope.CheckSave = function(){
            if(isChange){
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
        $scope.$watch('LoaiTuDien', function (newVal, oldVal) {
            if (newVal === oldVal || typeof oldVal === 'undefined' )
                return;
                 $scope.ma = newVal.MaLoai;
           $scope.refreshData(1);
        });
        
        $scope.CreateOrUpdate = function () {
            ngProgress.start();
            if ($scope.TuDien.Id) {
                // Update
                svTuDien.update($scope.TuDien).$promise.then(function (d) {
                    toaster.pop('success', 'Thông báo', 'Cập nhật từ điển thành công');
                    ngProgress.complete();
                    $scope.ViewDanhMuc = true;
                    $scope.refreshData($scope.iPageIndex);
                }, function (err) {
                    // toaster.pop('info', 'Cảnh báo', err.data);
                    ngProgress.complete();
                });
            }
            else {
                svTuDien.create($scope.TuDien).$promise.then(function (d) {
                    toaster.pop('success', 'Thông báo', 'Tạo mới từ điển thành công');
                    ngProgress.complete();
                    $scope.refreshData($scope.iPageIndex);
                    $scope.ViewDanhMuc = true;
                }, function (err) {
                    // toaster.pop('info', 'Cảnh báo', err.data);
                    ngProgress.complete();
                });
            }
        };
        $scope.Delete = function (Id) {
            if (Id) {
                confirmPopup('Cảnh báo', 'Anh/chị chắc chắn xóa chưa ạ?', function () {
                    ngProgress.start();
                    svTuDien.delete({ id: Id }).$promise.then(function (d) {
                        toaster.pop('success', 'Thông báo', 'Đã xóa thành công');
                        ngProgress.complete();
                        $scope.refreshData($scope.iPageIndex);
                        $scope.ViewDanhMuc = true;
                    }, function (err) {
                        toaster.pop('info', 'Cảnh báo', err.data);
                        ngProgress.complete();
                    });
                }, function () { return; });

            }
        };

        hotkeys.add({
            combo: 'ctrl+enter',
            description: 'Thêm từ điển',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function (e) {
				e.preventDefault();
                console.log('Lưu từ điển vào hệ thống');
                $scope.CreateOrUpdate();
            }
        });
        hotkeys.add({
            combo: 'ctrl+s',
            description: 'Thêm từ điển',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function (e) {
				e.preventDefault();
                console.log('Lưu từ điển vào hệ thống');
                $scope.CreateOrUpdate();
            }
        });

        hotkeys.add({
            combo: 'esc',
            description: 'Thoát ra ',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function () {
                console.log('Thoát ra ');
                $scope.OpenMasterForm();
            }
        });
        hotkeys.add({
            combo: 'ctrl+m',
            description: 'Thêm mới ',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function () {
                console.log('Thêm mới ');
                $scope.OpenDetailForm();
            }
        });
    }]);
