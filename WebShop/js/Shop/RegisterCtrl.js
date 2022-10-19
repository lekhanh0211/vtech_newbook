app.controller('RegisterCtrl', function ($scope, $http, ngProgress, toaster) {
    var urlObj = $.deparam.querystring();
    $scope.mUser = {
        UserName: '',
        Password: '',
        Password2: ''
    }
    $scope.IsErrorUserName = true;
    $scope.IsErrorPass = true;
    var checkSDT = function (mobile) {
        var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (mobile !== '') {
            if (vnf_regex.test(mobile) == false) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };
    var ValidateEmail = function (mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return true;
        }
        return false;
    };

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
            url: '/api/nguoidung',
            headers: {
                'content-type': 'application/json'
            },
            data: $scope.mUser,
        }).then(function mySuccess(result) {
            ngProgress.complete(true);
            if (result && result.data && result.data.Id) {
                location.href = '/oauth/login?user=' + $scope.mUser.UserName;
            }
        }, function myError(data) {
            ngProgress.complete(true);
            console.error('Login error: ', data);
            toaster.pop('error', 'Không tạo được tài khoản', 'Vui lòng kiểm tra tài thông tin và thử lại sau');
        });
    };

    $scope.CheckUsername = function (str) {
        if ($scope.mUser.UserName) {            
            $http({
                method: 'POST',
                url: '/api/nguoidung/checkUsername/' + str,
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
});