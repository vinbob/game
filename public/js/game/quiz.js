//var fs = require('fs');
//eval(fs.readFileSync('../qrcode.min.js')+'');

var answers = [];
var openquestion = false;
var goodanswers = [];
var wronganswers = [];
var updateAnswerList = function(){};
var receivedanswers = [];
var answerMaker = function(){};
function toUpdateAns(ans, dir){
	updateAnswerList(ans, dir);
}
function GameWorld(){
	var states = {START:0,TEST_QUESTION:1,STARTING:2,SHOW_QUESTION:3,SHOW_VIDEO:4,SHOW_ANSWER:5,END:6};
	var socket = false;
	
	var userType = false;
	var quizId = '';
	var selectedAnswerId = false;
	var curState = false;
	var savedState = false;
	
	this.init = function(){
		this.initSocket();
		this.initializeView();
		this.bindViewEvents();
		this.bindSocketEvents();		
		
		socket.emit('quiz_init');
	}
	
	this.initSocket = function(){
		socket = io.connect({'reconnection':true,'reconnectionDelay': 1000,'reconnectionDelayMax' : 1000,'reconnectionAttempts': 1000});
	}
	
	this.initializeView = function(){
		$('#timer_area').hide();
		$('#question_area').hide();
		$('#admin_area').hide();
	}
	
	this.showAreasBasedOnRoleAndState = function(state,stateParams){
		$('.element').hide();

		/*All users, all states*/
		$('#controlpanel_area').show();
		$('#generic_options_area').show();
		
		if(state==null && stateParams.leaderboard && $('#btn_show_leaderboard').attr('show_leaderboard')==null){				
				state = savedState;
		}
		
		/*All users, some states*/
		if(state==null && stateParams.leaderboard && $('#btn_show_leaderboard').attr('show_leaderboard')){
				$('#leaderboard_area').show();
				savedState = curState;
		}
		else if(state==states.TEST_QUESTION || state==states.SHOW_QUESTION || state==states.SHOW_ANSWER || state==states.SHOW_VIDEO){
			$('#timer_area').show();
			$('#question_area').show();
		}
		else if(state==states.START || state==states.STARTING || state==states.END){
			$('#wait_area').show();
		}
		

		
		if(userType=='official_participant' || userType=='unofficial_participant'){
			/*All states*/
			$('#participant_area').show();
		}
		else if(userType=='admin'){
			/*Before start*/
			if(state==states.SHOW_QUESTION){
				$('#admin_area_after_start').show();
			}
			else if(state==states.START || state==states.STARTING || state==states.END || state==states.TEST_QUESTION){
				$('#admin_area_before_start').show();
			}
			else if(state==states.SHOW_ANSWER || state==states.SHOW_VIDEO){
				$('#admin_area_show_answer').show();
			
				if(stateParams && stateParams.test) $('#admin_area_before_start').show();
				else $('#admin_area_after_start').show();
			}
		}
		else if(userType=='spectator'){

		}
	}
	
	this.bindViewEvents = function(){
		$('#btn_admin_test_question').click(function(e){
			socket.emit('quiz_admin_test_question');
			return false;
		});
		
		$('#btn_admin_start_quiz').click(function(e){
			socket.emit('quiz_admin_start_quiz');
			return false;
		});
		
		$('#btn_admin_next_question').click(function(e){
			$('#question_area .bet').html('');
			socket.emit('quiz_admin_next_question');
			socket.emit('update_leaderboard');
			return false;
		});
		
		$('#btn_admin_reveal_answer').click(function(e){
			if(openquestion == true && receivedanswers.length > 0){
				alert('Beoordeel eerst alle binnengekomen antwoorden.');
			} else {
				if(openquestion == true){
					if (curState==states.SHOW_VIDEO){
						socket.emit('quiz_admin_reveal_answer', goodanswers);
					} else {
						socket.emit('quiz_admin_reveal_answer', answers.concat(goodanswers));
					}
				} else {
					socket.emit('quiz_admin_reveal_answer');
				}
				socket.emit('update_leaderboard');
			}
			return false;
		});
		
		$('#btn_admin_show_video').click(function(e){
			if(openquestion == true && receivedanswers.length > 0){
				alert('Beoordeel eerst alle binnengekomen antwoorden.');
			} else {
				socket.emit('show_video', [answers.concat(goodanswers),wronganswers]);
			}
			return false;
		});
		
		$('#btn_admin_end_quiz').click(function(e){
			if(confirm("Are you sure you want to end the quiz?")){
				if(confirm("Are you really sure?")){
					socket.emit('quiz_admin_end_quiz');
				}
			}
			
			return false;
		});
		
		$('#btn_leave_quiz').click(function(e){
			if(confirm("Are you sure you want to leave the quiz? All your data will be lost. (score, etc.)")){
				if(confirm("Are you really sure?")){
					socket.emit('quiz_leave_quiz');
					socket.emit('update_leaderboard');
				}
			}
			
			return false;
		});
		
		$('#btn_show_leaderboard').click(function(gameWorld){
			return function(e){
				var show = $('#btn_show_leaderboard').attr("show_leaderboard");

				if(show!=null){
					$('#leaderboard_area').hide();
					$('#btn_show_leaderboard').attr("show_leaderboard",null);
					$('#btn_show_leaderboard').html('scores');
				}
				else{
					//socket.emit('quiz_get_leaderboard');
					socket.emit('update_leaderboard');
					$('#btn_show_leaderboard').attr("show_leaderboard",true);
					$('#btn_show_leaderboard').html('Hide scores');				
				}
				
				//gameWorld.showAreasBasedOnRoleAndState(null,{leaderboard:true});
			};
		}(this)
		);
		
	}
	
	this.bindSocketEvents = function(){
		socket.on('quiz_init_ok',function(gameWorld){
			return function(data){
				userType = data.userType;
				quizId = data.quizId;
				console.log(data);
				gameWorld.showAreasBasedOnRoleAndState(states.START,{});
			};
		}(this));
		
		socket.on('quiz_init_nok',function(data){
			location.href = '/';
		});
		
		socket.on('quiz_state_update',function(gameWorld){
			return function(data){
				var state = data.state;	
				var stateParams = data.stateParams;
				console.log(data);
				//if receiving updates from the server, hide the leaderboard
				if($('#btn_show_leaderboard').attr('show_leaderboard')){
					$('#btn_show_leaderboard').trigger("click");				
				}
				
				gameWorld.showAreasBasedOnRoleAndState(state,stateParams);
				curState = state;
				
				gameWorld.updateGeneralParams(stateParams);
				
				if(state == states.START){
					gameWorld.start(stateParams);
				}
				else if(state == states.TEST_QUESTION){
					gameWorld.showQuestion(stateParams);
				}				
				else if(state == states.STARTING){
					gameWorld.starting(stateParams);
				}
				else if(state == states.SHOW_QUESTION){
					gameWorld.showQuestion(stateParams);
				}
				else if(state == states.SHOW_ANSWER){
					gameWorld.showAnswer(stateParams);
				}
				else if(state == states.END){
					gameWorld.end(stateParams);
				}
				else if(state == states.SHOW_VIDEO){
    				gameWorld.showQuestion(stateParams);
				}
			};
		}(this)
		);

		socket.on('new_leaderboard',function(gameWorld){
			return function(data){
				if (userType == 'spectator'){
					var html = "";
					html += "<div>";
					
					var types = ['official'];
					var names = {
						'official' : 'Live-score',
					};
					
					for(var t in types){
						var participantsType = types[t];
						var name = names[participantsType];
						var elements = data[participantsType];
						
						html += "<h1>" + name + "</h1>";				
						html += "<table class='table table-hover table-condensed table-striped table-bordered' style='width:80%; font-size: 1.8em; border-color:red;'>";
						
						html += "<thead>";
						html += "<tr>";
						html += "<th style='width:50px; border-color:red;' >" + "Rank" + "</th>" + "<th style='border-color:red;'>" + "Speler" + "</th>" + "<th style='border-color:red;'>" + "Score" + "</th><th style='border-color:red;'>Antwoord</th><th style='border-color:red;'>Inzet</th>";
						html += "</tr>";
						html += "</thead>";
						
						html += "<tbody>";
						
						for(var elem in elements){
							var p = elements[elem];
							
							var colorStyle = "background-color: green";
							if(p.isLastCorrect === true){
								colorStyle = "background-color: rgb(133, 255, 135)";
							}
							else if(p.isLastCorrect === false){
								colorStyle = "background-color: rgb(255, 162, 162)";
							}
							
							html += "<tr style='"+colorStyle+"; height:56px; border-color:red;'>";
							var resp = '';
							if(p.response){ // if an answer was selected, show a picture of a card facing down
								resp = '<img src="../content/KlimaatCasino/card.png" width="30" />';
							}
							var betv = '';
							if(p.betValue > 0){
								betv = p.betValue;
							}
							html += "<td>" + p.rank + "</td>" + "<td>" + p.team + "</td>" + "<td>" + p.score + "</td>" + "<td>" + resp + "</td>" + "<td>" + betv + "</td>";
							html += "</tr>";
						}
						
						html += "</tbody>";
						
						html += "</table><br /><br /><br />";
					}
					
					$('#scores').html(html);
				} else if (userType == 'admin'){
					var curreceived = [];
					for(var elem in data['official']){
						var receivedanswer = data['official'][elem].response;
						if (typeof receivedanswer === 'string'){
							const allans = answers.concat(wronganswers).concat(receivedanswers).concat(goodanswers);
							const lallans = allans.map(ans => ans.toLowerCase());
							if (!(lallans.includes(receivedanswer.toLowerCase()))){
								receivedanswers.push(receivedanswer);
							}
						}
						curreceived.push(receivedanswer);
					}

					for(var a in receivedanswers){
						var ans = receivedanswers[a];
						if (!(curreceived.includes(ans)) || !ans){
							receivedanswers = receivedanswers.filter(item => item !== ans);//remove from received list
						}
					}
					console.log(receivedanswers);
					var html = '';
					for(var a in receivedanswers){
						var ans = receivedanswers[a];
						if (ans){
							html += answerMaker('pending', ans);
							console.log(ans);
						}
					}
					
					$('#pending').html(html);
				}
			};
		}(this)
		);

	}
	
	this.setWaitStatus = function(text){
		$('#wait_status').html(text);
	}
	
	this.start = function(stateParams){		
		this.setWaitStatus('Get ready!');

		function getUrlWithoutLastPart(url) {
			// Verwijder het protocol (http:// of https://)
			let urlWithoutProtocol = url.replace(/^https?:\/\//, '');
    
			// Verwijder www. als het aanwezig is
			urlWithoutProtocol = urlWithoutProtocol.replace(/^www\./, '');
		
			// Verwijder alles na de laatste slash
			return urlWithoutProtocol.substring(0, urlWithoutProtocol.lastIndexOf('/'));
		}

		if (userType == 'spectator'){
			$('#qr').html("Scan de QR of ga naar "+getUrlWithoutLastPart(window.location.href)+"/join/"+quizId+" en speel mee!");
			var qrcode = new QRCode(document.getElementById("qrcode"), {
				text: getUrlWithoutLastPart(window.location.href)+"/join/"+quizId,
				width: 128,
				height: 128
			});
		}
	}
	
	this.starting = function(stateParams){
		this.setWaitStatus('Starting... Good luck and have fun!');
	}
	
	var betValue = 0;
	var temp_answer = 404;
	var vidlink = '';
	var temp_role = "";
	this.showQuestion = function(stateParams){	
		receivedanswers = [];
		openquestion = false;	
		$('#answer_status').html("");
		if(stateParams.pic!='') $('#question_area .pic').html("<img style='max-width: 500px; width:100%' src='"+stateParams.pic+"' />");
		else $('#question_area .pic').html('');
		
		vidlink = '';
		$('#btn_admin_show_video').hide();
		if(stateParams.vid!=''){
			vidlink = stateParams.vid;
			$('#btn_admin_show_video').show();
		}

		if(stateParams && stateParams.score){
			var score = stateParams.score;
		}
		
		if(userType=='official_participant'){
    		if (curState==states.SHOW_QUESTION){
        		
        		//when the new question is loaded, reset all values
        		betValue = 0;
        		temp_answer = 404;
    		     selectedAnswerId = false;
    		     socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
    		     
        		var betarea = '<input type="submit" id="bet1" value="1" style="width: 40px; color: black;';
        		if(score < 1){
            		betarea += 'display: none;';
            }
        		betarea += '" /><input type="submit" id="bet10" value="10" style="width: 53px; color: black;';
        		if(score < 10){
            		betarea += 'display: none;';
            }
            betarea += '"/>';
        		$('#question_area .bet').html(' inzetten: '+betarea);
        		
        		//showing the betted value
        		var bettedarea = 'Inzet: <span id="totalbet">'+betValue+'</span> <input type="submit" id="min1" value="-1" style="width: 53px; color: black;';
            bettedarea += '"/>';
            
        		$('#question_area .betted').html(bettedarea);
        		$('#question_area .question').html("Kies je antwoord en zet in!");
        		if(stateParams.bonusrole.includes(temp_role)){
            		$('#question_area .question').html("Bonusvraag! Dubbele punten verdienen.");
        		}
			} else { //this means the state must be show video
			$('#question_area .betted').html("Je inzet is "+betValue);
				$('#question_area .question').html("");
				$('#question_area .bet').html("");
			}
    	} else { //the user is the admin
    	   $('#question_area .question').html(stateParams.question);
		   if (userType=='spectator'){
			    if (curState==states.SHOW_VIDEO){
					$('#question_area .bet').html('<video width="640" height="480" controls><source src="content/KlimaatCasino/'+ vidlink + '" type="video/mp4">Your browser does not support the video tag.</video>');
				}else{
					$('#question_area .bet').html('');
				}
			}
    	}
    			
    	$('#bet1').click(function() {
			if(curState == states.SHOW_QUESTION){
				// Get the value of 'bet' input field
				//var betValue = $(this).val();
				betValue += 1;
				if (betValue >= score){
				$(this).css('display', 'none');
				}
				if (betValue >= (score - 9)){
				$('#bet10').css('display', 'none');
				}
				$('#totalbet').html(betValue); //update betted value displayed
				// Check if user is an official_participant or unofficial_participant and if the current state is SHOW_QUESTION or TEST_QUESTION
				if (userType === 'official_participant' && curState === states.SHOW_QUESTION) {
					// Send socket event with answerId and betValue
					socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
					socket.emit('update_leaderboard');
				}
			}
		});
     $('#bet10').click(function() {
		if(curState == states.SHOW_QUESTION){
			// Get the value of 'bet' input field
			//var betValue = $(this).val();
			betValue += 10;
			if (betValue >= score){
			$('#bet1').css('display', 'none');
			}
			if (betValue >= (score - 9)){
			$(this).css('display', 'none');
			}
			$('#totalbet').html(betValue); //update betted value displayed
			// Check if user is an official_participant or unofficial_participant and if the current state is SHOW_QUESTION or TEST_QUESTION
			if (userType === 'official_participant' && curState === states.SHOW_QUESTION) {
				// Send socket event with answerId and betValue
				socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
				socket.emit('update_leaderboard');
			}
		}
    });
     $('#min1').click(function() {
		if(curState == states.SHOW_QUESTION){
			if (betValue > 0){
				betValue -= 1;
			}
			if ((score - betValue) > 0){
				$('#bet1').css('display', 'inline');
				if ((score - betValue) >= 10){
					$('#bet10').css('display', 'inline');
					if ((score - betValue) >= 100){
						$('#bet100').css('display', 'inline');
						if ((score - betValue) >= 1000){
							$('#bet1000').css('display', 'inline');
						}
					}    
				}
			}
			$('#totalbet').html(betValue);//update betted value displayed
			// Check if user is an official_participant or unofficial_participant and if the current state is SHOW_QUESTION or TEST_QUESTION
			if (userType === 'official_participant' && curState === states.SHOW_QUESTION) {
				// Send socket event with answerId and betValue
				socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
				socket.emit('update_leaderboard');
			}
		}
     });
		
		answers = stateParams.answers;		
		var type = stateParams.type;	
		$('#question_area .answers').html("");
		
	 	if (type == 'open'){
			openquestion = true;
			if(userType=='official_participant' && (curState==states.SHOW_QUESTION || curState==states.SHOW_VIDEO  || curState==states.SHOW_ANSWER)){
				console.log('show_answer');
				var html = '<div style="color:black;"><input type="text" id="openanswer" maxlength="40"';
				if (curState==states.SHOW_VIDEO || curState==states.SHOW_ANSWER){
					html += 'value="'+stateParams.myans+'" disabled';
				}
				html+= ' /><input type="submit" value="versturen" id="verzenden" ';
				if (curState==states.SHOW_VIDEO || curState==states.SHOW_ANSWER){
					html += 'disabled';
				}
				html +=' /></div>';
				$('#question_area .answers').html(html);
			} else if (userType=='admin' && (curState==states.SHOW_QUESTION || curState==states.SHOW_VIDEO || curState==states.SHOW_ANSWER)){
				goodanswers = [];
				wronganswers = [];
				if (curState==states.SHOW_VIDEO){
					goodanswers = stateParams.savedanswers[0];
					wronganswers = stateParams.savedanswers[1];
				}
				answerMaker = function(curloc, ans){
					var html = '';
					if (curloc == 'wrong' || curloc == 'pending'){
						if (curState!=states.SHOW_VIDEO){
							html += '<span style="cursor: pointer;" onclick="toUpdateAns(\''+ans+'\',\'left\')"><--</span>';
						}
					}
					html += ans;
					if (curloc == 'good' || curloc == 'pending'){
						if (curState!=states.SHOW_VIDEO){
							html += '<span style="cursor: pointer;" onclick="toUpdateAns(\''+ans+'\',\'right\')">--></span>';
						}
					}
					html += '<br />';
					return html;
				}
				createAnswerList = function(loc, standardanswers, insertedanswers){
					var html = '';
					if (curState!==states.SHOW_VIDEO){
						for(var i=0;i<standardanswers.length;i++){
							html += standardanswers[i] + '<br />';
						}
					}
					for(var i=0;i<insertedanswers.length;i++){
						html += answerMaker(loc,insertedanswers[i]);
					}
					$('#'+loc).html(html);
				}
				updateAnswerList = function(ans, dir){
					if (dir == 'left'){
						if (receivedanswers.includes(ans)){ //from pending to good
							goodanswers.push(ans);
							receivedanswers = receivedanswers.filter(item => item !== ans);//remove from other list
						} else { //from wrong to pending}
							receivedanswers.push(ans);
							wronganswers = wronganswers.filter(item => item !== ans);//remove from other list
						}
					} else { //right
						if (receivedanswers.includes(ans)){ //from pending to wrong
							wronganswers.push(ans);
							receivedanswers = receivedanswers.filter(item => item !== ans);//remove from other list
						} else { //from good to pending}
							receivedanswers.push(ans);
							goodanswers = goodanswers.filter(item => item !== ans);//remove from other list
						}
					}
					createAnswerList('good', answers, goodanswers);
					createAnswerList('wrong', [], wronganswers); //insert standard wrong answers
					createAnswerList('pending', [], receivedanswers);
				}
				var html = '<br /><table style="font-size: 18px;"><tr><td><b>Goed</b></td><td><b>Ingestuurde antwoorden</b></td><td width="150"><b>Fout</b></td></tr>';
				html += '<tr><td><div id="good"></div></td><td style="border-left:1px white solid;border-right:1px white solid;"><div id="pending"></div></td><td><div id="wrong"></div></td></tr></table>';
				$('#question_area .answers').html(html);
				createAnswerList('good', answers, goodanswers);
				createAnswerList('wrong', [], wronganswers); // insert standard wrong answers
			} 
		} else {
			for(var i=0;i<answers.length;i++){
				var curLetter = String.fromCharCode(65 + i);
				var answerId = (i+1);
				
				if(userType=='official_participant' && (curState==states.SHOW_QUESTION || curState==states.SHOW_VIDEO)){
					var $div = $("<div>", { answer_id:answerId })
					.attr("style","font-size:2em; padding-top: 10px; border: 1px solid; margin-top: 2px; overflow:hidden; cursor: pointer; cursor: hand; ")
					.addClass("answer_"+answerId)
					.append("<span/>")
					.text(curLetter);
					
					if(curState==states.SHOW_VIDEO && temp_answer==answerId){
						$div.css("background-color","rgb(255, 255, 162)");
					}
					
					$div.click(function(){
						if((userType=='official_participant' || userType=='unofficial_participant') && (curState==states.SHOW_QUESTION || curState==states.TEST_QUESTION)){
							selectedAnswerId = $(this).attr("answer_id");
							//var betValue = $('#bet').val(); // Get the value of 'bet' input field
							socket.emit('quiz_send_answer',{answerId:selectedAnswerId, bet: betValue });
							socket.emit('update_leaderboard');
							temp_answer = selectedAnswerId;
							
							$('#question_area .answers div').css("background-color","inherit");			
							$(this).css("background-color","rgb(255, 255, 162)");
						}
					});
				} else if (userType == 'spectator') {
					var $div = $("<div>", { answer_id:answerId })
					.attr("style","font-size:2em; padding-top: 10px; border: 1px solid; margin-top: 2px; overflow:hidden;")
					.addClass("answer_"+answerId)
					.append("<span/>")
					.text(curLetter+'. '+answers[i]);
				}
				
				$("#question_area .answers").append($div);			
			}
		}
		
		$('#verzenden').click(function(){
			selectedAnswerId = $('#openanswer').val();
			socket.emit('quiz_send_answer',{answerId:selectedAnswerId, bet: betValue });
			socket.emit('update_leaderboard');
		});

		var d = new Date();
		d.setSeconds(d.getSeconds()+stateParams.time);
		
		$('#timer').countdown({
			until: d,
			format: 'S',
			labels: ['', '', '', '', '', '', ''],
			labels1: ['', '', '', '', '', '', ''],
			onExpiry: function(){				
				$(this).countdown('destroy');
			}
		});
	}

	this.showAnswer = function(stateParams){
		this.setWaitStatus('Waiting for next question...');
		$('#timer').countdown('destroy');
	
		var correctAnswerId = stateParams.answerId;
		var isTest = stateParams.test;
		if (stateParams.type == 'open' && userType == 'official_participant'){
			$('#verzenden').prop('disabled', true);
			$('#openanswer').prop('disabled', true);
		}
		
		var correctAnswer = false;
		if(correctAnswerId == selectedAnswerId){
			correctAnswer = true;
		}
				
		if(!correctAnswer && selectedAnswerId!=false){	
			$('#question_area .answer_'+selectedAnswerId).css("background-color","rgb(255, 162, 162)");	
		}

		$('#question_area .answer_'+correctAnswerId).css("background-color","rgb(133, 255, 135)");
		if(userType=='official_participant' || userType=='unofficial_participant'){
			if(correctAnswer){
				$('#answer_status').html("Correct answer!");
			}
			else{
				$('#answer_status').html("<span style='color:#f00'>Incorrect answer!</span>");
			}
		} else if (userType == 'spectator' && openquestion == true){
			var html = '<h2> Goede antwoorden: ';
			const allgood = stateParams.savedanswers[0];
			for(var i=0;i<allgood.length;i++){
				html += allgood[i] + ', ';
			}
			html += '</h2>';
			$("#question_area .answers").html(html);
		}
		else{
			$('#answer_status').html("<span style='color:#f00'>Time over!</span>");
		}
	}

	this.end = function(stateParams){
		this.setWaitStatus('Thanks for your participation!');
	}
	
	this.updateGeneralParams = function(stateParams){
		if(stateParams && stateParams.score){
			var score = stateParams.score;
			temp_role = stateParams.role;
			$('#participant_rank').html(temp_role+' | Score: '+score);
		}
	}
}

$(document).ready(function(){
	var gameWorld = new GameWorld();
	gameWorld.init();
});