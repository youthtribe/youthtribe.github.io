'use strict';

angular.module('youthTribe')

	.controller('registerController', ['$scope', '$http', 'firebaseFactory', '$state', function(registerController, $http, fb, $state) {

		fb.init(registerController.$parent);

		registerController.registerData = {};

		registerController.isLiabilityUnChecked = function() {
			var isLiabilityChecked = document.getElementById("liabilityCheckBox").checked;
			if(isLiabilityChecked) {
				return false;
			} else {
				return true;
			}
		},
		registerController.register = function(){
			registerController.errorMessage = null;
			
			if(registerController.isLiabilityUnChecked()) {
				registerController.errorMessage = "Must read and agree to the terms."
			}
	        $(".form-control").each(function() {
	          $(this).closest(".form-group").removeClass("has-error has-feedback");
	          if($(this).val() == "") {
	            $(this).closest(".form-group").addClass("has-error has-feedback");
				registerController.errorMessage = "Please fill out every box";
	          }
	        });
	        if(registerController.errorMessage) {
	        	return false;
	        }
			if(registerController.registerData.password == registerController.registerData.confirmPassword){
				fb.getRoot().createUser({
				  email: registerController.registerData.email,
				  password: registerController.registerData.password
				}, function(error, userData) {
				  if (error) {
				  	registerController.$apply(function(){
				  		registerController.errorMessage = "Uh oh! " + error.message;
				  	});
				  } else {
				  	fb.getRoot().authWithPassword({
				  		email: registerController.registerData.email,
				  		password: registerController.registerData.password
				  	}, function(error, authData) {
				        if (error) {
				          console.log("Login Failed!", error);
				        } else {
				          	fb.newUser(userData.uid).update({
						  		firstName: registerController.registerData.firstName,
						  		lastName: registerController.registerData.lastName
						  	}, function(){
						  		$state.go("profiles");
						  	});
				        }
				      });
				  }
				});
			}else{
				$(".password").addClass("has-error has-feedback");
				registerController.errorMessage = "Make sure your passwords are matching!";
			}
		}	
	}]);