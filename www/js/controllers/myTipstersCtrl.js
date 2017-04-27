var TIPSTERS_CATEGORIES = 'https://members.bettinggods.com/api/get_categories';

controllers.controller('MyTipstersCtrl', function ($scope, $http, $rootScope, Loading, $sce, $ionicPlatform, Alert, $state) {
  Loading.start();
  $scope.page = 1;
  $scope.lastPage = 2;

  $rootScope.getTips = function(page, tips){
    var header = {
      cookie   : $rootScope.token,
      api_call : true
    };
    var formData = new FormData();
    for (var key in header) {
      formData.append(key, header[key]);
    }

    $scope.tips = tips || {};
    $http.post(TIPSTERS_CATEGORIES, formData)
      .then(
        function (res) {
          res.data.categories.forEach(function (tip, i) {
            $scope.tips[1 - 1 / tip.id] = {
              id         : tip.id,
              thumbnail  : tip.image,
              title      : tip.title,
              description: tip.description
            }
          });
          $scope.lastPage = res.data.pages;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          Loading.hide();
        },
        function (res) {
          Loading.hide();
          var message = res.data && res.data.error && res.data.error || 'Please check your internet connection or login again';
          Alert.failed('Error', message);
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if (res.status === 401) {
            window.localStorage.removeItem('token');
            $rootScope.token = window.localStorage.getItem('token');
            $state.go('login')
          }
        }
      );
  };

  $scope.getTips(1);

  $rootScope.getTipsOnTap = function () {
    if ( Object.keys($scope.tips).length === 0){
      Loading.start();
      $scope.getTips(1)
    }
  }

  $scope.loadMoreTips = function () {
    $scope.getTips(++$scope.page, $scope.tips);
  };

});
