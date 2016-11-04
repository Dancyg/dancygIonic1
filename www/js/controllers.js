var LOGIN = "https://members.bettinggods.com/api/login";
var BLOGS = "https://bettinggods.com/api/get_recent_posts/";
var BLOG = "https://bettinggods.com/api/get_post/?id=";

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
  .controller("BlogCtrl", function ($scope, $http, $ionicPopup, Loading, $sce) {
    $scope.domParser = new DOMParser();
    Loading.start();

    $http.post(BLOGS, {count: 3})
      .then(
        function (res) {
          Loading.hide();
          $scope.blogs = res.data.posts.map(function (blog, i) {
            return {
              id:blog.id,
              thumbnail: blog.thumbnail_images.medium.url,
              title: function () {
                return $sce.trustAsHtml(blog.title);
              }
            }
          });
          console.log(res.data)

        },
        function (res) {
          Loading.hide();
          console.log("error", res.data);
        }
      );


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
