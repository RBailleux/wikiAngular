var app = angular.module("WikiApp", ["ngCookies", "ngTouch", "ngMap", "ngRoute", "ui.tinymce"]);

//FACTORY

app.factory('utilit', ['$cookies', function ($cookies) {
 return {
     arrayToJson: function(data) {
         console.log(JSON.stringify(data));
     },
 	 doLogin: function(data) {
 		var logUser = $cookies.get('angularWikiUserToken');
 		$cookies.put('angularWikiUserToken', '456');
 	 },
 	 doLogout: function() {
 		$cookies.remove('angularWikiUserToken');
 	 },
 	 isUserLogged: function() {
 		 var logUser = $cookies.get('angularWikiUserToken');
 		 if(logUser){
 			 return true;
 		 }
 		 return false;
 	 }
 };
}]);

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

app.run(['$rootScope', '$route', 'utilit', function($rootScope, $route, utilit) {
	$rootScope.$route = $route;
	$rootScope.wikiDataServer = 'test';
	$rootScope.isUserLogged = utilit.isUserLogged();
}]);

//CONTROLLERS
app.controller('NavigationController', ['$scope', '$http', '$rootScope', '$cookies', '$window', 'utilit', '$interval', function($scope, $http, $rootScope, $cookies, $window, utilit, $interval){
	var ctrl = this;
	$interval(function(){
		$scope.isUserLogged = utilit.isUserLogged();
	}, 100);
	$scope.header = 'templates/header.tpl.html';
	$scope.sidebar = 'templates/sidebar.tpl.html';
}]);
app.controller('FrontController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}]);

app.controller('LoginController', ['$scope', '$http', '$rootScope', '$cookies', '$window', 'utilit', function($scope, $http, $rootScope, $cookies, $window, utilit){
	var ctrl = this;
	$scope.isUserLogged = utilit.isUserLogged();
	$scope.postData=function(form){
		var dataForm = 
			{
				'login' : $scope.login, 
				'password' : $scope.password
			}
		utilit.doLogin(utilit.arrayToJson(dataForm));
		if(utilit.isUserLogged()){
			$window.location.href ='#!';
		}
	};
}]);

app.controller('LogoutController', ['$scope', '$http', '$rootScope', '$cookies', '$timeout', '$window', 'utilit', function($scope, $http, $rootScope, $cookies, $timeout, $window, utilit){
	 var ctrl = this;
	 $scope.isUserLogged = utilit.isUserLogged();
	 if(utilit.isUserLogged()){
		utilit.doLogout();
	 	$scope.counter = 3;
		$scope.onTimeout = function(){
	        $scope.counter--;
	        mytimeout = $timeout($scope.onTimeout,1000);
	        if($scope.counter == -1){
	          $timeout.cancel(mytimeout);
	          $window.location.href ='#!';
	        }
		}
	   var mytimeout = $timeout($scope.onTimeout,1000);
	 }
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

app.controller('PageSlugController', ['$scope', '$http', '$routeParams', '$rootScope', '$sce', function($scope, $http, $routeParams, $rootScope, $sce){
      var ctrl= this;
      ctrl.slug = $routeParams.slug;
      ctrl.wikiExists = true;
      $scope.wikiContent = '<b>Nope</b>';
      if(ctrl.wikiExists){
    	  $scope.wikiContent = '<b>Yes</b>';
      }
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

app.controller('PageEditController', ['$scope', '$http', '$routeParams', '$rootScope','$cookies', 'utilit',  function($scope, $http, $routeParams, $rootScope, $cookies, utilit){
    var ctrl= this;
    ctrl.slug = $routeParams.slug;
    ctrl.pageTitle = "Création / Édition : "+ctrl.slug;
    ctrl.userToken = 'userToken123456';
    
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
    
    $scope.postData=function(form){
    	var dataForm = 
    		{
    			'title' : $scope.initialTitle, 
    			'content' : $scope.initialContent,
    			'userToken' : ctrl.userToken
    		}
		utilit.arrayToJson(dataForm);
    };
    
    // Retrieving a cookie
    var favoriteCookie = $cookies.get('myFavorite');
    // Setting a cookie
    $cookies.put('myFavorite', 'oatmeal');
}]);

app.controller('NotFoundController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}])