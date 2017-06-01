var app = angular.module("WikiApp", ["ngCookies", "ngTouch", "ngMap", "ngRoute", "ui.tinymce", "ngSanitize"]);

//FACTORY

app.factory('utilit', ['$cookies', '$rootScope', '$http', function ($cookies, $rootScope, $http) {
	var methods = {};
	
	methods.arrayToJson = function(data){
		return(JSON.stringify(data));
	};
	
	methods.doLogin = function(data){
		data = methods.arrayToJson(data);
		logUser = methods.submitData(data, "POST", $rootScope.dataServer+"login");
		logUser.then(function(response){
			if(response){
				$log = $cookies.get('angularWikiUserToken');
		 		$cookies.put('angularWikiUserToken', response.data.usertoken);
			}
			else{
				return false;
			}
		});
	};
	
	methods.doLogout = function(){
		$cookies.remove('angularWikiUserToken');
	};
	
	methods.doSignup = function(data){
		var _data = methods.arrayToJson(data);
		return $http({
			url: "http://localhost/ECV2016/wikiSymfony/web/app_dev.php/signup",
			method: "POST",
			data: _data
		}).then(function(response){
			if(response){
				return true;
			}
			else{
				return false;
			}
		});
	}
	
	methods.isUserLogged = function(){
		var logUser = $cookies.get('angularWikiUserToken');
		if(logUser){
			return true;
		}
		return true;
	};
	
	methods.isValidEmail = function(email){
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	};
	
	methods.submitData = function(_data, _method, _url){
		return $http({
			url: _url,
			method: _method,
			data: JSON.stringify(_data),
			headers: {'Content-Type': 'application/json'}
		});
	};
	
	methods.getData = function(_url){
		var data =  $http.get(_url)
	    .then(function(response) {
	        return response.data;
	    }, function(response) {
	        return false;
	    });
		return data;
	};
	
	methods.isWikiCreated = function(slug){
		var slugData = methods.getData($rootScope.wikiDataServer+'/pages/'+slug);
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
	
	methods.createPage = function(data){
		data = methods.arrayToJson(data);
		return methods.submitData(data, "POST", $rootScope.wikiDataServer+"pages");
	}
	
	methods.createRevision = function(data, slug){
		return methods.submitData(data, "POST", $rootScope.wikiDataServer+"pages/"+slug+"/revision");
	}
	
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
	$rootScope.wikiDataServer = 'http://localhost/ECV2016/wikiSymfony/web/app_dev.php/';
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
			utilit.doLogin(dataForm);
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
				'username' : $scope.login, 
				'plainPassword' : $scope.password1,
				'email' : $scope.email
			}
			console.log(dataForm);
			var signup = utilit.doSignup(dataForm);
			if(signup){
				$scope.errors = false;
				$scope.success = true;
				$scope.successMsg = "Votre compte a été créé";
			}
			else{
				$scope.success = false;
				$scope.errors = true;
				var msgIndex = $scope.errorsMsg.indexOf('Votre compte n\'a pas pu être créé');
				if (msgIndex < 0) {
					$scope.errorsMsg.push('Votre compte n\'a pas pu être créé');
				}
			}
		}
	};
}]);

