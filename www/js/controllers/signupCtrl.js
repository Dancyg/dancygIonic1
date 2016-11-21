var REGISTER = 'https://members.bettinggods.com/api/registration?login=';


controllers.controller('SignupCtrl', function ($scope, $http, Alert, Loading) {

  $scope.data ={
    login:'',
    email:''
  };
  $scope.register = function () {
    if (!$scope.data.login || !$scope.data.email ) {
      Alert.failed('Error', 'All fields are required.')
    }else {
      Loading.start();
      var url = REGISTER + $scope.data.login + '&email=' + $scope.data.email;
      $http.get(url)
        .then(function (res) {
          Loading.hide();
          Alert.success('Success', 'Your registration request has been sent. The response will sent to your mail.')
        }, function (err) {
          Loading.hide();
          Alert.failed('Error', 'Request has not been sent.')
        })
    }
  }
})
