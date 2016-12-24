var GET_RESPONSIBLE = 'https://www.bettinggods.com/api/how_to_gamble_responsibly/';

controllers.controller("ResponsibleCtrl", function ($scope, $http, $sce, Loading, Alert) {
  $scope.loaded = false;

  Loading.start();
  $http.get(GET_RESPONSIBLE)
    .then(function (res) {
      $scope.title = function () { return $sce.trustAsHtml(res.data.post.title) };
      $scope.content = function () { return $sce.trustAsHtml(res.data.post.content) };
      $scope.imgUrl = res.data.post.attachments["0"].images.medium.url;
      $scope.loaded = true;
      Loading.hide();
    }, function (err) {
      Loading.hide();
      Alert.failed('Error', 'Something went wrong... Please check your internet connection.')
      console.log(err)
    })
});
