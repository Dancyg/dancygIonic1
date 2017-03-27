controllers.controller("OneBlogCtrl", function ($scope, Loading, $stateParams, $http, $sce, $rootScope, Alert) {

  Loading.start();
  var url = BLOG + $stateParams.blogID;
  $http.get(url)
    .then(
      function (res) {
        Loading.hide();
        $scope.blog = res.data.post;
        $scope.title = function () { return $sce.trustAsHtml(res.data.post.title) };
        $scope.content = function() { return $sce.trustAsHtml(res.data.post.content) };
        console.log($scope.blog);
      },
      function (res) {
        Loading.hide();
        console.log("error", res.data);
      }
    );

  function onError(err){
    Alert.failed('Share Failed', 'Please check if social network app is installed on your phone.')
  }

  $scope.shareViaF = function () {
    window.plugins.socialsharing.shareViaFacebook($scope.blog.title, null, $scope.blog.url, null, onError)
  }
  $scope.shareViaTw = function () {
    window.plugins.socialsharing.shareViaTwitter($scope.blog.title, null, $scope.blog.url, null, onError)
  }
  $scope.shareViaEm = function () {
    window.plugins.socialsharing.shareViaEmail($scope.blog.url, $scope.blog.title, null, null, null, $scope.blog.thumbnail, null, onError)
  }
  $scope.shareViaAll = function () {
    window.plugins.socialsharing.share(null, $scope.blog.title, $scope.blog.thumbnail, $scope.blog.url, null, onError)
  };

});
