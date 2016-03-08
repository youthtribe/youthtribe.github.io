angular.module('youthTribeRoutes', [
	'ui.router'
]).config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/dashboard');

	$stateProvider

	.state('login', {
		url: '/login',
		controller: 'loginController',
		templateUrl: 'views/login.html'
	})
	.state('legal', {
		url: '/legal',
		controller: 'legalController',
		templateUrl: 'views/legal.html'
	})
	.state('legal.id', {
		url: '/:id',
		controller: 'legalController',
		templateUrl: 'views/legal.html'
	})
	.state('faq', {
		url: '/faq',
		controller: 'faqController',
		templateUrl: 'views/faq.html'
	})
	.state('faq.id', {
		url: '/:id',
		controller: 'faqController',
		templateUrl: 'views/faq.html'
	})
	.state('register', {
		url: '/register',
		controller: 'registerController',
		templateUrl: 'views/register.html'
	})
	.state('profiles', {
		url: '/profiles',
		controller: 'profilesController',
		templateUrl: 'views/profiles.html'
	})
	.state('dashboard', {
		url: '/dashboard',
		controller: 'dashboardController',
		templateUrl: 'views/dashboard.html'

	})
	.state('dashboard.id', {
		url: '/:id',
		controller: 'dashboardController',
		templateUrl: 'views/dashboard.html'
	})
	.state('profile', {
		url: '/profile',
		controller: 'profileController',
		templateUrl: 'views/profile.html'
	})
	.state('profile.id', {
		url: '/:id',
		controller: 'profileController',
		templateUrl: 'views/profile.html'
	})
	.state('rewards', {
		url: '/rewards',
		controller: 'rewardsController',
		templateUrl: 'views/rewards.html'
	})
	.state('rewards.id', {
		url: '/:id',
		controller: 'rewardsController',
		templateUrl: 'views/rewards.html'
	})
	.state('activity', {
		url: '/activity',
		controller: 'activityController',
		templateUrl: 'views/activity.html'
	})
	.state('activity.id', {
		url: '/:id',
		controller: 'activityController',
		templateUrl: 'views/activity.html'
	})
	.state('admin', {
		url: '/admin',
		controller: 'adminController',
		templateUrl: 'views/admin.html'
	})
	.state('leaderboard', {
		url: '/leaderboard',
		controller: 'leaderboardController',
		templateUrl: 'views/leaderboard.html'
	})
	.state('leaderboard.id', {
		url: '/:id',
		controller: 'leaderboardController',
		templateUrl: 'views/leaderboard.html'
	})
});
