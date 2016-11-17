var TIPSTERS_CATEGORIES = 'https://members.bettinggods.com/api/get_categories';

controllers.controller('MyTipstersCtrl', function ($scope, $http, Loading, Alert, $rootScope) {
  var url = TIPSTERS_CATEGORIES + $rootScope.token;
    $http.post(TIPSTERS_CATEGORIES, {
      cookie: $rootScope.token
    })
      .then(function (res) {
        Loading.hide();
        console.log(res)
        // Alert.success('Success', 'Your registration request has been sent. The response will sent to your mail.')
      }, function (err) {
        Loading.hide();
        Alert.failed('Error', 'Request has not been sent.')
      })
});
