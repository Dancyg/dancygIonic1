var LOGIN      = "https://members.bettinggods.com/api/login/";
var BLOGS      = "https://bettinggods.com/api/get_recent_posts/?page=";
var BLOG       = "https://bettinggods.com/api/get_post/?id=";

var controllers = angular.module('starter.controllers', ['ngSanitize'])


  .controller("TipstersCtrl", function ($scope, $http, $ionicPopup) {
    // $http.get("https://members.bettinggods.com/api/get_categories").then(function (res) {
        //   alert(JSON.stringify(res.data));
        // })
  });
