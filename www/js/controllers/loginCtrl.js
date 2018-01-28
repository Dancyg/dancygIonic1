controllers.controller("LoginCtrl", function ($scope, $http, $ionicPopup, $state, Loading, $rootScope, Alert) {

  $scope.data = {
    username: "",
    password: "",
    remember: false,
    api_call: true,
    showPass: false,
    type    : 'password'
  };

  if ($rootScope.device_token) {
    $scope.data.device_token = $rootScope.device_token;
  }

  $scope.changeType = function () {
    $scope.data.type = $scope.data.showPass ? 'text' : 'password';
  };

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
          $rootScope.checkBlogsHeight();
          $rootScope.checkOneBlogHeight();

        }, function (res) {
          var text = res.data && res.data.error && res.data.error || "Please check your credentials and network connection.";
          Loading.hide();
          $rootScope.checkBlogsHeight();
          $rootScope.checkOneBlogHeight();
          Alert.failed('Login Failde', text)
        });
    }
  }

});
