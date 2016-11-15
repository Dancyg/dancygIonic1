var LOGIN      = "https://members.bettinggods.com/api/login/";
var BLOGS      = "https://bettinggods.com/api/get_recent_posts/?page=";
var BLOG       = "https://bettinggods.com/api/get_post/?id=";

angular.module('starter.controllers', ['ngSanitize'])

  .controller("LoginCtrl", function ($scope, $http, $ionicPopup, $state, Loading ) {


    $scope.data={};
    $scope.data.name = "";
    $scope.data.password = "";
    $scope.data.remember = false;

    $scope.alert = function(text) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login Failed',
        template: text,
        buttons: [
          {
            text: '<b>Ok</b>',
            type: 'button-assertive'
          }
        ]
      });
    };

    $scope.submit = function () {
      // Loading.start();
      var formData = new FormData();
      for (var key in $scope.data) {
        formData.append(key, $scope.data[key]);
      }

      $http.post(LOGIN, formData)
        .then(
          function (res){

            // Loading.hide();
            // $state.go("tab.home");
            console.log(JSON.stringify(res.data.status));

        },
          function (res) {
          console.log(JSON.stringify(res));
            // var text = res.data.error;
            // if(!text){
            //   text = "Please check your credentials and network connection."
            // }
            // Loading.hide();
            // $scope.alert(text);
          }
        );
    }

  })
  .controller("TipstersCtrl", function ($scope, $http, $ionicPopup) {
    // $http.get("https://members.bettinggods.com/api/get_categories").then(function (res) {
        //   alert(JSON.stringify(res.data));
        // })
  })
  .controller("BlogCtrl", function ($scope, $http, $ionicPopup, Loading, $sce, $ionicPopover, Categories,  $ionicScrollDelegate, $rootScope) {

    $scope.domParser = new DOMParser();
    Loading.start();

    $scope.page = 1;
    $scope.lastPage = 2;
    $scope.currentCategoryId = '';

    $scope.loadBlogs = function (page, blogs, catId){
      $scope.blogs = blogs || {};


      if(catId){
        $scope.currentCategoryId = catId;
      }
      var url = BLOGS + page + '&cat=' + $scope.currentCategoryId;
      $http.post(url, {count: 3})
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
            console.log($scope.lastPage )

          },
          function (res) {
            Loading.hide();
            console.log("error", res.data);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        );
    }

    $scope.loadBlogs($scope.page);

    $scope.loadMoreBlogs = function () {
      $scope.loadBlogs(++$scope.page, $scope.blogs)
    }

    $scope.currentCategory = 'All';
    $scope.chooseCategory = function (name, id) {
      $scope.notShown = !$scope.notShown;
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



  })
  .controller("OneBlogCtrl", function ($scope, Loading, $stateParams, $http, $sce) {

      Loading.start();
      var url = BLOG + $stateParams.blogID;
      $http.get(url)
        .then(
          function (res) {
            Loading.hide();
            console.log(res.data)
            $scope.blog = res.data.post;
            $scope.content = function() {
              return $sce.trustAsHtml(res.data.post.content);
            };
          },
          function (res) {
            Loading.hide();
            console.log("error", res.data);
          }
        );

  })
  .directive('scrollWatch', function($rootScope) {
  return function(scope, elem, attr) {
    var start = 0;
    var threshold = 50;

    elem.bind('scroll', function(e) {
      if(e.detail.scrollTop - start > threshold) {
        $rootScope.slideHeader = true;
      } else {
        $rootScope.slideHeader = false;
      }
      if ($rootScope.slideHeaderPrevious >= e.detail.scrollTop - start) {
        $rootScope.slideHeader = false;
      }
      $rootScope.slideHeaderPrevious = e.detail.scrollTop - start;
      $rootScope.$apply();
    });
  };
});
