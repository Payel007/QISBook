angular.module('starter.controllers', [ ])
.controller('SignupCtrl', function($scope, Fire, Auth, $ionicLoading, $location) {
  $scope.Signup = function(user) {
    console.log("Create User Function called");
    console.log(user);
    if (user && user.email && user.password) {
      $ionicLoading.show({
        template: 'Signing Up...'
      });

      Auth.$createUser({
        email: user.email,
        password: user.password
      }).then(function(userData) {
        console.log(userData);
        alert("User created successfully!");
        Fire.child("users").child(userData.uid).set({
            email: user.email,
            displayName: user.displayname
        });
        $ionicLoading.hide();
        $location.path("/login");
      }).
      catch (function(error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
            alert("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            alert("The specified email is not a valid email.");
            break;
          default:
            alert("Error creating user:", error);
        }
        $ionicLoading.hide();
      });
    } else {
      alert("Please fill all details");
    }
  }
})
.controller('LoginCtrl', function($rootScope, $scope, Fire, Auth, $ionicLoading, $location) {
  $scope.Login = function(user) {
    console.log(user);
    if (user && user.email && user.password) {
      $ionicLoading.show({
        template: 'Signing In...'
      });
      Auth.$authWithPassword({
        email: user.email,
        password: user.password
      }).then(function(authData) {
        console.log("Logged in as:" + authData.uid);
        Fire.child("users").child(authData.uid).once('value', function (snapshot) {
            var val = snapshot.val();
            $rootScope.loggedInUser = val;
        });
        $ionicLoading.hide();
        $location.path("/app/playlists");
      }).
      catch (function(error) {
        alert("Authentication failed:" + error.message);
        $ionicLoading.hide();
      });
    } else
      alert("Please enter email and password both");
  }
})


.controller('addController',function($scope,$firebaseArray,$location,recipeService){
    $scope.submitRecipe = function(){
        $scope.newRec = recipeService.all;
        $scope.newRec.$add({
            recipeName: $scope.recName,
            recipeIngredients: $scope.recIngredients,
            recipeDirections: $scope.recDirections
            
        });
        $location.path("/app/playlists");
    }
})

.controller('listController',function($scope,recipeService){
    $scope.recipes = recipeService.all;
})

.controller('recipeController',function($scope,recipeService,$stateParams,$state){
    $scope.singleRecipe = recipeService.get($stateParams.id);
    $scope.ingList =  $scope.singleRecipe.recipeIngredients.split(';');
    $scope.prepList = $scope.singleRecipe.recipeDirections.split(';');
 

})


.controller('deleteController',function($scope,recipeService,$state,$firebaseArray,$ionicActionSheet){
    $scope.recs = recipeService.all;
    
    $scope.showDetails = function(id) {
        $ionicActionSheet.show({
            destructiveText: 'Delete',
            titleText: 'Sure you want to delete?',
            cancelText: 'Cancel',
            destructiveButtonClicked: function() {
                var rem = $scope.recs.$getRecord(id);
                $scope.recs.$remove(rem);
                return true;
            }
        });
    };
})


.controller('editController',function($scope,recipeService){
    $scope.editRecipes = recipeService.all;
})


.controller('recipeEditController',function($scope,recipeService,$stateParams,$location){
    $scope.allRecs = recipeService.all;
    $scope.singleRecipe = recipeService.get($stateParams.id);
    $scope.title = $scope.singleRecipe.recipeName;
    $scope.ingredients =  $scope.singleRecipe.recipeIngredients;
    $scope.directions = $scope.singleRecipe.recipeDirections;
   
    $scope.myid = $scope.singleRecipe.$id;

    $scope.updateRecipe = function(id) {
        var ed = $scope.allRecs.$getRecord(id);
        ed.recipeName = $scope.title;
        ed.recipeIngredients = $scope.ingredients;
        ed.recipeDirections = $scope.directions;
        ed.recipeStatus = $scope.status;
        ed.recipeDate = $scope.date;
        $scope.allRecs.$save(ed);
        $location.path("/app/editideas");
    };
});