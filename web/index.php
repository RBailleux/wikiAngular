<!DOCTYPE html>
<html lang="en" ng-app="WikiApp">
	<head>
		<meta charset="UTF-8">
		<title>Wiki Angular</title>
		<script src="bower_components/angular/angular.js"></script>
		<script src="bower_components/angular-touch/angular-touch.min.js"></script>
		<script src="bower_components/ngmap/build/scripts/ng-map.min.js"></script>
		<script src="bower_components/angular-route/angular-route.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-cookies.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-sanitize.js"></script>
		<script src="http://maps.google.com/maps/api/js?key=AIzaSyA-z8PTHzvOaIlCOhWo0cVJraB7R4i6JJo&libraries=geometry"></script>
		
		<script type="text/javascript" src="bower_components/tinymce/tinymce.js"></script>
		<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
		<script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
		<script type="text/javascript" src="js/angular-ui-tinymce.min.js"></script>
		<script type="text/javascript" src="js/adminlte.min.js"></script>
		
		<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
		<link rel="stylesheet" href="css/AdminLTE.min.css">
		<link rel="stylesheet" href="css/skin-blue.min.css">
		<link rel="stylesheet" href="css/app.css" />
	</head>
	<body class="hold-transition skin-blue sidebar-mini">
		<div ng-controller="NavigationController">
			<div ng-include="header"></div>
			<div ng-include="sidebar"></div>
		</div>
		<div class="content-wrapper">
			<section class="content">
				<div ng-view></div>
			</section>
		</div>
	</body>
</html>
