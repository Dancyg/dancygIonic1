controllers.controller("BlogCtrl", function ($scope, $http, $ionicPopup, Loading, $sce, $ionicPopover, Categories,  $ionicScrollDelegate, $rootScope, Alert) {
  Loading.start();

  $scope.page = 1;
  $scope.lastPage = 2;
  $scope.currentCategoryId = '';

  $scope.loadBlogs = function (page, blogs, catId){
    $scope.blogs = blogs || {};


    if(catId || catId === ''){
      $scope.currentCategoryId = catId;
    }
    var url = BLOGS + page + '&cat=' + $scope.currentCategoryId;
    $http.get(url)
      .then(
        function (res) {
          Loading.hide();

          res.data.posts.forEach(function (blog, i) {
            $scope.blogs[1 - 1 / blog.id] = {
              id         : blog.id,
              thumbnail  : blog.thumbnail_images.medium.url,
              title      : function () { return $sce.trustAsHtml(blog.title) }
            }
          });

          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.lastPage = res.data.pages;

        },
        function (res) {
          Loading.hide();
          console.log("error", res.data);
          Alert.failed('Error', 'Please check your internet connection.')
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      );
  }

  $scope.loadBlogs(1);

  $scope.loadMoreBlogs = function () {
    $scope.loadBlogs(++$scope.page, $scope.blogs)
  }

  $scope.currentCategory = 'All';
  $scope.chooseCategory = function (name, id) {
    $scope.currentCategory = name;
    $scope.blogs = {};
    $scope.page = 1
    $scope.loadBlogs($scope.page, $scope.blogs, id);
    Loading.start();
  };

  Categories.get(function (categories) {
    $scope.categories = categories;
  });

  $rootScope.slideHeader = false;
  $rootScope.slideHeaderPrevious = 0;

  $scope.notShown = true;

  $scope.showCategories = function () {
    $scope.notShown = !$scope.notShown;
  }

  $scope.onScrollHide = function() {
    var top = $ionicScrollDelegate.$getByHandle('small').getScrollPosition().top;
    var start = 0;
    var threshold = 50;

    if(top - start > threshold) {
      $rootScope.slideHeader = true;
    } else {
      $rootScope.slideHeader = false;
    }
    if ($rootScope.slideHeaderPrevious >= top - start) {
      $rootScope.slideHeader = false;
    }
    $rootScope.slideHeaderPrevious = top - start;
    $rootScope.$apply();
  };



})
