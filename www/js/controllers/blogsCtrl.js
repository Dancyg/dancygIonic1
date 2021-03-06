controllers.controller("BlogCtrl", function ($scope, $http, $ionicPopup, Loading, $sce, $ionicPopover, Categories,  $ionicScrollDelegate, $rootScope, Alert, $ionicPlatform, $state) {
  Loading.start();

  $scope.page = 1;
  $scope.lastPage = 2;
  $scope.currentCategoryId = '';

  $rootScope.checkBlogsHeight && $rootScope.checkBlogsHeight();
  $scope.loadBlogs = function (page, blogs, catId){
    Categories.get(function (categories) {
      $scope.categories = categories;
    });

    $scope.blogs = blogs || {};
    $rootScope.blogsGlobal = $rootScope.blogsGlobal || {};


    if(catId || catId === ''){
      $scope.currentCategoryId = catId;
    }
    var url = BLOGS + page + '&cat=' + $scope.currentCategoryId;
    $http.get(url)
      .then(
        function (res) {
          $scope.offlineMode = false;
          $ionicPlatform.ready(function () {
            localforage.removeItem('blogsGlobal')
              .then(function () {
                res.data.posts.forEach(function (blog, i) {
                  var imgUrl = blog.thumbnail ?
                    blog.thumbnail :
                    blog.attachments.length && blog.attachments[0].images && blog.attachments[0].images.medium ?
                      blog.attachments[0].images.medium.url :
                      "";

                  $rootScope.blogsGlobal[blog.id] = {
                    id: blog.id,
                    thumbnail: imgUrl,
                    title: blog.title,
                    content: blog.content,
                    url: blog.url
                  };

                  $scope.blogs[1 - 1 / blog.id] = {
                    id: blog.id,
                    thumbnail: imgUrl,
                    title: function () {
                      return $sce.trustAsHtml(blog.title)
                    },
                    content: blog.content
                  }

                });
                localforage.setItem('blogsGlobal', $rootScope.blogsGlobal);
                Loading.hide();

                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.lastPage = res.data.pages;
                $rootScope.checkBlogsHeight && $rootScope.checkBlogsHeight();
              });
          });
        },
        function (res) {
          $scope.offlineMode = true;
          $ionicPlatform.ready(function () {
            $rootScope.checkBlogsHeight && $rootScope.checkBlogsHeight();
            Loading.hide();
            localforage.getItem('blogsGlobal')
              .then(function (blogsGlobal) {
                Alert.success('Offline mode', 'Blogs that were saved during previous session are available.');
                $rootScope.blogsGlobal = blogsGlobal;
                Object.keys($rootScope.blogsGlobal).reverse().forEach(function (key, i) {
                  var blog = $rootScope.blogsGlobal[key];

                  $scope.blogs[1 - 1 / blog.id] = {
                    id: blog.id,
                    thumbnail: 'img/offline_mode.jpg',
                    title: function () {
                      return $sce.trustAsHtml(blog.title)
                    },
                    content: blog.content
                  };

                  $rootScope.blogsGlobal[key].thumbnail = 'img/offline_mode.jpg'
                });

              })
              .catch(function (error) {
                Alert.failed('Error', 'Please check your internet connection.')
              });

            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });
  };

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

});
