controllers.controller("LoginCtrl", function ($scope, $http, $ionicPopup, $state, Loading, $rootScope ) {

  $scope.data= {
    username :"",
    password :"",
    remember :false
  };

  $scope.alert = function(text) {
    var alertPopup = $ionicPopup.alert({
      title: 'Login Failed',
      template: text,
      buttons: [
        {
          text: '<b>Ok</b>',
          type: 'button-assertive'
        }
      ]
    });
  };

  $scope.submit = function () {
    console.log($scope.data);
    if ($scope.data.username === '' || $scope.data.password === '') {
      $scope.alert('Name and password are required!');

    } else {
      Loading.start();
      var formData = new FormData();
      for (var key in $scope.data) {
        formData.append(key, $scope.data[key]);
      }

      $http.post(LOGIN, formData)
        .then(
          function (res) {
            console.log(res.data);
            window.localStorage.setItem('token', res.data.cookie);
            $rootScope.token = window.localStorage.getItem('token');

            Loading.hide();
            $state.go("tab.home");

          },
          function (res) {
            var text = res.data.error;
            if (!text) {
              text = "Please check your credentials and network connection."
            }
            Loading.hide();
            $scope.alert(text);
          }
        );
    }
  }

});
