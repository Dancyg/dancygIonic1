var CATEGORIES = "https://bettinggods.com/api/get_categories";

angular.module('starter.services', [])

.factory('Loading', function ($ionicLoading) {

  return {

    start: function () {
      $ionicLoading.show({
        template:'<ion-spinner icon="lines" class="custom-spiner"></ion-spinner>'
      });
    },

    hide:function () {
      $ionicLoading.hide();
    }
  }

}).factory('Categories', function ($http) {

  return {
    get: function (callback) {
      $http.get(CATEGORIES)
        .then(
          function (res) {
            callback(res.data.categories);
          },
          function (res) {
          }
        );
    }
  }

}).factory('Alert', function ($ionicPopup) {

  return {
    failed: function(header, text) {
      var alertPopup = $ionicPopup.alert({
        title: header,
        template: text,
        buttons: [
          {
            text: '<b>Ok</b>',
            type: 'button-assertive'
          }
        ]
      });
    },
    success: function(header, text) {
      var alertPopup = $ionicPopup.alert({
        title: header,
        template: text,
        buttons: [
          {
            text: '<b>Ok</b>',
            type: 'button-balanced'
          }
        ]
      });
    }
  }

});
