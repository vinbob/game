function Index(){
	var socket = false;
	
	var uniqueId = localStorage.getItem('uniqueId');

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
			var html = "";
			
			for(var i in data){
				var q = data[i];
				if (q.quiz == 'vincent'){
					html += "<div><a href='"+q.link+"'>* "+q.quiz+"</a></div>";
				}
			}
			
			//$('#quiz_list_area').html(html);
		});
		
		socket.on('connect_connect_ok',function(data){
			location.href='quiz.html';
			localStorage.setItem('uniqueId', data);
			return false;
		});		
	}

	$('#btn_login').click(function(){
		window.location.href = "/quiz/"+$('#gebruikersnaam').val();
	});
	$('#btn_login_digiboard').click(function(){
		window.location.href = "/digiboard/"+$('#gebruikersnaam').val();
	});
}

$(document).ready(function(){
	var index = new Index();
	index.start();
});