var TIPSTERS_CATEGORIES = 'https://members.bettinggods.com/api/get_categories';

controllers.controller('MyTipstersCtrl', function ($scope, $http, $rootScope, Loading, $sce, $ionicPlatform,Alert) {
  Loading.start();
  $scope.page = 1;
  $scope.lastPage = 2;

  $scope.getTips = function(page, tips){
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
          console.log(res);
          res.data.categories.forEach(function (tip, i) {
            $scope.tips[1 - 1 / tip.id] = {
              id         : tip.id,
              thumbnail  : tip.image,
              title      : tip.title,
              description: tip.description
            }
          });
          $scope.lastPage = res.data.pages;
          console.log(res);
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          Loading.hide();

        },
        function (res) {
          Loading.hide();
          Alert.failed('Error', 'Please check your internet connection.');
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      );
  };

  $scope.getTips(1);

  $scope.loadMoreTips = function () {
    $scope.getTips(++$scope.page, $scope.tips);
  };


});
