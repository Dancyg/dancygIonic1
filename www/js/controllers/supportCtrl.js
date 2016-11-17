var SUPPORT = 'http://members.bettinggods.com/api/support/';

controllers.controller('SupportCtrl', function ($scope, $http, Alert, Loading) {

  $scope.data ={
    name:'',
    email:'',
    subject:'',
    message:''
  };
  $scope.sendToSupport = function () {
    if (!$scope.data.message || !$scope.data.email || !$scope.data.name || !$scope.data.subject){
      Alert.failed('Response Failed', 'All fields are required.')
    }else {
      console.log($scope.data);
      Loading.start();
      $http.post(SUPPORT, $scope.data)
        .then(function (res) {
          Loading.hide();
          Alert.success('Success', 'Your request has been sent. The response will sent to your mail.')
        }, function (err) {
          Loading.hide();
          Alert.failed('Error', 'Request has not been sent.')
        })
    }
  }

});
