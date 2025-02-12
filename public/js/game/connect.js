function Connect(){
	var socket = false;
	var uniqueId = localStorage.getItem('uniqueId');
	var qID = -1;
	var personQs = {
		1: ['Ik werk het liefst met...','Mensen','Dingen'],
		2: ['Ik vind het leukste om...','Nieuwe ideeën te bedenken','Een idee helemaal uit te werken en werkelijkheid te maken'],
		3: ['Ik...','Neem graag de leiding','Ben liever onderdeel van een team'],
		4: ['Ik wil het liefst dingen...','Bedenken','Bouwen'],
		5: ['Ik haal voldoening uit...','Iemand te kunnen helpen','Iets helemaal te snappen']
	}
	var pregameanswers = {1:0,2:0,3:0,4:0,5:0};

	this.start = function(){
		socket = io();
		this.bindViewEvents();
		this.bindSocketEvents();
		socket.emit('connect_init');
	}
	
	this.bindSocketEvents = function(){
		socket.on('connect_init_ok',function(data){
			if(data.quiz_desc){
				//$('#quiz_title').html('<h1>'+data.quiz_desc+'</h1>');
			}
			
			/*if(data.quiz_pic){
				$('#quiz_pic').html('<img src="'+data.quiz_pic+'"/>');
			}*/
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
		
		/*socket.on('connect_connect_nok_invalid_team_name',function(){
			alert('Je naam moet minstens 2 letters hebben en niet al in gebruik zijn.');
		});*/
		
		socket.on('connect_connect_nok_invalid_admin_password',function(){
			alert('Invalid administrator password!');
		});
		
		socket.on('connect_connect_ok',function(data){
			location.href='quiz.html';
			localStorage.setItem('uniqueId', data);
			return false;
		});		
		
	}
	
	this.bindViewEvents = function(){
		function getBrowserName() {
			const userAgent = navigator.userAgent;
			
			if (userAgent.indexOf("Firefox") > -1) {
			  return "Mozilla Firefox";
			} else if (userAgent.indexOf("SamsungBrowser") > -1) {
			  return "Samsung Internet";
			} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
			  return "Opera";
			} else if (userAgent.indexOf("Trident") > -1) {
			  return "Microsoft Internet Explorer";
			} else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
			  return "Microsoft Edge";
			} else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
			  return "Google Chrome";
			} else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) {
			  return "Apple Safari";
			} else {
			  return "Unknown browser";
			}
		  }

		function capitalizeFirstLetter(val) {
		    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
		}

		function getRole(){
			var answerweights = {
					1: {
						1: [0,1],
						2: [0.5,0],
						3: [0,0.5],
						4: [1,0],
						5: [0,0.5],
						6: [1,0]
					},
					2: {
						1: [0,1],
						2: [0,1],
						3: [1,0],
						4: [0,0],
						5: [1,0],
						6: [0,0]
					},
					3: {
						1: [0,0],
						2: [1,0],
						3: [0,0],
						4: [1,0],
						5: [0,0],
						6: [0,1]
					},
					4: {
						1: [0,1],
						2: [0.5,0],
						3: [1,0],
						4: [0,0],
						5: [1,0],
						6: [0,0]
					},
					5: {
						1: [0,0],
						2: [0,0],
						3: [0,0.5],
						4: [1,0],
						5: [0,0.5],
						6: [1,0]
					}};
				var rolescores = {};
				for (let rl in rolenames){
					rolescores[rl] = 0;
				}
				console.log(pregameanswers);
				console.log(rolescores);
				for (let quest in pregameanswers){
					for (let rl in rolescores){
						rolescores[rl] += answerweights[quest][rl][parseInt(pregameanswers[quest])];
					}
				}
				
				let maxKey = null;
				let maxValue = -Infinity;
				for (let [key, value] of Object.entries(rolescores)) {
					if (value > maxValue) {
						maxValue = value;
						maxKey = key;
					}
				}
				return(maxKey);
		}

		function nextQuestion(ans){
			qID++;
			if (0 < qID && qID < 6){
				if (qID > 1){
					pregameanswers[qID-1] = ans;
				}
				$('#btn_links').show();
				$('#btn_rechts').show();
				$('#btn_links').html(personQs[qID][1]);
				$('#btn_rechts').html(personQs[qID][2]);
				$('#signuptext').html(personQs[qID][0]);
			} else if (qID == 6){
				pregameanswers[5] = ans;
				$('#btn_links').hide();
				$('#btn_rechts').hide();
				$('#pijlimg').show();
				$('#signuptext').html(capitalizeFirstLetter($('#official_team_name').val())+', jij bent een<br /><b>'+rolenames[getRole()]+'!</b><br /><img src="content/bouwer.png" width="150" /><br />'+roledescriptions[getRole()]);
			} else if (qID == 7){
				$('#pijlimg').show();
				$('#signuptext').html('Bij vragen die dit icoon tonen...<br /><img src="content/bouwer.png" width="75" /><br/>...kun jij dubbele punten verdienen. Denk dan dus extra goed na over je antwoord!');
			} else {
				socket.emit('connect_connect',{type:'official',team_name:$('#official_team_name').val(),quiz_code:'test',role:getRole(), browser: getBrowserName()});
				socket.emit('update_leaderboard');
				return false;
			}
		}

		$('#btn_rechts').click(function(){
			nextQuestion(1);
		});

		$('#btn_links').click(function(){
			nextQuestion(0);
		});

		$('#pijlimg').click(function(){
			if(qID == -1){
				if ($('#official_team_name').val() != ''){
					qID++;
					$('#signuptext').html('Je krijgt nu een paar vragen voorgelegd.');
					$('#official_team_name').hide();
				}
			} else {
				$('#pijlimg').hide();
				nextQuestion();
			}
		});
		  
		/*$('#btn_connect_unofficial').click(function(){
			socket.emit('connect_connect',{type:'unofficial',team_name:$('#unofficial_team_name').val()});			
			return false;
		});*/
		
		$('#btn_connect_official').click(function(){
			var pregameanswers = {q1:$('input[name="q1"]:checked').val(),q2:$('input[name="q2"]:checked').val(),q3:$('input[name="q3"]:checked').val(),q4:$('input[name="q4"]:checked').val(),q5:$('input[name="q5"]:checked').val()}
			socket.emit('connect_connect',{type:'official',team_name:$('#official_team_name').val(),quiz_code:$('#official_quiz_code').val(),pregameanswers:pregameanswers, browser: getBrowserName()});
			socket.emit('update_leaderboard');
			return false;
		});

		$('#btn_connect_spectator').click(function(){
			socket.emit('connect_connect',{type:'spectator', browser: getBrowserName()});
			return false;
		});
		
		$('#btn_admin_connect').click(function(){
			let qlist = []; 
			for (let i in questions) {
				if ($('#check'+i).is(':checked')) {
					qlist.push($('#check'+i).val());
				}
			}
			socket.emit('connect_connect',{type:'admin',admin_password:$('#admin_password').val(),questions:qlist,endgame:$('#admin_endgame').is(':checked'), browser: getBrowserName()});
			return false;
		});	
		$('#btn_admin_questions').click(function(){
			if ($('#admin_password').val() == 'tttt') {
				$('#questions').show();
				$(this).hide();
			} else {
				alert('onjuist wachtwoord');
			}
			return false;
		});	

		function getQueryParams() {
			const params = new URLSearchParams(window.location.search);
			return {
				quiz_id: params.get('quiz_id'),
				type: params.get('type')
			};
		}
	
		// URL parameters ophalen
		const params = getQueryParams();
		console.log(params.type);
		// Controleren of spectator true is
		if (params.type === 'spectator' && params.quiz_id) {
			socket.emit('connect_connect',{type:'spectator'});
		} else if (params.type === 'player' && params.quiz_id) {
			$('#admin').hide();
		} else if (params.type === 'admin') {
			$('#player').hide();
			console.log('yez');
		}
	}

	
}

