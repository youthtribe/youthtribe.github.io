'use strict';

angular.module('youthTribe')

  .controller('loginController', ['$scope', '$http', '$state', 'firebaseFactory', function(loginController, $http, $state, fb) {

    fb.init(loginController.$parent);

    loginController.register = function(){
      $state.go("register");
    };

    loginController.loginFunction = function(){
      loginController.errorMessage = null;
      fb.getRoot().authWithPassword(loginController.loginData, function(error, authData) {
        if (error) {
          if (error.code == "INVALID_PASSWORD"){
            loginController.errorMessage = "Whoops! The password is not right. Please try again.";
            loginController.$apply();
          }
          console.log("Login Failed!", error);
        } else {
          $state.go("profiles");
        }
      });
    };

  }]);