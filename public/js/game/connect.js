function Connect(){
	var socket = false;
	
	this.start = function(){
		socket = io();
		this.bindViewEvents();
		this.bindSocketEvents();
		socket.emit('connect_init');
	}
	
	this.bindSocketEvents = function(){
		socket.on('connect_init_ok',function(data){
			if(data.quiz_desc){
				$('#quiz_title').html('<h1>'+data.quiz_desc+'</h1>');
			}
			
			if(data.quiz_pic){
				$('#quiz_pic').html('<img src="'+data.quiz_pic+'"/>');
			}
		});
		
		socket.on('connect_init_nok',function(){
			location.href = '/';
		});
		
		socket.on('connect_init_ok_ready_quiz',function(){
			location.href = '/quiz.html';
		});
		
		socket.on('connect_connect_nok_invalid_quiz_code',function(){
			alert('Invalid quiz code!');
		});
		
		socket.on('connect_connect_nok_invalid_team_name',function(){
			alert('Invalid team name! Please try another one (must be at least 4 characters and not used by another team)');
		});
		
		socket.on('connect_connect_nok_invalid_admin_password',function(){
			alert('Invalid administrator password!');
		});
		
		socket.on('connect_connect_ok',function(data){
			location.href='quiz.html';
			
			return false;
		});		
		
	}
	
	this.bindViewEvents = function(){
		$('#btn_connect_unofficial').click(function(){
			socket.emit('connect_connect',{type:'unofficial',team_name:$('#unofficial_team_name').val()});			
			return false;
		});
		
		$('#btn_connect_official').click(function(){
			socket.emit('connect_connect',{type:'official',team_name:$('#official_team_name').val(),quiz_code:$('#official_quiz_code').val(),q1:$('input[name="q1"]:checked').val(),q2:$('input[name="q2"]:checked').val(),q3:$('input[name="q3"]:checked').val(),q4:$('input[name="q4"]:checked').val(),q5:$('input[name="q5"]:checked').val()});
			return false;
		});

		$('#btn_connect_spectator').click(function(){
			socket.emit('connect_connect',{type:'spectator'});
			return false;
		});
		
		$('#btn_admin_connect').click(function(){
			let qlist = []; 
			for (let i in questions) {
				if ($('#check'+i).is(':checked')) {
					qlist.push($('#check'+i).val());
				}
			}
			socket.emit('connect_connect',{type:'admin',admin_password:$('#admin_password').val(),questions:qlist});
			return false;
		});	
		$('#btn_admin_questions').click(function(){
			if ($('#admin_password').val() == 'test') {
				$('#questions').show();
				$(this).hide();
			} else {
				alert('onjuist wachtwoord');
			}
			return false;
		});	
	}
}

$(document).ready(function(){
	var connect = new Connect();
	connect.start();
	qhtml = '';
	for (let i in questions) {
		qhtml += '<input type="checkbox" checked value="' +  i + '" id="check' + i + '" /> ' + questions[i].question;
		qhtml += '<br />';
	}
	$('#questions').html(qhtml);
});