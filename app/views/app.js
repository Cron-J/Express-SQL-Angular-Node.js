'use strict';

angular.module('app', [
        'ui.bootstrap'
    ])
    .controller('MainCtrl', function($scope, $http, $filter) {
        $scope.youtube = {};
        $scope.youtube.date = new Date();

        $scope.getScheduleInfo = function(youtube, form) {
            if (form.$valid) {
                youtube.date = $filter('date')(youtube.date, 'yyyy-MM-dd');
                $http.post('/getViews', youtube)
                    .then(function(data) {
                        $scope.views = data.data;
                    })
                    .catch(function(err) {
                        alert(err)
                    })
            }

        }

        $scope.getScheduleData = function(youtube, form) {
            if (form.$valid) {
                $http.post('/getTotalCount', youtube)
                    .then(function(data) {
                        $scope.views = data.data;
                    })
                    .catch(function(err) {
                        alert(err)
                    })
            }
        }

        var getUserList = function() {
            $http.get('/getUsername')
                .then(function(data) {
                    $scope.userList = data.data;
                })
                .catch(function(err) {
                    alert(err)
                })
        }

        getUserList();
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
    });