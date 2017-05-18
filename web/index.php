<!DOCTYPE html>
<html lang="en" ng-app="WikiApp">
	<head>
		<meta charset="UTF-8">
		<title>AIRBNB</title>
		<script src="bower_components/angular/angular.js"></script>
		<script src="bower_components/angular-foundation-6/dist/angular-foundation.min.js"></script>
		<script src="bower_components/angular-touch/angular-touch.min.js"></script>
		<script src="bower_components/ngmap/build/scripts/ng-map.min.js"></script>
		<script src="bower_components/angular-route/angular-route.min.js"></script>
		<script src="http://maps.google.com/maps/api/js?key=AIzaSyA-z8PTHzvOaIlCOhWo0cVJraB7R4i6JJo&libraries=geometry"></script>
		
		<script src="app.js"></script>
		
		
		<link rel="stylesheet" href="bower_components/foundation-sites/dist/css/foundation-flex.min.css" />
		<link rel="stylesheet" href="app.css" />
	</head>
	<body>
		<div class="container">
			<div ng-view></div>
		</div>
	</body>
</html>
