
app.controller('DMMauPhieuInCtrl', ['$scope', 'hotkeys', 'ngProgress', 'toaster', 'svPhieuIn', '$compile'
    , function myfunction($scope, hotkeys, ngProgress, toaster, svPhieuIn, $compile) {
        $scope.DsMauPhieuIn = [];
        $scope.ViewDanhMuc = true;
        $scope.sSearch = '';
        $scope.pageIndex = '1';
        $scope.pageSize = 20;
        $scope.refreshData = function (pageindex) {
            ngProgress.start();
            $scope.pageIndex = pageindex;
            svPhieuIn.showPage({
                sSearch: $scope.sSearch,
                iPageIndex: $scope.pageIndex,
                iPageSize: $scope.pageSize,
            }).$promise.then(function (d) {
                $scope.DsMauPhieuIn = d.List;
                $scope.total = d.total != null ? d.total : 0;
                $scope.totalPage = Math.floor(($scope.total - 1) / $scope.pageSize) + 1;
                var totalPage = GetlstPage($scope.totalPage, $scope.pageIndex, 'refreshData');
                $("#lstPage").html($compile(totalPage)($scope));
                ngProgress.complete();
            }, function (err) {
                ngProgress.complete();
            });
        }
        $scope.refreshData(1);
        $scope.OpenMasterForm = function () {
            $scope.ViewDanhMuc = true;
        }

        $scope.OpenDetailForm = function (d) {
            if (d) {
                $scope.MauPhieuIn = d;
                setTimeout(() => {
                    $('#strNoiDung').focus();
                }, 100);
                $('#strNoiDung').focus();
            } else {
                $scope.MauPhieuIn = {
                    NoiDung: "",
                };
                setTimeout(() => {
                    $('#strMa').focus();
                }, 100);
            }
            $scope.ViewDanhMuc = false;
            $scope.refreshCodemirror = true;
            setTimeout(() => {
                $scope.refreshCodemirror = false;
            }, 100);
        }
        $scope.delete = function (phieuXoa) {
            if (phieuXoa.Id) {
                confirmPopup('Cảnh báo', 'Anh/chị chắc chắn xóa chưa ạ?', function () {
                    ngProgress.start();
                    svPhieuIn.delete({
                        id: phieuXoa.Id
                    }).$promise.then(function (d) {
                        toaster.pop('success', 'Thông báo', 'Xóa mẫu phiếu in thành công');
                        ngProgress.complete();
                        $scope.refreshData($scope.pageIndex);
                    }, function (err) {
                        toaster.pop('warning', 'Cảnh báo', err.data);
                        ngProgress.complete();
                    });
                });
            }
        }
        $scope.CreateOrUpdate = function () {
            ngProgress.start();
            if ($scope.MauPhieuIn.Id) {
                // Update
                svPhieuIn.createOrUpdate($scope.MauPhieuIn).$promise.then(function (d) {
                    toaster.pop('success', 'Thông báo', 'Cập nhật mẫu phiếu in thành công');
                    ngProgress.complete();
                    $scope.ViewDanhMuc = true;
                    $scope.refreshData($scope.pageIndex);
                }, function (err) {
                    toaster.pop('warning', 'Cảnh báo', err.data);
                    ngProgress.complete();
                });
            } else {
                svPhieuIn.createOrUpdate($scope.MauPhieuIn).$promise.then(function (d) {
                    toaster.pop('success', 'Thông báo', 'Tạo mới mẫu phiếu in thành công');
                    ngProgress.complete();
                    $scope.refreshData($scope.pageIndex);
                    $scope.ViewDanhMuc = true;
                }, function (err) {
                    toaster.pop('warning', 'Cảnh báo', err.data);
                    ngProgress.complete();
                });
            }
        };

        $scope.XemTruoc = function () {
            if ($scope.MauPhieuIn.Script) {
                eval($scope.MauPhieuIn.Script);
            }
            var template = Handlebars.compile($scope.MauPhieuIn.NoiDung);
            var data = {};
            try {
                data = JSON.parse($scope.MauPhieuIn.SampleData || '{}')
            } catch (error) {
                data = {};
            }
            svPhieuIn.printHtml(template(data));
        }

        hotkeys.add({
            combo: 'ctrl+enter',
            description: 'Thêm mẫu phiếu in',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function (e) {
                e.preventDefault();
                console.log('Lưu mẫu phiếu in vào hệ thống');
                $scope.CreateOrUpdate();
            }
        });
        hotkeys.add({
            combo: 'ctrl+s',
            description: 'Thêm mẫu phiếu in',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function (e) {
                e.preventDefault();
                console.log('Lưu mẫu phiếu in vào hệ thống');
                $scope.CreateOrUpdate();
            }
        });

        hotkeys.add({
            combo: 'ctrl+m',
            description: 'Thêm mẫu phiếu in',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function () {
                if ($scope.ViewDanhMuc)
                    $scope.OpenDetailForm();
            }
        });

        hotkeys.add({
            combo: 'esc',
            description: 'Thoát ra danh mục mẫu phiếu in',
            allowIn: ['INPUT', 'TEXTAREA'],
            callback: function () {
                console.log('Thoát ra danh mục mẫu phiếu in');
                $scope.OpenMasterForm();
            }
        });
    }]
);
