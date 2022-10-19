'use strict';
var app = angular.module('uiApp');

app.controller('DasboardCtrl', ['$scope', 'ngProgress', 'svBaoCao', 'svPhieuIn'
    , function myfunction($scope, ngProgress, svBaoCao, svPhieuIn) {
        var timer1 = null;
        var timer2 = null;
        $scope.$on("$destroy", function () {
            if (timer1) {
                clearTimeout(timer1);
            }
            if (timer2) {
                clearTimeout(timer2);
            }
        });
        $scope.param = {
            idkho: _idKho,
            trangthai: 0   
        };

        $scope.DsTrangThai = [{ v: 0, n: 'Còn trong kho (Tồn > 0)' },
            { v: 1, n: 'Kho đã hết (Tồn = 0)' },
            { v: 2, n: 'Kho sắp hết (Tồn < 100)' },
            { v: 3, n: 'Tồn đọng quá nhiều' }
        ]

        $scope.refreshBaoCaoTongHop = function () {
            ngProgress.start();
            return svBaoCao.getData({
                procName: 'proc_bc_tong_hop',
                objParams: { idkho: _idKho },
                optParams: ['SoDauSach', 'SoLuongTon','ThanhTien']
            }).$promise.then(function (d) {
                ngProgress.complete();
                $scope.TongHop = d.RptData;
                return true;
            }, function (err) {
                ngProgress.complete();
                return false;
            });
        }

        $scope.refreshData = function () {
            ngProgress.start();
            return svBaoCao.getData({
                procName: 'proc_bc_ton_kho',
                objParams: $scope.param,
            }).$promise.then(function (d) {
                ngProgress.complete();
                $scope.BCTonKho = d.Data["Table"];
                $scope.BCTonKho1 = d.Data["Table"];
                return true;
            }, function (err) {
                ngProgress.complete();
                return false;
            });
        }

        $scope.TimKiemSach = function (str) {
            $scope.BCTonKho = _.filter($scope.BCTonKho1, x => x.StrSearch.includes(strKhongDau(str)));
        }

        setTimeout(() => {
            $scope.refreshData();
            $scope.refreshBaoCaoTongHop();
        }, 0);

        $scope.printData = function () {
            const data = {
                thoiGian: moment().format(EFormat.DateInViewLong),
                htmlView: $('#tableView').html(),
            }
            svPhieuIn.printHtmlView(ETemplateName.PhieuInTonKho, data, true)
                .then((result) => {
                    return $scope.$apply(function () {
                        toaster.pop('success', 'Thành công!', 'Thực hiện in kết quả thành công.');
                    })
                })
                .catch((err) => {
                    console.log('Khong in duoc template: ', err);
                    toaster.pop('error', 'Báo lỗi', 'Không in được kết quả, vui lòng kiểm tra!');
                })
        }

        $scope.XuatFileExcel = function () {
            ngProgress.start(true);
            return svBaoCao.exportExcel({
                TemplatesExcel: 'VETT-BCTonKho',
                ExcelStartRow: 6,
                ExcelStartCol: 1,
                InsertSTT: true,
                ColmunName: ['MaSo', 'TenSach', 'NgayNhap', 'GiaBia', 'SLNhap', 'SLXuat', 'SLTon', 'ThanhTien'],
                objReplace: { THOI_GIAN: moment().format(EFormat.DateInViewLong) },
                ObjData: $scope.BCTonKho
            }).$promise.then(function () {
                ngProgress.complete(true);
            }, function (err) {
                ngProgress.complete(true);
            });
        }
    }
]);
