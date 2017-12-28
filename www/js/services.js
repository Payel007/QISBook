angular.module('starter.factories', [ ])
  .factory("Fire", function($firebaseAuth) {
    var usersRef = new Firebase("https://ideaapp.firebaseio.com");
    return usersRef;
  })
  .factory("Auth", function($firebaseAuth) {
    var usersRef = new Firebase("https://ideaapp.firebaseio.com");
    return $firebaseAuth(usersRef);
  })

  .factory('recipeService',function($firebaseArray) {
    var fb = new Firebase("https://ideaapp.firebaseio.com/ideas/");
    var recs = $firebaseArray(fb);
    var recipeService = {
        all: recs,
        get: function(recId) {
            return recs.$getRecord(recId);
        }        
    };
    return recipeService;
  });
