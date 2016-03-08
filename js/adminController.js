'use strict';

angular.module('youthTribe')
	.controller('adminController', ['$scope', 'firebaseFactory', function(adminController, fb) {
		adminController.view = fb.getView();
		adminController.viewDataForm = fb.getViewData();
		adminController.submit = function() {
			adminController.view.update(adminController.viewDataForm);
		}
	}]);