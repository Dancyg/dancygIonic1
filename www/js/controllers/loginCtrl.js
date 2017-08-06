controllers.controller("LoginCtrl", function ($scope, $http, $ionicPopup, $state, Loading, $rootScope, Alert, $ionicPush) {

  $scope.data = {
    username: "",
    password: "",
    remember: false,
    api_call: true
  };

  if ($rootScope.pushToken) {
    $scope.data.device_token = $rootScope.pushToken;
  }

  $scope.submit = function () {
    if ($scope.data.username === '' || $scope.data.password === '') {
      Alert.failed('Error', 'Name and password are required!');

    } else {
      Loading.start();
      var formData = new FormData();
      for (var key in $scope.data) {
        formData.append(key, $scope.data[key]);
      }

      $http.post(LOGIN, formData)
        .then(function (res) {
          window.localStorage.setItem('token', res.data.cookie);
          $rootScope.token = window.localStorage.getItem('token');
          Loading.hide();
          $rootScope.register();
          $state.go("sidemenu.tab.blogs");

        }, function (res) {
          var text = res.data && res.data.error && res.data.error || "Please check your credentials and network connection.";
          Loading.hide();
          Alert.failed('Login Failde', text)
        });
    }
  }

});
