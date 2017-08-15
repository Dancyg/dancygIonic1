var LOGIN               = "https://members.bettinggods.com/api/login/";
var BLOGS               = "https://bettinggods.com/api/get_recent_posts/?page=";
var BLOG                = "https://bettinggods.com/api/get_post/?id=";
var EMAIL_CHECK         = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var UPDATE_DEVICE_TOKEN = 'https://bettinggods.com/api/register_device_token';

var controllers = angular.module('starter.controllers', ['ngSanitize'])


  .controller("TipstersCtrl", function ($scope, $http, $ionicPopup) {
    // $http.get("https://members.bettinggods.com/api/get_categories").then(function (res) {
    //   alert(JSON.stringify(res.data));
    // })
  });
// sudo ln -s "/Applications/Xcode-beta.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport/10.3 (14E5277a)/" "/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport"
