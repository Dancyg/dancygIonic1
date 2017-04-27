var CATEGORIES = "https://bettinggods.com/api/get_categories";

angular.module('starter.services', [])

.factory('Loading', function ($ionicLoading, $rootScope) {

  return {

    start: function () {
      $rootScope.isLoading = true;
      $ionicLoading.show({
        template:'<ion-spinner icon="lines" class="custom-spiner"></ion-spinner>'
      });
    },

    hide:function () {
      $rootScope.isLoading = false;
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
    },
    pushContent: function (header, text) {
      return $ionicPopup.confirm({
        title: header,
        template: text,
        buttons: [
          {
            text: 'Cancel' ,
            onTap: function(e) {
              return false;
            }
          },
          {
            text: '<b>CHECK</b>',
            type: 'button-dark',
            onTap: function(e) {
              return true;
          }
          }
        ]
      })
    }
  }

}).directive('focus', function() {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {

        element.bind('keydown', function(e) {
          var code = e.keyCode || e.which;
          if (code === 13) {
            e.preventDefault();
            var pageElements = document.querySelectorAll('.logins'),
              element = e.srcElement,
              focusNext = false,
              len = pageElements.length;
            console.log(pageElements)
            for (var i = 0; i < len; i++) {
              var elem = pageElements[i];
              if (focusNext) {
                if (elem.style.display !== 'none') {
                  elem.focus();
                  break;
                }
              } else if (elem === e.srcElement) {
                focusNext = true;
              }
            }
          }
        });
      }
    }
  });
