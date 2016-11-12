var LOGIN      = "https://members.bettinggods.com/api/login";
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
      Loading.start();
      var formData = new FormData();
      for (var key in $scope.data) {
        formData.append(key, $scope.data[key]);
      }

      $http.post(LOGIN, formData)
        .then(
          function (res){
            console.log(res);
            Loading.hide();
            $state.go("tab.home");

        },
          function (res) {
            var text = res.data.error;
            if(!text){
              text = "Please check your credentials and network connection."
            }
            Loading.hide();
            $scope.alert(text);
          }
        );
    }

  })
  .controller("TipstersCtrl", function ($scope, $http, $ionicPopup) {
    // $http.get("https://members.bettinggods.com/api/get_categories").then(function (res) {
        //   alert(JSON.stringify(res.data));
        // })
  })
  .controller("BlogCtrl", function ($scope, $http, $ionicPopup, Loading, $sce, $ionicPopover, Categories) {

    $scope.domParser = new DOMParser();
    Loading.start();

    $scope.page = 1;
    $scope.lastPage = '';
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
            console.log($scope.blogs)

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
      $scope.currentCategory = name;
      $scope.blogs = {};
      $scope.page = 1
      $scope.loadBlogs($scope.page, $scope.blogs, id);
      $scope.closePopover();
      Loading.start();
    };

    Categories.get(function (categories) {
      $scope.categories = categories;

      var template = '<ion-popover-view class="popover-custom">' +
        '<ion-content> ' +
        '<div class="category-item">' +
        '<h4 ng-click="chooseCategory(\'All\', \' \')">All</h4>' +
        '</div> ' +
        '<div ng-repeat="cat in categories" class="category-item" ng-click="chooseCategory(cat.title, cat.id)">' +
          '<h4 >{{cat.title}}</h4>' +
        '</div> ' +
        '</ion-content> ' +
        '</ion-popover-view>';



      $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
      });

      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
    });




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

  });
