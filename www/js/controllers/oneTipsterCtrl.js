controllers.controller('OneTipsterCtrl', function ($scope, $stateParams, Loading, Alert, $http, $sce, $rootScope) {
  console.log($stateParams.id);
  if ($rootScope.tipsList){
    Object.keys($rootScope.tipsList).forEach(function (key, i) {
      var tip = $rootScope.tipsList[key];
      if(tip.id == $stateParams.id){
        $scope.content = function () { return $sce.trustAsHtml(tip.content) };
      }
    })
  }

});
