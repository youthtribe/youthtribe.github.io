'use strict';

angular.module('youthTribe')
  .controller('activityController', ['$scope', '$http', 'firebaseFactory', function($activityController, $http, fb) {

  	fb.init($activityController.$parent);

      $activityController.activity = {"type": "swim", "date": new Date(Date.now())};
      $activityController.profile = fb.getProfile();

      $activityController.findAge = function() {
        var birthday = +new Date($activityController.profile.dateOfBirth);
        var year = (new Date(Date.now())).getYear() + 1900;
        var age = ~~((new Date("12/31/" + year) - birthday) / (31557600000));

        if (age > 12) age = 12;
        if (age < 5) age = 5;

        return age;
      }

      $activityController.addActivity = function() {
        var age = $activityController.findAge();
        $activityController.activity.date = $activityController.activity.date.toLocaleDateString("en-US");

        if ($("#lengthOrDistance").prop("checked")) {
          $activityController.convertTimeToDistance(age, $activityController.activity.type, $activityController.activity.length);
        }

        var usernameLeaderboard = fb.getLeaderboardForUser($activityController.profile.username);
        usernameLeaderboard.$loaded(function(){
          var usernameLeaderboardRef = fb.getLeaderboardRefForUser($activityController.profile.username);

          var leaderboardUpdateObject = {ageGroup: age};
          leaderboardUpdateObject[$activityController.activity.type] = usernameLeaderboard[$activityController.activity.type]
          if(!leaderboardUpdateObject[$activityController.activity.type]){
            leaderboardUpdateObject[$activityController.activity.type] = 0;
          }
          leaderboardUpdateObject[$activityController.activity.type] += $activityController.activity.length;
          usernameLeaderboard[$activityController.activity.type] = leaderboardUpdateObject[$activityController.activity.type];

          //Update Leaderboard
          usernameLeaderboardRef.update(leaderboardUpdateObject, function(){

            //Add new activity
            var newActivity = fb.getActivities().push($activityController.activity);
            var newKey = newActivity.key();
            newActivity.update({uniqueKey: newKey}, function(){
              $activityController.activity = {"type": "swim"};

              //Get age goals
              var fbGoals = fb.getGoalsForAgeData(age);
              fbGoals.$loaded(function(){

                //Check Rewards
                var fbRewards = fb.getRewards();
                fbRewards.$loaded(function(){
                  fbRewards.forEach(function(reward){
                    if(!reward.manual && (!$activityController.profile.medals || !$activityController.profile.medals[reward.uniqueKey])){
                      if(reward.uniqueKey == "-KC6tUL4dJZd71v7i8gQ"){
                        //Any Activity Added Goal
                        $activityController.addMedal(reward);
                      }else if(reward.uniqueKey == "-KC6tULBEFv1hQVAp3y9"){
                        //Full Tri Goal
                        if(usernameLeaderboard.bike >= fbGoals.bike.goal
                          && usernameLeaderboard.swim >= fbGoals.swim.goal
                          && usernameLeaderboard.run >= fbGoals.run.goal){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULBEFv1hQVAp3yA"){
                        //Running Goal
                        if(usernameLeaderboard.run >= fbGoals.run.goal){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULD7WVxR4kQ03Rv"){
                        //Biking Goal
                        if(usernameLeaderboard.bike >= fbGoals.bike.goal){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULFjKz7XElrgwep"){
                        //Swimming Goal
                        if(usernameLeaderboard.swim >= fbGoals.swim.goal){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULG72__eVYGUb8i"){
                        //Double Running Goal
                        if(usernameLeaderboard.run >= (fbGoals.run.goal * 2)){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULHR3SH-cAA9TEY"){
                        //Double Biking Goal
                        if(usernameLeaderboard.bike >= (fbGoals.bike.goal * 2)){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULItECJnV32J3og"){
                        //Double Swimming Goal
                        if(usernameLeaderboard.swim >= (fbGoals.swim.goal * 2)){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULKV3iqkggzF7-R"){
                        //Olympic Tri
                        if(usernameLeaderboard.bike >= 24.8
                          && usernameLeaderboard.swim >= 1500
                          && usernameLeaderboard.run >= 6.2){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULLIEIpyt1bLwgK"){
                        //Half Iron Man
                        if(usernameLeaderboard.bike >= 56
                          && usernameLeaderboard.swim >= 1900
                          && usernameLeaderboard.run >= 13.1){
                          $activityController.addMedal(reward);
                        }
                      }else if(reward.uniqueKey == "-KC6tULMdcDcGlArwWD7"){
                        //Iron Man
                        if(usernameLeaderboard.bike >= 112
                          && usernameLeaderboard.swim >= 3800
                          && usernameLeaderboard.run >= 26.2){
                          $activityController.addMedal(reward);
                        }
                      }
                    }
                  });

                  //Go to Dashboard
                  $activityController.navDashboard();
                });
              });
            });
          });
        });
      };

      $activityController.addMedal = function(reward){
        var medalsRef = fb.getProfileMedalsFirebase(),
            newMedalObject = {};

        newMedalObject[reward.uniqueKey] = reward;
        newMedalObject[reward.uniqueKey].date = new Date();
        medalsRef.update(newMedalObject);
      };

      $("#lengthOrDistance").change(function() {
        if ($("#lengthOrDistance").prop("checked")) {
          $activityController.convertDistanceToTime($activityController.findAge(), $activityController.activity.type, $activityController.activity.length);
        } else {
          $activityController.convertTimeToDistance($activityController.findAge(), $activityController.activity.type, $activityController.activity.length);
        }
        $activityController.$apply()
      });

      $activityController.viewData = fb.getViewData();

      $activityController.convertTimeToDistance = function(age, activity, time) {
        $activityController.activity.length = convertActivity(time, $activityController.viewData.goals["age_" + age].swim.conversion/10,
                                                                        $activityController.viewData.goals["age_" + age].bike.conversion,
                                                                        $activityController.viewData.goals["age_" + age].run.conversion);

        function convertActivity(time, swimConvert, bikeConvert, runConvert) {
          switch (activity) {
            case "swim":
              return time * swimConvert;
            case "bike":
              return (bikeConvert/60) * time;
            case "run":
              return time/runConvert;
          }
        }
      };

      $activityController.convertDistanceToTime = function(age, activity, distance) {
        console.log("convert distance to time");
        $activityController.activity.length = convertActivity(distance, $activityController.viewData.goals["age_" + age].swim.conversion/10,
                                                                        $activityController.viewData.goals["age_" + age].bike.conversion,
                                                                        $activityController.viewData.goals["age_" + age].run.conversion);

        function convertActivity(distance, swimConvert, bikeConvert, runConvert) {
          switch (activity) {
            case "swim":
              return distance / swimConvert;
            case "bike":
              return distance / (bikeConvert/60);
            case "run":
              return distance * runConvert;
          }
        }
      };
  }]);
