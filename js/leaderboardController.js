'use strict';

angular.module('youthTribe')

  .controller('leaderboardController', ['$scope', '$http', 'firebaseFactory', '$state', function(leaderboardController, $http, fb, $state) {

    var promise1 = false;
    var promise2 = false;
    
      fb.init(leaderboardController.$parent);
      leaderboardController.children = [];
      leaderboardController.swim = [];
      leaderboardController.bike = [];
      leaderboardController.run = [];

      var promiseFunction = function() {
        if(promise1 && promise2){
          $.each(leaderboardController.viewDataSet.leaderboard, function(username, stats){
            if(username === leaderboardController.userData.username){
              leaderboardController.myProfile = $(this)[0];
              return;             
            }
          });
        }
      };

      fb.getViewData().$loaded().then(function(data) {
        $.each(data.leaderboard, function(username, stats) {
          stats.username = username;
          leaderboardController.children.push(stats); 
          leaderboardController.viewDataSet = data;   
          promise1 = true;
          promiseFunction();      
        });
        leaderboardController.swim = Array.from(leaderboardController.children.sort(function(a, b) {
          console.log("b: " + b.swim);
          console.log("a: " + a.swim);
          if(typeof b.swim === 'undefined' && typeof a.swim === 'undefined'){
            return 0;
          }
          if(typeof b.swim === 'undefined'){
            return 1;
          }
          if(typeof a.swim === 'undefined'){
            return -1;
          }
          return b.swim - a.swim;          
        }));
        leaderboardController.bike = Array.from(leaderboardController.children.sort(function(a, b) {
          return b.bike - a.bike;
        }));
        leaderboardController.run = Array.from(leaderboardController.children.sort(function(a, b) {
          return b.run - a.run;
        }));
        leaderboardController.swim.splice(5);
        leaderboardController.bike.splice(5);
        leaderboardController.run.splice(5);        
      });

      fb.getProfile().$loaded().then(function(data){
        leaderboardController.userData = data;      
        promise2 = true;
        promiseFunction();
      });
      // fb.getViewData().$loaded().then(function(data){
      //   leaderboardController.viewDataSet = data;
      //   $.each(leaderboardController.viewDataSet.leaderboard, function(username, stats){
      //     if(username == dataTwo.username){
      //       var user = $(this);
      //     }
      //   });
      // });
            
      leaderboardController.sortType = "run";
      leaderboardController.allAgeGroups = [5, 6, 7, 8, 9, 10, 11, 12, 13];

      var runConversion = function(conversionVal, distance) {
        // earn minutes per distance run
        return distance*conversionVal;
      };

      var swimConversion = function(conversionVal, distance) {
        // earn minutes per distance swam * 10
        return (distance/conversionVal)*10;
      };

      var bikeConversion = function(conversionVal, distance) {
        // earn minutes per hour of distance biked
        return (distance / conversionVal) * 60;
      };      
  }]);
