function Index(){
	var socket = false;
	
	this.start = function(){
		socket = io();
		this.bindSocketEvents();
		socket.emit('index_init');
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