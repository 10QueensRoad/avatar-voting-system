angular.module('index', [])
    .controller('RegisterController', function ($scope, $http) {
        $scope.submit = function () {
            $http.post('/users', $scope.user).success(function () {
                $scope.created = true;
                $scope.error = undefined;
                console.log("created");
            }).error(function (data, status) {
                if (status == 409) {
                    $scope.error = 'Email has been registered!';
                } else {
                    $scope.error = data.message || status;
                }
            });
        };
    });