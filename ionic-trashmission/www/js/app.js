angular.module('trashmission', ['ionic', 'trashmission.controllers', 'trashmission.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl as home'
    })
    .state('trashcan-detail', {
      url: '/trashcah/:id',
      templateUrl: 'templates/trashcan-detail.html',
      controller: 'TrashcanDetailCtrl as detail'
    })

  $urlRouterProvider.otherwise('/home');
});
