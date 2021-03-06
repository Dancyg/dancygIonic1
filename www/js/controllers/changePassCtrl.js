controllers.controller('ChangePassCtrl', function ($scope, $state, $http, Alert, Loading, $rootScope) {
  $scope.back = function () {
    $state.go('sidemenu.settings')
  };

  $scope.data = {
    showPass: false,
    type    : 'password',
    password: '',
    confirm : '',
    api_call: true,
    token   : $rootScope.token
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

    if ($scope.data.password !== $scope.data.confirm ) {
      Alert.failed('Error', 'Passwords are not matching!');
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
        window.localStorage.setItem('token', res.data.cookie);
        $rootScope.token = window.localStorage.getItem('token');
        Loading.hide();
        Alert.success('Success', 'Your password has been changed.')
      }, function (err) {
        var errText = '';
        if (err && err.data && err.data.error && err.data.error.errors) {
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
