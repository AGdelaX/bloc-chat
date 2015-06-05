"use strict";

var userChat = {
	room: "",
	username : "Joe Lipper",
	time : "1:45",
	message: "Hey, how's it going?"
};

var blocChat = angular.module('BlocChat', ['ui.router', 'firebase', "ui.bootstrap"]);

blocChat.factory('Room', ['$firebaseArray', function($firebaseArray){
	var firebaseRef = new Firebase('https://shining-torch-9429.firebaseio.com/');
	var rooms = $firebaseArray(firebaseRef.child('rooms'));
	var messages = $firebaseArray(firebaseRef.child('messages'));

	// rooms.$add({name: 'Room 1'});

	return {
		all: rooms
	};
}]);

// blocChat.controller('chatLog', ['$scope', "Room", function($scope, Room){
// 	$scope.chat= userChat;
// }]);

blocChat.controller('RoomsDisplay', ['$scope', 'Room', function($scope, Room){

	$scope.rooms = Room.all;

	$scope.chat= userChat;

	// $scope.roomMessage = this.room;



	$scope.roomClick= function(){
		$scope.roomMessage = this.room.chatlog;

		userChat.room= this.room.name;
	};

}]);

// blocChat.controller('RoomsForm', ['$scope', 'Room', function($scope, Room) {
// 	$scope.form = {};

// 	var rooms = Room.all;

// 	$scope.click = function(){
// 		rooms.$add($scope.form);
// 		console.log(Room.all);
// 	};
// }]);

blocChat.controller('modalWindow', ['$scope', '$modal', 'Room', '$log', function($scope, $modal, Room, $log) {

	$scope.open = function() {

		var modalInstance = $modal.open({

		templateUrl: '../templates/modal.html',
		controller: 'modalInstanceCtrl'


		});

		modalInstance.result.then(function () {
            console.log("Instance passed");
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

	};
}]);

blocChat.controller('modalInstanceCtrl', ["$scope", "$modalInstance", "Room", function($scope, $modalInstance, Room) {

		var rooms =  Room.all;

		$scope.form = {
		text: " "
		};

	$scope.input = function() {
		rooms.$add({name: $scope.form.text});
		$modalInstance.close($scope.form.text);
	};

	$scope.cancel= function(){
		$modalInstance.dismiss('cancel');
	};
}]);
