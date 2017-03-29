controllers.controller("BlogCtrl", function ($ionicPush, $scope, $http, $ionicPopup, Loading, $sce, $ionicPopover, Categories,  $ionicScrollDelegate, $rootScope, Alert) {
  Loading.start();

  $scope.page = 1;
  $scope.lastPage = 2;
  $scope.currentCategoryId = '';


  $scope.loadBlogs = function (page, blogs, catId){
    $scope.blogs = blogs || {};
    $rootScope.blogsGlobal = $rootScope.blogsGlobal || {};


    if(catId || catId === ''){
      $scope.currentCategoryId = catId;
    }
    var url = BLOGS + page + '&cat=' + $scope.currentCategoryId;
    $http.get(url)
      .then(
        function (res) {
          Loading.hide();

          res.data.posts.forEach(function (blog, i) {
            var imgUrl = blog.thumbnail ? blog.thumbnail : blog.attachments.length ? blog.attachments[0].images.medium.url : "";

            $rootScope.blogsGlobal[blog.id] = {
              id         : blog.id,
              thumbnail  : imgUrl,
              title      : blog.title,
              content    : blog.content,
              url        : blog.url
            };

            $scope.blogs[1 - 1 / blog.id] = {
              id         : blog.id,
              thumbnail  : imgUrl,
              title      : function () { return $sce.trustAsHtml(blog.title) },
              content    : blog.content
            }

          });
          localforage.setItem('blogsGlobal', $rootScope.blogsGlobal);

          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.lastPage = res.data.pages;

        },
        function (res) {
          Loading.hide();

          localforage.getItem('blogsGlobal')
            .then(function (blogsGlobal) {
              alert(JSON.stringify(blogsGlobal));
              Alert.success('Offline mode', 'Blogs that have been save during previous session are available.');
              $rootScope.blogsGlobal = blogsGlobal;
              $rootScope.blogsGlobal.forEach(function (blog, i) {

                $scope.blogs[1 - 1 / blog.id] = {
                  id         : blog.id,
                  thumbnail  : 'img/offline_mode.jpg',
                  title      : function () { return $sce.trustAsHtml(blog.title) },
                  content    : blog.content
                }
              });
            })
            .catch(function (error) {
              Alert.failed('Error', 'Please check your internet connection.')
            });

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

  $scope.$on('cloud:push:notification', function(event, data) {
    var msg   = data.message;
    Alert.pushContent(msg.title, msg.text);
  });

});
