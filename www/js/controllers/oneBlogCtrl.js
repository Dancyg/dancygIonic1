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

});
