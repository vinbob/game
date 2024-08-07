function GameWorld(){
	var states = {START:0,TEST_QUESTION:1,STARTING:2,SHOW_QUESTION:3,SHOW_VIDEO:4,SHOW_ANSWER:5,END:6};
	var socket = false;
	
	var userType = false;
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
		//console.log('now');
		//socket.emit('quiz_get_leaderboard');
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
			socket.emit('quiz_admin_reveal_answer');
			socket.emit('update_leaderboard');
			return false;
		});
		
		$('#btn_admin_show_video').click(function(e){
			socket.emit('show_video');
			$('#question_area .bet').html('<video width="640" height="480" controls><source src="content/KlimaatCasino/'+ vidlink + '" type="video/mp4">Your browser does not support the video tag.</video>');
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
				console.log(data);	
				if (userType == 'admin'){
					console.log('isadmin');
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
						html += "<table class='table table-hover table-condensed table-striped table-bordered' style='width:80%; font-size: 1.8em'>";
						
						html += "<thead>";
						html += "<tr>";
						html += "<th style='width:50px' >" + "Rank" + "</th>" + "<th>" + "Speler" + "</th>" + "<th>" + "Score" + "</th><th>Antwoord</th><th>Inzet</th>";
						html += "</tr>";
						html += "</thead>";
						
						html += "<tbody>";
						
						for(var elem in elements){
							var p = elements[elem];
							
							var colorStyle = "";
							if(p.isLastCorrect === true){
								colorStyle = "background-color: rgb(133, 255, 135)";
							}
							else if(p.isLastCorrect === false){
								colorStyle = "background-color: rgb(255, 162, 162)";
							}
							
							html += "<tr style='"+colorStyle+"; height:56px;'>";
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
	}
	
	this.starting = function(stateParams){
		this.setWaitStatus('Starting... Good luck and have fun!');
	}
	
	var betValue = 0;
	var temp_answer = 404;
	var vidlink = '';
	var temp_role = "";
	this.showQuestion = function(stateParams){		
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
    		     
        		var betarea = '<input type="submit" id="bet1" value="1" style="width: 40px;';
        		if(score < 1){
            		betarea += 'display: none;';
            }
        		betarea += '" /><input type="submit" id="bet10" value="10" style="width: 53px;';
        		if(score < 10){
            		betarea += 'display: none;';
            }
            betarea += '"/>';
        		$('#question_area .bet').html(' inzetten: '+betarea);
        		
        		//showing the betted value
        		var bettedarea = 'Inzet: <span id="totalbet">'+betValue+'</span> <input type="submit" id="min1" value="-1" style="width: 53px;';
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
    	}
    			
    	$('#bet1').click(function() {
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
    });
     $('#bet10').click(function() {
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
    });
     $('#min1').click(function() {
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
     });
		
		var answers = stateParams.answers;				
		$('#question_area .answers').html("");
		
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
        			console.log(answerId + " en " + temp_answer);
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
        } else {
           var $div = $("<div>", { answer_id:answerId })
    			.attr("style","font-size:2em; padding-top: 10px; border: 1px solid; margin-top: 2px; overflow:hidden;")
    			.addClass("answer_"+answerId)
    			.append("<span/>")
    			.text(curLetter+'. '+answers[i]);
        }
			
			$("#question_area .answers").append($div);			
		}
		
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