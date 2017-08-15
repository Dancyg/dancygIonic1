var REGISTER = 'https://members.bettinggods.com/api/registration';


controllers.controller('SignupCtrl', function ($scope, $http, Alert, Loading, $rootScope) {

  $scope.data ={
    login:'',
    email:'',
    api_call: true,
    device_token: $rootScope.device_token
  };
  $scope.register = function () {
    if (!$scope.data.login || !$scope.data.email ) {
      Alert.failed('Error', 'All fields are required.')
    } else if (!$scope.data.email.match(EMAIL_CHECK)) {
      Alert.failed('Response Failed', 'Please indicate correct email.')
      console.log($scope.data)
    } else {
      Loading.start();
      var formData = new FormData();
      for (var key in $scope.data) {
        formData.append(key, $scope.data[key]);
      }
      // var url = REGISTER + $scope.data.login + '&email=' + $scope.data.email;
      $http.post(REGISTER, formData)
        .then(function (res) {
          Loading.hide();
          Alert.success('Success', 'Your registration request has been sent. The response will be sent to your mail.')
        }, function (err) {
          var errText = '';
          if(err && err.data && err.data.error && err.data.error.errors){
            errText = Object.keys(err.data.error.errors).map(function (elem, i) {
              return err.data.error.errors[elem];
            })[0];
          } else {
            errText = 'Request has not been sent.';
          }
          Loading.hide();
          Alert.failed('Error', errText);
        })
    }
  }
});