app.controller('SearchController', ['$scope', '$http', '$rootScope', '$cookies', '$window', 'utilit', function($scope, $http, $rootScope, $cookies, $window, utilit){
	var ctrl = this;
	$scope.errors = false;
	$scope.errorsMsg = '';
	$scope.postData=function(form){
		if(!$scope.keyWords){
			$scope.errors = true;
			$scope.errorsMsg = 'Vous devez renseigner des mots clef';
		}
		else{
			$scope.errors = false;
			$scope.errorsMsg = '';
			var promise = utilit.getData($rootScope.wikiDataServer+"pages/search?q="+$scope.keyWords);
			var data = promise.then(function(response){
				$scope.result = response;
			});
			
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
	$scope.wikiAll = false;
	ctrl.slug = $routeParams.slug;
	
	switch(ctrl.slug){
		case 'last':
			$scope.wikiAll = true;
			ctrl.title = "Dernier wikis";
			var promise = utilit.getData($rootScope.wikiDataServer+"pages/last?offset=0&limit=1");
			var data = promise.then(function(response){
				$scope.allWiki = response;
			});
			break;
		case 'best_rated':
			break;
		case 'all':
			$scope.wikiAll = true;
			ctrl.title = "Tous les wikis";
			var promise = utilit.getData($rootScope.wikiDataServer+"pages/last");
			var data = promise.then(function(response){
				$scope.allWiki = response;
			});
			break;
		case 'new':
			$scope.wikiExists = false;
			$scope.wikiNotNew = false;
			$scopeerrors = false;
			$scope.errorsMsg = new Array();
			ctrl.title = 'Nouvelle page';
			$scope.postData=function(form){
				if(!$scope.title){
					var msgIndex = $scope.errorsMsg.indexOf('Le titre doit être renseigné');
					$scope.errors = true;
					if (msgIndex < 0) {
						$scope.errorsMsg.push('Le titre doit être renseigné');
					}
				}
				else{
					$scope.errors = false;
					$scope.errorsMsg = new Array();
					var dataForm = 
					{
						'title' : $scope.title,
						'userid' : 1
					};
					var create = utilit.createPage(dataForm);
					create.then(function(response) {
				    }, function(response) {

				    });
				}
			}
			break;
		default:
			var promise = utilit.getData($rootScope.wikiDataServer+'pages/'+$routeParams.slug);
			promise.then(function(response){
				if(response){
					dataSlug = response[0];
					$scope.wikiExists = true;
					ctrl.title = dataSlug.title;
					
					$scope.hasContent = false;
					dataSlug.revisions.forEach(function(revision) {
						  if(revision.status == 'online'){
							  $scope.content = decodeURI(revision.content);
							  var date = new Date(dataSlug.createdAt);
							  ctrl.date = date.toLocaleDateString();
							  if($scope.content.length > 0){
								  $scope.hasContent = true;
							  }
						  }
					});
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

app.controller('PageEditController', ['$scope', '$http', '$routeParams', '$rootScope','$cookies', 'utilit', '$window',  function($scope, $http, $routeParams, $rootScope, $cookies, utilit, $window){
    var ctrl= this;
    ctrl.slug = $routeParams.slug;
    ctrl.pageTitle = "Édition : "+ctrl.slug;
    $scope.errors = true;
    $scope.isUserLogged = utilit.isUserLogged();
    $scope.success = false;
    $scope.successError = false;
    ctrl.userToken = "123";
    
    var promise = utilit.getData($rootScope.wikiDataServer+'pages/'+$routeParams.slug);
	promise.then(function(response){
		$scope.errors = false;
		var data = response[0];
	    $scope.initialContent = "";
	    $scope.initialTitle = data.title;
	    ctrl.pageTitle = "Édition : "+data.title;
	    ctrl.title = data.title;
	    
	    data.revisions.forEach(function(revision) {
			  if(revision.status == 'online'){
				  $scope.initialContent = decodeURI(revision.content);
			  }
		});

	    $scope.editorOptions = {
	      plugins: 'link image code',
	      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
	    };
	});
	
	$scope.postData=function(form){
		if(!$scope.initialContent){
			$scope.successError = true;
			$scope.successErrorMsg = "Vous devez renseigner du contenu";
			alert($scope.successErrorMsg)
		}
		else{
	    	var dataForm = 
    		{
    			'status' : 'pending_validation',
    			'content' : encodeURI($scope.initialContent)
    		};
	    	var revision = utilit.createRevision(dataForm, ctrl.slug);
	    	revision.then(function(response){
	    		alert('La modification a été enregistrée');
	    		$window.location.href ='#!/page/'+ctrl.slug;
				$scope.success = true;
			}, function(response){
				$scope.successError = true;
				$scope.successErrorMsg = "Erreur !";
			});
		}
    };

}]);

app.controller('NotFoundController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
	 var ctrl = this;
}])