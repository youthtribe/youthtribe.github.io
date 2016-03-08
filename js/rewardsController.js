'use strict';

angular.module('youthTribe')
  .controller('rewardsController', ['$scope','$http', 'firebaseFactory', function(rewardsController, $http, fb) {

    fb.init(rewardsController.$parent);

    rewardsController.rewards = fb.getRewards();

    rewardsController.showManualRewardForm = function(reward){
      var origHidden = $(".manual-reward-form-" + reward.uniqueKey).hasClass("hidden");
      $(".manual-reward-form").addClass("hidden");
      $(".manual-reward-form-" + reward.uniqueKey).toggleClass("hidden", !origHidden);
    };

    rewardsController.addManualReward = function(reward, manualReward){
      var profileManualMedalsFirebase = fb.getProfileManualMedalsFirebase();

      var newManualMedal = profileManualMedalsFirebase.push(reward),
          newManualMedalKey = newManualMedal.key();

      newManualMedal.update({
        uniqueKey: newManualMedalKey,
        date: manualReward.dateAwarded,
        eventName: manualReward.eventName
      });
      
      $(".manual-reward-form").hide();
    };

    /*var profile = fb.getProfileData(),
        profileLeaderboard = fb.getLeaderboardForUser(profile.username);

    rewardsController.rewards.$loaded(function() {
      rewardsController.rewards.forEach(function(reward){
        if(profile.claimedRewards && profile.claimedRewards[reward.uniqueKey]){
          reward.claimed = true;
        }else{
          if(reward.requirementActivity == "any"){
            reward.eligible = profileLeaderboard.bike > 0 || profileLeaderboard.swim > 0 || profileLeaderboard.run > 0;
          }else if(reward.requirementActivity == "all"){
            reward.eligible = profileLeaderboard.bike > 0 || profileLeaderboard.swim > 0 || profileLeaderboard.run > 0;
          }else{
            if(profileLeaderboard[reward.requirementActivity] >= reward.requirementAmount){
              reward.eligible = true;
            }else{
              var amountLeft = reward.requirementAmount - profileLeaderboard[reward.requirementActivity];
              reward.requirementLeft = reward.requirementLeft.replace("%REPLACE%", amountLeft);
            }
          }
        }
      });
    });*/

    /*rewardsController.claimReward = function(rewardToClaim){
      var fbProfileRewards = fb.getProfileRewardsFirebase(),
          claimedObject = {};
      claimedObject[rewardToClaim.uniqueKey] = true;
      fbProfileRewards.update(claimedObject);
      rewardsController.rewards[rewardToClaim.uniqueKey].claimed = true;
    };*/
  }]);
