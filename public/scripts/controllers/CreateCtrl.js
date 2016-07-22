// Manage create trade modal form ui and logic
angular.module('TradeApp').controller('CreateCtrl',  ['ApiService', '$scope','$uibModalInstance', 'modalScope', function(ApiService, $scope, $uibModalInstance, modalScope) {

    ApiService.getAllCurrencies().then(function (data) {
        $scope.currencies = Object.keys(data.rates);
    });

    //json to be sent using: Http POST
    $scope.newData = {
        "sell_amount": null,
        "buy_amount": null,
        "rate": null,
        "sell_currency": null,
        "buy_currency": null
    };

    $scope.updateRate = function () {
        if($scope.sellCurrencySelect != null && $scope.buyCurrencySelect != null){
            ApiService.getRateSet($scope.sellCurrencySelect).then(function (data) {
                $scope.newData['rate'] = data.rates[$scope.buyCurrencySelect];
            });
        }
    };

    //on sell_amount change
    $scope.$watch("newData['sell_amount']", function() {
        $scope.newData['buy_amount'] = $scope.newData['sell_amount'] * $scope.newData['rate'];
    });

    //on sell_currency select change
    $scope.$watch("sellCurrencySelect", function() {
        $scope.newData['sell_currency'] = $scope.sellCurrencySelect;
        $scope.updateRate();
    });


    //on buy_currency select change
    $scope.$watch("buyCurrencySelect", function() {
        $scope.newData['buy_currency'] = $scope.buyCurrencySelect;
        $scope.updateRate();
    });

    $scope.ok = function () {
        ApiService.createTrade($scope.newData, modalScope.reloadResultSet);
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);