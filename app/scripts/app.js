blocChat = angular.module('BlocChat', ['ui.router', 'firebase']);

blocChat.factory('Room', ['$firebase', function($firebase){
	var firebaseRef = new Firebase('https://shining-torch-9429.firebaseio.com/');
	var rooms = $firebase(firebaseRef.child('rooms')).$asArray();;

	return {
		all: rooms
	};
}]);

blocChat.controller('RoomsDisplay.controller', ['$scope', 'Room', function($scope, Room){
	$scope.rooms = Room.all;
}]);