'use strict';
var app = angular.module('uiApp');

app.controller('baseDanhMucCtrl', ['$scope', '$compile', 'hotkeys', 'ngProgress', 'toaster', 'svService'
    , function myfunction($scope, $compile, hotkeys, ngProgress, toaster, svService) {
        $scope.tbName = '';
        $scope.ListDatas = [];
        $scope.ViewDetail = false;
        $scope.sSearch = '';
        $scope.iPageIndex = 0;
        $scope.iPageSize = 10;
        $scope.mData = {};
        var isChange = false;
        $scope.ChangeData = function () {
            isChange = true;
        }

        $scope.unChangeData = function () {
            isChange = false;
        }

        $scope.setQueryParam = function () {
            $scope.mQueryParam = {
                tbName: $scope.tbName,
                sSearch: $scope.sSearch,
                from: '',
                to: '',
                iPageIndex: $scope.iPageIndex,
                iPageSize: $scope.iPageSize,
            }
        }

        $scope.setListDatas = function () {}

        $scope.refreshData = function (iPageindex) {
            ngProgress.start();
            $scope.iPageIndex = iPageindex;
            $scope.setQueryParam();
            return svService.showPage($scope.mQueryParam).$promise.then(function (d) {
                $scope.ListDatas = d.List;
                $scope.setListDatas();
                $scope.total = d.Total != null ? d.Total : 0;
                $scope.totalPage = Math.floor(($scope.total - 1) / $scope.iPageSize) + 1;
                var totalPage = GetlstPage($scope.totalPage, $scope.iPageIndex, 'refreshData');
                $("#lstPage").html($compile(totalPage)($scope));
                ngProgress.complete();
                return true;
            }, function (err) {
                ngProgress.complete();
                return false;
            });
        }
        $scope.OpenMasterForm = function () {
            $scope.ViewDetail = false;
            $('#myModal-detail').modal('hide');
        }

        $scope.setDataForAddNew = function () {

        }

        $scope.setDataForEdit = function () {

        }

        $scope.afterOpenDetailForm = function () {

        }

        $scope.OpenDetailForm = function (d) {
            isChange = false;
            if (d) {
                $scope.mData = d;
                $scope.setDataForEdit(d);
            } else {
                $scope.mData = {
                    Active: true,
                    NgayTao: moment().format(EFormat.DateISO)
                };
                $scope.setDataForAddNew();
            }
            $scope.ViewDetail = true;
            $('#myModal-detail').modal({
                keyboard: false,
                backdrop: 'static'
            });
            setTimeout(() => {
                $scope.afterOpenDetailForm();
            }, 10);
        }

        $scope.setDateBeforSave = function () {

        }

        $scope.checkDateBeforSave = function () {
            return true;
        }

        $scope.changeDataAfterSave = function () {

        }

        $scope.CreateOrUpdate = function (isOpenMaster = true) {
            if ($scope.checkDateBeforSave()) {
                ngProgress.start();
                $scope.setDateBeforSave();
                svService.createOrUpdate({
                    tbName: $scope.tbName
                }, $scope.mData).$promise.then(function (d) {
                    toaster.pop('success', 'Thông báo', 'Cập nhật dữ liệu thành công');
                    ngProgress.complete();
                    $scope.changeDataAfterSave();
                    $scope.refreshData($scope.iPageIndex);
                    if (isOpenMaster) {
                        $scope.OpenMasterForm();
                    }
                }, function (err) {
                    toaster.pop('error', 'Cảnh báo', err.data);
                    ngProgress.complete();
                });
            }
        };

        $scope.delete = function (row) {
            if (row.Id) {
                confirmPopup('Cảnh báo', 'Anh/chị chắc chắn xóa chưa ạ?', function () {
                    ngProgress.start();
                    svService.delete({
                        tbName: $scope.tbName,
                        id: row.Id
                    }).$promise.then(function (d) {
                        toaster.pop('success', 'Thông báo', 'Xóa dữ liệu thành công');
                        ngProgress.complete();
                        $scope.refreshData($scope.iPageIndex);
                    }, function (err) {
                        toaster.pop('warning', 'Cảnh báo', err.data);
                        ngProgress.complete();
                    });
                });
            }
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

        hotkeys.add({
            combo: 'ctrl+enter',
            description: 'Thêm dữ liệu',
            allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
            inContentEditable: true,
            callback: function (e) {
                e.preventDefault();
                if ($scope.ViewDetail)
                    $scope.CreateOrUpdate();
            }
        });

        hotkeys.add({
            combo: 'ctrl+s',
            description: 'Thêm dữ liệu',
            allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
            inContentEditable: true,
            callback: function (e) {
                e.preventDefault();
                if ($scope.ViewDetail)
                    $scope.CreateOrUpdate();
            }
        });
        hotkeys.add({
            combo: 'ctrl+m',
            description: 'Thêm dữ liệu',
            allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
            callback: function (e) {
                e.preventDefault();
                if (!$scope.ViewDetail)
                    $scope.OpenDetailForm();
            }
        });

        hotkeys.add({
            combo: 'esc',
            description: 'Thoát ra danh sách dữ liệu',
            allowIn: ['INPUT', 'TEXTAREA', 'SELECT'],
            inContentEditable: true,
            callback: function (e) {
                e.preventDefault();
                if ($scope.ViewDetail)
                    $scope.CheckSave();
            }
        });
    }
]);

app.controller('DMTrangTinhCtrl', ['$scope', '$controller', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMTrangTinh';
    $scope.tinymceOptions = tinymceOptions;
    $scope.tinymceOptions.height = "480";

    $scope.ChangeTieuDe = function () {
        if ($scope.mData.TieuDe) {
            $scope.mData.url = strToUrl($scope.mData.TieuDe);
        }
        $scope.ChangeData();
    }

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);
app.controller('HTConfigCtrl', ['$scope', '$controller', 'ngProgress', 'svDanhMuc', function myfunction($scope, $controller, ngProgress, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'HTConfig';

    $scope.refreshData = function (iPageindex) {
        ngProgress.start();
        return svDanhMuc.getList({ tbName: $scope.tbName, fName: 'UserEdit' }).$promise.then(function (d) {
            $scope.ListDatas = d;
            ngProgress.complete();
            return true;
        }, function (err) {
            ngProgress.complete();
            return false;
        });
    }

    $scope.CreateOrUpdate = function (row) {
        $scope.mData = row;
        mSuper.CreateOrUpdate(false);
    };

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);
app.controller('DMBanTinCtrl', ['$scope', '$controller', 'myAppConfig', 'svDanhMuc', function myfunction($scope, $controller, myAppConfig, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMBanTin';
    $scope.tinymceOptions = tinymceOptions;
    $scope.tinymceOptions.height = "480";
    var input = $("#myFile").get(0);

    $scope.ChangeTieuDe = function () {
        if ($scope.mData.TieuDe) {
            $scope.mData.url = strToUrl($scope.mData.TieuDe);
        }
        $scope.ChangeData();
    }
    $scope.setDataForAddNew = function () {
        input.value = null;
        $scope.mData.NgayDang = moment().format(EFormat.DateISO);
        $scope.mData.NguoiDang = myAppConfig.user.HoTen;
    }

    $scope.setDataForEdit = function () {
        input.value = null;

    }
    $scope.ChonAnh = function () {
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
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgdAnh').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };
    $scope.CreateOrUpdate = async function (isOpenMaster = true) {
        if (input.files && input.files.length > 0) {
            let reDsHinh = await svDanhMuc.uploadfile({
                tbName: $scope.tbName,
                delFile: $scope.mData.UrlHinh
            }, input.files);
            $scope.mData.UrlHinh = reDsHinh[0];
        }
        mSuper.CreateOrUpdate(isOpenMaster);
    };

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);
app.controller('DMBannerCtrl', ['$scope', '$controller', 'ngProgress', 'svDanhMuc', function myfunction($scope, $controller, ngProgress, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMBanner';
    var input = $("#myFile").get(0);

    $scope.refreshData = function (iPageindex) {
        ngProgress.start();
        return svDanhMuc.getAll({ tbName: $scope.tbName }).$promise.then(function (d) {
            $scope.ListDatas = d;
            ngProgress.complete();
            return true;
        }, function (err) {
            ngProgress.complete();
            return false;
        });
    }

    $scope.afterOpenDetailForm = function () {
        input.value = null;
    }

    $scope.ChonAnh = function () {
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
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgdAnh').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };
    $scope.CreateOrUpdate = async function (isOpenMaster = true) {
        if (input.files && input.files.length > 0) {
            let reDsHinh = await svDanhMuc.uploadfile({
                tbName: $scope.tbName,
                delFile: $scope.mData.UrlHinhAnh
            }, input.files);
            $scope.mData.UrlHinhAnh = reDsHinh[0];
        }
        mSuper.CreateOrUpdate(isOpenMaster);
    };

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);
app.controller('DMDoiTacCtrl', ['$scope', '$controller', 'ngProgress', 'svDanhMuc', function myfunction($scope, $controller, ngProgress, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMDoiTac';
    var input = $("#myFile").get(0);

    $scope.refreshData = function (iPageindex) {
        ngProgress.start();
        return svDanhMuc.getAll({ tbName: $scope.tbName }).$promise.then(function (d) {
            $scope.ListDatas = d;
            ngProgress.complete();
            return true;
        }, function (err) {
            ngProgress.complete();
            return false;
        });
    }

    $scope.afterOpenDetailForm = function () {
        input.value = null;
    }

    $scope.ChonAnh = function () {
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
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgdAnh').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };
    $scope.CreateOrUpdate = async function (isOpenMaster = true) {
        if (input.files && input.files.length > 0) {
            let reDsHinh = await svDanhMuc.uploadfile({
                tbName: $scope.tbName,
                delFile: $scope.mData.LogoUrl
            }, input.files);
            $scope.mData.LogoUrl = reDsHinh[0];
        }
        mSuper.CreateOrUpdate(isOpenMaster);
    };

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);
app.controller('DMLoaiSanPhamCtrl', ['$scope', '$controller', '$http', 'toaster', 'svDanhMuc', 'svTuDien', function myfunction($scope, $controller, $http, toaster, svDanhMuc, svTuDien) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMLoaiSanPham';
    var input = $("#myFile").get(0);
    var input1 = $("#myFile1").get(0);
    $scope.mParam = {};
    $scope.ChangeTen = function () {
        if ($scope.mData.Ten) {
            $scope.mData.Url = strToUrl($scope.mData.Ten);
        }
        $scope.ChangeData();
    }

    svDanhMuc.getList({ tbName: $scope.tbName, fName: 'bycap', cap: 1 }).$promise.then(d => {
        $scope.DsDMCap1 = d;
    });

    $scope.reloadCapDuoi = function (captren) {
        if (captren) {
            svDanhMuc.getList({ tbName: $scope.tbName, fName: 'bycaptren', id: captren.Id, cap: 2 }).$promise.then(d => {
                $scope.DsDMCap2 = d;
            });
        } else {
            $scope.DsDMCap2 = [];
        }
        $scope.mParam.mDMCap2 = null;
    }

    $scope.setQueryParam = function () {
        $scope.mQueryParam = {
            tbName: $scope.tbName,
            sSearch: $scope.sSearch,
            idcap1: '',
            idcap2: '',
            iPageIndex: $scope.iPageIndex,
            iPageSize: $scope.iPageSize,
        }
        if ($scope.mParam.mDMCap1) {
            $scope.mQueryParam.idcap1 = $scope.mParam.mDMCap1.Id
            if ($scope.mParam.mDMCap2) {
                $scope.mQueryParam.idcap2 = $scope.mParam.mDMCap2.Id
            }
        }
    }

    $scope.setDataForAddNew = function () {
        $scope.mData.UuTien = $scope.total + 1;
        input.value = null;
        input1.value = null;
        if ($scope.mParam.mDMCap2) {
            $scope.mData.IdCap2 = $scope.mParam.mDMCap2.Id
            $scope.mData.IdCap1 = $scope.mParam.mDMCap1.Id
            $scope.mData.Cap = 3;
        } else if ($scope.mParam.mDMCap1) {
            $scope.mData.IdCap1 = $scope.mParam.mDMCap1.Id
            $scope.mData.Cap = 2;
        } else {
            $scope.mData.Cap = 1;
        }
    }

    $scope.setDataForEdit = function () {
        input.value = null;
        input1.value = null;
    }
    $scope.ChonAnh = function () {
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
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgdAnh').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };
    
    $scope.ChonAnh1 = function () {
        if (input1.files && input1.files[0]) {
            if (input1.files[0].type != "image/jpeg" && input1.files[0].type != "image/png") {
                input1.value = '';
                setTimeout(function () {
                    $.gritter.add({
                        title: 'Thông báo',
                        text: 'Yêu cầu chọn ảnh có định dạnh jpg hoặc png',
                        time: 2000
                    });
                }, 2000);
                return;
            }
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgdAnh1').attr('src', e.target.result);
            }
            reader.readAsDataURL(input1.files[0]);
        }
    };

    $scope.CreateOrUpdate = async function (isOpenMaster = true) {
        if (input.files && input.files.length > 0) {
            let reDsHinh = await svDanhMuc.uploadfile({
                tbName: $scope.tbName,
                delFile: $scope.mData.UrlHinhAnh
            }, input.files);
            $scope.mData.UrlHinhAnh = reDsHinh[0];
        }
        if (input1.files && input1.files.length > 0) {
            let reDsHinh = await svDanhMuc.uploadfile({
                tbName: $scope.tbName,
                delFile: $scope.mData.UrlIcon
            }, input1.files);
            $scope.mData.UrlIcon = reDsHinh[0];
        }
        mSuper.CreateOrUpdate(isOpenMaster);
    };

    $scope.loadData = function () {
        $http({
            method: 'GET',
            url: `https://app.hebec.vn:8080/v1/admin/category?page=1&limit=200`,
            headers: {
                'content-type': 'application/json',
                'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidHlwZSI6IkFETUlOIiwiaWEiOjE2NTg1ODI2MjAsImlhdCI6MTY1ODU4MjYxOSwiZXhwIjoxNjg5Njg2NjE5fQ.Klk-uqfhrgHrzb0CwIN8izacRX7QcYNE4aM8t9ysSAQ'
            },
        }).then(async function mySuccess(result) {
            if (result && result.data) {
                var data = result.data.data.data;
                let lImage = []
                let lDanhMuc = []
                for (let i = 0; i < data.length; i++) {
                    let x = data[i];
                    if (x.thumbnail && !x.thumbnail.includes('undefined')) {
                        lImage.push(x.thumbnail);
                    }
                    let idCap1 = null;
                    let idCap2 = null;
                    if (x.parent1) {
                        var dmmoi = _.find(lDanhMuc, dm => dm.Code == x.parent1.id);
                        if (dmmoi) idCap1 = dmmoi.Id;
                    }
                    if (x.parent2) {
                        var dmmoi = _.find(lDanhMuc, dm => dm.Code == x.parent2.id);
                        if (dmmoi) idCap2 = dmmoi.Id;
                    }
                    const vObj = {
                        NgayTao: moment().format(EFormat.DateISO),
                        Ten: x.name,
                        Code: x.id,
                        UuTien: x.priority,
                        UrlHinhAnh: null,
                        Cap: x.level,
                        IdCap1: idCap1,
                        IdCap2: idCap2,
                        IsNoiBat: x.isHighlight,
                        IsHienThi: x.isShowInApp,
                        UrlIcon: (x.thumbnail || '').replace('/media/', 'Content/LoaiSanPham/2021/'),
                        Url: x.name + '-' + x.id
                    };
                    let d = await svDanhMuc.createOrUpdate({
                        tbName: $scope.tbName
                    }, vObj).$promise;
                    lDanhMuc.push(d);
                }
                console.log(lImage);
            }
        });
    }

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);

app.controller('DMSanPhamCtrl', ['$scope','$http', '$controller', 'toaster', 'svDanhMuc', 'svTuDien', 'svBaoCao', 'ngProgress', function myfunction($scope, $http, $controller, toaster, svDanhMuc, svTuDien, svBaoCao, ngProgress) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMSanPham';
    var input = $("#myFile").get(0);
    $scope.mParam = {};
    $scope.dsDataImport = [];
    $scope.mDataImport = {};
    $scope.mQueryParam = {
        tbName: $scope.tbName,
        sSearch: '',
        from: '',
        to: '',
        idLoai: '',
        phanLoai: '',
        tinhTrang: '',
        Active: true
    }
    $scope.ChangeTen = function () {
        if ($scope.mData.Ten) {
            $scope.mData.Url = strToUrl($scope.mData.Ten);
        }
        $scope.ChangeData();
    }
    svDanhMuc.getAll({ tbName: 'DMLoaiSanPham' }).$promise.then(d => {
        const dsCap1 = _.filter(d, x => x.Cap === 1);
        let LisData = [];
        _.each(dsCap1, c1 => {
            LisData.push(c1);
            const dsCap2 = _.filter(d, x => x.IdCap1 === c1.Id && x.Cap === 2);
            _.each(dsCap2, c2 => {
                LisData.push(c2);
                const dsCap3 = _.filter(d, x => x.IdCap2 === c2.Id && x.Cap === 3);
                _.each(dsCap3, c3 => {
                    LisData.push(c3);
                });
            });
        });
        $scope.DsLoaiSanPham = LisData;
    });

    $scope.reloadCapDuoi = function (captren) {
        if (captren) {
            svDanhMuc.getList({ tbName: $scope.tbName, fName: 'bycaptren', id: captren.Id, cap: 2 }).$promise.then(d => {
                $scope.DsDMCap2 = d;
            });
        } else {
            $scope.DsDMCap2 = [];
        }
    }

    $scope.setQueryParam = function () {
        $scope.mQueryParam.idLoai = $scope.mParam.idLoai || '';
        $scope.mQueryParam.iPageIndex = $scope.iPageIndex
        $scope.mQueryParam.iPageSize = $scope.iPageSize;
    }

    $scope.setListDatas = function() {
        _.each($scope.ListDatas, x => {
            if (x.ThuocTinh) {
                x.DsThuocTinh = JSON.parse(x.ThuocTinh);
            } else x.DsThuocTinh = [];
            if (x.CauHinhGiaSi) {
                x.DsGiaSi = JSON.parse(x.CauHinhGiaSi);
            } else x.DsGiaSi = [];
        });
    }

    $scope.setDataForAddNew = function () {
        $scope.mData.PhanLoai = 1;
        input.value = null;
        $scope.mData.DsThuocTinh = [];
        $scope.mData.DsGiaSi = [];
    }

    $scope.setDataForEdit = function () {
        input.value = null;
        if ($scope.mData.DanhSachHinhAnh) {
            $scope.DsHinhAnh = $scope.mData.DanhSachHinhAnh.split(',');
        } else $scope.DsHinhAnh = [];
    }
    $scope.afterOpenDetailForm = function() {
        $scope.DsHinhAnhTam = [];
        $scope.DsHinhAnh = [];
        $scope.DsFile = [];
        $scope.mData.DsAnhXoa = [];
        $('#btn-tab-1').click();
    }
    $scope.ChonAnh = function () {
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
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgdAnh').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    $scope.CreateOrUpdate = async function (isOpenMaster = true) {
        if (!strIsNotNull($scope.mData.Ten)) {
            toaster.pop('warning', 'Yêu cầu nhập tên sản phẩm');
        }
        if (!strIsNotNull($scope.mData.IdLoai)) {
            toaster.pop('warning', 'Yêu cầu chọn danh mục sản phẩm');
        }
        if ($scope.mData.DsThuocTinh.length > 0) {
            $scope.mData.ThuocTinh = JSON.stringify($scope.mData.DsThuocTinh);
        } else $scope.mData.ThuocTinh = null;
        if ($scope.mData.DsGiaSi.length > 0) {
            $scope.mData.CauHinhGiaSi = JSON.stringify($scope.mData.DsGiaSi);
        } else $scope.mData.CauHinhGiaSi = null;
        if (input.files && input.files.length > 0) {
            let reDsHinh = await svDanhMuc.uploadfile({
                tbName: $scope.tbName,
                delFile: $scope.mData.UrlHinhAnh
            }, input.files);
            $scope.mData.UrlHinhAnh = reDsHinh[0];
        }
        if ($scope.DsFile && $scope.DsFile.length > 0) {
            let reDsHinh = await svDanhMuc.uploadfile({
                tbName: $scope.tbName,
                delFile: ''
            }, $scope.DsFile);
            $scope.DsHinhAnh = $scope.DsHinhAnh.concat(reDsHinh);
        }
        if ($scope.DsHinhAnh.length > 0) {
            $scope.mData.DanhSachHinhAnh = $scope.DsHinhAnh.toString();
        } else $scope.mData.DanhSachHinhAnh = null;
        mSuper.CreateOrUpdate(isOpenMaster);
    };

    // #region Thuốc tính
    $scope.ThemThuocTinhMoi = function() {
        $scope.mData.DsThuocTinh.push({TenThuocTinh: '', DsGiaTri: [{}]});
    }
    $scope.XoaThuocTinh = function(index) {
        $scope.mData.DsThuocTinh.splice(index, 1);
    }
    $scope.ThemGiaTri = function(th) {
        th.DsGiaTri.push({});
    }
    $scope.XoaGiaTri = function(th, index) {
        th.DsGiaTri.splice(index, 1);
    }
    // #endregion

    // #region Thuốc tính
    $scope.ThemGiaSiMoi = function() {
        var vlast = _.last($scope.mData.DsGiaSi);
        $scope.mData.DsGiaSi.push({SoLuong: (vlast ? vlast.SoLuong : 0)+ 1000, GiaSi: $scope.mData.GiaBan});
    }
    $scope.XoaGiaSi = function(index) {
        $scope.mData.DsGiaSi.splice(index, 1);
    }
    // #endregion

    // #region Danh sách ảnh
    $scope.DsHinhAnhTam = [];
    $scope.DsFile = [];
    $scope.ChonDsAnh = function () {
        var inputAnh = $("#myImages").get(0);
        if (inputAnh.files) {
            _.each(inputAnh.files, file => {
                if (file.type != "image/jpeg" && file.type != "image/png") {
                    setTimeout(function () {
                        $.gritter.add({
                            title: 'Thông báo',
                            text: 'Yêu cầu chọn ảnh có định dạnh jpg hoặc png',
                            time: 2000
                        });
                    }, 2000);
                } else {
                    var reader = new FileReader();
        
                    reader.onload = function (e) {
                        $scope.DsHinhAnhTam.push(e.target.result);
                        setTimeout(() => {
                            $scope.$apply();
                        }, 10);
                    }
                    reader.readAsDataURL(file);
                    $scope.DsFile.push(file);
                }
            });
            inputAnh.value = '';
        }
    };
    $scope.XoaAnhTam = function(index) {
        $scope.DsHinhAnhTam.splice(index, 1);
        $scope.DsFile.splice(index, 1);
    }
    $scope.XoaAnh = function(url, index) {
        $scope.DsHinhAnh.splice(index, 1);
        $scope.mData.DsAnhXoa.push(url);
    }
    // #endregion

    // #region covert data
    $scope.loadData = function () {
        $http({
            method: 'GET',
            url: `https://app.hebec.vn:8080/v1/admin/book?page=8&limit=100&search=&type=SINGLE`,
            headers: {
                'content-type': 'application/json',
                'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidHlwZSI6IkFETUlOIiwiaWEiOjE2NTg1ODI2MjAsImlhdCI6MTY1ODU4MjYxOSwiZXhwIjoxNjg5Njg2NjE5fQ.Klk-uqfhrgHrzb0CwIN8izacRX7QcYNE4aM8t9ysSAQ'
            },
        }).then(function mySuccess(result) {
            if (result && result.data) {
                var data = result.data.data.data;
                let lImage = []
                _.each(data, x => {
                    if (x.thumbnail && !x.thumbnail.includes('undefined')) {
                        lImage.push(x.thumbnail);
                        let loai = _.find($scope.DsLoaiSanPham, l => l.Code == x.category.id);
                        let idloai = "";
                        if (!loai) {
                            console.log(x);
                            return true;
                        } else {
                            idloai = loai.Id;
                        }
                        const vObj = {
                            NgayTao: moment().format(EFormat.DateISO),
                            Ten: x.name,
                            MaSanPham: x.code,
                            GiaGoc: x.originPrice,
                            GiaBan: x.finalPrice,
                            PhanLoai: 1,
                            IdLoai: idloai,
                            UrlHinhAnh: (x.thumbnail || '').replace('/media/', 'Content/SanPham/20218/'),
                            MoTa: x.description,
                            Url: x.name
                        };
                        if (strIsNotNull(x.attribute1) && x.bookAttributes.length > 0) {
                            let th = { TenThuocTinh: x.attribute1, DsGiaTri: _.map(x.bookAttributes, y => { return { GiaTri: y.value } }) };
                            vObj.ThuocTinh = JSON.stringify([th]);
                        }
                        svDanhMuc.createOrUpdate({
                            tbName: $scope.tbName
                        }, vObj).$promise.then(function (d) { });
                    }
                });
                console.log(lImage);
            }
        });
    }
    // #endregio

    // #region export/import excel
    $scope.XuatFileExcel = function () { // Xuất excel
        ngProgress.start(true);
        return svBaoCao.getExcel({
            procName: 'proc_excel_dm_san_pham',
            objParams: {
                sSearch: $scope.mQueryParam.sSearch,
                to: $scope.mQueryParam.to,
                from: $scope.mQueryParam.from,
                idLoai: $scope.mQueryParam.idLoai || _idEmpty,
                phanLoai: $scope.mQueryParam.phanLoai,
                tinhTrang: $scope.mQueryParam.tinhTrang,
                Active: $scope.mQueryParam.Active
            },
            TemplatesExcel: 'VETT-DMSanPham',
            ExcelStartRow: 4
        }).$promise.then(function () {
            ngProgress.complete(true);
        }, function (err) {
            ngProgress.complete(true);
        });
    }

    // Import excel
    $scope.OpenPopupInportExcel = function () {
        $('#myModal-import').modal({
            keyboard: false,
            backdrop: 'static'
        });
    }
    $scope.ClosePopupImportExcel = function () {
        if ($scope.dsDataImport.length > 0) {
            confirmPopup('Cảnh báo', 'Bạn chắc chắn muốn thoát?', () => {
                $('#myModal-import').modal('hide');
                $scope.dsDataImport = [];
                $scope.mDataImport = {};
            });
        } else {
            $('#myModal-import').modal('hide');
            $scope.dsDataImport = [];
            $scope.mDataImport = {};
        }
    }
    $scope.DownloadFileMau = async function () {
        await svBaoCao.exportExcelByName({
            name: 'getFileExcelDMSanPham'
        }).$promise;
    }
    $scope.chooseFile = function (event) {
        var input = event.target;
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        if (regex.test(input.files[0].name.toLowerCase())) { 
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function(){
                    var fileData = reader.result;
                    var wb = XLSX.read(fileData, {type : 'binary'});
                    var rowObj =XLSX.utils.sheet_to_row_object_array(wb.Sheets['SanPham']);
                    var jsonObj = JSON.stringify(rowObj);
                    console.log(rowObj)
                };
                reader.readAsBinaryString(input.files[0]);
            }
        } else {
            toaster.pop('error', 'Báo lỗi', 'Vui lòng chọn file Excel');
        }
    }

    $scope.UploadProcess = function () {
        //Reference the FileUpload element.
        $scope.dsDataImport = [];
        var fileUpload = document.getElementById("fileUpload");

        //Validate whether File is valid Excel file.
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();

                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        $scope.ConvertData(e.target.result);
                        fileUpload.value = null;
                    };
                    reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        $scope.ConvertData(data);
                        fileUpload.value = null;
                    };
                    reader.readAsArrayBuffer(fileUpload.files[0]);
                }
            } else {
                toaster.pop('error', 'Báo lỗi', 'Trình duyệt không hỗ trợ HTML5');
            }
        } else {
            toaster.pop('error', 'Báo lỗi', 'Vui lòng chọn file Excel');
        }
    }

    $scope.ConvertData = async function (data) {
        // STT	Mã sản phẩm|Tên sản phẩm|Giá gốc|Giá bán|Loại sản phẩm|Loại Danh Mục|Mô tả|Nội bật|Trạng thái|Tồn kho|Giá sỉ
        // 1	    2	           3	    4	    5	      6	            7	         8	   9	   10	     11    12
        //Read the Excel File data in binary
        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        //get the name of First Sheet.
        var Sheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);
        //Add the data rows from Excel file.
        for (var i = 2; i < excelRows.length && i < 1000; i++) {
          const col = Object.values(excelRows[i]);
          if (strIsNotNull(col[1]) && strIsNotNull(col[2])) {
            let code = '';
            if (strIsNotNull(col[6])) {
                const arrLoai = col[6].split('-');
                code = arrLoai.length > 1 ? arrLoai[0] : '';
            }
            const loaiSP =  code != '' ? _.find($scope.DsLoaiSanPham, x => x.Code == code) : {Id: null, Ten: ''};
            const data = {
                MaSanPham: col[1],
                Ten: col[2],
                GiaGoc: col[3],
                GiaBan: col[4],
                PhanLoai: col[5] == 'Sảm phẩm đơn' ? 1 : 2,
                strPhanLoai: col[5],
                IdLoai: loaiSP.Id,
                strLoai: loaiSP.Ten,
                MoTa: col[7],
                UrlHinhAnh: col[8],
                DanhSachHinhAnh: col[9],
                TonKho: col[10] || 0,
                GiaSi: col[11],
                NoiBat: col[14] == '1' ? true : false,
                Active: col[15] == '1' ? true : false,
            }
            data.Url = strToUrl(data.Ten);
            data.DsAnh = data.DanhSachHinhAnh.split(',');
            data.objCauHinhGiaSi = $scope.ConvertGiaSi(col[12]);
            data.CauHinhGiaSi = JSON.stringify(data.objCauHinhGiaSi);

            // thuộc tính
            data.objThuocTinh = $scope.ConvertThuocTinh(col[13]);
            data.ThuocTinh = JSON.stringify(data.objThuocTinh);
            // Kiểm tra trường dữ liệu
            data.Error = {
                SoDong: '',
                NoiDung: []
            }
            if (strIsNotNull(data.UrlHinhAnh)) {
                // check hình ảnh
                if (data.UrlHinhAnh.slice(-4) != '.png' && data.UrlHinhAnh.slice(-4) != '.jpg') {
                    data.Error.NoiDung.push('- File Ảnh không đúng định dạng! url: ' + data.UrlHinhAnh);
                }
            }
            // check định dạng
            if (isNaN(data.GiaBan)) {
                data.Error.NoiDung.push('- Giá bán không đúng định dạng');
            }
            if (isNaN(data.GiaGoc)) {
                data.Error.NoiDung.push('- Giá gốc không đúng định dạng');
            }
            if (isNaN(data.GiaSi)) {
                data.Error.NoiDung.push('- Giá sỉ không đúng định dạng');
            }
            if (!strIsNotNull(data.PhanLoai)) {
                data.Error.NoiDung.push('- Phân loại không được để trống!');
            }
            if (data.Error.NoiDung.length > 0) {
                data.Error.SoDong = '* <b>File Excel dòng ' + (i + 2) + ' lỗi: </b>';
            }
            $scope.dsDataImport.push(data);
          }
        }
        setTimeout(() => {
            toaster.pop("success", "Hoàn thành đọc file Excel");
            $scope.$apply();
        }, 100);
    }
    // Convert cấu hình giá sỉ
    $scope.ConvertGiaSi = function (strCauHinh) {
        if (strIsNotNull(strCauHinh)) {
            const objCauHinh = [];
            const arrCauHinh = strCauHinh.split('\r\n');
            if (arrCauHinh.length > 0) {
                _.each(arrCauHinh, x => {
                    const arr = x.split(':');
                    if (arr.length > 1) {
                        objCauHinh.push({
                            SoLuong: arr[0],
                            GiaSi: arr[1]
                        });
                    }
                });
            }
            return objCauHinh;
        }
        return null;
    }

    $scope.ConvertThuocTinh = function (strThuocTinh) {
        if (strIsNotNull(strThuocTinh)) {
            const objThuocTinh = [];
            const arrThuocTinh = strThuocTinh.split('\r\n');
            if (arrThuocTinh.length > 0) {
                _.each(arrThuocTinh, x => {
                    const arr = x.split(':');
                    if (arr.length > 1) {
                        const data = {
                            TenThuocTinh: arr[0],
                            DsGiaTri: []
                        };
                        _.each(arr[1].split(','), z => {
                            data.DsGiaTri.push({
                                GiaTri: z.trim()
                            })
                        })
                        objThuocTinh.push(data)
                    }
                });
            }
            return objThuocTinh;
        }
        return null;
    }
    $scope.OpenDetailFormImport = function (item) {
        $("#tab22").addClass("active");
        $("#tab11").removeClass("active");
        $scope.mDataImport = item;
    }
    $scope.SaveDataImport = function () {
        if (!$scope.dsDataImport) return;
        // Check row error
        if (_.some($scope.dsDataImport, x => x.Error.NoiDung.length > 0)) {
            toaster.pop('warning', 'Thông báo', 'Dữ liệu có dòng bị lỗi, vui lòng kiểm tra lại!');
            return;
        }
        ngProgress.start(true);
        svDanhMuc.post({
            tbName: $scope.tbName,
            fName: 'importExcel'
        }, $scope.dsDataImport).$promise.then(function(d) {
            $scope.dsDataImport = [];
            ngProgress.complete(true);
            $scope.ClosePopupImportExcel();
            toaster.pop('success', 'Thông báo', 'Import dữ liệu thành công!');
            $scope.refreshData(1);
        }, function(err) {
            ngProgress.complete(true);
            toaster.pop('error', 'Thông báo', 'Import dữ liệu không thành công!');
        })
    }
    // #endregion
    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);

app.controller('DMTinhThanhCtrl', ['$scope', '$controller', 'ngProgress', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, ngProgress, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMTinhThanh';

    $scope.refreshData = function (iPageindex) {
        ngProgress.start();
        return svDanhMuc.getList({ tbName: $scope.tbName, fName: 'GetAllByLoai', loai: 1 }).$promise.then(d => {
            $scope.ListDatas = d;
            ngProgress.complete();
            return true;
        }, function (err) {
            ngProgress.complete();
            return false;
        });
    }

    $scope.loadDsHuyen = function (tinh) {
        $scope.mTinh = tinh;
        svDanhMuc.getList({ tbName: $scope.tbName, fName: 'GetCapDuoi', id: tinh.Id }).$promise.then(d => {
            $scope.DsHuyen = d;
        });
    }

    $scope.afterOpenDetailForm = function () {
        $('#input-phiship').focus();
    }

    $scope.CreateOrUpdate = function (isOpenMaster = true) {
        ngProgress.start();
        svDanhMuc.createOrUpdate({
            tbName: $scope.tbName
        }, $scope.mData).$promise.then(function (d) {
            toaster.pop('success', 'Thông báo', 'Cập nhật dữ liệu thành công');
            ngProgress.complete();
            if (isOpenMaster) {
                $scope.OpenMasterForm();
            }
        }, function (err) {
            toaster.pop('error', 'Cảnh báo', err.data);
            ngProgress.complete();
        });
    };

    $scope.DocSoTien = function (st) {
        if (st) return DocTienBangChu(st);
        else return '';
    }

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);
app.controller('DMMaGiamGiaCtrl', ['$scope', '$controller', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMMaGiamGia';

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);

app.controller('DMNguoiDungCtrl', ['$scope', '$controller', 'myAppConfig', 'svDanhMuc', function myfunction($scope, $controller, myAppConfig, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMNguoiDung';
    $scope.DsRole = [{ v: 'BanSi', n: 'Khách sỉ' }, { v: 'User', n: 'Khách lẻ' }];
    $scope.iRole = 'BanSi';
    $scope.setDataForAddNew = function () {
        $scope.mData.Role = $scope.iRole;
    }
    $scope.setQueryParam = function () {
        mSuper.setQueryParam();
        $scope.mQueryParam.iRole = $scope.iRole;
    }
    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);
app.controller('DMDonHangCtrl', ['$scope', '$controller', 'toaster', 'ngProgress', 'svDanhMuc', 'svPhieuIn', 'svBaoCao', function myfunction($scope, $controller, toaster, ngProgress, svDanhMuc, svPhieuIn, svBaoCao) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMDonHang';
    $scope.mParam = {
        Active: true,
        TrangThai: '',
        Loai: 1
    };

    $scope.setQueryParam = function () {
        mSuper.setQueryParam();
        $scope.mQueryParam.trangthai = $scope.mParam.TrangThai;
        $scope.mQueryParam.active = $scope.mParam.Active;
        $scope.mQueryParam.loai = $scope.mParam.Loai;
    }

    $scope.setDataForEdit = function () {
        svDanhMuc.getList({ tbName: 'DMDonHangChiTiet', fName: 'GetByDonHang', id: $scope.mData.Id }).$promise.then(d => {
            $scope.mData.DsSanPham = d;
        });
    }

    $scope.ChuyenTrangThai = function (tt) {
        var vtt = $scope.DsTrangThai[tt];
        confirmPopup('Xác nhận thực hiện', 'Anh/chị chắc chắn muốn chuyển trạng thái đơn hàng thành<br/>' + vtt.Ten, function () {
            $scope.mData.TrangThai = tt;
            var ls = JSON.parse($scope.mData.LichSuDonHang || '[]');
            ls.push({
                TrangThai: vtt.Ma,
                TenTrangThai: vtt.Ten,
                Icon: vtt.Icon,
                ThoiGian: moment().format(EFormat.DateISO),
                ThuTu: ls.length
            });
            $scope.mData.LichSuDonHang = JSON.stringify(ls);
            mSuper.CreateOrUpdate(false);
        });
    }

    $scope.IsDangHuy = false;
    $scope.HuyDonHang = function () {
        if ($scope.IsDangHuy || !$scope.mData || !$scope.mData.Active) return;
        $scope.IsDangHuy = true;
        ngProgress.start();
        svDanhMuc.post({
            tbName: $scope.tbName, fName: 'huy'
        }, $scope.mData).$promise.then(function (d) {
            toaster.pop('success', 'Xác nhận huỷ thành công');
            ngProgress.complete();
            $("#myModalHuy").modal('hide');
            $scope.OpenMasterForm();
            $scope.refreshData($scope.iPageIndex);
        }, (err) => {
            toaster.pop('warning', 'Huỷ đơn thất bại', 'Vui lòng thử lại sau');
            $scope.IsDangHuy = false;
            ngProgress.complete();
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
    // #region in xuất file
    $scope.PrintDonHang = async function (data, func) {
        data.strNgayChungTu = moment(data.NgayDatHang).format(EFormat.DateInViewNgay);
        data.ThanhTienGiaBia = 0;
        data.strTongTienhang = ConverTienCoDauPhay2(data.TongTienhang, 0);
        data.strTienVanChuyen = ConverTienCoDauPhay2(data.TienVanChuyen, 0);
        data.strTongTien = ConverTienCoDauPhay2(data.TongTien, 0);
        _.each(data.DsSanPham, (x, index) => {
            x.STT = index + 1;
            x.strSoLuong = ConverTienCoDauPhay2(x.SoLuong, 0);
            x.strGiaBan = ConverTienCoDauPhay2(x.GiaBan, 0);
            x.strThanhTien = ConverTienCoDauPhay2(x.SoLuong * x.GiaBan, 0);
        });
        const temp = {
            template: {
                name: ETemplateName.DonDatHang
            },
            data: data,
        };
        await svPhieuIn.printTemplate(temp);
        if (func) func();
    }
    $scope.exportExcel = function (data) {
        ngProgress.start(true);
        return svBaoCao.exportExcel({
            TemplatesExcel: 'VTech-ChiTietDonHang',
            ExcelStartRow: 8,
            ExcelStartCol: 1,
            ColmunName: ['MaSanPham', 'TenSanPham', 'SoLuong', 'ThuocTinh', 'GiaBan', 'TongTien'],
            objReplace: {
                ThoiGian: moment(data.NgayDatHang).format(EFormat.DateInView),
                MaChungTu: data.MaDonHang,
                TenNguoiNhan: data.TenNguoiNhan,
                DiaChi: data.DiaChiFull,
                SoDienThoai: data.SoDienThoai,
                Email: data.Email,
            },
            CellReplace: [{ row: 11, col: 6, value: data.TienVanChuyen }, { row: 12, col: 6, value: data.TongTien }],
            ObjData: data.DsSanPham
        }).$promise.then(function (d) {
            ngProgress.complete(true);
            return true;
        }, function (err) {
            ngProgress.complete(true);
            return false;
        });
    }
    // #endregion

    setTimeout(() => {
        svDanhMuc.getList({ tbName: $scope.tbName, fName: 'dmtranghtai' }).$promise.then(d => {
            $scope.DsTrangThai = d;
            $scope.DsTrangThaiLoc = [{ Ma: '', Ten: '-Trạng thái đơn hàng-', HanhDong: '' }].concat(_.filter($scope.DsTrangThai, x => x.Ma != 99));
        });
        $scope.refreshData(1);
    }, 0);
}]);
app.controller('DMPhongGDCtrl', ['$scope', '$controller', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMPhongGD';

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);

app.controller('DMTruongCtrl', ['$scope', '$controller', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMTruong';

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);

app.controller('DMKhoiCtrl', ['$scope', '$controller', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMKhoi';

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);

app.controller('DMLopCtrl', ['$scope', '$controller', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMLop';

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);

app.controller('DMHocSinhCtrl', ['$scope', '$controller', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMHocSinh';

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);

app.controller('DMGiaoVienCtrl', ['$scope', '$controller', 'toaster', 'svDanhMuc', function myfunction($scope, $controller, toaster, svDanhMuc) {
    angular.extend(this, $controller('baseDanhMucCtrl', { $scope: $scope, svService: svDanhMuc }));
    const mSuper = angular.extend({}, $scope);
    $scope.tbName = 'DMGiaoVien';

    setTimeout(() => {
        $scope.refreshData(1);
    }, 0);
}]);
