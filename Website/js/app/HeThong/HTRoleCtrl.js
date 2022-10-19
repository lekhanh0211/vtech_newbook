
app.controller('HTRoleCtrl', ['$scope', '$compile', 'svRole', 'svMenu', 'ngProgress', 'toaster'
    , function myFunc($scope, $compile, svRole, svMenu, ngProgress, toaster) {
        $scope.DsRole = [];
        $scope.DsMenu = [];
        $scope.DsMenuInParentGroup = []; // Menu mà có cấu hình là cha
        $scope.DsAllMenu = [];
        $scope.state = 0; // 0: is master; 1: is update role; 2: is update menu
        $scope.iPageSize = '10';
        $scope.iPageIndex = '1';
        $scope.sSearch = '';
        $scope.Role = null;
        $scope.Menu = {};

        $scope.refreshData = function (pageIndex) {
            ngProgress.start();
            $scope.iPageIndex = pageIndex;
            svRole.showPage({
                sSearch: $scope.sSearch,
                from: '',
                to: '',
                iPageIndex: $scope.iPageIndex,
                iPageSize: $scope.iPageSize,
            }).$promise.then(function (d) {
                $scope.DsRole = d.List;
                $scope.total = d.Total || 0;
                $scope.totalPage = Math.floor(($scope.total - 1) / $scope.iPageSize) + 1;
                var totalPage = GetlstPage($scope.totalPage, $scope.iPageIndex, 'refreshData');
                $("#lstPage").html($compile(totalPage)($scope));
                ngProgress.complete();
            }, function (err) {
                ngProgress.complete();
            });
        }
        $scope.loadMenu = function (idRole) {
            svRole.showMenus({
                id: idRole,
                level: 1
            }).$promise
                .then(function (d) {
                    $scope.DsMenu = d;
                }, function (err) { });
        };

        $scope.loadMenuGroupParent = function (idRole) {
            svRole.showMenus({
                id: idRole,
                level: 0,
            }).$promise
                .then(function (d) {
                    $scope.DsMenuInParentGroup = d;
                }, function (err) { });
        };

        $scope.loadAllMenu = function () {
            svMenu.query({}).$promise.then(function (d) {
                $scope.DsAllMenu = d;
            }, function (err) { });
        };

        $scope.addMenu = function (menu) {
            if (!menu) {
                toaster.info('Bạn chưa chọn menu!');
                return;
            }

            var vRoleMenu = {};
            vRoleMenu.IdRole = $scope.Role.Id;
            vRoleMenu.IdMenu = menu.Id;
            if ($scope.Menu.selected) {
                vRoleMenu.IdParent = $scope.Menu.selected.Id;
                var menu = _.find($scope.DsMenu, x => x.Id === $scope.Menu.selected.Id);
                vRoleMenu.UuTien = (menu.Children || []).length;
            } else {
                vRoleMenu.UuTien = ($scope.DsMenu || []).length;
            }

            svRole.addMenu({}, vRoleMenu).$promise
                .then(function (d) {
                    toaster.success('Thêm menu thành công.');
                    $scope.loadMenu($scope.Role.Id);
                    $scope.loadMenuGroupParent($scope.Role.Id);
                }, function (err) {
                    toaster.error('Thêm menu thất bại.');
                });
        };

        // Up, Down, Remove Menu
        $scope.sortableOptions = {
            stop: function (e, ui) {
                $scope.ChangeMenuPosit(ui.item.sortable.sourceModel);
            }
        };
        $scope.ChangeMenuPosit = function (dsMenu) {
            const vLitChange = [];
            _.each(dsMenu, (x, i) => {
                if (x.UuTien !== i) {
                    x.UuTien = i;
                    vLitChange.push(x);
                }
            });
            svRole.changeMenuPosition(vLitChange).$promise.then(function (d) {
                toaster.success('Chuyển thành công!');
                $scope.loadMenu($scope.Role.Id);
            }, function (err) {
                toaster.error('Chuyển thất bại!');
            });
        };

        $scope.rmMenu = function (id) {
            svRole.rmMenu({ id }).$promise.then(function (d) {
                toaster.success('Xóa thành công!');
                $scope.loadMenu($scope.Role.Id);
                $scope.loadMenuGroupParent($scope.Role.Id);
            }, function (err) {
                toaster.error('Xóa thất bại!');
            });
        };

        $scope.updateOrCreate = function () {
            svRole.createOrUpdate($scope.Role).$promise.then(function (d) {
                console.log('Thành công');
                $scope.state = 0;
                $scope.refreshData($scope.iPageIndex);
            }, function (err) {
                console.log('Thất bại');
            });
        };

        $scope.goToDetail = function (isCreate, obj) {
            $scope.Role = {};
            $scope.state = 1;
            $scope.IsCreate = isCreate;
            if (!isCreate) {
                $scope.Role = obj;

            }
        };

        $scope.goToUpdateMenu = function (obj) {
            $scope.state = 2;
            $scope.Role = obj;
            $scope.loadMenu(obj.Id);
            $scope.loadAllMenu();
            $scope.loadMenuGroupParent($scope.Role.Id);
        }

        $scope.changeHeThong = function () {
            $scope.loadAllMenu();
            $scope.loadMenuGroupParent($scope.Role.Id);
            $scope.loadMenu($scope.Role.Id);
        }

        $scope.exitDetail = function () {
            $scope.state = 0;
        }

        $scope.delete = function (id) {
            svRole.delete({ id }).$promise.then(function (d) {
                toaster.success('Thành công');
                $scope.refreshData($scope.iPageIndex);
            }, function (err) {
                toaster.error('Thất bại');
            });
        }

        $scope.refreshData(1);
    }]);
