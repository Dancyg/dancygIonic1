controllers.controller('SettingsCtrl', function ($scope, $http, Alert, Loading, $rootScope) {
    var URL     = {
      tipNotif : 'https://members.bettinggods.com/api/toggle_notification_status',
      blogNotif: 'https://bettinggods.com/api/toggle_notification_status'
    };
    $scope.data = {
      blogNotif: false,
      tipNotif : false
    };

    $scope.click = function (name) {
      Loading.start();
      let data     = {
        status      : $scope.data[name] ? 1 : 0,
        api_call    : true,
        device_token: $rootScope.device_token
      };
      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }
      $http.post(URL[name], formData)
        .then(function (res) {
          Loading.hide();
          Alert.success('Success', 'Your push notifications settings for has been changed');
          localforage.setItem('settingsData', $scope.data)
        }, function (err) {
          var errText = '';
          if (err.data.error.errors) {
            errText = Object.keys(err.data.error.errors).map(function (elem, i) {
              return err.data.error.errors[elem];
            })[0];
          } else {
            errText = 'Request has not been sent.';
          }
          Loading.hide();
          Alert.failed('Error', errText);
        })
    };

    localforage.getItem('settingsData')
      .then(function (data) {
        $scope.data.blogNotif = data ? Boolean(data.blogNotif) : true;
        $scope.data.tipNotif  = data ? Boolean(data.tipNotif) : true;
        localforage.setItem('settingsData', $scope.data)
      });
});
