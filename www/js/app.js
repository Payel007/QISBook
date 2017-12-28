// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'starter.factories', 'starter.controllers'])
  .run(function($ionicPlatform, Fire, Auth, $location, $rootScope, $ionicLoading) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    
    Auth.$onAuth(function(authData) {
      if (authData) {
        console.log("Logged in as:", authData.uid);
        Fire.child("users").child(authData.uid).once('value', function (snapshot) {
            var val = snapshot.val();
            console.log(val.displayName);
            $rootScope.loggedInUser = val;
        });
      } else {
        console.log("Logged out");
        $location.path('/login');
      }
      initWatcher();
    });

    $rootScope.logout = function() {
      console.log("Logging out from the app");
      Auth.$unauth();
      $rootScope.loggedInUser = null;
      $location.path('/login');
    }
    
    var initWatcher = function(){
      console.log("initWatcher");
      $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){
        
        if ($rootScope.loggedInUser == null) {
          // no logged user, redirect to /login
          if ( toState.name === "login" || toState.name === "signup") {

          } else {
            event.preventDefault();
          }
        }
        else
        {
          if ( toState.name === "login" || toState.name === "signup") {
            event.preventDefault();
          }
        }
      });

      $rootScope.$on("$stateChangeError", 
      function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
          $location.path("/login");
        }
      });
    }
  })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupCtrl'
    })

    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome-QISBook.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      resolve: {
          // controller will not be loaded until $waitForAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["Auth", function(Auth) {
            // $waitForAuth returns a promise so the resolve waits for it to complete
            return Auth.$waitForAuth();
          }]
        }
    })
    .state('app.setting', {
      url: '/setting',
      views: {
        'menuContent': {
          templateUrl: 'templates/setting.html'
        }
      }
    })
    .state('app.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'templates/help.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'listController'
        }
      }
    })
.state('app.addidea', {
      url: '/addidea',
      views: {
        'menuContent': {
          templateUrl: 'templates/addidea.html',
          controller: 'addController'
        }
      }
    })

    .state('app.delidea', {
      url: '/delidea',
      views: {
        'menuContent': {
          templateUrl: 'templates/delidea.html',
          controller: 'deleteController'
        }
      }
    })

    .state('app.editideas', {
      url: '/editideas',
      views: {
        'menuContent': {
          templateUrl: 'templates/editideas.html',
          controller: 'editController'
        }
      }
    })

    .state('app.editidea', {
      url: '/editidea/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/editidea.html',
          controller: 'recipeEditController'
        }
      }
    })

    .state('app.search', {
      url: '/help',
      templateUrl: 'templates/help.html'
    })
    .state('app.settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html'
    })

  .state('app.playlist', {
    url: '/playlist/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'recipeController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
});
