controllers.controller('ChangePassCtrl', function ($scope, $state, $http, Alert, Loading, $rootScope) {
  $scope.back = function () {
    $state.go('sidemenu.settings')
  };

  $scope.data = {
    showPass: false,
    password: '',
    type    : 'password',
    api_call: true
  };

  $scope.changeType = function () {
    $scope.data.type = $scope.data.showPass ? 'text' : 'password';
  };

  $scope.changePassword = function () {
    $scope.data.token = $rootScope.token;
    if ($scope.data.password === '') {
      Alert.failed('Error', 'Password is required!');
      return;
    }

    if (!$scope.data.token) {
      Alert.failed('Error', 'Please login before changing password.');
      return;
    }
    Loading.start();
    var formData = new FormData();
    for (var key in $scope.data) {
      formData.append(key, $scope.data[key]);
    }
    $http.post('https://members.bettinggods.com/api/change_password', formData)
      .then(function (res) {
        Loading.hide();
        Alert.success('Success', 'Your password has been changed.')
      }, function (err) {
        var errText = '';
        if (err.data.error.errors) {
          errText = Object.keys(err.data.error.errors).map(function (elem, i) {
            return err.data.error.errors[elem];
          })[0];
        } else {
          errText = 'Changing password failed';
        }
        Loading.hide();
        Alert.failed('Error', errText);
      })
  }

});
