angular.module('index', [])
    .controller('IndexController', function ($scope, $http) {
        var load_suggestions = function () {
            $http.get('/suggestions').success(function (data) {
                $scope.suggestions = data;
            });
        };

        $scope.register = function () {
            $http.post('/users', $scope.user).success(function () {
                $scope.created = true;
                $scope.error = undefined;
            }).error(function (data, status) {
                if (status == 409) {
                    $scope.error = 'Email has been registered!';
                } else {
                    $scope.error = data.message || status;
                }
            });
        };

        $scope.vote = function (suggestion_id) {
            $http.post('/suggestions/' + suggestion_id, '').success(function () {
                load_suggestions();
            });
        };
        $scope.suggest = function () {
            $http.post('/suggestions', {suggestion: $scope.suggestion}).success(function () {
                load_suggestions();
            });
        };

        $http.get('/users/login-state').success(function () {
            $scope.logged_in = true;
            load_suggestions();
        }).error(function () {
            $scope.logged_in = false;
        });
    });