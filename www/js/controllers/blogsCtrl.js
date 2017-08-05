controllers.controller("BlogCtrl", function ($ionicPush, $scope, $http, $ionicPopup, Loading, $sce, $ionicPopover, Categories,  $ionicScrollDelegate, $rootScope, Alert, $ionicPlatform, $state) {
  Loading.start();

  $scope.page = 1;
  $scope.lastPage = 2;
  $scope.currentCategoryId = '';


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
            localforage.clear()
              .then(function () {
                res.data.posts.forEach(function (blog, i) {
                  var imgUrl = blog.thumbnail ? blog.thumbnail : blog.attachments.length && blog.attachments[0].images.medium ? blog.attachments[0].images.medium.url : "";

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
              });
          });
        },
        function (res) {
          $scope.offlineMode = true;
          $ionicPlatform.ready(function () {

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

  $rootScope.routeOnPush = function (payload) {
    if (payload.type === 'tip') {
      var timerId = setTimeout(function tick() {

        if (!$rootScope.tipsList) {
          timerId = setTimeout(tick, 1000);
        }
        if (!$rootScope.isLoading) {
          Loading.start()
        }
        if($rootScope.tipsList ){
          Loading.hide()
        }
      }, 1000);
      $state.go('sidemenu.tab.tipsters1', { recent: payload.id });
    } else {
      $state.go('sidemenu.tab.blog', { blogID: payload.id })
    }
  };

  $scope.$on('cloud:push:notification', function(event, data) {
    var msg   = data.message;
    var payload = msg.payload;
    var app     = msg.app;
    if (app.closed){
      $rootScope.routeOnPush(payload);
    } else {
      Alert.pushContent(msg.title, msg.text)
        .then(function (resp) {
          if (resp) {
            $rootScope.routeOnPush(payload);
          }
        });
    }
  });

});