$(document).ready(function(){
	var connect = new Connect();
	connect.start();
	qhtml = '';
	aqhtml = '';
	var categories = {};
	var aq = {};
	for (let i in questions) {
		cat = questions[i].category;
		if (!(cat in categories)){
			categories[cat] = '<details><summary style="cursor:pointer;"><b>'+cat+'</b></summary><table>';
			aq[cat] = '<b>'+cat+'</b><br/>';
		}
		categories[cat] += '<tr><td><input type="checkbox" ';
		if (cat == 'Basis'){
			categories[cat] += 'checked ';
		}
		categories[cat] += 'value="' +  i + '" id="check' + i + '" /></td><td text-align="left"> ' ;
		aq[cat] += i+'. ';
		if(questions[i].type){
			categories[cat] += '<b>[open vraag]</b> ';
			aq[cat] += '[open vraag]';
		}
		categories[cat] += questions[i].question + '</td></tr>';
		aq[cat] += '<u>'+questions[i].question+'</u><br />';
		for(let a in questions[i].answers){
			aq[cat] += questions[i].answers[a]+'<br />';
		}
		aq[cat] += '<br />';
	}
	for (let i in categories){
		qhtml += '';
		qhtml += categories[i];
		aqhtml += aq[i];
		qhtml += '</table></details>';
	}
	$('#questions').html(qhtml);
	//$('#allquestions').html(aqhtml);
});