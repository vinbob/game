/* the javascript file for connect.html

- shows the admin area if the user wants to login as an admin
- shows and handles the pregame if the user wants to be a player
- redirects the user if they want to be the digiboard
*/

function Connect(){
	var socket = false;
	var uniqueId = localStorage.getItem('uniqueId'); //get the cookie of the player id
	var qID = -1; // keep track of which question we are at during the pregame
	var personQs = {
		1: ['Ik werk het liefst met...','Mensen','Dingen'],
		2: ['Ik vind het leukste om...','Nieuwe ideeën te bedenken','Een idee helemaal uit te werken en werkelijkheid te maken'],
		3: ['Ik...','Neem graag de leiding','Ben liever onderdeel van een team'],
		4: ['Ik wil het liefst dingen...','Bedenken','Bouwen'],
		5: ['Ik haal voldoening uit...','Iemand te kunnen helpen','Iets helemaal te snappen']
	} // these are the questions for the pregame
	var pregameanswers = {1:0,2:0,3:0,4:0,5:0}; //object to store answers to the pregame (0 is left, 1 is right)

	this.start = function(){
		socket = io();
		this.bindViewEvents();
		this.bindSocketEvents();
		socket.emit('connect_init');
	}
	
	this.bindSocketEvents = function(){
		socket.on('connect_init_ok',function(data){
			//
		});
		
		socket.on('connect_init_nok',function(){
			location.href = '/';
		});
		
		socket.on('connect_init_ok_ready_quiz',function(){ //if already loggin in, redirect to quiz.html
			location.href = '/quiz.html';
		});
		
		socket.on('connect_connect_nok_invalid_quiz_code',function(){
			alert('Invalid quiz code!');
		});
		
		socket.on('connect_connect_nok_invalid_admin_password',function(){
			alert('Invalid administrator password!');
		});
		
		socket.on('connect_connect_ok',function(data){
			location.href='quiz.html'; //login is complete, redirect to quiz.html
			localStorage.setItem('uniqueId', data); //set the cookie for the player id
			return false;
		});		
		
	}
	
	this.bindViewEvents = function(){
		function getBrowserName() { //get the browser for fixing bugs related to browser type
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
			/* determine the role of the player after completing the pregame, based on the weights of the answers
			- there are 5 questions
			- there are 6 roles
			- for each question, each role has a weight for the left and right answer (0, 0.5 or 1)
			- the role with the highest final score becomes the role of the player
			*/
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
			/* handles clicking on the left or right answer or arrow to move to the next slide in the pregame.
			- saves the answers (ans) for each question
			- on the final question (after qID == 7), connection is made with the server (through app.js) by connect_connect
			*/
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
		

		$('#btn_connect_spectator').click(function(){ //handle clicking the button to connect as the digiboard
			socket.emit('connect_connect',{type:'spectator', browser: getBrowserName()});
			return false;
		});
		
		$('#btn_admin_connect').click(function(){ //handle clicking the button to connect as the admin
			let qlist = []; 
			for (let i in questions) {
				if ($('#check'+i).is(':checked')) {
					qlist.push($('#check'+i).val());
				}
			}
			socket.emit('connect_connect',{type:'admin',admin_password:$('#admin_password').val(),questions:qlist,endgame:$('#admin_endgame').is(':checked'), browser: getBrowserName()});
			return false;
		});	
		$('#btn_admin_questions').click(function(){ //handle clicking the button to view all the questions to select them
			if ($('#admin_password').val() == 'tttt') {
				$('#questions').show();
				$(this).hide();
			} else {
				alert('onjuist wachtwoord');
			}
			return false;
		});	

		function getQueryParams() { // from the url, determine if the user wants to login as a player or as an admin/bigiboard, and for which quiz session.
			const params = new URLSearchParams(window.location.search);
			return {
				quiz_id: params.get('quiz_id'),
				type: params.get('type')
			};
		}
	
		// URL parameters ophalen
		const params = getQueryParams();

		// Controleren of spectator true is
		if (params.type === 'spectator' && params.quiz_id) {
			socket.emit('connect_connect',{type:'spectator'}); //if it is the digiboard, immediately connect, which will redirect to quiz.html
		} else if (params.type === 'player' && params.quiz_id) { //if it is a player, hide the admin area in connect.html
			$('#admin').hide();
		} else if (params.type === 'admin') { //if it is an admin, hide the player area in connect.html
			$('#player').hide();
		}
	}

	
}

$(document).ready(function(){
	var connect = new Connect();
	connect.start();
	qhtml = '';
	var categories = {};
	for (let i in questions) { //create the dropdown menu with all questions and checkboxes
		cat = questions[i].category;
		if (!(cat in categories)){
			categories[cat] = '<details><summary style="cursor:pointer;"><b>'+cat+'</b></summary><table>';
		}
		categories[cat] += '<tr><td><input type="checkbox" ';
		if (cat == 'Basis'){
			categories[cat] += 'checked ';
		}
		categories[cat] += 'value="' +  i + '" id="check' + i + '" /></td><td text-align="left"> ' ;
		if(questions[i].type){
			categories[cat] += '<b>[open vraag]</b> ';
		}
		categories[cat] += questions[i].question + '</td></tr>';
	}
	for (let i in categories){
		qhtml += '';
		qhtml += categories[i];
		qhtml += '</table></details>';
	}
	$('#questions').html(qhtml);
});