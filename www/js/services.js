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

});
