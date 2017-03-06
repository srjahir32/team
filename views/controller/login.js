var app = angular.module('login', []);

app.controller('loginClt', function($scope, $window, $http, $location) {

    console.log('login controller');
    $scope.login = function() {


        var params = {
            "email": $scope.email,
            "password": $scope.password
        };
        $http({
            method: "POST",
            url: "https://team-application.herokuapp.com/user/signin",
            data: angular.toJson(params),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(
            function mySucces(res) {
                console.log('res', res);
                if (res.data.status == "success") {
                    $window.location.href = "/home";
                } else {
                    console.log('login fail');
                }
            },
            function Error(err) {
                console.log('Error', err);
            });

    }
});