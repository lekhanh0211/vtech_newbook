
app.controller('BanTinCtrl', ['$scope', '$http', 'ngProgress', 'toaster', function ($scope, $http, ngProgress, toaster) {
    $scope.sSearch = '';
    $scope.iPageIndex = 1;
    $scope.LoadDsBanTin = function (index) {
        ngProgress.start();
        $scope.iPageIndex = index || 1;
        $http({
            method: 'GET',
            url: `/api/bantin/list?sSearch=${$scope.sSearch}&index=${$scope.iPageIndex}&size=9`,
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
                $scope.totalPage = Math.floor((total - 1) / 9) + 1;
            }
            ngProgress.complete();
        }, function myError(data) {
            ngProgress.complete();
        });
    }

    setTimeout(() => {
        $scope.LoadDsBanTin();
    });
}]);