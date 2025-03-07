/* 
the javascript code for index.html 

- handles the action when the button for admin or digiboard login is clicked
*/

function Index(){
	var socket = false;
	
	var uniqueId = localStorage.getItem('uniqueId'); //get the cookie of the player id

	this.start = function(){
		socket = io();
		this.bindSocketEvents();
		socket.emit('index_init', uniqueId);
		socket.on('redirect_to_quiz', function(){
			location.href='quiz.html';
		});
	}
	
	this.bindSocketEvents = function(){
		socket.on('index_init_ok',function(data){
			//
		});
		
		socket.on('connect_connect_ok',function(data){ // not sure if this is ever used...
			location.href='quiz.html';
			localStorage.setItem('uniqueId', data);
			return false;
		});		
	}

	$('#btn_login').click(function(){
		window.location.href = "/quiz/"+$('#gebruikersnaam').val(); //app.js handles this further, if the gebruikersnaam exists it will make this user the admin
	});
	$('#btn_login_digiboard').click(function(){
		window.location.href = "/digiboard/"+$('#gebruikersnaam').val(); //app.js handles this further, if the gebruikersnaam exists it will make this user the digiboard
	});
}

$(document).ready(function(){
	var index = new Index();
	index.start();
});