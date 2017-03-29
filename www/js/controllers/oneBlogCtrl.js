controllers.controller("OneBlogCtrl", function ($scope, Loading, $stateParams, $http, $sce, $rootScope, Alert, $state) {

  if(!$rootScope.blogsGlobal || !$rootScope.blogsGlobal[$stateParams.blogID]){
    Loading.start();
    var url = BLOG + $stateParams.blogID;
    $http.get(url)
      .then(
        function (res) {
          Loading.hide();
          $scope.blog      = res.data.post;
          $scope.title     = function () { return $sce.trustAsHtml(res.data.post.title) };
          $scope.content   = function() { return $sce.trustAsHtml(res.data.post.content) };
        },
        function (res) {
          Loading.hide();
          console.log("error", res.data);
        }
      );
  } else {
    $scope.blog      = $rootScope.blogsGlobal[$stateParams.blogID];
    $scope.title     = function() { return $sce.trustAsHtml($scope.blog.title) } ;
    $scope.content   = function() { return $sce.trustAsHtml($scope.blog.content) };
  }

  $scope.back = function () {
    $state.go('tab.blogs')
  }

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
