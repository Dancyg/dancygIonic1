controllers.controller('SettingsCtrl', function ($scope, $http, Alert, Loading, $rootScope) {
  localforage.getItem('settingsData')
    .then(data => {

      $scope.data = {
        blogNotif: data ? data.blogNotif : true,
        tipNotif : data ? data.tipNotif : true
      };

      localforage.setItem('settingsData', $scope.data)
  })

  $scope.click = function (param) {
    console.log(param);

    // $http.post(REGISTER, formData)
    //   .then(function (res) {
    //     Loading.hide();
    //     Alert.success('Success', 'Your registration request has been sent. The response will be sent to your mail.')
    //   }, function (err) {
    //     var errText = '';
    //     if(err.data.error.errors){
    //       errText = Object.keys(err.data.error.errors).map(function (elem, i) {
    //         return err.data.error.errors[elem];
    //       })[0];
    //     } else {
    //       errText = 'Request has not been sent.';
    //     }
    //     Loading.hide();
    //     Alert.failed('Error', errText);
    //   })


  }

});
