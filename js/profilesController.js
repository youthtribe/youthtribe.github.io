'use strict';

angular.module('youthTribe')

  .controller('profilesController', ['$scope', '$http', 'firebaseFactory', '$state', function(profilesController, $http, fb, $state) {

      fb.init(profilesController.$parent);

      profilesController.children = fb.getChildrenData();

      profilesController.imageCheckboxHandler = function(imgNum) {
        $(".avatar-input").val(imgNum);
        $("#avatar-1").css("border", "");
        $("#avatar-2").css("border", "");
        $("#avatar-3").css("border", "");
        $("#avatar-4").css("border", "");
        $("#avatar-" + imgNum).css("border", "5px solid black");
        profilesController.newChild.avatar = imgNum;
      }

      profilesController.createChild = function(){
        $(".profiles-input").each(function() {
          if($(this).val() == "") {
            $(this).closest(".form-group").addClass("has-error has-feedback");
          } else {
            $(this).closest(".form-group").removeClass("has-error has-feedback");
          }
        });


        if(!$(".newChildClass").find(".has-error").length){
          console.log(profilesController.newChild);
          var firebaseUserChildren = fb.getChildren();
			    profilesController.newChild.dateOfBirth = profilesController.newChild.dateOfBirth.toLocaleDateString("en-US");
          var newChild = firebaseUserChildren.push(profilesController.newChild),
              newChildKey = newChild.key();

          newChild.update({uniqueKey: newChildKey});

          profilesController.newChild = {};
          profilesController.addChild = false;
        }
      };

      profilesController.chooseChild = function(child){
        $state.go("dashboard.id", {id: child.uniqueKey});
      };

  }]);
