angular.module('youthTribe').factory('firebaseFactory', [
	'$firebaseArray',
	'$firebaseObject',
	'$firebaseAuth',
	'$state',
	'$stateParams',
	function firebaseFactory($fbArray, $fbObject, $fbAuth, $state, $stateParams) {
		var url = "https://sweltering-fire-6401.firebaseio.com",
		ref = new Firebase(url),
        auth = $fbAuth(ref);

		return {
			object: $fbObject,
			array: $fbArray,
			init: function($scope){

				if(!$state.includes("login")){
					if(!!auth.$getAuth()){
						$stateParams.uid = auth.$getAuth().uid;
						if($stateParams.id || $state.includes("login") || $state.includes("register") || $state.includes("profiles")){

						}else{
							var user = $fbObject(new Firebase(url + "/users/" + $stateParams.uid));
							if(user.firstName){
								$state.go("profiles");
							}else{
								$state.go("login");
							}
						}
					}else{
						if(!$state.includes("register") && !$state.includes("login")){
							$state.go("login");
						}
					}
				}

				$scope.navLogout = function(){
					$stateParams.uid = null;
				    auth.$unauth();
				    $state.go("login");
				};

				$scope.navLogin = function(){
					$state.go("login");
				};

				$scope.navFaq = function(){
					$state.go("faq.id", {id: $stateParams.id});
				};

				$scope.navLegal = function(){
					$state.go("legal.id", {id: $stateParams.id});
				};

				$scope.navProfiles = function(){
					$state.go("profiles");
				};

				$scope.navDashboard = function(){
					$state.go("dashboard.id", {id: $stateParams.id});
				};

				$scope.navProfile = function(){
					$state.go("profile.id", {id: $stateParams.id});
				};

				$scope.navRewards = function(){
					$state.go("rewards.id", {id: $stateParams.id});
				};

				$scope.navActivity = function() {
					$state.go("activity.id", {id: $stateParams.id});
				};
				$scope.navLeaderboard = function() {
					$state.go("leaderboard.id", {id: $stateParams.id});
				};
			},
			//returns boolean indicating whether user is logged in
			isLoggedIn: function() {
				return !!auth.$getAuth()
			},
			auth: auth,
			getProfile: function() {
				return $fbObject(new Firebase(url + "/users/" + auth.$getAuth().uid + "/children/" + $stateParams.id))
			},
			getChildren: function() {
				return new Firebase(url + "/users/" + auth.$getAuth().uid + "/children")
			},
			getChildrenData: function() {
				return $fbObject(new Firebase(url + "/users/" + auth.$getAuth().uid + "/children"));
			},
			getAuth: auth.$getAuth,
			getUser: function() {
				var id = this.user();

				return $fbObject(id);
			},
			user: function() {
				return this.newUser(auth.$getAuth().uid);
			},
			newUser: function (uid) {
				return new Firebase(url + "/users/" + uid);
			},
			getView: function() {
				return new Firebase(url + "/view");
			},
			getGoalsForAgeData: function(age) {
				return $fbObject(new Firebase(url + "/view/goals/age_" + age));
			},
			getViewData: function() {
				return $fbObject(this.getView());
			},
			getProfileMedalsFirebase: function() {
				return new Firebase(url + "/users/" + auth.$getAuth().uid + "/children/" + $stateParams.id + "/medals");
			},
			getProfileManualMedalsFirebase: function() {
				return new Firebase(url + "/users/" + auth.$getAuth().uid + "/children/" + $stateParams.id + "/manualMedal");
			},
			getProfileFirebase: function() {
				return new Firebase(url + "/users/" + auth.$getAuth().uid + "/children/" + $stateParams.id);
			},
			getProfileData: function() {
				return $fbObject(this.getProfileFirebase());
			},
			getFirebaseActivities: function() {
				return $fbObject(this.getActivities());
			},
			getActivities: function() {
				return new Firebase(url + "/users/" + auth.$getAuth().uid + "/children/" + $stateParams.id +"/activities");
			},
			getRoot: function(){
				return new Firebase(url);
			},
			getRewards: function(){
				return $fbObject(this.getRewardsRef());
			},
			getRewardsRef: function(){
				return new Firebase(url + "/view/rewards");
			},
			getLeaderboardForUser: function(username){
				return $fbObject(this.getLeaderboardRefForUser(username));
			},
			getLeaderboardRefForUser: function(username){
				return new Firebase(url + "/view/leaderboard/" + username);
			},
			getRestrictDates: function() {
				return $fbObject(this.getRestrictDatesFirebase());
			},
			getRestrictDatesFirebase: function() {
				return new Firebase(url + "/view/restrictDates");
			}
		}
	}

])
