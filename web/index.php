<!DOCTYPE html>
<html lang="en" ng-app="WikiApp">
	<head>
		<meta charset="UTF-8">
		<title>Wiki Angular</title>
		<script src="bower_components/angular/angular.js"></script>
		<script src="bower_components/angular-foundation-6/dist/angular-foundation.min.js"></script>
		<script src="bower_components/angular-touch/angular-touch.min.js"></script>
		<script src="bower_components/ngmap/build/scripts/ng-map.min.js"></script>
		<script src="bower_components/angular-route/angular-route.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-cookies.js"></script>
		<script src="http://maps.google.com/maps/api/js?key=AIzaSyA-z8PTHzvOaIlCOhWo0cVJraB7R4i6JJo&libraries=geometry"></script>
		
		<script type="text/javascript" src="bower_components/tinymce/tinymce.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
		<script type="text/javascript" src="js/angular-ui-tinymce.min.js"></script>
		
		
		<link rel="stylesheet" href="bower_components/foundation-sites/dist/css/foundation-flex.min.css" />
		<link rel="stylesheet" href="css/app.css" />
	</head>
	<body>
		<div class="container">
			<div ng-view></div>
		</div>
	</body>
</html>
