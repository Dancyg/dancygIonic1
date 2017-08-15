controllers.controller('SettingsCtrl', function ($scope, $http, Alert, Loading, $rootScope) {
  var URL = {
    tipNotif : 'https://members.bettinggods.com/api/toggle_notification_status',
    blogNotif: 'https://bettinggods.com/api/register_device_token'
  };

  $scope.settingsData = {
    blogNotif: false,
    tipNotif : false
  }

  var settingsData = JSON.parse(window.localStorage.getItem('settingsData'));

  $scope.settingsData = {
    blogNotif: settingsData ? Boolean(settingsData.blogNotif) : true,
    tipNotif : settingsData ? Boolean(settingsData.tipNotif) : true
  };

  window.localStorage.setItem('settingsData', JSON.stringify($scope.settingsData));

  $scope.notificationSettings = function (name) {


    var data = {
      status      : $scope.settingsData[name] ? 1 : 0,
      api_call    : true,
      device_token: $rootScope.device_token
    };

    if (name === 'tipNotif' && !$rootScope.token) {
      Alert.failed('Warning', 'To manage tips notifications please login first.');
      $scope.settingsData[name] = !$scope.settingsData[name];
      return;
    }

    if (name === 'tipNotif' && $rootScope.token) {
      data.token = $rootScope.token
    }

    Loading.start();

    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

    var blogOrTip = name === 'blogNotif' ? 'bogs' : 'tipsters';

    $http.post(URL[name], formData)
      .then(function (res) {
        Loading.hide();
        Alert.success('Success', 'Your push notifications settings for ' + blogOrTip + ' have been changed');
        window.localStorage.setItem('settingsData', JSON.stringify($scope.settingsData));
      }, function (err) {
        $scope.settingsData[name] = !$scope.settingsData[name];
        Loading.hide();
        Alert.failed('Error', 'Request has not been sent.' + JSON.stringify(err));
      })
  };
});
