'use strict';

angular.module('youthTribe')

  .controller('profileController', ['$scope', '$http', 'firebaseFactory', function(profileController, $http, fb) {

    fb.init(profileController.$parent);

    profileController.profile = fb.getProfile();
    profileController.viewMedals = [[]];
    profileController.viewManualMedals = [[]];

   profileController.profile.$loaded().then(function() {

    $.each(profileController.profile.medals, function(index, medal){
      var viewDate = new Date(medal.date);
      medal.viewDate = viewDate.getMonth() + "/" + viewDate.getDay() + "/" + viewDate.getFullYear();

      var lastRow = profileController.viewMedals[profileController.viewMedals.length - 1];
      if(lastRow.length == 3){
        profileController.viewMedals.push([]);
      }
      profileController.viewMedals[profileController.viewMedals.length - 1].push(medal);
    });

    $.each(profileController.profile.manualMedal, function(index, medal){
      var viewDate = new Date(medal.date);
      medal.viewDate = viewDate.getMonth() + "/" + viewDate.getDay() + "/" + viewDate.getFullYear();

      var lastRow = profileController.viewManualMedals[profileController.viewManualMedals.length - 1];
      if(lastRow.length == 3){
        profileController.viewManualMedals.push([]);
      }
      profileController.viewManualMedals[profileController.viewManualMedals.length - 1].push(medal);
    });
    
    switch(profileController.profile.avatar) {
      case 1:
        profileController.imgPath = "img/girl1.svg";
      break;
      case 2:
        profileController.imgPath = "img/girl2.svg";
      break;
      case 3:
        profileController.imgPath = "img/boy1.svg";
      break;
      case 4:
        profileController.imgPath = "img/boy2.svg";
      break;
    }

    profileController.editBio = function() {
      profileController.editMode = true;
    };

    profileController.saveBio = function() {
      profileController.editMode = false;
      fb.getProfileFirebase().update({bio: profileController.profile.bio});
    };
    profileController.findAge = function() {
      var birthday = +new Date(profileController.profile.dateOfBirth);
      var year = (new Date(Date.now())).getYear() + 1900;
      var age = ~~((new Date("12/31/" + year) - birthday) / (31557600000));

      return age;
    };

    profileController.showHoverDesc = function(uniqueKey){
      $(".img-hover-desc").addClass("hidden");
      $("." + uniqueKey).removeClass("hidden");
    };
    
    profileController.closePopover = function(uniqueKey){
      if(!$("." + uniqueKey).hasClass("hidden")){
        $("." + uniqueKey).addClass("hidden");
      }
    };
  });
}]);
