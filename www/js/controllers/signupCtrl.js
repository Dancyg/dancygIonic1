var REGISTER = 'https://members.bettinggods.com/api/registration/';

controllers.controller('SignupCtrl', function ($scope, $http, Alert, Loading) {
  $scope.data ={
    login:'',
    email:''
  };
  $scope.register = function () {
    if (!$scope.data.login || !$scope.data.email ){
      Alert.failed('Response Failed', 'All fields are required.')
    }else {
      console.log($scope.data);
      Loading.start();
      $http.post(REGISTER, $scope.data)
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
