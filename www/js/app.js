// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var bet = angular.module('starter', ['ionic', 'ionic.cloud', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $state, $ionicHistory, $ionicPush, $http, Alert, Loading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.hide();
    }

    $rootScope.token = window.localStorage.getItem('token');
    $rootScope.pushToken = { t: '' };

    $ionicPush.register().then(function(t) {
      return $ionicPush.saveToken(t);
    }).then(function(t) {
      $rootScope.pushToken.t = t.token;
    })
      .catch(function (err) {
        Alert.failed('Push Failed', 'Couldn\'t register app for push notifications' )
      });

    $rootScope.logout = function () {
      var data = {
        token       : $rootScope.token,
        device_token: $rootScope.pushToken.t,
        api_call    : true
      };

      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }
      Loading.start();
      $http.post('https://members.bettinggods.com/api/logout/', formData)
        .then(function () {
          window.localStorage.removeItem('token');
          $rootScope.token = window.localStorage.getItem('token');
          var currentTab = $ionicHistory.currentStateName();
          if (currentTab === 'tab.tipsters' || currentTab === 'tab.tipsters1'|| currentTab === 'tab.tipsters2') {
            // $state.go('tab.buy-tipsters')
            $state.go('tab.blogs')
          }
          Loading.hide();
        })
        .catch(function (error) {
          Loading.hide();
          Alert.failed('Logout Failed', 'Please check the internet connection')
        });
    };


  });
})

.config(function( $stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $compileProvider, $ionicCloudProvider) {
  $ionicConfigProvider.navBar.alignTitle("center"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS

  // $ionicConfigProvider.scrolling.jsScrolling(false);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};

  // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);

  $ionicCloudProvider.init({
    "core": {
      "app_id": "2ada1795"
    },
    "push": {
      "sender_id": 716852556262,
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#343434"
        }
      }
    }
  });


  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller:'LoginCtrl'
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller:'SignupCtrl'
    })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.blogs', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-blogs.html',
        controller: 'BlogCtrl'
      }
    }
  })
    .state('tab.blog', {
    url: '/home/:blogID',
    views: {
      'tab-home': {
        templateUrl: 'templates/blog.html',
        controller: 'OneBlogCtrl'
      }
    }
  })
//BUY TIPSTERS
  .state('tab.buy-tipsters', {
      url: '/buy-tipsters',
      views: {
        'tab-buy-tipsters': {
          templateUrl: 'templates/tab-buy-tipsters.html',
          controller: 'BuyTipstersCtrl'
        }
      }
    })
    //OWN TIPSTERS
  .state('tab.tipsters', {
      url: '/tipsters',
      views: {
        'tab-tipsters': {
          templateUrl: 'templates/tab-my-tipsters.html',
          controller: 'MyTipstersCtrl'
        }
      }
    })
  .state('tab.tipsters1', {
      url: '/tipst/:recent',
      views: {
        'tab-tipsters': {
          templateUrl: 'templates/tab-my-tipster.html',
          controller: 'MyTipsterCtrl'
        }
      }
    })
  .state('tab.tipsters2', {
      url: '/tip/:id',
      views: {
        'tab-tipsters': {
          templateUrl: 'templates/tab-my-tipster-tip.html',
          controller: 'OneTipsterCtrl'
        }
      }
    })
    //SUPPORT
  .state('tab.support', {
      url: '/support',
      views: {
        'tab-support': {
          templateUrl: 'templates/tab-support.html',
          controller: 'SupportCtrl'
        }
      }
    })
//RESPONSIBILITY
  .state('tab.rules', {
    url: '/rules',
    views: {
      'tab-rules': {
        templateUrl: 'templates/tab-rules.html',
        controller: 'ResponsibleCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
