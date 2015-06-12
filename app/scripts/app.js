"use strict";


var userChat = {
	room: "",
	username : "Joe Lipper",
	time : "1:45",
	message: "Hey, how's it going?"
};

var blocChat = angular.module('BlocChat', ['ui.router', 'firebase', "ui.bootstrap", 'ngCookies']);

blocChat.run(['$cookies', '$modal', '$rootScope', function ($cookies, $modal, $rootScope) {


	if (!$cookies.blocChatCurrentUser || $cookies.blocChatCurrentUser === '') {

		$modal.open({

		templateUrl: '../templates/username-modal.html',
		controller: 'usernameModalCtrl'

		});

	} else {

		$rootScope.username = $cookies.blocChatCurrentUser;

	};
}]);

blocChat.controller('usernameModalCtrl', ["$scope", "$modalInstance", "Room", '$cookies', function($scope, $modalInstance, Room, $cookies) {


	var messages = Room.chats

	$scope.usernameForm = {
		name: " "
	};


	$scope.enter = function(){
		$cookies.blocChatCurrentUser = $scope.usernameForm.name;
		// messages.$add({username: $scope.usernameForm.name});
		$modalInstance.close($scope.usernameForm.name);
	};


	// 	var rooms =  Room.all;

	// 	$scope.form = {
	// 	text: " "
	// 	};

	// $scope.input = function() {
	// 	rooms.$add({name: $scope.form.text});
	// 	$modalInstance.close($scope.form.text);
	// };

	// $scope.cancel= function(){
	// 	$modalInstance.dismiss('cancel');
	// };
}]);

blocChat.factory('Room', ['$firebaseArray', function($firebaseArray, $scope){
	var firebaseRef = new Firebase('https://shining-torch-9429.firebaseio.com/');
	var rooms = $firebaseArray(firebaseRef.child('rooms'));
	var messages = $firebaseArray(firebaseRef.child('messages'));

	// console.log(messages);


	// rooms.$add({name: 'Room 1'});

	return {
		all: rooms,
		chats: messages,
		messagesFunction: function(roomId) {
			return firebaseRef.child('messages').orderByChild('roomId').equalTo(roomId);
			// .on("value", function(snapshot){
			// 	return snapshot.val();
			// 	// console.log(snapshot.val());
			// });
		}
	};
}]);

// blocChat.controller('chatLog', ['$scope', "Room", function($scope, Room){
// 	$scope.chat= userChat;
// }]);

blocChat.controller('RoomsDisplay', ['$scope', 'Room', '$cookies', "$modal", function($scope, Room, $cookies, $modal){

	$scope.rooms = Room.all;

	$scope.chat= userChat;

	var chats = Room.chats;


	// $scope.roomMessage = this.room;

	// console.log(Room.chats);

	$scope.roomClick= function(){


		var chatMessage = Room.messagesFunction(this.room.$id);

		chatMessage.on("value", function(snapshot){
			$scope.roomMessage = snapshot.val();
		});

		// POSSIBLE SOLUTION FOR WAITING FOR DATA …
		// var waitForChatMessages = setInterval(function () {
		// 	if (chatMessage) {
		// 		console.log(chatMessage);
		// 		clearInterval(waitForChatMessages);
		// 	}
		// }, 50);

		// $scope.chats.orderByChild('roomId').equalTo(this.room.$id);

		// $scope.roomMessage = this.room.chatlog;

		// console.log(this.room.chatlog);

		userChat.room= this.room.name;

		$scope.roomIdString = this.room.$id;
	};

	$scope.newUser = function() {
		$modal.open({

			templateUrl: '../templates/username-modal.html',
			controller: 'newUsernameModalCtrl'

		});
	};


	$scope.messageForm = null;


	$scope.send = function(){

		if ($scope.messageForm !== null) {

		var currentDate = new Date();
		var datetime = currentDate.getHours() + ":" + currentDate.getMinutes();

		chats.$add({
			message: $scope.messageForm, 
			username: $cookies.blocChatCurrentUser,
			time: datetime,
			roomId: $scope.roomIdString
		});

		$scope.messageForm = null;

	}

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

// blocChat.controller('newUsernameModal', ["$scope", "$modal", "Room", function($scope, $modal, Room){
	
// 	$scope.newUser = function() {
// 		$modal.open({

// 			templateUrl: '../templates/username-modal.html',
// 			controller: 'newUsernameModalCtrl'

// 		});
// 	};
// }]);

blocChat.controller('newUsernameModalCtrl', ["$scope", "$modalInstance", "Room", '$cookies', function($scope, $modalInstance, Room, $cookies) {

	var messages = Room.chats

	$scope.usernameForm = {
		name: " "
	};


	$scope.enter = function(){
		$cookies.blocChatCurrentUser = $scope.usernameForm.name;
		// messages.$add({username: $scope.usernameForm.name});
		$modalInstance.close($scope.usernameForm.name);
	};

	$scope.dismiss = function(){
		$modalInstance.dismiss('cancel');
	};
}]);
