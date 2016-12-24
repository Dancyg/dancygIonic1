var SUPPORT = 'http://members.bettinggods.com/api/support/';

controllers.controller('SupportCtrl', function ($scope, $http, Alert, Loading) {

  $scope.data ={
    name:'',
    email:'',
    subject:'',
    message:''
  };
  $scope.sendToSupport = function () {
    if (!$scope.data.message || !$scope.data.email || !$scope.data.name || !$scope.data.subject) {
      Alert.failed('Response Failed', 'All fields are required.')
      console.log($scope.data)
    } else if (!$scope.data.email.match(EMAIL_CHECK)){
      Alert.failed('Response Failed', 'Please indicate correct email.')
      console.log($scope.data)
    } else {
      console.log($scope.data);
      Loading.start();
      $http.get(SUPPORT +
        '?name=' + $scope.data.name +
        '&email=' + $scope.data.email +
        '&subject=' + $scope.data.subject +
        '&message=' + $scope.data.message)
        .then(function (res) {
          Loading.hide();
          Alert.success('Success', 'Your request has been sent. The response will be sent to your mail.')
        }, function (err) {
          Loading.hide();
          Alert.failed('Error', 'Request has not been sent.')
        })
    }
  }

});
