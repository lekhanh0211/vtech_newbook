'use strict';
var app = angular.module('uiApp');

app.controller('DMLoaiTuDienCtrl', ['$scope', '$resource', 'hotkeys'
    , 'ngProgress', 'toaster', 'svLoaiTuDien', '$compile'
    , function myfunction($scope, $resource, hotkeys, ngProgress, toaster, svLoaiTuDien, $compile) {
        $scope.DsLoaiTuDien = [];
        $scope.ViewDanhMuc = true;
        $scope.sSearch = '';
        $scope.iPageIndex = '1';
        $scope.iPageSize = '10';
        var isChange =  false;

        $scope.ChangeData = function(){
             isChange = true;
         }

        $scope.refreshData = function (pageindex) {
            ngProgress.start();
             $scope.iPageIndex = pageindex;
            svLoaiTuDien.showPage({
                sSearch : $scope.sSearch,
                iPageIndex: $scope.iPageIndex,
                iPageSize: $scope.iPageSize,
            }).$promise.then(function (d) {
                $scope.DsLoaiTuDien = d.List;
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

        $scope.OpenMasterForm = function () {
            $scope.ViewDanhMuc = true;
            $scope.refreshData(1);
        }

        $scope.OpenDetailForm = function (d) {
            isChange = false;
            $scope.LoaiTuDien = {};
            if (d) {
                $scope.LoaiTuDien = d;
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
        $scope.CreateOrUpdate = function () {

            ngProgress.start();
            if ($scope.LoaiTuDien.Id) {
                // Update
                svLoaiTuDien.update($scope.LoaiTuDien).$promise.then(function (d) {
                    toaster.pop('success', 'Thông báo', 'Cập nhật loại từ điển thành công');
                    ngProgress.complete();
                    $scope.ViewDanhMuc = true;
                    $scope.refreshData($scope.iPageIndex);
                }, function (err) {
                    // toaster.pop('info', 'Cảnh báo', err.data);
                    ngProgress.complete();
                });
            }
            else {
                svLoaiTuDien.create($scope.LoaiTuDien).$promise.then(function (d) {
                    toaster.pop('success', 'Thông báo', 'Tạo mới loại từ điển thành công');
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
                svLoaiTuDien.delete({id: Id}).$promise.then(function (d) {
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


        $scope.refreshData(1);

        hotkeys.add({
            combo: 'ctrl+enter',
            description: 'Thêm loại từ điển',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function (e) {
				e.preventDefault();
                console.log('Lưu loại từ điển vào hệ thống');
                $scope.CreateOrUpdate();
            }
        });
        hotkeys.add({
            combo: 'ctrl+s',
            description: 'Thêm loại từ điển',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function (e) {
				e.preventDefault();
                console.log('Lưu loại từ điển vào hệ thống');
                $scope.CreateOrUpdate();
            }
        });

        hotkeys.add({
            combo: 'esc',
            description: 'Thoát ra danh mục loại từ điển',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function () {
                console.log('Thoát ra danh mục loại từ điển');
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
