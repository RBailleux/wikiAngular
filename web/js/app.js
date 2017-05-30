var app = angular.module("WikiApp", ["ngCookies", "ngTouch", "ngMap", "ngRoute", "ui.tinymce", "ngSanitize"]);

//FACTORY

app.factory('utilit', ['$cookies', '$rootScope', '$http', function ($cookies, $rootScope, $http) {
	var methods = {};
	
	methods.arrayToJson = function(data){
		 console.log(JSON.stringify(data));
	};
	
	methods.doLogin = function(data){
		var logUser = $cookies.get('angularWikiUserToken');
 		$cookies.put('angularWikiUserToken', '456');
	};
	
	methods.doLogout = function(){
		$cookies.remove('angularWikiUserToken');
	};
	
	methods.isUserLogged = function(){
		var logUser = $cookies.get('angularWikiUserToken');
		if(logUser){
			return true;
		}
		return false;
	};
	
	methods.isValidEmail = function(email){
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	};
	
	methods.submitData = function(_data, _method, _url){
		return $http({
			method: _method,
			url: _url,
			data: _data
		})
	};
	
	methods.getData = function(_url){
		return $http.get(_url)
	    .then(function(response) {
	        return response.data;
	    }, function(response) {
	        return false;
	    });
	};
	
	methods.isWikiCreated = function(slug){
		var slugData = methods.getData($rootScope.wikiDataServer+'/page/'+slug+".json");
		var data = slugData.then(function(response){
			if(response){
				return true;
			}
			else{
				return false;
			}
		});
		return data;
	};
	
	return methods;
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
	}).when('/signup', {
		templateUrl: 'templates/signup.tpl.html',
		controller: "SignupController",
		controllerAs: 'ctrl',
	}).when('/search', {
		templateUrl: 'templates/search.tpl.html',
		controller: "SearchController",
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
	$scope.errors = false;
	$scope.errorsMsg = '';
	$scope.postData=function(form){
		if(!$scope.login || !$scope.password){
			$scope.errors = true;
			$scope.errorsMsg = 'Tous les champs doivent être remplis';
		}
		else{
			var dataForm = 
			{
				'login' : $scope.login, 
				'password' : $scope.password
			}
			utilit.doLogin(utilit.arrayToJson(dataForm));
			if(utilit.isUserLogged()){
				$window.location.href ='#!';
			}
			else{
				$scope.errors = true;
				$scope.errorsMsg = 'L\'identifiant ou le mot de passe est incorrect';
			}
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

app.controller('SignupController', ['$scope', '$http', '$rootScope', '$cookies', '$window', 'utilit', function($scope, $http, $rootScope, $cookies, $window, utilit){
	var ctrl = this;
	$scope.isUserLogged = utilit.isUserLogged();
	$scope.errors = false;
	$scope.errorsMsg = new Array();
	$scope.postData=function(form){
		//LOGIN
		if(!$scope.login){
			var msgIndex = $scope.errorsMsg.indexOf('L\'identifiant doit être renseigné');
			$scope.errors = true;
			if (msgIndex < 0) {
				$scope.errorsMsg.push('L\'identifiant doit être renseigné');
			}
		}
		else{
			var msgIndex = $scope.errorsMsg.indexOf('L\'identifiant doit être renseigné');
			if (msgIndex > -1) {
				$scope.errorsMsg.splice(msgIndex, 1);
			}
		}
		//PASSWORDS
		if(!$scope.password1 || !$scope.password2){
			$scope.errors = true;
			var msgIndex = $scope.errorsMsg.indexOf('Les mots de passe doivent être renseignés');
			if (msgIndex < 0) {
				$scope.errorsMsg.push('Les mots de passe doivent être renseignés');
			}
		}
		else{
			var msgIndex = $scope.errorsMsg.indexOf('Les mots de passe doivent être renseignés');
			if (msgIndex > -1) {
				$scope.errorsMsg.splice(msgIndex, 1);
			}
		}
		if($scope.password1 != $scope.password2){
			var msgIndex = $scope.errorsMsg.indexOf('Les mots de passes doivent être identiques');
			$scope.errors = true;
			if (msgIndex < 0) {
				$scope.errorsMsg.push('Les mots de passes doivent être identiques');
			}
		}
		else{
			var msgIndex = $scope.errorsMsg.indexOf('Les mots de passes doivent être identiques');
			if (msgIndex > -1) {
				$scope.errorsMsg.splice(msgIndex, 1);
			}
		}
		
		//EMAIL
		if(!utilit.isValidEmail($scope.email)){
			$scope.errors = true;
			var notValidMsg = 'L\'adresse email saisie n\'est pas valide';
			if(!$scope.errorsMsg.includes(notValidMsg)){
				$scope.errorsMsg.push(notValidMsg);
			}
		}
		else{
			var msgIndex = $scope.errorsMsg.indexOf('L\'adresse email saisie n\'est pas valide');
			if (msgIndex > -1) {
				$scope.errorsMsg.splice(msgIndex, 1);
			}
		}
		
		if($scope.errorsMsg.length == 0){
			$scope.errors = false;
			var dataForm = 
			{
				'login' : $scope.login, 
				'password' : $scope.password,
				'email' : $scope.email
			}
		}
	};
}]);

app.controller('SearchController', ['$scope', '$http', '$rootScope', '$cookies', '$window', 'utilit', function($scope, $http, $rootScope, $cookies, $window, utilit){
	var ctrl = this;
	$scope.errors = false;
	$scope.errorsMsg = '';
	$scope.title=true;
	$scope.content=false;
	$scope.author=false;
	$scope.postData=function(form){
		if(!$scope.keyWords){
			$scope.errors = true;
			$scope.errorsMsg = 'Vous devez renseigner des mots clef';
		}
		else{
			$scope.errors = false;
			$scope.errorsMsg = '';
			var dataForm = 
			{
				'keywords' : $scope.keywords, 
				'title' : $scope.title,
				'content' : $scope.content,
				'author' : $scope.author
			};
			console.log(dataForm);
			
		}
	};
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

app.controller('PageSlugController', ['$scope', '$http', '$routeParams', '$rootScope', 'utilit', function($scope, $http, $routeParams, $rootScope, utilit){
	var ctrl= this;
	
	$scope.isUserLogged = utilit.isUserLogged();
	$scope.wikiExists = true;
	$scope.wikiNotNew = true;
	ctrl.slug = $routeParams.slug;
	
	switch(ctrl.slug){
		case 'last':
			break;
		case 'best_rated':
			break;
		case 'new':
			$scope.wikiNotNew = false;
			ctrl.title = 'Nouvelle page';
			break;
		default:
			var promise = utilit.getData($rootScope.wikiDataServer+'/page/'+$routeParams.slug+".json");
			promise.then(function(response){
				if(response){
					console.log(response);
					$scope.wikiExists = true;
					ctrl.title = response.title;
					$scope.content = response.content;
					
				}
				else{
					$scope.wikiExists = false;
				}
			});
			break;
	}
}]);

app.controller('PageRevisionController', ['$scope', '$http', '$routeParams', '$rootScope', function($scope, $http, $routeParams, $rootScope){
    var ctrl= this;
    ctrl.slug = $routeParams.slug;
}]);

app.controller('PageEditController', ['$scope', '$http', '$routeParams', '$rootScope','$cookies', 'utilit',  function($scope, $http, $routeParams, $rootScope, $cookies, utilit){
    var ctrl= this;
    ctrl.slug = $routeParams.slug;
    ctrl.pageTitle = "Édition : "+ctrl.slug;
    $scope.isUserLogged = utilit.isUserLogged();
    if($scope.isUserLogged){
        ctrl.userToken = 'userToken123456';
    }
    
    var promise = utilit.getData($rootScope.wikiDataServer+'/page/'+$routeParams.slug+".json");
	promise.then(function(response){
		if(response){
		    $scope.initialContent = response.content;
		    $scope.initialTitle = response.title;
		    ctrl.title = response.title;


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
			
		}
	});
}]);

app.controller('NotFoundController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}])