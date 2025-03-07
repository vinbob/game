/* the javascript for quiz.html

- shows the html elements based on the type of player and the state of the game
- handles inputs from the admin and players, such as next question and answer selection
*/

var answers = [];
var openquestion = false; // if false, it means it is currently a multiple choiche question
var goodanswers = []; // to store the correct answers to an open question
var wronganswers = []; // to store the wrong answers to an open question
var updateAnswerList = function(){}; //to be used for open question to update the list of answers viewed by the admin
var receivedanswers = []; // to store the incoming answers to an open question
var answerMaker = function(){}; //to be used for open question to update the list of answers viewed by the admin

function toUpdateAns(ans, dir){ //to be used for open question to update the list of answers viewed by the admin
	updateAnswerList(ans, dir);
}

function GameWorld(){ //when quiz.html is loaded, this function is used.
	var states = {START:0,STARTING:1,SHOW_QUESTION:2,SHOW_VIDEO:3,SHOW_ANSWER:4,END:5}; // the 5 possible states of the game
	const maxbetfraction = 0.5; // maximum allowed fraction of a player's score that can be used as a bet
	var socket = false;
	
	//initiate general variables
	var userType = false;
	var quizId = '';
	let selectedAnswerId = false;
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

	//constants of the chip handling
	const chipvalues = [1,5,25,100]; // IMPORTANT: the values of chips need to be multiples of each other (due to automatic exchange functionality)
	let unitstack = [1]; // create an object that signifies a stack of only one chip of value 1
	for (let i = 1; i < chipvalues.length; i++){
		unitstack.push(0);
	}
	const dist = 6; //the distance in px between to chips stacked on top of each other
	const minstackheight = 10; //the minium height of a stack of chips, if the stack is higher, and chips will be exchanged for chips of higher value if the leftover stack remains equal to or higher than the minimum stack height
	const maxstackheight = 20; //the maximum height of a stack, after which the chips will be exchanged for those of higher value

	//variables of the chip handling
	var stackobj = {yours: {}}; // the object that stores the chips of the players hand (and those that are betted on an answer, entries are added later depending on the amount of possible answers)
	for (const [key, value] of Object.entries(stackobj)) { // create an entry for each possible chip value
		for (let i = 0; i < chipvalues.length; i++){
			stackobj[key][chipvalues[i]] = [];
		}
	}
	var chipID = 0; //each chip has a unique ID
	let answercount; //amount of possible answers, depending on the question
	var inHand = []; //will hold the chips that are being grabbed by the player
	var offsetX; //offset between where the player taps on the chip and the chip's left X coordinate
	var offsetY; //offset between where the player taps on the chip and the chip's top Y coordinate
	var added_chips = false; //keep track if the chips have been added to the html already

	function stacksCalculator(amount){ //calculates how many chips of each value is needed to represent the amount, based on the minimum stack height
		var stack = [0,0,0,0];
		for (let s = 0; s < amount; s++){
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

	function ChipAdder(stack, divid,type,droploc, height=0){ 
		/* Adds the chips to the element (divid)
		- stack is an object with 4 entries representing the amount of chips of each value
		- when type is 'player', the chips are larger. If not, the chips will be added to the digiboard and will be smaller and without number
		- droploc holds the location where the chip is added (yours = the players hand, 0 = answer1, 1 = answer2, etc.)
		- when the height is given, it means the chips are added to an already existing stack of height = height, so the position of that chip can be adjusted accordingly.
		*/
		for (var s in stack){
			for (var k = 0; k < stack[s]; k++){
				const chip = document.createElement("div");
				chip.className = "fiche fiche"+chipvalues[s];
				if(type == 'player'){
					chip.style = 'top:'+((k+height)*-dist+30)+'px; width: 40px; height: 20px; left:'+(s*45+40)+'px; z-index:'+1+k+height+';';
					chip.innerHTML = '<div style="width:100%; padding:0px;">'+chipvalues[s]+'</div>';
					chip.id = 'chip'+chipID;
					let curid = chipID;
					chip.addEventListener("mousedown", function (e) {
					    // Prevent default mousedown behavior
					    e.preventDefault();
					    Grab(curid, e); //grab the chip on mousedown (for desktop)
					});
					chip.addEventListener("touchstart", function (e) {
					    // Prevent default touch behavior (scrolling)
					    e.preventDefault();
					    Grab(curid, e.touches[0]); //grab the chip on touchstart (for touch devices)
					});
					stackobj[droploc][chipvalues[s]].push({chip: chip, chipID: chipID, val: chipvalues[s]});
					chipID++;
				} else {
					chip.style = 'top:'+k*-4+'px;';
				}
				$('#'+divid).append(chip);
			}
		}
		added_chips = true;
	}

	function ChipRemover(){ //removes all chips from the page and the stackobj
		for(let a in stackobj){
			for (let value in stackobj[a]){
				for (let m in stackobj[a][value]){
					delete stackobj[a][value][m];
				}
				stackobj[a][value] = stackobj[a][value].filter(n => n);
			}
		}
		for(let a in answercount){
			$('#chipcontainer'+a).html('');
		}
		$('#fiches_inhand').html('');
	}

	function Grab(cID, e){ //grab a chip with ID = cID and all the chips that are stacked on top of it
		if(curState == states.SHOW_QUESTION){ // only allow grabbing (thus changing one's bet) when the state is show question
			let curstack;
			let thisChip;
			let curpos;
			let totalbet = 0;
			for (const [key, value] of Object.entries(stackobj)) {
			  for (const [k, val] of Object.entries(value)) {
			  	for(let i = 0; i < val.length; i++){
				  	if (val[i].chipID == cID){
				  		curstack = key;
				  		thisChip = val[i];
				  		curpos = i; //determine how high the chip is in it's stack
				  	}
				  }
			  }
			}

			if(stackCounter(stackobj['yours']) <= Math.ceil(score * maxbetfraction) && curstack == 'yours'){ // only allow grabbing (thus changing one's bet) when the maximum allowed betting amount has not been reached
				console.log(stackobj['yours']);
				return false;
			}
			if(thisChip == undefined){
				console.log('chip undefined');
				return;
			}

			offsetX = e.clientX - thisChip.chip.getBoundingClientRect().left;
		    offsetY = e.clientY - thisChip.chip.getBoundingClientRect().top;

			for (let i = 0; i < stackobj[curstack][thisChip.val].length; i++) {
				if(i >= curpos){ //move all chips that are the current chip or stacked on top of it into the inHand object
					let stackChip = stackobj[curstack][thisChip.val][i];
					stackChip.chip.style.boxShadow = "8px -8px 8px rgba(0, 0, 0, 0.3)";
			   		stackChip.chip.style.width = "60px";
			   		stackChip.chip.style.height = "30px";
			   		stackChip.chip.style.fontSize = "18px";
			   		stackChip.chip.style.zIndex = String(i+1000);
			   		document.body.appendChild(stackChip.chip);
			   		inHand.push(stackChip);
			   		Drag(stackChip.chip, e.clientX, e.clientY, i - curpos);
			   		delete stackobj[curstack][thisChip.val][i];
				}
			}
			stackobj[curstack][thisChip.val] = stackobj[curstack][thisChip.val].filter(n => n);
		}
	}

	function Drag(element, clientX, clientY, k){ //move a chip around on the screen
		let x = clientX - offsetX
    	let y = clientY - offsetY - k*dist + window.scrollY;
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
		if(k==0){ //check if bottom chip is inside dropzone
			var droploc = CheckIfInside();
			for(let i = 0; i < answercount; i++){ //make all answers transparent
				$('#answer'+i).css('opacity','0.5');
			}
			if (droploc !== 'yours'){
				$('#answer'+droploc).css('opacity','1'); //make the answer that the chip is currently hovering over opaque
			} else { //if the chip is not hovering over any answer...
				var nobet = true;
				for(let i in stackobj){
					if(i !== 'yours'){
						if (stackCounter(stackobj[i],false) > 0){ //make only the answer that still has chips on it opaque
							$('#answer'+i).css('opacity','1');
							nobet = false;
						}
					}
				}
				if(nobet == true){ //none of the answers have any bet on them, so make them all opaque
					for(let i = 0; i < answercount; i++){
						$('#answer'+i).css('opacity','1');
					}
				}
			}
		}
	}

	document.addEventListener("mousemove", function (e) { //when the mouse moves...
		if (inHand.length < 1) return; // ... and there have been chips grabbed...
	    e.preventDefault();
	    for (let k = 0; k < inHand.length; k++){
	    	Drag(inHand[k].chip, e.clientX, e.clientY, k); // ...move the chips along with the cursor / finger
	    }
	});

	document.addEventListener("touchmove", function (e) { //same functionality as mousemove, but for touchscreens
		if (inHand.length < 1) return;
	    e.preventDefault(); // Prevent scrolling
		for (let k = 0; k < inHand.length; k++){
	    	Drag(inHand[k].chip, e.touches[0].clientX, e.touches[0].clientY, k);
	    }
	}, { passive: false });

	var gamestadium = 'main'; //to do: change to endgame if endgame, so that you can bet on multiple answers / measures

	function CheckIfInside(){
		// Haal de coördinaten van het draggable-element op
	    const draggableRect = inHand[0].chip.getBoundingClientRect();
	    
	    // Controleer of draggable binnen #answer valt
	    let droploc = 'yours';
	    for (let i = 0; i < answercount; i++){
	    	let checkzone = $('#answer'+i)[0].getBoundingClientRect();
	        if (draggableRect.left < checkzone.right && draggableRect.right > checkzone.left && draggableRect.top < checkzone.bottom && draggableRect.bottom > checkzone.top){
	        	droploc = i;
	        }
	    }
	    return droploc;
	}

	function stackCounter(stack,withremoval){ //counts the total value of a stack object, and potentially also removes the chips of that stack from the html
		var total = 0;
    	for (let value in stack){
    		for (let i in stack[value]){
    			total += Number(value);
    			if(withremoval == true){
    				document.getElementById('chip'+stack[value][i].chipID).remove();
    			}
    		}
    	}
    	return total;
	}

	function Drop(){
		/*
		Handles dropping the chips on top of an answer (droploc)
		- if not on top of an answer, the chips will be moved back to the players total stack (yours)
		- chips in the 'yours' stack will also be exchanged so that there are always at least the minimum amount of chips with value 1
		- a chipstack that is higher than the maximum stack height will also be exchanged
		*/
		if(inHand.length > 0){
		    let droploc = CheckIfInside();
		    
		    if (gamestadium == 'main' && droploc !== 'yours'){ // move all already betted coins to the hand so that it can be placed on the new answer
	        	for(let a = 0; a < answercount; a++){
	        		for (let value in stackobj[a]){
	        			for (let m in stackobj[a][value]){
	        				inHand.push(stackobj[a][value][m]);
	        				delete stackobj[a][value][m];
	        			}
	        			stackobj[a][value] = stackobj[a][value].filter(n => n);
	        		}
	        		$('#answer'+a).css('border','0px #fff solid'); //remove the border from the answers
	        	}
	        	$('#answer'+droploc).css('border','2px #fff solid'); //add a border to the answer that the chips are dropped on
	        } else {
				for(let i in stackobj){
					if(i !== 'yours'){
						if (stackCounter(stackobj[i],false) == 0){
							$('#answer'+i).css('border','0px #fff solid'); //if all chips are removed from the answer, remove its border
						}
					}
				}
	        }

			for (let k = 0; k < inHand.length; k++){
				inHand[k].chip.style = 'width: 40px; height: 20px;';
				let stackplace = 0;
				let i = 0;
				for (const [key, value] of Object.entries(stackobj[droploc])) {
					if (key == inHand[k].val){
						stackplace = i;
					}
					i++
				}
				inHand[k].chip.style.zIndex = String(stackobj[droploc][inHand[k].val].length);

				if(droploc !== 'yours'){ //place the chips in fixed locations inside the answer element
					document.getElementById('chipcontainer'+droploc).appendChild(inHand[k].chip);
					inHand[k].chip.style.top = `${30 - stackobj[droploc][inHand[k].val].length * dist}px`;
			        inHand[k].chip.style.left = `${stackplace*45 + 40}px`;
			    } else {
			    	// Zet de positie terug als het niet boven de dropzone is
			    	document.getElementById('fiches_inhand').appendChild(inHand[k].chip);
		    		inHand[k].chip.style.top = (stackobj[droploc][inHand[k].val].length*-dist+30)+'px';  
		    		inHand[k].chip.style.left = (stackplace*45+40)+'px';
		    		$('#fiches_inhand').css('opacity','1');
			    }
		        stackobj[droploc][inHand[k].val].push(inHand[k]); //store the chips in the stackobj element
		    }

		    var betOverflow = stackCounter(stackobj[droploc]) - Math.ceil(score * maxbetfraction);
		    if(betOverflow >= 0 && droploc != 'yours'){
	        	$('#fiches_inhand').css('opacity','0.5');
	        }
		    if(betOverflow > 0 && droploc !== 'yours'){
		    	for(var i = 0; i < betOverflow; i++){
		    		const chip = document.createElement("div");
		    		chip.id = 'chip'+chipID;
		    		stackobj['yours'][1].push({chip:chip,chipID:chipID,val: 1});//add fake chip to put the amount of point in hand back to the max
		    		$('#fiches_inhand').append(chip);
		    		chipID++;
		    	}
		    	var reversechipvalues = [...chipvalues].reverse();
		    	var added_overflow = false;
		    	for(let c in reversechipvalues){
		    		var reversechips = [...stackobj[droploc][reversechipvalues[c]]].reverse();
		    		for (let ic in reversechips){
		    			if(added_overflow == false){
			    			document.getElementById('chip'+reversechips[ic].chipID).remove();
		    				for(let cid in stackobj[droploc][reversechipvalues[c]]){
		    					if(stackobj[droploc][reversechipvalues[c]][cid].chipID == reversechips[ic].chipID){ // remove the chip of this ID from original stackobj
		    						delete stackobj[droploc][reversechipvalues[c]][cid];
		    						stackobj[droploc][reversechipvalues[c]] = stackobj[droploc][reversechipvalues[c]].filter(n => n);
		    					}
		    				}
		    				betOverflow -= reversechipvalues[c];
		    				if (betOverflow < 0){ //add as many chips of 1 as necessary after removing higher value chips
			    				for(let b = 0; b < -betOverflow; b++){
			    					ChipAdder(unitstack,'chipcontainer'+droploc, 'player',droploc, stackobj[droploc][1].length);
			    				}
			    				added_overflow = true;
			    			} 
			    		}
		    		}
		    	}
	        }


	    	var total = stackCounter(stackobj['yours'], true); //count total value and remove chips
	    	$('#amount_inhand').html(total);

	    	for (let value in stackobj['yours']){
	    		stackobj['yours'][value].length = 0;
	    	}

	    	ChipAdder(stacksCalculator(total),'fiches_inhand', 'player','yours');

	    	restack = '';
		    for(let loc in stackobj){
		    	for(let value in stackobj[loc]){
		    		if(stackobj[loc][value].length > maxstackheight){
		    			restack = loc;
		    		}
		    	}
		    }

		    if(restack !== ''){
		    	var total = stackCounter(stackobj[restack], true);

		    	for (let value in stackobj[restack]){
		    		stackobj[restack][value].length = 0;
		    	}

		    	ChipAdder(stacksCalculator(total),'answer'+restack, 'player',restack);
		    }

		    droploc = undefined; //assume all chips were removed from the answers
		    for(let i = 0; i < answercount; i++){
		    	var total = stackCounter(stackobj[i]);
		    	if(total > 0){
		    		droploc = i; //if there is still a chip on the answer, make the new droploc to be sent by quiz_send_answer
		    		$('#answernumber'+i).html('= '+total);
		    	} else {
		    		$('#answernumber'+i).html('');
		    	}
		    }

		    temp_answer = droploc+1;
		    if(openquestion == true){
		    	temp_answer = $('#openanswer2').val();
		    }
		    temp_bet = stackCounter(stackobj[droploc]);
		    socket.emit('quiz_send_answer', { answerId: String(temp_answer), bet: temp_bet });
			socket.emit('update_leaderboard');
			inHand = [];
		}
	}

	document.addEventListener("mouseup", function (e) {
		Drop();
	});

	document.addEventListener("touchend", function (e) {
		Drop();
	});
	
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
		//$('#question_area').hide();
		//$('#admin_area').hide();
	}
	
	var showedqr = false;
	this.showAreasBasedOnRoleAndState = function(state,stateParams){
		//$('.element').hide();

		/*All users, all states*/
		$('#controlpanel_area').show();
		$('#admin_open_question').hide();
		$('#question_area').hide();
		
		if(state==null && stateParams.leaderboard && $('#btn_show_leaderboard').attr('show_leaderboard')==null){				
				state = savedState;
		}
		
		/*All users, some states*/
		if(state==null && stateParams.leaderboard && $('#btn_show_leaderboard').attr('show_leaderboard')){
				savedState = curState;
		}
		else if(state==states.SHOW_QUESTION || state==states.SHOW_ANSWER || state==states.SHOW_VIDEO){
			if(userType == 'admin'){
				$('#question_area').show();
				if(state==states.SHOW_QUESTION && stateParams.type == 'open'){
					$('#admin_open_question').css('display','flex');
				}
			}
		}
		else if(state==states.START || state==states.STARTING || state==states.END || state==states.START_ENDGAME){
			$('#wait_area').show();
		}
		

		
		if(userType=='official_participant' || userType=='unofficial_participant'){
			// preparing for the draggable chips
			if (stateParams != undefined){
				if (stateParams.answers){
					answercount = stateParams.answers.length;
					if(stateParams.type == 'open'){
						answercount = 1;
						$('#player_console_text').html('Voer één antwoord in en plaats je inzet');
						$('#open_player_console').show();
					} else {
						$('#player_console_text').html('Sleep je inzet naar het juiste antwoord!');
						$('#open_player_console').hide();
					}
					if (!added_chips){
						for(let i = 0; i < answercount; i++){
							stackobj[i] = {};
						}
						for (const [key, value] of Object.entries(stackobj)) {
							for (let i = 0; i < chipvalues.length; i++){
								stackobj[key][chipvalues[i]] = [];
							}
						}
					}
				}

				if(stateParams.myans !== undefined){
					temp_answer = stateParams.myans;
					temp_bet = stateParams.mybet;
				}
				var score = stateParams.score;
				$('#amount_inhand').html(score - temp_bet);
				if (state==states.SHOW_ANSWER){
					if (temp_answer != stateParams.answerId){
						$('#amount_inhand').html(score);
					}
				} 
				console.log('hier');
				if(!added_chips && score !== undefined && stateParams.answers){
					console.log('hier2');
					if(stateParams.answers.length > 0){
						if (state==states.SHOW_QUESTION || state==states.STARTING){
							temp_bet = 0;
							$('#amount_inhand').html(score);
						}
						console.log(score);
						ChipAdder(stacksCalculator(score - temp_bet),'fiches_inhand','player','yours');
						if(state == states.SHOW_ANSWER || state == states.SHOW_VIDEO){
							$('#fiches_inhand').css("opacity","0.5");
						}
					}
				}
			}
			/*All states*/
			$('#player_console').hide();
			if (state!=states.START && state!=states.STARTING){
				$('#player_console').show();
			}
			$('#btn_leave_quiz').css('display','flex');
			$('#participant_rank').css('display','flex');
		}
		else if(userType=='admin'){
			/*Before start*/
			$('#btn_admin_end_quiz').css('display','flex');
			$('#spelerslijst').css('display','flex');
			$('#btn_leave_quiz').hide();
			$('#btn_admin_start_quiz').hide();
			$('#btn_admin_bekijk_toelichting').hide();
			$('#btn_admin_show_video').hide();
			$('#btn_admin_reveal_answer').hide();
			$('#btn_admin_next_question').hide();
			$('#stoplicht').hide();

			if(state==states.START){
				$('#btn_admin_end_quiz').hide();
				$('#btn_admin_start_quiz').css('display','flex');
				$('#btn_leave_quiz').css('display','flex');
			}
			if(state==states.SHOW_QUESTION){
				$('#admin_area_after_start').show();
				if(stateParams.vid != ''){
					$('#btn_admin_show_video').css('display','flex');
				} else {
					$('#btn_admin_reveal_answer').css('display','flex');
					$('#btn_admin_reveal_answer').html('antwoord tonen');
				}
				$('#btn_admin_bekijk_toelichting').css('display','flex');
				$('#stoplicht').css('display','flex');
			}
			else if(state==states.SHOW_VIDEO){
				$('#btn_admin_reveal_answer').css('display','flex');
				$('#btn_admin_reveal_answer').html('sluit video en toon antwoord');
			} else if(state==states.SHOW_ANSWER){
				$('#btn_admin_next_question').css('display','flex');
			}
		} else if(userType=='spectator' && showedqr == false){
			$('#table_area').show();
			$('#qr_wrapper').css('display','flex');
			$('#btn_leave_quiz').css('display', 'flex');
			$('#btn_leave_quiz').css('width','200px');
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

		$('#spelerslijst').click(function(e){
			if($('#spelerslijst_area').is(':hidden')){
				$('#spelerslijst_area').show();
				$('#spelerslijst').text('<- terug');
			} else {
				$('#spelerslijst_area').hide();
				$('#spelerslijst').text('spelerslijst');
			}
			
			return false;
		});
		
	}
	
	this.bindSocketEvents = function(){
		let connectionLostTimeout;

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
			};
		}(this)
		);

		socket.on('new_leaderboard',function(gameWorld){
			return function(data){
				if (userType == 'spectator'){			
					var types = ['official'];
					var names = {
						'official' : 'Live-score',
					};
					
					for(var t in types){
						var participantsType = types[t];
						var name = names[participantsType];
						var elements = data[0][participantsType];
						
						for(var j = 1; j < 7; j++){ //spelers leeg maken
							$('#playerinfo'+j).html('');
							$('#fichebox'+j).html('');
						}
						var j = 0;
						for(var elem in elements){
							var p = elements[elem];
							j++;
							if (p.issleeping == false){
								if(p.isLastCorrect === true){
									//potentially show on the spectator screen that the last answer was correct
								}
								else if(p.isLastCorrect === false){
									//potentially show on the spectator screen that the last answer was wrong
								}

								var betv = '';
								if(p.betValue > 0){
									betv = p.betValue;
								}

								if (j < 7){
									$('#playerinfo'+j).html(p.team+'<br /><img src="content/bouwer.png" width="50" class="icon player'+j+'" />');
									var counter = p.score;
									ChipAdder(stacksCalculator(counter), 'fichebox'+j);

									if(p.response){
										const card = document.createElement("div");
										card.className = 'cardbox player'+j;
										card.innerHTML = '<img src="content/KlimaatCasino/card.png" width="30" /><div style="position: absolute; left: 35px; top:10px; z-index:5;">'+p.betValue+'</div>';
										$('#fichebox'+j).append(card);
									}
								} else {
									$('#playerinfo6').html('+ en nog '+(j-5)+' anderen');
								}
							}
						}
					}
				} else if (userType == 'admin'){
					var curreceived = [];
					var bettedplayerIDs = [];
					var totalplayers = data[0]['official'].length + 0.000001;
					var answercollect = [];
					for(var elem in data[0]['official']){
						var receivedanswer = data[0]['official'][elem].response;
						if (typeof receivedanswer === 'string'){
							const allans = answers.concat(wronganswers).concat(receivedanswers).concat(goodanswers);
							const lallans = allans.map(ans => ans.toLowerCase());
							if (!(lallans.includes(receivedanswer.toLowerCase()))){
								receivedanswers.push(receivedanswer);
							}

							if(receivedanswer != 'NaN'){
								bettedplayerIDs.push(data[0]['official'][elem].unique_id);
								answercollect.push(receivedanswer);
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

					var html = '';
					for(var a in receivedanswers){
						var ans = receivedanswers[a];
						if (ans){
							html += answerMaker('pending', ans);
						}
					}
					
					$('#pending').html(html);

					var stillneedbettingNames = [];
					for(var i in data[0]['official']){
						if (!(bettedplayerIDs.includes(data[0]['official'][i].unique_id))){
							stillneedbettingNames.push(data[0]['official'][i].team);
						}
					}
					
					var stillneedbettingText = '';
					for(var i in stillneedbettingNames){
						if(i == 0){
							stillneedbettingText+= stillneedbettingNames[i];
						}
						if (i == 1){
							if(stillneedbettingNames.length < 3){
								stillneedbettingText+=' en ';
							} else {
								stillneedbettingText+=', ';
							}
							stillneedbettingText+= stillneedbettingNames[i];
						}
						if (i == 2){
							if(stillneedbettingNames.length == 3){
								stillneedbettingText+=' en ';
							} else {
								stillneedbettingText+=' en '+(stillneedbettingNames.length - i)+' anderen';
								break;	
							}
							stillneedbettingText+= stillneedbettingNames[i];
						}					
					}
					stillneedbettingText += ' moet';
					if(stillneedbettingNames.length > 1){
						stillneedbettingText += 'en';
					}
					stillneedbettingText += ' nog inzetten';
					$('#stoplicht_image').attr('src', '../content/stoplicht_rood.png');
					if(stillneedbettingNames.length == 0){
						stillneedbettingText = 'Iedereen heeft ingezet';
						$('#stoplicht_image').attr('src', '../content/stoplicht_groen.png');
					} 
					$('#stoplicht_text').html(stillneedbettingText);

					$("#results").html('');
					if(curState==states.SHOW_ANSWER){
						console.log(correctAnswerId);
						if(openquestion == true){
							//show the results of open questions to the admin...
						} else {
							for(var i=0;i<answers.length;i++){
								var $letter = $("<div>")
								.attr("style","color:#000; background-color: "+answercolors[i]+"; padding: 3px; padding-left:15px; padding-right:15px; display:flex; align-items:center; height:41px;")
								.text(String.fromCharCode(65 + i));

								var bettedthisone = 0;
								var balkcolor = 'red';
								if(correctAnswerId == i+1){
									balkcolor = 'green';
								}
								for(var j in answercollect){
									if(answercollect[j] == String(i+1)){
										bettedthisone++;
									}
								}
								console.log(bettedthisone);
								var $div = $("<div>")
								.attr("style","padding: 3px; padding-left: 20px; width:100%;")
								.html('<div style="width:'+Math.round(bettedthisone / totalplayers *100)+'%; min-width:45px; padding:10px; background-color:'+balkcolor+'; white-space:nowrap;">'+Math.round(bettedthisone / totalplayers *100)+' %</div>');

								var $answerWrapper = $("<div>")
							    .attr("style","display: flex; padding-top:10px; align-items:center; width:100%;")
							      .append($letter)
							      .append($div);
							    $("#results").append($answerWrapper);
							}
						}
					    $("#results").show();
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
		added_chips = false;
	}
	
	this.starting = function(stateParams){
		this.setWaitStatus('Starting... Good luck and have fun!');
		$('#qr_area').html('');
		$('#questiontext').html('');
	}
	
	let betValue = 0;
	var temp_answer = 404;
	var temp_bet = 0;
	var vidlink = '';
	var temp_role = "";
	let score = 0;
	var answercolors = {0:'#F2EB17',1:'#B9519F',2:'#64CDF5',3:'#017591'};
	this.showQuestion = function(stateParams){
		$('#wait_area').hide();
		if(curState == states.SHOW_QUESTION){
			$('#fiches_inhand').css("opacity","1");
			temp_bet = 0;
		} else {
			$('#fiches_inhand').css("opacity","0.5");
		}
		document.body.style.backgroundColor = "";	
		receivedanswers = [];
		openquestion = false;	
		
		vidlink = '';
		if(stateParams.vid!==''){
			vidlink = stateParams.vid;
		}

		if(stateParams){
			score = stateParams.score;
		}
		
		if(userType=='official_participant'){
    		if (curState==states.SHOW_QUESTION){
        		
        		//when the new question is loaded, reset all values
        		betValue = 0;
        		temp_answer = 404;
        		temp_bet = 0;
    		     selectedAnswerId = false;
    		     socket.emit('quiz_send_answer', { answerId: selectedAnswerId, bet: betValue });
    		     
				$('#player_console').show();
        		if(stateParams.bonusrole.includes(temp_role)){
            		// to do? show in player screen that this question is their bonus question
        		}
			}
    	} else { //the user is the admin or spectator
    	   $('#q_area .questiontext').html('Vraag '+stateParams.curq+'/'+stateParams.totalqs+' - '+stateParams.question);
    	   $('#question_area .question').html('Vraag '+stateParams.curq+'/'+stateParams.totalqs+' - '+stateParams.question);
    	   $('#video_area').hide();
		   if (userType=='spectator'){
			    if (curState==states.SHOW_VIDEO){
					$('#myVideo').html('<video style="height: 100%;" controls id="videotag" ><source src="content/KlimaatCasino/'+ vidlink + '" type="video/mp4">Your browser does not support the video tag.</video>');
					$('#vidvraagnummer').html('Vraag '+stateParams.curq+'/'+stateParams.totalqs+' - ');
    	   			$('#vidvraag').html('"'+stateParams.question+'"');
    	   			$('#video_area').css('display','flex');
				}else{
					$('#question_area .bet').html('');
					if(document.getElementById('videotag')!==null){
						document.getElementById('videotag').pause();
					}
				}
			}
    	}
		
		answers = stateParams.answers;		
		var type = stateParams.type;	
		$('#q_area .answrs').html("");
		$('#player_answers').html("");
		
	 	if (type == 'open'){
			openquestion = true;
			if (userType=='admin' && (curState==states.SHOW_QUESTION || curState==states.SHOW_VIDEO || curState==states.SHOW_ANSWER)){
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
							html += '<span style="cursor: pointer;" onclick="toUpdateAns(\''+ans+'\',\'left\')">&larr;</span>';
						}
					}
					html += ans;
					if (curloc == 'good' || curloc == 'pending'){
						if (curState!=states.SHOW_VIDEO){
							html += '<span style="cursor: pointer;" onclick="toUpdateAns(\''+ans+'\',\'right\')">&rarr;</span>';
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

				createAnswerList('good', answers, goodanswers);
				createAnswerList('wrong', [], wronganswers); // insert standard wrong answers
			} 
		} else {
			for(var i=0;i<answers.length;i++){
				var curLetter = String.fromCharCode(65 + i);
				var answerId = (i+1);
				
				if(userType=='official_participant' && (curState==states.SHOW_QUESTION || curState==states.SHOW_VIDEO || curState==states.SHOW_ANSWER)){
					var $div = $("<div>", { id:'answer'+i, answer_id:answerId })
					.attr("style","color:#000; background-color: "+answercolors[i]+"; box-sizing:border-box; height:66px; padding: 10px; align-items:center; text-align:center; margin:10px; position:relative; display:flex;")
					.addClass("answer_"+answerId)
					.append("<span/>")
					.html('<div style="display:flex;">'+curLetter+'</div><div style="display:flex; width:100%;" id="chipcontainer'+i+'"></div><div style="display:flex; font-size:18px; color:#fff; white-space:nowrap;" id="answernumber'+i+'"></div>');
					
					$("#player_answers").append($div);
					if(curState==states.SHOW_VIDEO || curState==states.SHOW_ANSWER){
						$('#answer'+i).css('border','0px #fff solid');
						$('#answer'+i).css('opacity','0.5');
						if (temp_answer==answerId){
							$('#answer'+i).css('border','2px #fff solid');
							if (curState==states.SHOW_ANSWER){
								$('#answer'+i).css('border','2px red solid');
							}
							$('#answer'+i).css('opacity','1');
							ChipAdder(stacksCalculator(temp_bet),'answer'+i,'player',i);
							if(temp_bet > 0){
								$('#answernumber'+i).html('= '+temp_bet);
							}
						}
						if (curState==states.SHOW_ANSWER){
							if (stateParams.answerId == i + 1){
								$('#answer'+i).css('border','2px #0f0 solid');
								$('#answer'+i).css('opacity','1');
							}
						}
					}
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
							
			}
		}
		
		$('#verzenden2').click(function(){
			selectedAnswerId = $('#openanswer2').val();
			betValue = stackCounter(stackobj[0]);
			$('#verzenden2').css('background-color','#555');
			$('#verzenden2').html('verzonden');
			socket.emit('quiz_send_answer',{answerId:selectedAnswerId, bet: betValue });
			socket.emit('update_leaderboard');
		});

		$('#openanswer2').click(function(){
			$('#verzenden2').css('background-color','blue');
			$('#verzenden2').html('verzenden');
		});
	}

	var correctAnswerId = 345543523;
	this.showAnswer = function(stateParams){
		correctAnswerId = stateParams.answerId;
		var answers = stateParams.answers;
		var correctAnswer = false;
		if(correctAnswerId == selectedAnswerId){
			correctAnswer = true;
		}

		for(i=0;i<answers.length;i++){
			$('#answer_'+i).css("opacity","0.3");
		}
		$('#answer_'+correctAnswerId).css("border","2px #fff solid").css("opacity","1").css("padding","1px").css("padding-left","13px").css("padding-right","13px");

		if(userType=='official_participant' || userType=='unofficial_participant'){
			ChipRemover();
			ChipAdder(stacksCalculator(score),'fiches_inhand','player','yours');
		} else if (userType == 'spectator' && openquestion == true){
			var html = 'Goede antwoorden: ';
			const allgood = stateParams.savedanswers[0];
			for(var i=0;i<allgood.length;i++){
				html += allgood[i] + ', ';
			}
			$("#q_area .answrs").html(html.substring(0,html.length-2));
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