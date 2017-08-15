angular.module('starter', ['ionic', 'ionic.cloud', 'starter.controllers', 'starter.services', 'ngCordova', 'ui.router'])
  .run(function ($ionicPlatform, $rootScope, $state, $ionicHistory, $ionicPush, $http, Alert, Loading, $ionicSideMenuDelegate) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar && document.getElementsByClassName('platform-android').length) {
        StatusBar.hide();
      }

      //define local db
      localforage.defineDriver(window.cordovaSQLiteDriver).then(function () {
        return localforage.setDriver([
          // Try setting cordovaSQLiteDriver if available,
          window.cordovaSQLiteDriver._driver,
          // otherwise use one of the default localforage drivers as a fallback.
          // This should allow you to transparently do your tests in a browser
          localforage.INDEXEDDB,
          localforage.WEBSQL,
          localforage.LOCALSTORAGE
        ]);
      })
        .catch(function (err) {
          Loading.hide();
          // alert(err);
        });

      $rootScope.token        = window.localStorage.getItem('token');
      $rootScope.device_token = '';

      $rootScope.updateDeviceTokenForBlogs = function () {

        var settingsData = JSON.parse(window.localStorage.getItem('settingsData'));
        var data         = {
          api_call    : true,
          device_token: $rootScope.device_token,
          status      : settingsData ?
            settingsData.blogNotif ? 1 : 0 :
            1
        };

        var formData = new FormData();
        for (var key in data) {
          formData.append(key, data[key]);
        }
        // alert(JSON.stringify(data));
        $http.post(UPDATE_DEVICE_TOKEN, formData)
          .then(function (resp) {
            // alert(JSON.stringify(resp))
          })
          .catch(function (err) {
            // alert(JSON.stringify(err))
          })
      };

      $rootScope.updateDeviceTokenForTips = function () {

        var settingsData = JSON.parse(window.localStorage.getItem('settingsData'));
        var data         = {
          api_call    : true,
          device_token: $rootScope.device_token,
          token       : $rootScope.token,
          status      : settingsData ?
            settingsData.tipNotif ? 1 : 0 :
            1
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
          .catch(function (err) {
            // alert(JSON.stringify(err))
          })
      };

      $rootScope.register = function (showErrAlert) {
        $ionicPush.register()
          .then(function (t) {
            return $ionicPush.saveToken(t);
          })
          .then(function (t) {
            $rootScope.device_token = t.token;
            // alert(JSON.stringify(t.token));
            $rootScope.updateDeviceTokenForBlogs();

            if ($rootScope.token) {
              $rootScope.updateDeviceTokenForTips();
            }

          })
          .catch(function (err) {
            if (showErrAlert) {
              Alert.failed('Push Registration Failed', 'Couldn\'t register app for push notifications.' + JSON.stringify(err));
            }
          });
      };

      $rootScope.register();

      $rootScope.unregister = function (showErrAlert) {
        $ionicPush.unregister()
          .catch(function () {
            if (showErrAlert) {
              Loading.hide();
              Alert.failed('Failed to unregister', 'Device was not unregistered.');
            }
          })
      };

      $rootScope.checkBlogsHeight = function () {
        var footer = window.document.getElementsByClassName('tab-nav');
        var tabs   = window.document.getElementsByClassName('tabs');
        var blogs  = window.document.getElementsByClassName('blogs');

        if (!$rootScope.token && !window.document.getElementsByClassName('platform-android').length) {
          footer.length && Array.prototype.forEach.call(footer, function (el) {
            el.style.height = '0px'
          });
          tabs.length && Array.prototype.forEach.call(tabs, function (el) {
            el.style.height = '0px'
          });
          blogs.length && Array.prototype.forEach.call(blogs, function (el) {
            el.style.height = 'calc(100vh - 43px)'
          });
        } else {
          footer.length && Array.prototype.forEach.call(footer, function (el) {
            el.style.height = '49px'
          });
          tabs.length && Array.prototype.forEach.call(tabs, function (el) {
            el.style.height = '49px'
          });
          blogs.length && Array.prototype.forEach.call(blogs, function (el) {
            el.style.height = 'auto'
          });
        }
      }

        $rootScope.checkOneBlogHeight = function () {
          var blogContainerCustom = window.document.getElementsByClassName('blog-container-custom');

          if (!$rootScope.token && !window.document.getElementsByClassName('platform-android').length) {
            blogContainerCustom.length && Array.prototype.forEach.call(blogContainerCustom, function (el) {
              el.style.height = 'calc(100vh - 43px)';
            });
          } else {
            blogContainerCustom.length && Array.prototype.forEach.call(blogContainerCustom, function (el) {
              el.style.height = 'auto';
            });
          }
        };
        $rootScope.checkBlogsHeight();

        $rootScope.logout = function () {
          $rootScope.showMenu();
          var data = {
            token       : $rootScope.token,
            device_token: $rootScope.device_token,
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
              console.log('$rootScope.token', $rootScope.token);

              var currentTab = $ionicHistory.currentStateName();
              $rootScope.unregister(true);
              if (currentTab === 'sidemenu.tab.tipsters' || currentTab === 'sidemenu.tab.tipsters1' || currentTab === 'sidemenu.tab.tipsters2') {
                // $state.go('sidemenu.tab.buy-tipsters')
                $state.go('sidemenu.tab.blogs');
              }
              $rootScope.checkBlogsHeight();
              Loading.hide();
            })
            .catch(function (error) {
              window.localStorage.removeItem('token');
              $rootScope.token = window.localStorage.getItem('token');
              var currentTab   = $ionicHistory.currentStateName();
              $rootScope.unregister();
              if (currentTab === 'sidemenu.tab.tipsters' || currentTab === 'sidemenu.tab.tipsters1' || currentTab === 'sidemenu.tab.tipsters2') {
                $rootScope.checkBlogsHeight();
                // $state.go('sidemenu.tab.buy-tipsters')
                $state.go('sidemenu.tab.blogs');
              }
              $rootScope.checkBlogsHeight();
              Loading.hide();
            });
        };

        $rootScope.checkIfAndroid = function (callback) {
          setTimeout(function () {
            if (window.document.getElementsByClassName('platform-android').length) {
              callback && callback();
            }
          }, 10)
        };

        // var scrollContent = document.getElementsByClassName('scroll-content')[0];
        // console.log(scrollContent);
        // scrollContent.style.heigh = '8px';


        $rootScope.setEventOnA = function setEventOnA() {
          $rootScope.checkIfAndroid(function () {
            $ionicPlatform.ready(function onDeviceReady() {
              var aList = window.document.getElementById('blogContent').getElementsByTagName('a');
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

        $rootScope.showMenu = function () {
          $ionicSideMenuDelegate.toggleLeft();
        };

      }
      );
  })
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $compileProvider, $ionicCloudProvider) {
    $ionicConfigProvider.navBar.alignTitle("center"); //Places them at the bottom for all OS
    $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
    $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS

    // $ionicConfigProvider.scrolling.jsScrolling(false);

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post   = {};
    $httpProvider.defaults.headers.put    = {};
    $httpProvider.defaults.headers.patch  = {};

    // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);

    $ionicCloudProvider.init({
      "core": {
        "app_id": "2ada1795"
      },
      "push": {
        "sender_id"   : 716852556262,
        "pluginConfig": {
          "ios"    : {
            "badge": true,
            "sound": true
          },
          "android": {
            "iconColor": "#343434",
            "sound"    : true,
            "vibrate"  : true
          }
        }
      }
    });

    $stateProvider
      .state('sidemenu', {
        url     : '/sidemenu',
        abstract: true,
        views   : {
          "body": { templateUrl: "templates/side-menu.html" }
        }
      })
      .state('sidemenu.settings', {
        url  : '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller : 'SettingsCtrl'
          }
        }
      })
      .state('sidemenu.login', {
        url  : '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller : 'LoginCtrl'
          }
        }
      })
      .state('sidemenu.signup', {
        url  : '/signup',
        views: {
          'menuContent': {
            templateUrl: 'templates/signup.html',
            controller : 'SignupCtrl'
          }
        }
      })
      .state('sidemenu.changePassword', {
        url  : '/change-password',
        views: {
          'menuContent': {
            templateUrl: 'templates/change-password.html',
            controller : 'ChangePassCtrl'
          }
        }
      })
      // setup an abstract state for the tabs directive

      .state('sidemenu.tab', {
        url  : '/tab',
        views: {
          'menuContent': {
            templateUrl: 'templates/tabs.html'
          }
        }
      })
      // Each tab has its own nav history stack:
      .state('sidemenu.tab.blogs', {
        url  : '/home',
        views: {
          'tab-home': {
            templateUrl: 'templates/tab-blogs.html',
            controller : 'BlogCtrl'
          }
        }
      })
      .state('sidemenu.tab.blog', {
        url  : '/home/:blogID',
        views: {
          'tab-home': {
            templateUrl: 'templates/blog.html',
            controller : 'OneBlogCtrl'
          }
        }
      })
      //BUY TIPSTERS
      .state('sidemenu.tab.buy-tipsters', {
        url  : '/buy-tipsters',
        views: {
          'tab-buy-tipsters': {
            templateUrl: 'templates/tab-buy-tipsters.html',
            controller : 'BuyTipstersCtrl'
          }
        }
      })
      //OWN TIPSTERS
      .state('sidemenu.tab.tipsters', {
        url  : '/tipsters',
        views: {
          'tab-tipsters': {
            templateUrl: 'templates/tab-my-tipsters.html',
            controller : 'MyTipstersCtrl'
          }
        }
      })
      .state('sidemenu.tab.tipsters1', {
        url  : '/tipst/:recent',
        views: {
          'tab-tipsters': {
            templateUrl: 'templates/tab-my-tipster.html',
            controller : 'MyTipsterCtrl'
          }
        }
      })
      .state('sidemenu.tab.tipsters2', {
        url  : '/tip/:id',
        views: {
          'tab-tipsters': {
            templateUrl: 'templates/tab-my-tipster-tip.html',
            controller : 'OneTipsterCtrl'
          }
        }
      })
      //SUPPORT
      .state('sidemenu.support', {
        url  : '/support',
        views: {
          'menuContent': {
            templateUrl: 'templates/tab-support.html',
            controller : 'SupportCtrl'
          }
        }
      })
      //RESPONSIBILITY
      .state('sidemenu.rules', {
        url  : '/rules',
        views: {
          'menuContent': {
            templateUrl: 'templates/tab-rules.html',
            controller : 'ResponsibleCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('sidemenu/tab/home');

  });
