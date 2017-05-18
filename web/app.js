var app = angular.module("WikiApp", ["ngTouch", "mm.foundation", "ngMap","ngRoute"]);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {
		templateUrl: 'templates/index.tpl.html',
		controller: "FrontController",
		controllerAs: 'ctrl',
	}).when('/login', {
		templateUrl: 'templates/login.tpl.html',
		controller: "LoginController",
		controllerAs: 'ctrl',
	}).when('/logout', {
		templateUrl: 'templates/logout.tpl.html',
		controller: "LogoutController",
		controllerAs: 'ctrl',
	}).when('/user', {
		templateUrl: 'templates/user.tpl.html',
		controller: "UserController",
		controllerAs: 'ctrl',
	}).when('/user/:userId', {
		templateUrl: 'templates/userId.tpl.html',
		controller: "UserIdController",
		controllerAs: 'ctrl',
	}).when('/page', {
		templateUrl: 'templates/page.tpl.html',
		controller: "PageController",
		controllerAs: 'ctrl',
	}).when('/page/:slug', {
		templateUrl: 'templates/pageslug.tpl.html',
		controller: "PageSlugController",
		controllerAs: 'ctrl',
	}).when('/page/:slug/revision', {
		templateUrl: 'templates/pagerevision.tpl.html',
		controller: "PageRevisionController",
		controllerAs: 'ctrl',
	})
}]);

app.run(['$rootScope', '$route', function($rootScope, $route) {
  $rootScope.$route = $route;

}]);

app.controller('FrontController', ['$scope', '$http', function($scope, $http){
	 var ctrl = this;
}]);

app.controller('LoginController', ['$scope', '$http', function($scope, $http){
	 var ctrl = this;
}]);

app.controller('LogoutController', ['$scope', '$http', function($scope, $http){
	 var ctrl = this;
}]);

app.controller('UserController', ['$scope', '$http', function($scope, $http){
	 var ctrl = this;
}]);

app.controller('UserIdController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var ctrl= this;
    ctrl.userId = $routeParams.userId;
}]);

app.controller('PageController', ['$scope', '$http', function($scope, $http){
	 var ctrl = this;
}]);

app.controller('PageSlugController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
      var ctrl= this;
      ctrl.slug = $routeParams.slug;
      if(ctrl.slug === 'last'){
    	  //@TODO RETURN THE LAST SUBMITED PAGE
    	  ctrl.slug = 'last submited page';
      }
      if(ctrl.slug === 'best_rated'){
    	  //@TODO RETURN THE BEST RATED PAGE
    	  ctrl.slug = 'best rated page';
      }
}]);

app.controller('PageRevisionController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var ctrl= this;
    ctrl.slug = $routeParams.slug;
}]);