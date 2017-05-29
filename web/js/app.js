var app = angular.module("WikiApp", ["ngCookies", "ngTouch", "ngMap", "ngRoute", "ui.tinymce"]);

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
	}).when('/page/:slug/edit', {
		templateUrl: 'templates/pageedit.tpl.html',
		controller: "PageEditController",
		controllerAs: 'ctrl',
	}).otherwise({
		templateUrl: 'templates/notfound.tpl.html',
		controller: "NotFoundController",
		controllerAs: 'ctrl',
	})
}]);

app.run(['$rootScope', '$route', function($rootScope, $route) {
	$rootScope.$route = $route;
	$rootScope.wikiDataServer = 'test';
}]);

app.controller('FrontController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}]);

app.controller('LoginController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}]);

app.controller('LogoutController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}]);

app.controller('UserController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}]);

app.controller('UserIdController', ['$scope', '$http', '$routeParams', '$rootScope', function($scope, $http, $routeParams, $rootScope){
    var ctrl= this;
    ctrl.userId = $routeParams.userId;
}]);

app.controller('PageController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}]);

app.controller('PageSlugController', ['$scope', '$http', '$routeParams', '$rootScope', function($scope, $http, $routeParams, $rootScope){
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

app.controller('PageRevisionController', ['$scope', '$http', '$routeParams', '$rootScope', function($scope, $http, $routeParams, $rootScope){
    var ctrl= this;
    ctrl.slug = $routeParams.slug;
}]);

app.controller('PageEditController', ['$scope', '$http', '$routeParams', '$rootScope', '$cookies', function($scope, $http, $routeParams, $rootScope, $cookies){
    var ctrl= this;
    ctrl.slug = $routeParams.slug;
    
    $scope.initialContent = 'Initial content';

    $scope.getContent = function() {
      console.log('Editor content:', $scope.initialContent);
    };

    $scope.setContent = function() {
      $scope.initialContent = 'Time: ' + (new Date());
    };

    $scope.editorOptions = {
      plugins: 'link image code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };
    
    // Retrieving a cookie
    var favoriteCookie = $cookies.get('myFavorite');
    // Setting a cookie
    $cookies.put('myFavorite', 'oatmeal');
}]);

app.controller('NotFoundController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}])