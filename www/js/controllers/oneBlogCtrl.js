controllers.controller("OneBlogCtrl", function ($scope, Loading, $stateParams, $http, $sce) {

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
    alert('Please check if social network app is installed on your phone.')
  }

  $scope.shareViaF = function () {
    window.plugins.socialsharing.shareViaFacebook($scope.blog.title, $scope.blog.thumbnail, $scope.blog.url, null, onError)
  }
  $scope.shareViaTw = function () {
    window.plugins.socialsharing.shareViaTwitter($scope.blog.title, null, $scope.blog.url, null, onError)
  }
  $scope.shareViaEm = function () {
    window.plugins.socialsharing.shareViaEmail(null, $scope.blog.title, null, null, null, $scope.blog.thumbnail, null, onError)
  }
  $scope.shareViaAll = function () {
    window.plugins.socialsharing.share(null, $scope.blog.title, $scope.blog.thumbnail, $scope.blog.url)
  }

  // // this is the complete list of currently supported params you can pass to the plugin (all optional)
  // var options = {
  //   message: 'share this', // not supported on some apps (Facebook, Instagram)
  //   subject: 'the subject', // fi. for email
  //   files: ['', ''], // an array of filenames either locally or remotely
  //   url: 'https://www.website.com/foo/#bar?a=b',
  //   chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
  // }
  //
  // var onSuccess = function(result) {
  //   console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
  //   console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  // }
  //
  // var onError = function(msg) {
  //   console.log("Sharing failed with message: " + msg);
  // }
  //
  // $scope.share = function share (){
  //   window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
  // }

});
