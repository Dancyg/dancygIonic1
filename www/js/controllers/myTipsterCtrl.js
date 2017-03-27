var GET_TIPSTER = 'https://members.bettinggods.com/api/get_recent_posts?count=15&cat=';


controllers.controller("MyTipsterCtrl", function ($scope, $stateParams, Loading, Alert, $http, $sce, $rootScope) {
  console.log($stateParams.recent);
  Loading.start();
  $scope.page = 1;
  $scope.lastPage = 2;


  $scope.getTips = function(page, tips){
    var header = {
      cookie: $rootScope.token,
      api_call: true
    };
    var formData = new FormData();
    for (var key in header) {
      formData.append(key, header[key]);
    }

    var url = GET_TIPSTER + $stateParams.recent + '&page=' + page;

    $scope.tips = tips || {};
    $http.post(url, formData)
      .then(
        function (res) {
          $rootScope.tipsList = $rootScope.tipsList || {};
          res.data.posts.forEach(function (tip, i) {
            $rootScope.tipsList[1 - 1 / tip.id] = {
              id         : tip.id,
              content    : tip.content
            };
            $scope.tips[1 - 1 / tip.id] = {
              id         : tip.id,
              title      : function () { return $sce.trustAsHtml(tip.title) }
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
