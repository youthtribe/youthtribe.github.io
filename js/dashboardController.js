'use strict';

angular.module('youthTribe')

  .controller('dashboardController', ['$scope', '$http', 'firebaseFactory','$state', function(dashboardController, $http, fb, $state) {
    dashboardController.dashboard = {
      swimCompleted: 0,
      bikeCompleted: 0,
      runCompleted: 0,
      runGoal: 26,
      bikeGoal: 50,
      swimGoal: 3000,
      startDate: "",
      endDate: "",
      inDateRange: false,
      daysRemaining: 0,
      age: 0,
      activities : [{}]
    };

    fb.init(dashboardController.$parent);
    fb.getFirebaseActivities().$loaded()
      .then(function(activityData) {
        fb.getViewData().$loaded()
          .then(function(viewData) {
            fb.getProfile().$loaded()
              .then(function(profileData) {
                dashboardController.profile = profileData;
                dashboardController.dashboard.age = dashboardController.findAge();

                dashboardController.viewData = viewData;
                dashboardController.dashboard.username = viewData.leaderboard.username;
                dashboardController.loadGoals();

                dashboardController.dashboard.activities = activityData;
                dashboardController.sumActivities();
              });
          });
      });

    fb.getRestrictDates().$loaded()
      .then(function(data) {
        dashboardController.dashboard.startDate = data.startDate;
        dashboardController.dashboard.endDate = data.endDate;

        var oneDay = 24*60*60*1000;
        
        var lastDate = new Date(data.endDate);
        var beginDate = new Date(data.startDate);
        var currentDate = new Date();
        //set the time to midnight of the current date
        currentDate.setHours(0,0,0,0);
        
        var days = Math.round(Math.abs((lastDate.getTime() - currentDate.getTime())/(oneDay)));
        var inRange = currentDate >= beginDate && currentDate <= lastDate;

        dashboardController.dashboard.inDateRange = inRange;

        dashboardController.dashboard.daysRemaining = days;

        
      });

    dashboardController.goLeaderboard = function(child) {
      $state.go("dashboard.id", {id: child.uniqueKey});
    }
    dashboardController.goProfiles = function() {
      $state.go("profiles");
    };

    dashboardController.findAge = function() {
      var birthday = +new Date(dashboardController.profile.dateOfBirth);
      var year = (new Date(Date.now())).getYear() + 1900;
      var age = ~~((new Date("12/31/" + year) - birthday) / (31557600000));

      if (age > 12) age = 12;
      if (age < 5) age = 5;

      return age;
    }

    dashboardController.sumActivities = function() {
      var filterKey = /-/;
      var filtered = [];
      // Get keys for the actual activity objects.
      for (var key in dashboardController.dashboard.activities) {
        if (dashboardController.dashboard.activities.hasOwnProperty(key) && filterKey.test(key)) {
          filtered.push(key);
        }
      }

      // Get the activity array based on the keys we got earlier.
      var activities = [];
      for (var i = 0; i < filtered.length; i++) {
        activities.push(dashboardController.dashboard.activities[filtered[i]]);
      }

      // for each type, sum up and added to distance completed.
      var types = ["swim", "bike", "run"];
      $.each(types, function(index) {
        dashboardController.dashboard[types[index] + "Completed"] =
          activities.filter(function(val) {
            return val.type == types[index]; // TODO: 6-months prior to end date -> end date
          }).reduce(function(a, b) { return a + b.length }, 0);
      });
    }

    dashboardController.loadGoals = function() {
      var age = dashboardController.dashboard.age;

      dashboardController.dashboard.swimGoal = dashboardController.findGoal(age, "swim");
      dashboardController.dashboard.bikeGoal = dashboardController.findGoal(age, "bike");
      dashboardController.dashboard.runGoal = dashboardController.findGoal(age, "run");
    }

    dashboardController.findGoal = function(age, type) {
      try {
        return dashboardController.viewData.goals["age_" + age][type].goal;
      } catch(ex) {
        //console.log`('Whoops! Error getting goals.');
      }
    }

    dashboardController.hasActivities = false;
    dashboardController.haveActivities = function() {
      dashboardController.hasActivities = true;
    };
  }]);
