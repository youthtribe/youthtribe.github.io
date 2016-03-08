'use strict';

angular.module('youthTribe')
  .controller('faqController', ['$scope','$http', function(faqController, $http) {
    
    faqController.faqs = [
      {q: "This is question 1, it could get to be a longer question. I am going to keep typing in order to get this text field longer for long questions.", a:"answer0"},
      {q: "This is question 2", a:"answer1"},
      {q: "This is question 3", a:"answer2"}
    ];
  }]);