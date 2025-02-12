var answers = [];
var openquestion = false;
var goodanswers = [];
var wronganswers = [];
var measures = [];
var updateAnswerList = function(){};
var receivedanswers = [];
var answerMaker = function(){};

function toUpdateAns(ans, dir){
	updateAnswerList(ans, dir);
}
function GameWorld(){
	var states = {START:0,TEST_QUESTION:1,STARTING:2,SHOW_QUESTION:3,SHOW_VIDEO:4,SHOW_ANSWER:5,START_ENDGAME:6, PRESCENARIO:7, BALLROLLING:8, POSTSCENARIO:9, END:10};
	var socket = false;
	
	var userType = false;
	var quizId = '';
	let selectedAnswerId = false;
	let selectedMeasure = '';
	var curState = false;
	var savedState = false;

	function getUrlWithoutLastPart(url) {
		// Verwijder het protocol (http:// of https://)
		let urlWithoutProtocol = url.replace(/^https?:\/\//, '');

		// Verwijder www. als het aanwezig is
		urlWithoutProtocol = urlWithoutProtocol.replace(/^www\./, '');
	
		// Verwijder alles na de laatste slash
		return urlWithoutProtocol.substring(0, urlWithoutProtocol.lastIndexOf('/'));
	}

	//constants
	const chipvalues = [1,5,25,100];
	const dist = 6;
	const minstackheight = 10;

	//variables
	let yourstack;
	var stackobj = {yours: {}};
	var chipID = 0;
	let answercount = 4;
	var inHand = [];
	var offsetX;
	var offsetY;

	for(let i = 0; i < answercount; i++){
	stackobj[i] = {};
	}
	for (const [key, value] of Object.entries(stackobj)) {
		for (let i = 0; i < chipvalues.length; i++){
			stackobj[key][chipvalues[i]] = [];
		}
	}

	function stacksCalculator(score){
		var stack = [0,0,0,0];
		for (let s = 0; s < score; s++){
			stack[0]++;
			for(let i = 0; i < chipvalues.length - 1; i++){
				if(stack[i] - minstackheight >= chipvalues[i+1] / chipvalues[i]){
					stack[i] -= chipvalues[i+1] / chipvalues[i];
					stack[i+1]++;
				}
			}
		}
		return stack;
	}

	function ChipInitiator(counter,divid,type){
		var stack = stacksCalculator(counter);
		for (var s in stack){
			for (var k = 0; k < stack[s]; k++){
				ChipAdder(s,divid,k,type);
			}
		}
	}

	function ChipAdder(i_value, divid,position,type){
		const chip = document.createElement("div");
		chip.className = "fiche fiche"+chipvalues[i_value];
		if(type == 'player'){
			chip.style = 'top:'+(position*-dist+20)+'px; width: 40px; height: 20px; left:'+(i_value*45+40)+'px;';
			chip.innerHTML = '<div style="width:100%; padding:0px;">'+chipvalues[i_value]+'</div>';
			let curid = chipID;
			chip.addEventListener("mousedown", function (e) {
			    // Prevent default touch behavior
			    e.preventDefault();
			    Grab(curid, e);
			});
			chip.addEventListener("touchstart", function (e) {
			    // Prevent default touch behavior
			    e.preventDefault();
			    Grab(curid, e.touches[0]);
			});
			stackobj['yours'][chipvalues[i_value]].push({chip: chip, chipID: chipID, val: chipvalues[i_value]});
			chipID++;
		} else {
			chip.style = 'top:'+position*-4+'px;';
		}
		$('#'+divid).append(chip);
	}

	function Grab(cID, e){
		let curstack;
		let thisChip;
		let curpos;
		for (const [key, value] of Object.entries(stackobj)) {
		  for (const [k, val] of Object.entries(value)) {
		  	for(let i = 0; i < val.length; i++){
			  	if (val[i].chipID == cID){
			  		curstack = key;
			  		thisChip = val[i];
			  		curpos = i;
			  	}
			  }
		  }
		}

		if(thisChip == undefined){
			console.log('chip undefined');
			return;
		}

		offsetX = e.clientX - thisChip.chip.getBoundingClientRect().left;
	    offsetY = e.clientY - thisChip.chip.getBoundingClientRect().top;
	    //offsetY = thisChip.chip.getBoundingClientRect().top;
	    console.log(offsetY);

		for (let i = 0; i < stackobj[curstack][thisChip.val].length; i++) {
			if(i >= curpos){
				let stackChip = stackobj[curstack][thisChip.val][i];
				stackChip.chip.style.boxShadow = "8px -8px 8px rgba(0, 0, 0, 0.3)";
		   		stackChip.chip.style.width = "60px";
		   		stackChip.chip.style.height = "30px";
		   		stackChip.chip.style.zIndex = String(i+1000);
		   		inHand.push(stackChip);
		   		delete stackobj[curstack][thisChip.val][i];
			}
		}
		stackobj[curstack][thisChip.val] = stackobj[curstack][thisChip.val].filter(n => n);
	}

	function Drag(element, x, y){
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
	}

	document.addEventListener("mousemove", function (e) {
		if (inHand.length < 1) return;
	    e.preventDefault();
	    for (let k = 0; k < inHand.length; k++){
	    	let x = e.clientX - offsetX
	    	//let y = e.clientY - offsetY - k*dist;
	    	let y = e.clientY - offsetY - k*dist - 405 + window.scrollY;
	    	console.log(window.scrollY);
	    	//inHand[k].chip.style.position = "absolute";
	    	inHand[k].chip.style.transition = "transform 0.1s ease, top 0.1s ease";
	    	Drag(inHand[k].chip, x, y);
	    }
	});

	document.addEventListener("touchmove", function (e) {
		if (inHand.length < 1) return;
	    e.preventDefault(); // Prevent scrolling
	    const touch = e.touches[0];

		for (let k = 0; k < inHand.length; k++){
	    	// Verplaats het element op basis van de touch-coördinaten en offset
	    	let x = touch.clientX - offsetX;
	    	let y = touch.clientY - offsetY - k*dist - 445 + window.scrollY;
	    	inHand[k].chip.style.transition = "transform 0.1s ease, top 0.1s ease";
	    	Drag(inHand[k].chip, x, y);
	    }
	}, { passive: false });

	/*document.addEventListener("touchmove", function (e) {
		if (inHand.length < 1) return;
		console.log('move');
	    /*e.preventDefault();
	    for (let k = 0; k < inHand.length; k++){
	    	let x = e.clientX - offsetX
	    	//let y = e.clientY - offsetY - k*dist;
	    	let y = e.clientY - offsetY - k*dist - 405 + window.scrollY;
	    	console.log(window.scrollY);
	    	//inHand[k].chip.style.position = "absolute";
	    	inHand[k].chip.style.transition = "transform 0.1s ease, top 0.1s ease";
	    	Drag(inHand[k].chip, x, y);
	    }
	});
	*/

	function CheckExchange(droploc){
		console.log(stackobj[droploc]);
		let tofill = 0;
		let nextval = 0;
		let j = 0;
		for (const [key, value] of Object.entries(stackobj[droploc])) {
			let color = "";
			j = 0;
			console.log("tofill: "+tofill)
			for (let i = 0; i < fiches.length; i++){
				if(fiches[i][0] == tofill){
					j = i;
					console.log(j);
					color = fiches[i][1];
				}
			}
			if (tofill > 0){
				if (value.length > 0){
					console.log("Een "+key+" inwisselen voor "+key/tofill+" van "+tofill);
					stackobj[droploc][key][stackobj[droploc][key].length - 1].chip.remove();
					stackobj[droploc][key].pop();

					for (let k = 0; k < key/tofill; k++){
						AddChip(tofill, droploc);
					}
				}
			}
			tofill = 0;
			if (j < fiches.length){
				nextval = fiches[j+1][0];
			}
			if (value.length < minstackheight){
				tofill = key;
			} else if (value.length - (nextval / fiches[j][0]) > minstackheight && j < fiches.length){
				for (let k = 0; k < (nextval / fiches[j][0]); k++){
					stackobj[droploc][key][stackobj[droploc][key].length - 1].chip.remove();
					stackobj[droploc][key].pop();
				}
				AddChip(nextval, droploc);
				console.log(nextval);
			} 
		}
	}
	
	this.init = function(){
		this.initSocket();
		this.initializeView();
		this.bindViewEvents();
		this.bindSocketEvents();		
		
		socket.emit('quiz_init', localStorage.getItem('uniqueId'));
	}
	
	this.initSocket = function(){
		socket = io.connect({'reconnection':true,'reconnectionDelay': 1000,'reconnectionDelayMax' : 1000,'reconnectionAttempts': 1000});
	}
	
	this.initializeView = function(){
		$('#timer_area').hide();
		$('#question_area').hide();
		$('#admin_area').hide();
	}
	
	var showedqr = false;
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
		else if(state==states.TEST_QUESTION || state==states.SHOW_QUESTION || state==states.SHOW_ANSWER || state==states.SHOW_VIDEO || state==states.PRESCENARIO || state==states.POSTSCENARIO){
			$('#timer_area').show();
			$('#question_area').show();
			if(state==states.PRESCENARIO){
				$('#question_area .question').html('');
				$('#question_area .answers').html('');
			}
		}
		else if(state==states.START || state==states.STARTING || state==states.END || state==states.START_ENDGAME || state==states.BALLROLLING){
			if(state==states.BALLROLLING && userType=='official_participant'){
				$('#question_area').show();
			} else {
				$('#wait_area').show();
			}
		}
		

		
		if(userType=='official_participant' || userType=='unofficial_participant'){
			/*All states*/
			$('#participant_area').show();
			var score = stateParams.score;
			ChipInitiator(score,'fiches_inhand','player');
			console.log(stackobj);
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
			} else if(state==states.START_ENDGAME || state==states.PRESCENARIO || state==states.POSTSCENARIO){
				$('#admin_area_endgame').show();
				$('#btn_admin_start_endgame').hide();
				$('#btn_admin_spin').hide();
				$('#btn_admin_next_scenario').hide();
				if(state==states.START_ENDGAME){
					$('#btn_admin_start_endgame').show();
				} else if(state==states.POSTSCENARIO){
					$('#btn_admin_next_scenario').show();
				} else {
					$('#btn_admin_spin').show();
				}
			}
		} else if(userType=='spectator' && showedqr == false && state!==states.START_ENDGAME && state!==states.PRESCENARIO && state!==states.POSTSCENARIO && state!==states.BALLROLLING){
			$('#table_area').show();
			$('#qr_wrapper').css('display','flex');
			$('#qr_text').html("Scan de QR of ga naar <br />"+getUrlWithoutLastPart(window.location.href)+"/join/"+quizId);
			var qrcode = new QRCode(document.getElementById("qr_zone"), {
				text: getUrlWithoutLastPart(window.location.href)+"/join/"+quizId,
				width: 100,
				height: 100
			});
			showedqr = true;
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

		$('#btn_admin_start_endgame').click(function(e){
			socket.emit('start_endgame');
			return false;
		});

		$('#btn_admin_spin').click(function(e){
			socket.emit('spin_endgame');
			return false;
		});

		$('#btn_admin_next_scenario').click(function(e){
			socket.emit('next_scenario');
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
		let connectionLostTimeout;

		/*ping option
		// Custom timer to detect connection loss
		let pingCheckTimeout;

		// This event is triggered whenever a ping is received
		socket.io.on('ping', () => {
		  console.log('Ping received from the server');
		  clearTimeout(pingCheckTimeout);  // Clear any existing timeout
		  pingCheckTimeout = setTimeout(() => {
			alert('Server is not responding. Please refresh the page.');
		  }, 5000);  // Show alert if no ping response in 5 seconds
		});*/

		socket.on('connect', () => {
			clearTimeout(connectionLostTimeout); // Clear any previous timeout when reconnected
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
			connectionLostTimeout = setTimeout(() => {
		    location.reload();  // Reload the page if no ping within the timeout
			}, 5000); // Show alert after 5 seconds of disconnection
		});

		socket.on('reconnect', (attemptNumber) => {
			console.log('Reconnected after', attemptNumber, 'attempts');
			clearTimeout(connectionLostTimeout); // Clear timeout on reconnect
			//clearTimeout(pingCheckTimeout);
			location.reload();
		});

		socket.on('reconnect_attempt', (attemptNumber) => {
			console.log('Reconnection attempt', attemptNumber);
		});

		socket.on('reconnect_error', (error) => {
			console.log('Reconnection failed:', error);
		});
		
		socket.on('quiz_init_ok',function(gameWorld){
			return function(data){
				userType = data.userType;
				quizId = data.quizId;

				gameWorld.showAreasBasedOnRoleAndState(states.START,{});
			};
		}(this));
		
		socket.on('quiz_init_nok',function(data){
			location.href = '/';
		});
		
		socket.on('quiz_state_update',function(gameWorld){
			return function(data){
				console.log(data);
				var state = data.state;	
				var stateParams = data.stateParams;

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
					gameWorld.showQuestion(stateParams);
					gameWorld.showAnswer(stateParams);
				}
				else if(state == states.END){
					gameWorld.end(stateParams);
				}
				else if(state == states.SHOW_VIDEO){
    				gameWorld.showQuestion(stateParams);
				} 
				else if(state == states.START_ENDGAME){
    				gameWorld.startEndgame(stateParams);
				} 
				else if(state == states.PRESCENARIO){
					gameWorld.setPrescenario(data);
				}
				else if(state == states.POSTSCENARIO){
					gameWorld.setPrescenario(data);
				}
				else if(state == states.BALLROLLING){
					if(userType == 'official_participant'){
						gameWorld.setPrescenario(data);
					} else {
						gameWorld.setBallrolling(data);
					}
				}
			};
		}(this)
		);

		socket.on('new_leaderboard',function(gameWorld){
			return function(data){
				if (userType == 'spectator'){
					measures = data[1];
					var measurebets = [];
					for (m in measures){
						measurebets.push(0);
					}
					var html = "";
					html += "<div>";
					
					var types = ['official'];
					var names = {
						'official' : 'Live-score',
					};
					
					for(var t in types){
						var participantsType = types[t];
						var name = names[participantsType];
						var elements = data[0][participantsType];
						
						html += "<h1>" + name + "</h1>";				
						html += "<table class='table table-hover table-condensed table-striped table-bordered' style='width:80%; font-size: 1.8em; border-color:red;'>";
						
						html += "<thead>";
						html += "<tr>";
						html += "<th style='width:50px; border-color:red;' >" + "Rank" + "</th>" + "<th style='border-color:red;'>" + "Speler" + "</th>" + "<th style='border-color:red;'>" + "Score" + "</th>";
						if(curState==states.PRESCENARIO || curState==states.POSTSCENARIO || curState==states.BALLROLLING){
							var i = 0;
							for (m in measures){
								i++;
								html+= "<th style='border-color:red;'>M"+i+"</th>";
							}
							html+="<th style='background-color:red; border-color:red;'></th><th style='background-color:black; border-color:red;'></th>";
						} else if (curState==states.END){
							html += "<th style='border-color:red;'></th><th style='border-color:red;'></th>";
						} else {
							html += "<th style='border-color:red;'>Antwoord</th><th style='border-color:red;'>Inzet</th>";
						}
						html += "</tr>";
						html += "</thead>";
						
						html += "<tbody>";
						
						for(var j = 1; j < 7; j++){ //spelers leeg maken
							$('#playerinfo'+j).html('');
							$('#fichebox'+j).html('');
						}
						var j = 0;
						for(var elem in elements){
							var p = elements[elem];
							j++;
							if (p.issleeping == false){
								var colorStyle = "background-color: green";
								if(p.isLastCorrect === true){
									colorStyle = "background-color: rgb(133, 255, 135)";
								}
								else if(p.isLastCorrect === false){
									colorStyle = "background-color: rgb(255, 162, 162)";
								}
								
								if(curState==states.PRESCENARIO || curState==states.POSTSCENARIO || curState==states.END || curState==states.BALLROLLING){
									colorStyle = "background-color: green";
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
								html += "<td>" + p.rank + "</td>" + "<td>" + p.team + "</td>" + "<td>" + p.score + "</td>";
								if (j < 7){
									$('#playerinfo'+j).html(p.team+'<br /><img src="content/bouwer.png" width="50" class="icon player'+j+'" />');
									var counter = p.score;
									ChipInitiator(counter,'fichebox'+j);
									
									if(p.response){
										const chip = document.createElement("div");
										chip.className = 'cardbox player'+j;
										chip.innerHTML = '<img src="content/KlimaatCasino/card.png" width="30" /><div style="position: absolute; left: 35px; top:10px; z-index:5;">'+p.betValue+'</div>';
										$('#fichebox'+j).append(chip);
									}
								} else {
									$('#playerinfo6').html('+ en nog '+(j-5)+' anderen');
								}
								if(curState==states.PRESCENARIO || curState==states.POSTSCENARIO || curState==states.BALLROLLING){
									var i = 0;
									for (m in measures){
										i++;
										resp = '';
										//console.log(typeof p.response[i].betval);
										console.log(p);
										if(typeof p.response[i] !== 'undefined' && typeof p.response[i] !=='string'){
											var responseval = p.response[i].betval;
											measurebets[i-1] += responseval;
											$('#measurebet'+i).html(measurebets[i-1]);
											console.log('measurebet'+i+': '+measurebets[i-1]);
											if (data[1][m].unlocked == true){
												$('#measuretext'+i).css('color','yellow');
												$('#measurebet'+i).html(measures[m].currentcost);
											}
											if(responseval > 0){
												resp += responseval;
											}
										}
										html+= "<td>"+resp+"</td>";
									}
									i++;
									resp = '';
									if(typeof p.response[i] !== 'undefined'){
										var responseval = p.response[i].betval;
										if(responseval > 0){
											resp += responseval;
										}
									}
									html+= "<td>"+resp+"</td>";
									i++;
									resp = '';
									if(typeof p.response[i] !== 'undefined'){
										var responseval = p.response[i].betval;
										if(responseval > 0){
											resp += responseval;
										}
									}
									html+= "<td>"+resp+"</td>";
								} else if (curState==states.END){
									html += "<td></td><td></td>";
								} else {
									html +=  "<td>" + resp + "</td>" + "<td>" + betv + "</td>";
								}
								html += "</tr>";
							}
						}
						html += "</tbody>";
						
						html += "</table><br /><br /><br />";
					}
					
					$('#scores').html(html);
				} else if (userType == 'admin'){
					var curreceived = [];
					for(var elem in data[0]['official']){
						var receivedanswer = data[0]['official'][elem].response;
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
				} else if (userType == 'official'){
					if(curState==states.PRESCENARIO || curState==states.POSTSCENARIO){
						//check unlocks?
					}
				}
			};
		}(this)
		);

	}
	
	this.setWaitStatus = function(text){
		$('#wait_status').html(text);
	}
	
	this.start = function(stateParams){	
		$("#q_area .answrs").html('');	
		this.setWaitStatus('Get ready!');
		if(userType === 'official_participant'){
			this.setWaitStatus('<div style="color:black; padding-top:100px;">We wachten even tot iedereen klaar is.<div>');
			document.body.style.backgroundColor = "white";
		} else if (userType === 'spectator'){
			$('#questiontext').html('Scan de code of ga naar '+getUrlWithoutLastPart(window.location.href)+"/join/"+quizId);
			var qrcode = new QRCode(document.getElementById("qr_area"), {
				text: getUrlWithoutLastPart(window.location.href)+"/join/"+quizId,
				width: 200,
				height: 200
			});
		}
		/*this.setWaitStatus('Get ready! <div id="destroysession">DESTROY!</div>');
		$('#destroysession').click(function(e){
			socket.emit('refresh_me', localStorage.getItem('uniqueId'));
			socket.removeAllListeners();  // Remove all event listeners
  			socket.disconnect(true);
			console.log('refreshing socket...');
			location.reload();
			return false;
		});*/
	}
	
	this.starting = function(stateParams){
		this.setWaitStatus('Starting... Good luck and have fun!');
		$('#endgame').html('');
		$('#qr_area').html('');
		$('#questiontext').html('');
	}
	
	setBetarea = function(score){
		$('#player_console').show();
		var maxbet = Math.ceil(score / 2);
		var myanstot = 0; //the total betvalue, in case of refresh
		if(userType === 'official_participant' && curState === states.PRESCENARIO){
			for (let i in selectedAnswerId){
				myanstot += selectedAnswerId[i].betval;
			}
		}
		betValue += myanstot;
		
		var betarea = '<input type="submit" id="bet1" value="1" style="width: 40px; color: black;';
		if((maxbet - myanstot) < 1){
			betarea += 'display: none;';
		}
		betarea += '" /><input type="submit" id="bet10" value="10" style="width: 53px; color: black;';
		if((maxbet - myanstot) < 10){
			betarea += 'display: none;';
		}
		betarea += '"/>';
		$('#question_area .bet').html(' inzetten: '+betarea);

		$('#bet1').click(function() {
			if(userType === 'official_participant' && (curState === states.SHOW_QUESTION || curState === states.PRESCENARIO)){
				if(curState == states.SHOW_QUESTION || selectedMeasure != ''){
					betValue += 1;
					if (betValue >= maxbet){
					$(this).css('display', 'none');
					}
					if (betValue >= (maxbet - 9)){
					$('#bet10').css('display', 'none');
					}
					if(betValue > maxbet){
						betValue = maxbet;
					}
				}
				$('#totalbet').html(betValue); //update betted value displayed
				// Check if user is an official_participant or unofficial_participant and if the current state is SHOW_QUESTION or TEST_QUESTION
				if (curState == states.PRESCENARIO && selectedMeasure != ''){
					selectedAnswerId[selectedMeasure].betval++;
					$('#bet_m'+selectedMeasure).html(selectedAnswerId[selectedMeasure].betval+'&nbsp;&nbsp;&nbsp;<img id="cancel'+selectedMeasure+'" src="content/KlimaatCasino/cross.png" width="20" />');
					for (let i in selectedAnswerId){
						$('#cancel'+i).click(function() {
							betValue -= selectedAnswerId[i].betval;
							selectedAnswerId[i].betval = 0;
							$('#bet_m'+i).html("");
							if (betValue < 0){
								betValue = 0;
							}
							if ((maxbet - betValue) > 0){
								$('#bet1').css('display', 'inline');
								if ((maxbet - betValue) >= 10){
									$('#bet10').css('display', 'inline'); 
								}
							}
							// Send socket event with answerId and betValue
							socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
							socket.emit('update_leaderboard');
						}
						);
					}
				}
				if(curState == states.SHOW_QUESTION || selectedMeasure != ''){
					// Send socket event with answerId and betValue
					socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
					socket.emit('update_leaderboard');
				}
			}
		});
		$('#bet10').click(function() {
			if(userType === 'official_participant' && (curState === states.SHOW_QUESTION || curState === states.PRESCENARIO)){
				// Get the value of 'bet' input field
				//var betValue = $(this).val();
				if(curState == states.SHOW_QUESTION || selectedMeasure != ''){
					betValue += 10;
					if (betValue >= maxbet){
					$('#bet1').css('display', 'none');
					}
					if (betValue >= (maxbet - 9)){
					$(this).css('display', 'none');
					}
					if(betValue > maxbet){
						betValue = maxbet;
					}
					$('#totalbet').html(betValue); //update betted value displayed
				}
				// Check if user is an official_participant or unofficial_participant and if the current state is SHOW_QUESTION or TEST_QUESTION
				if (curState == states.PRESCENARIO && selectedMeasure != ''){
					selectedAnswerId[selectedMeasure].betval+= 10;
					$('#bet_m'+selectedMeasure).html(selectedAnswerId[selectedMeasure].betval+'&nbsp;&nbsp;&nbsp;<img id="cancel'+selectedMeasure+'" src="content/KlimaatCasino/cross.png" width="20" />');
					for (let i in selectedAnswerId){
						$('#cancel'+i).click(function() {
							betValue -= selectedAnswerId[i].betval;
							selectedAnswerId[i].betval = 0;
							$('#bet_m'+i).html("");
							if (betValue < 0){
								betValue = 0;
							}
							if ((maxbet - betValue) > 0){
								$('#bet1').css('display', 'inline');
								if ((maxbet - betValue) >= 10){
									$('#bet10').css('display', 'inline'); 
								}
							}
							// Send socket event with answerId and betValue
							socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
							socket.emit('update_leaderboard');
						}
						);
					}
				}

				if(curState == states.SHOW_QUESTION || selectedMeasure != ''){
					// Send socket event with answerId and betValue
					socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
					socket.emit('update_leaderboard');
				}
			}
		});
		
	}
	let betValue = 0;
	var temp_answer = 404;
	var vidlink = '';
	var temp_role = "";
	let score = 0;
	var answercolors = {0:'#F2EB17',1:'#B9519F',2:'#64CDF5',3:'#017591'};
	this.showQuestion = function(stateParams){
		document.body.style.backgroundColor = "";	
		receivedanswers = [];
		openquestion = false;	
		$('#answer_status').html("");
		if(stateParams.pic!='') $('#question_area .pic').html("<img style='max-width: 500px; width:100%' src='"+stateParams.pic+"' />");
		else $('#question_area .pic').html('');
		
		vidlink = '';
		$('#btn_admin_show_video').hide();
		if(stateParams.vid!==''){
			vidlink = stateParams.vid;
			$('#btn_admin_show_video').show();
		}

		if(stateParams){
			score = stateParams.score;
		}
		
		if(userType=='official_participant'){
    		if (curState==states.SHOW_QUESTION){
        		
        		//when the new question is loaded, reset all values
        		betValue = 0;
        		temp_answer = 404;
    		     selectedAnswerId = false;
    		     socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
    		     
				setBetarea(score);
        		
        		//showing the betted value
        		var bettedarea = 'Inzet: <span id="totalbet">'+betValue+'</span> <input type="submit" id="min1" value="-1" style="width: 53px; color: black;';
            bettedarea += '"/>';
			
			//bettedarea += '<div id="destroysession">DESTROY!</div>';
			
            
        		$('#question_area .betted').html(bettedarea);

				/*$('#destroysession').click(function(e){
					socket.emit('refresh_me', localStorage.getItem('uniqueId'));
					socket.removeAllListeners();  // Remove all event listeners
					socket.disconnect(true);
					console.log('refreshing socket...');
					location.reload();
					return false;
				});*/

        		$('#question_area .question').html("Kies je antwoord en zet in!");
        		if(stateParams.bonusrole.includes(temp_role)){
            		$('#question_area .question').html("Bonusvraag! Dubbele punten verdienen.");
        		}
			} else { //this means the state must be show video
			$('#question_area .betted').html("Je inzet is "+betValue);
				$('#question_area .question').html("");
				$('#question_area .bet').html("");
			}
    	} else { //the user is the admin or spectator
    	   $('#question_area .question').html('(Vraag '+stateParams.curq+' van de '+stateParams.totalqs+')<br />'+stateParams.question);
    	   $('#q_area .questiontext').html('Vraag '+stateParams.curq+'/'+stateParams.totalqs+' - '+stateParams.question);
		   if (userType=='spectator'){
			    if (curState==states.SHOW_VIDEO){
					$('#question_area .bet').html('<video width="640" height="480" controls><source src="content/KlimaatCasino/'+ vidlink + '" type="video/mp4">Your browser does not support the video tag.</video>');
				}else{
					$('#question_area .bet').html('');
				}
			}
    	}

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
		$('#q_area .answrs').html("");
		
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
					.attr("style","color:#000; background-color: "+answercolors[i]+"; padding: 5px; align-items:center; text-align:center; margin:10px;")
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
					$("#player_answers").append($div);
				} else if (userType == 'spectator') {
					var $letter = $("<div>", { id:'answer_'+answerId })
					.attr("style","color:#000; background-color: "+answercolors[i]+"; padding: 3px; padding-left:15px; padding-right:15px; display:flex; align-items:center; height:41px;")
					.addClass("answer_"+answerId)
					.append("<span/>")
					.text(curLetter);

					var $div = $("<div>", { answer_id:answerId })
					.attr("style","padding: 3px; padding-left: 40px;")
					.addClass("answer_"+answerId)
					.append("<span/>")
					.text(answers[i]);

					var $answerWrapper = $("<div>", { 
				        answer_id: answerId 
				    }).addClass("answer_wrapper")
				    .attr("style","display: flex; padding-top:10px; align-items:center;")
				      .append($letter)
				      .append($div);
				    $("#q_area .answrs").append($answerWrapper);
				}
				
				//$("#question_area .answers").append($div);				
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
		var answers = stateParams.answers;
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

		for(i=0;i<answers.length;i++){
			$('#answer_'+i).css("opacity","0.3");
		}
		$('#answer_'+correctAnswerId).css("border","2px #fff solid").css("opacity","1").css("padding","1px").css("padding-left","13px").css("padding-right","13px");

		if(userType=='official_participant' || userType=='unofficial_participant'){
			/*if(correctAnswer){
				$('#answer_status').html("Correct answer!");
			}
			else{
				$('#answer_status').html("<span style='color:#f00'>Incorrect answer!</span>");
			}*/
		} else if (userType == 'spectator' && openquestion == true){
			var html = 'Goede antwoorden: ';
			const allgood = stateParams.savedanswers[0];
			for(var i=0;i<allgood.length;i++){
				html += allgood[i] + ', ';
			}
			$("#q_area .answrs").html(html.substring(0,html.length-2));
		}
		else{
			$('#answer_status').html("<span style='color:#f00'>Time over!</span>");
		}
	}

	this.startEndgame = function(stateParams){
		this.setWaitStatus('Maak je klaar voor de endgame!');
		$('#endgame').html('');
	}

	this.getRoulette = function(disasters, scenario){
		var rouletteslices = [
			[["green"],[") 0deg 9.73deg"]], 
			[["red"],[") 9.73deg 19.45deg"]],
			[["black"],[") 19.45deg 29.18deg"]],
			[["red"],[") 29.18deg 38.91deg"]],
			[["black"],[") 38.91deg 48.63deg"]],
			[["red"],[") 48.63deg 58.36deg"]],
			[["black"],[") 58.36deg 68.09deg"]],
			[["red"],[") 68.09deg 77.81deg"]],
			[["black"],[") 77.81deg 87.54deg"]],
			[["red"],[") 87.54deg 97.27deg"]],
			[["black"],[") 97.27deg 107deg"]],
			[["red"],[") 107deg 116.72deg"]],
			[["black"],[") 116.72deg 126.45deg"]],
			[["red"],[") 126.45deg 136.18deg"]],
			[["black"],[") 136.18deg 145.9deg"]],
			[["red"],[") 145.9deg 155.63deg"]],
			[["black"],[") 155.63deg 165.36deg"]],
			[["red"],[") 165.36deg 175.08deg"]],
			[["black"],[") 175.08deg 184.81deg"]],
			[["red"],[") 184.81deg 194.54deg"]],
			[["black"],[") 194.54deg 204.27deg"]],
			[["red"],[") 204.27deg 213.99deg"]],
			[["black"],[") 213.99deg 223.72deg"]],
			[["red"],[") 223.72deg 233.45deg"]],
			[["black"],[") 233.45deg 243.17deg"]],
			[["red"],[") 243.17deg 252.9deg"]],
			[["black"],[") 252.9deg 262.63deg"]],
			[["red"],[") 262.63deg 272.36deg"]],
			[["black"],[") 272.36deg 282.08deg"]],
			[["red"],[") 282.08deg 291.81deg"]],
			[["black"],[") 291.81deg 301.54deg"]],
			[["red"],[") 301.54deg 311.26deg"]],
			[["black"],[") 311.26deg 320.99deg"]],
			[["red"],[") 320.99deg 330.72deg"]],
			[["black"],[") 330.72deg 340.45deg"]],
			[["red"],[") 340.45deg 350.17deg"]],
			[["black"],[") 350.17deg 360deg"]]
		]
		var vakje = 1;

		for(m in measures){
			if(measures[m].unlocked == true){
				for(e in measures[m].effects){
					if (measures[m].effects[e][1] == "="){
						disasters[measures[m].effects[e][0]].risks[scenario] = measures[m].effects[e][2];
					} else if (measures[m].effects[e][1] == "/"){
						disasters[measures[m].effects[e][0]].risks[scenario] = Math.round(disasters[measures[m].effects[e][0]].risks[scenario] / measures[m].effects[e][2]);
					}
				}
			}
		}
		for (d in disasters){
			for (let step = 0; step < disasters[d].risks[scenario]; step++) {
				rouletteslices[vakje][0] = disasters[d].color;
				vakje++;
			}
		}
		var roulettebackground = '';
		for (slice in rouletteslices){
			roulettebackground += 'var(--custom-'+rouletteslices[slice][0] + rouletteslices[slice][1] + ', ';
		}
		roulettebackground = roulettebackground.substring(0, roulettebackground.length - 2);
		return roulettebackground;
	}
	var scenario;
	this.setPrescenario = function(data){
		measures = data.stateParams.measures;
		betValue = 0;
		if(userType == 'admin'){
			console.log('show instructions');
			$('#endgame').html("<h2>Laat spelers inzetten op maatregelen om de kans op klimaatrampen te verminderen. Als er niet meer ingezet wordt, roep 'rien ne va plus' en klik op draaien!</h2>");
		} else if(userType == 'spectator'){
			$('#qr').html("");
			showedqr = false;
			scenario = data.stateParams.scenario;
			var html = '<h2>Scenario '+(scenario[0]+1)+': het is het jaar '+scenario[1]+'</h2><table style="margin:10px;"><tr><td><h2>Rampen:</h2>';
			var disasters = data.stateParams.disasters;
			for (d in disasters){
				html += '<div style="background-color:var(--custom-'+disasters[d].color+'); padding-left:2px; padding-right:2px; text-align:center;"><h3>'+disasters[d].name+'</h3></div>';
			}
			html += '<h2>Levens: <span id="lives">'+data.stateParams.lives+'</span> / '+data.stateParams.totallives+'</h2>';
			html += '</td><td width="10"></td><td><div id="spinnednumber" style="text-align:center;"></div><div class="roulette-container"><div class="roulette-wheel" id="roulette-wheel"><div class="numbers-container"></div></div></div><script src="js/game/roulette.js"></script></td><td width="10"></td>';
			html += '<td><h2>Maatregelen:</h2>';
			var i = 0;
			for (m in measures){
				i++;
				html += '<div id="measuretext'+i+'" style="border: 1px #fff solid; padding-left:2px; padding-right:2px;"><h3>M'+i+'. '+m+'(<span id="measurebet'+i+'">0</span>/'+measures[m].currentcost+')</h3></div>';

			}
			html += '</td></tr></table>';
			$('#endgame').html(html);
			$('#roulette-wheel').css("background","conic-gradient("+this.getRoulette(disasters, scenario[0])+")");
			if(typeof data.stateParams.rouletteresult != 'undefined'){
				$('#spinnednumber').html('<h2>'+data.stateParams.rouletteresult+'</h2');
				$('#spinnednumber').css("background-color","var(--custom-"+data.stateParams.resultcolor+")");
			}
		} else {
			score = data.stateParams.score;
			var html = '<table>';
			var i = 0;

			selectedAnswerId = data.stateParams.myans;
			if(typeof selectedAnswerId !== 'object'){
				selectedAnswerId = {}
				var c = 0;
				for(m in measures){
					c++;
					selectedAnswerId[c] = {name:m, betval: 0};
				}
				c++;
				selectedAnswerId[c] = {name: 'rood', betval: 0};
				c++;
				selectedAnswerId[c] = {name: 'zwart', betval: 0};
			}
			alreadyBetted = function(i, betv, mtype='measure'){
				var alreadybetted = '';
				if(betv > 0 && (measures[m].unlocked == false || mtype == 'color')){ 
					alreadybetted = betv;
					if(data.state != states.BALLROLLING && data.state != states.POSTSCENARIO){
						alreadybetted +='&nbsp;&nbsp;&nbsp;<img id="cancel'+i+'" src="content/KlimaatCasino/cross.png" width="20" />';
					}
				}

				var $div = $("<div>", { id:"bet_m"+i})
					.attr("style","font-size:0.6em; padding-top: 10px; border: margin-top: 2px; overflow:hidden; cursor: pointer; cursor: hand; min-height:43px; min-width:100px;")
					.append("<span/>")
					.addClass("something")
					.html(alreadybetted);

				$("#question_area .betted").append($div);
				$('#cancel'+i).click(function() {
						betValue -= selectedAnswerId[i].betval;
						selectedAnswerId[i].betval = 0;
						$('#bet_m'+i).html("");
						if (betValue < 0){
							betValue = 0;
						}
						if ((score - betValue) > 0){
							$('#bet1').css('display', 'inline');
							if ((score - betValue) >= 10){
								$('#bet10').css('display', 'inline'); 
							}
						}
						// Send socket event with answerId and betValue
						socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
						socket.emit('update_leaderboard');
					});			
			}

			$("#question_area .answers").html("");
			$('#question_area .betted').html("");
			for (m in measures){
				i++;
				if(measures[m].unlocked == false){
					var $div = $("<div>", { measure:i })
						.attr("style","font-size:1.5em; padding-top: 10px; border: 1px solid; margin-top: 2px; overflow:hidden; cursor: pointer; cursor: hand; ")
						.addClass("measure_"+i)
						.append("<span/>")
						.text("M"+i);
						$div.click(function(){
								selectedMeasure = $(this).attr("measure");
								$('#question_area .answers div').css("background-color","inherit");			
								$(this).css("background-color","rgb(255, 255, 162)");
						});
					$("#question_area .answers").append($div);	
					alreadyBetted(i, selectedAnswerId[i].betval);
				}
			}
			i++;
			var $div = $("<div>", { measure:i })
					.attr("style","font-size:1.5em; padding-top: 10px; border: 1px solid; margin-top: 2px; overflow:hidden; cursor: pointer; cursor: hand; ")
					.addClass("measure_"+i)
					.append("<span/>")
					.text("Rood");
					
					$div.click(function(){
							selectedMeasure = $(this).attr("measure");
							
							$('#question_area .answers div').css("background-color","inherit");			
							$(this).css("background-color","rgb(255, 255, 162)");
					});
			$("#question_area .answers").append($div);	
			alreadyBetted(i, selectedAnswerId[i].betval, 'color');		
			i++;
			var $div = $("<div>", { measure:i })
					.attr("style","font-size:1.5em; padding-top: 10px; border: 1px solid; margin-top: 2px; overflow:hidden; cursor: pointer; cursor: hand; ")
					.addClass("measure_"+i)
					.append("<span/>")
					.text("Zwart");
					
					$div.click(function(){
							selectedMeasure = $(this).attr("measure");
							
							$('#question_area .answers div').css("background-color","inherit");			
							$(this).css("background-color","rgb(255, 255, 162)");
						});
			$("#question_area .answers").append($div);		
			alreadyBetted(i, selectedAnswerId[i].betval, 'color');
			if(data.state != states.BALLROLLING && data.state != states.POSTSCENARIO){
				setBetarea(score);
				console.log(selectedAnswerId);
			}
		}
	}

	this.setBallrolling = function(data){
		if(userType == 'spectator' || userType == 'admin'){
			this.setWaitStatus('De bal rolt!');
		}
	}

	this.end = function(stateParams){
		this.setWaitStatus('Thanks for your participation!');
	}
	
	this.updateGeneralParams = function(stateParams){
		if(stateParams){
			score = stateParams.score;
			temp_role = stateParams.role;
			$('#participant_rank').html(temp_role+' | Score: '+score);
		}
	}
}

$(document).ready(function(){
	var gameWorld = new GameWorld();
	gameWorld.init();
});