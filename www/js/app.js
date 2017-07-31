var bet = angular.module('starter', ['ionic', 'ionic.cloud', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $state, $ionicHistory, $ionicPush, $http, Alert, Loading, $q) {
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

    $rootScope.token     = window.localStorage.getItem('token');
    $rootScope.pushToken = {};

    $rootScope.updateDeviceToken = function () {
      var data= {
        api_call    : true,
        device_token: $rootScope.pushToken,
        token       : $rootScope.token
      };

      var formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key]);
      }
      // alert(JSON.stringify(data));
      $http.post(LOGIN, formData)
        .then(function (resp) {
          // alert(JSON.stringify(resp))
        })
        .catch(function(err){
          // alert(JSON.stringify(err))
        })
    };

    $rootScope.register = function(showErrAlert){
      $ionicPush.register()
        .then(function(t) {
          return $ionicPush.saveToken(t);
        })
        .then(function(t) {
          $rootScope.pushToken = t.token;
          // alert(JSON.stringify(t.token));

          if ($rootScope.token){
            $rootScope.updateDeviceToken();
          }
        })
        .catch(function (err) {
          if (showErrAlert) {
            Alert.failed('Push Registration Failed', 'Couldn\'t register app for push notifications.' + JSON.stringify(err));
          }
        });
    };

    $rootScope.register(true);

    $rootScope.unregister = function (showErrAlert) {
      $ionicPush.unregister()
        .catch(function () {
          if (showErrAlert) {
            Loading.hide();
            Alert.failed('Failed to unregister', 'Device was not unregistered.');
          }
        })
    };

    $rootScope.historyBack = function () {
      if (history.previous === undefined){

        $state.go('tab.blogs')
      } else {
        history.back()
      }
    }

    $rootScope.logout = function () {
      var data = {
        token       : $rootScope.token,
        device_token: $rootScope.pushToken,
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
          $rootScope.unregister(true);
          if (currentTab === 'tab.tipsters' || currentTab === 'tab.tipsters1'|| currentTab === 'tab.tipsters2') {
            // $state.go('tab.buy-tipsters')
            $state.go('tab.blogs')
          }
          Loading.hide();
        })
        .catch(function (error) {
          window.localStorage.removeItem('token');
          $rootScope.token = window.localStorage.getItem('token');
          var currentTab = $ionicHistory.currentStateName();
          $rootScope.unregister();
          if (currentTab === 'tab.tipsters' || currentTab === 'tab.tipsters1'|| currentTab === 'tab.tipsters2') {
            // $state.go('tab.buy-tipsters')
            $state.go('tab.blogs')
          }
          Loading.hide();
        });
    };
    //define local db
    localforage.defineDriver(window.cordovaSQLiteDriver).then(function() {
      return localforage.setDriver([
        // Try setting cordovaSQLiteDriver if available,
        window.cordovaSQLiteDriver._driver,
        // otherwise use one of the default localforage drivers as a fallback.
        // This should allow you to transparently do your tests in a browser
        localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE
      ]);
    }).catch(function(err) {
      Loading.hide();
      alert(err);
    });

  });

  $rootScope.checkIfAndroid = function (callback){
    setTimeout(function () {
      if (document.getElementsByClassName('platform-android').length) {
        callback && callback();
      }
    }, 10)
  };


  $rootScope.setEventOnA = function setEventOnA() {
    $rootScope.checkIfAndroid( function () {
      $ionicPlatform.ready(function onDeviceReady() {
        var aList = document.getElementById('blogContent').getElementsByTagName('a');
        setTimeout(function () {
          console.log('android');
          angular.forEach(aList, function (el, i) {
            el.addEventListener('click', function (e) {
              var ref = cordova.InAppBrowser.open(e.target.href, '_blank', 'location=yes');
            })
          });
        }, 10);
      });
    })
  };

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
          "iconColor": "#343434",
          "sound": true,
          "vibrate": true
        }
      }
    }
  });


  $stateProvider

    .state('sidemenu', {
      url: '/sidemenu',
      abstract: true,
      templateUrl: 'templates/side-menu.html'
      // controller:'LoginCtrl'
    })

    .state('login', {
      url: '/login',
      views: {
        'menuContent' :{
          templateUrl: 'templates/login.html',
          controller:'LoginCtrl'
        }
      }
    })

    .state('settings', {
      url: '/settings',
      views: {
        'menuContent' :{
          templateUrl: 'templates/settings.html',
          controller:'SettingsCtrl'
        }
      }
    })

    .state('signup', {
      url: '/signup',
      views: {
        'menuContent' :{
          templateUrl: 'templates/signup.html',
          controller:'SignupCtrl'
        }
      }
    })

    // setup an abstract state for the tabs directive
    .state('sidemenu.tab', {
      url: '/tab',
      views: {
        'menuContent' :{
          templateUrl: 'templates/tabs.html'
        }
      }
    })

    // Each tab has its own nav history stack:

    .state('sidemenu.tab.blogs', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-blogs.html',
          controller: 'BlogCtrl'
        }
      }
    })
    .state('sidemenu.tab.blog', {
      url: '/sidemenu/tab/home/:blogID',
      views: {
        'tab-home': {
          templateUrl: 'templates/blog.html',
          controller: 'OneBlogCtrl'
        }
      }
    })
    //BUY TIPSTERS
    .state('sidemenu.tab.buy-tipsters', {
        url: '/sidemenu/tab/buy-tipsters',
        views: {
          'tab-buy-tipsters': {
            templateUrl: 'templates/tab-buy-tipsters.html',
            controller: 'BuyTipstersCtrl'
          }
        }
      })
    //OWN TIPSTERS
    .state('sidemenu.tab.tipsters', {
        url: '/tipsters',
        views: {
          'tab-tipsters': {
            templateUrl: 'templates/tab-my-tipsters.html',
            controller: 'MyTipstersCtrl'
          }
        }
      })
    .state('sidemenu.tab.tipsters1', {
        url: '/tipst/:recent',
        views: {
          'tab-tipsters': {
            templateUrl: 'templates/tab-my-tipster.html',
            controller: 'MyTipsterCtrl'
          }
        }
     })
    .state('sidemenu.tab.tipsters2', {
        url: '/tip/:id',
        views: {
          'tab-tipsters': {
            templateUrl: 'templates/tab-my-tipster-tip.html',
            controller: 'OneTipsterCtrl'
          }
        }
      })
      //SUPPORT
    .state('sidemenu.tab.support', {
        url: '/support',
        views: {
          'tab-support': {
            templateUrl: 'templates/tab-support.html',
            controller: 'SupportCtrl'
          }
        }
      })
    //RESPONSIBILITY
    .state('sidemenu.tab.rules', {
      url: '/rules',
      views: {
        'tab-rules': {
          templateUrl: 'templates/tab-rules.html',
          controller: 'ResponsibleCtrl'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('sidemenu/tab/home');

});
