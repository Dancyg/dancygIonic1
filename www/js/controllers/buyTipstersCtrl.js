var BUY_TIPSTERS = 'https://bettinggods.com/api/get_recent_posts?post_type=tipsters&page=';


// count = 3
// post_type = tipsters

controllers.controller('BuyTipstersCtrl', function ($scope, $http, $rootScope, Loading, $sce, $ionicPlatform, Alert) {
  Loading.start();
  $scope.page = 1;
  $scope.lastPage = 2;

  $scope.getTips = function(page, tips){

    $scope.tips = tips || {};
    $http.get(BUY_TIPSTERS + page)
      .then(
        function (res) {
          Loading.hide();
          res.data.posts.forEach(function (tip, i) {
            $scope.tips[1 - 1 / tip.id] = {
              id         : tip.id,
              thumbnail  : tip.thumbnail,
              url        : tip.url,
              title      : function () { return $sce.trustAsHtml(tip.title) },
              description: function () {
                return $sce.trustAsHtml(`<p class='tip-content'>Earn an Average Monthly Profit of  <span class='tip-profit'> 
                  ${tip.custom_fields.average_profit[0]}  </span> 
                    Using £10 Stakes with a  
                  ${tip.custom_fields.total_strike_rate["0"]}
                   Strike Rate and ROI of ${tip.custom_fields.return_on_investment["0"]}  </p>`)
              }
            }
          });
          $scope.lastPage = res.data.pages;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
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
  }



  $ionicPlatform.ready(function onDeviceReady() {
    $scope.buyTipster = function(url) {
      var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
    }
  });


});
