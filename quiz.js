var states = {START:0,STARTING:1,SHOW_QUESTION:2,SHOW_VIDEO:3,SHOW_ANSWER:4,END:5};
var startingscore = 30;

function Quizzes(){
	var quizzes = {};
	var quiz = new Quiz('Vincent');
	quizzes['Vincent'] = quiz;
	var quiz = new Quiz('Joeri');
	quizzes['Joeri'] = quiz;
	var quiz = new Quiz('Frank');
	quizzes['Frank'] = quiz;
	var quiz = new Quiz('Bibi');
	quizzes['Bibi'] = quiz;
	console.log("Ready!");
	this.addQuestions = function(quizId,selectedQs){
		quizzes[quizId].emptyQuiz();
		var onlybasis = true;
		for (let i in selectedQs){ //Check if the quiz only consists of basis questions
			if (questions[selectedQs[i]].category != 'Basis'){
				onlybasis = false;
			}
		}
		var bonusquestions = {};
		for (let i in rolenames){ //set up the bonusquestion for each role
			bonusquestions[rolenames[i]] = {qid:0,position:1000};
		}
		for (let i in selectedQs){
			if (onlybasis == true || questions[selectedQs[i]].category != 'Basis'){ //if there are not only basis questions, skip the basis questions
				var count = 0;
				for (let j in questions[selectedQs[i]].bonusrole){
					if (bonusquestions[rolenames[questions[selectedQs[i]].bonusrole[j]]].position > count){ // if the current highest position of the questions for this bonusrole is higher than that of the current question, make this question the highest
						bonusquestions[rolenames[questions[selectedQs[i]].bonusrole[j]]].position = count;
						bonusquestions[rolenames[questions[selectedQs[i]].bonusrole[j]]].qid = selectedQs[i];
					}
					count += 1;
				}
			}
		}
		for (let i in selectedQs){
			var selectedquestion = new Question();
			selectedquestion.setVid(questions[selectedQs[i]].video);
			if ('type' in questions[selectedQs[i]]){
				selectedquestion.setType(questions[selectedQs[i]].type);
			}
			for (let j in bonusquestions){
				if (bonusquestions[j].qid == selectedQs[i]){ // if this question is the bonus question for a certain role
					selectedquestion.setBonus(j); //set the bonusrole for this question
				}
			}
			for (let a in questions[selectedQs[i]].answers){
				var ans = questions[selectedQs[i]].answers[a];
				if (ans.charAt(0) == '!'){ 
					selectedquestion.addCorrectAnswer(ans.substring(1));
				} else {
					selectedquestion.addAnswer(ans);
				}
			}
			selectedquestion.setQuestion(questions[selectedQs[i]].question);
			quizzes[quizId].addQuestion(selectedquestion);
		}
	}

	this.getList = function(){
		var result = [];
		for(var q in quizzes){
			result.push({quiz: q,link: '/quiz/'+q});
		}

		return result;
	}

	this.getAll = function(){
		return quizzes;
	}

	this.addParticipant = function(participant){
		var quizId = participant.getQuizId();
		if(quizId in quizzes){
			quizzes[quizId].addParticipant(participant);
		}
	}

	this.removeParticipant = function(data){
		if(data.quiz_id in quizzes){
			quizzes[data.quiz_id].removeParticipant(data.participantId);
		}
	}

	this.isValidQuizId = function(quizId){
		if(typeof quizId === 'undefined') return false;
		if(quizId in quizzes) return true;
		return false;
	}

	this.isValidTeamname = function(quizId,teamname){
		if(quizId in quizzes)
		return quizzes[quizId].isValidTeamname(teamname);
	}

	this.getQuizDetails = function(quizId){
		if(quizId in quizzes)
		return quizzes[quizId].getDetails();
	}

	this.isValidQuizCode = function (quizId,quizCode){
		if(quizId in quizzes)
		return quizzes[quizId].isValidQuizCode(quizCode);
	}

	this.isValidAdminPassword = function(quizId,adminPassword){
		if(quizId in quizzes)
		return quizzes[quizId].isValidAdminPassword(adminPassword);
	}

	this.sendUpdates = function(participant){
		var quizId = participant.getQuizId();
		if(quizId in quizzes)
		quizzes[quizId].sendUpdates(participant);
	}

	this.getParticipant = function(quizId,participantId){
		if(quizId in quizzes)
		return quizzes[quizId].getParticipant(participantId);
	}

	this.startQuiz = function(quizId){
		if(quizId in quizzes)
		quizzes[quizId].startQuiz();
	}

	this.endQuiz = function(quizId){
		if(quizId in quizzes)
		quizzes[quizId].endQuiz();
	}

	this.showNextQuestion = function(quizId){
		if(quizId in quizzes)
		quizzes[quizId].nextQuestion();
	}

	this.collectResponse = function(quizId,participant,response){
		if(quizId in quizzes)
		quizzes[quizId].collectResponse(participant,response);
	}
	
	this.revealAnswer = function(quizId, data){
		if(quizId in quizzes)
		quizzes[quizId].revealAnswer(quizzes[quizId], data);
	}

	this.updateLeaderboard = function(quizId, leaderboard){
		if(quizId in quizzes)
		quizzes[quizId].updateLeaderboard(quizzes[quizId], leaderboard);
	}

	this.getLeaderboard = function(quizId){
		if(quizId in quizzes)
		return quizzes[quizId].getLeaderboard();
	}

	this.getQuestionType = function(quizId){
		if(quizId in quizzes)
			return quizzes[quizId].getQuestionType();
	}

	this.getSavedAnswers = function(quizId){
		if(quizId in quizzes)
			return quizzes[quizId].getSavedAnswers();
	}

	this.setSavedAnswers = function(quizId, good, wrong){
		if(quizId in quizzes)
			return quizzes[quizId].setSavedAnswers(good, wrong);
	}

	this.getCurAnswers = function(quizId){
		if(quizId in quizzes)
			return quizzes[quizId].getCurAnswers();
	}

	this.getCurQuestion = function(quizId){
		if(quizId in quizzes)
			return quizzes[quizId].getCurQuestion();
	}

	this.getCurVid = function(quizId){
		if(quizId in quizzes)
			return quizzes[quizId].getCurVid();
	}

	this.setShowedAnswer = function(quizId, bool){
		if(quizId in quizzes)
			return quizzes[quizId].setShowedAnswer(bool);
	}

	this.getTotalQuestions = function(quizId){
		if(quizId in quizzes)
			return quizzes[quizId].countQuestions();
	}

	this.showVideo = function(quizId, data){
		if(quizId in quizzes)
		quizzes[quizId].showVideo(quizzes[quizId], {savedanswers: [data[0],data[1]]});
	}
}

function Participants(){
	var participants = {};
	var teamnames = {};
	var leaderboard = new Leaderboard();

	this.addParticipant = function(participant){
		var uniqueId = participant.getUniqueId();
		if(typeof uniqueId === 'undefined' || !uniqueId) return;

		participants[uniqueId] = participant;

		if(participant.isRealParticipant){
			teamnames[participant.getTeamname()] = true;
			this.updateRanks();
		}
	}

	this.getParticipant = function(participantId){
		if(participantId in participants)
			return participants[participantId];
		else
			return false;
	}

	this.removeParticipant = function(uniqueId){
		if(uniqueId in participants)
			delete participants[uniqueId];
			this.updateRanks();
	}

	this.getAll = function(){
		return participants;
	}

	this.resetResponses = function(){
		for(var id in participants){
			if(participants[id] && participants[id].isRealParticipant){
				participants[id].resetResponse();
			}
		}
	}

	this.resetScores = function(){
		for(var id in participants){
			if(participants[id] && participants[id].isRealParticipant){
				participants[id].resetScore();
			}
		}
	}

	this.updateScores = function(answerId,marks,bonusrl, data){
		for(var id in participants){
			if(participants[id] && participants[id].isRealParticipant){
				participants[id].updateScore(answerId,marks,bonusrl, data);
			}
		}

		this.updateRanks();
	}

	this.getAllscores = function(){
		scores = [];
		for(var id in participants){
			if(participants[id] && participants[id].isRealParticipant){
				if(participants[id].isSleeping() == false){
					scores.push(participants[id].getScore());
				}
			}
		}
		return scores;
	}

	this.getAllbets = function(){
		var bets = [];
		for(var id in participants){
			if(participants[id] && participants[id].isRealParticipant){
				bets.push(participants[id].getResponse());
			}
		}
		return bets;
	}

	this.addBonus = function(bonus){
		for(var id in participants){
			if(participants[id] && participants[id].isRealParticipant){
				participants[id].addBonus(bonus);
			}
		}
	}

	this.revertScores = function(answerId,marks){
		for(var id in participants){
			if(participants[id] && participants[id].isRealParticipant){
				participants[id].revertScore(answerId,marks);
			}
		}

		this.updateRanks();
	}

	this.updateRanks = function(){
		leaderboard.updateRanks(participants);
	}

	this.getLeaderboard = function(){
		return leaderboard;
	}

	setInterval(function(participants){
		return function() {
			participants.updateRanks();
		}
	}(this)
	,5000);
}

function Participant(){
	var socket = false;

	this.initParent = function(pSocket){
		socket = pSocket;
		if(socket && socket.handshake && socket.handshake.session){
			if(typeof socket.handshake.session.unique_id === 'undefined'){
				console.log('# Participant connected.');
				socket.handshake.session.unique_id = socket.id;
			}

			socket.handshake.session.ready_for_quiz = true;
			socket.handshake.session.participantId = this.getUniqueId();
			if(this.isSpectator){
				socket.handshake.session.participantName = 'Digi-board';
			} else if (this.isAdministrator){
				socket.handshake.session.participantName = 'Admin';
			} else {
				socket.handshake.session.participantName = this.tName;
			}
			socket.handshake.session.browser = this.tBrowser;
			socket.handshake.session.save();
		}
	}

	this.getUniqueId = function(){
		if(socket && socket.handshake && socket.handshake.session && socket.handshake.session.unique_id){
			return socket.handshake.session.unique_id;
		}

		return false;
	}

	this.getQuizId = function(){
		if(socket && socket.handshake && socket.handshake.session && socket.handshake.session.quiz_id){
			return socket.handshake.session.quiz_id;
		}
		console.log('incorrect socket, so no quizid at getquizid: '+socket.handshake);

		return false;
	}

	this.updateSocket = function(pSocket){
		socket = pSocket;
	}

	this.sendUpdates = function(quizState,params){
		if(!this.isAdministrator && !this.isSpectator && quizState.state != states.END){
			quizState.stateParams.score = this.getScore();
			quizState.stateParams.role = this.getRole();
			quizState.stateParams.myans = this.getResponse();
			quizState.stateParams.mybet = this.betValue();
		}
		if(typeof params!=='undefined' && typeof params.fields!=='undefined'){
			var fields = params.fields;
			for(var f in fields){
				if(fields[f]=='rank'){
					if(this.isRealParticipant){
						quizState.stateParams.rank = this.getRank();
					}
				}
			}
		}
		if(typeof params!=='undefined'){ 
			if(typeof params.savedanswers!=='undefined'){ 
				quizzes.setSavedAnswers(this.getQuizId(), params.savedanswers[0], params.savedanswers[1]);//pass on the saved answers for open questions in case of refresh
			}
			if(params.state){
				if(params.state == states.STARTING && !this.isAdministrator && !this.isSpectator){
					this.setSleeping(true);
				} else if (params.state == states.END && this.isRealParticipant){
					this.addRound();
				}
			}
		}
		if(quizState.state != states.END){
			quizState.stateParams.curq = quizzes.getTotalQuestions(this.getQuizId())[0];
			quizState.stateParams.totalqs = quizzes.getTotalQuestions(this.getQuizId())[1];
			quizState.stateParams.savedanswers = quizzes.getSavedAnswers(this.getQuizId());
			quizState.stateParams.type = quizzes.getQuestionType(this.getQuizId());
			quizState.stateParams.answers = quizzes.getCurAnswers(this.getQuizId());
			quizState.stateParams.question = quizzes.getCurQuestion(this.getQuizId());
			quizState.stateParams.vid = quizzes.getCurVid(this.getQuizId());
		}

		socket.emit('quiz_state_update',quizState);
	}

	this.leaderboardUpdates = function(quizState,leaderboard){
		socket.emit('new_leaderboard',leaderboard);
	}
}

function Spectator(pSocket, pBrowser){
	this.__proto__ = new Participant();
	this.isSpectator = true;
	this.tBrowser = pBrowser;
	this.initParent(pSocket);

	this.getUserType = function(){
		return 'spectator';
	}
}

function RealParticipant(pSocket,pTeamname){
	this.__proto__ = new Participant();
	this.isRealParticipant = true;

	var teamname;
	var role;
	var response = false;
	var score = startingscore;
	var rank = 1;
	var lastCorrect = null;
	var bet = 0;
	var sleeping = false;
	var roundsplayed = 0;

	this.initParentParent = function(pSocket){
		this.initParent(pSocket);
	}

	this.getTeamname = function(){
		return teamname;
	}
	
	this.getRole = function(){
		return role;
	}

	this.setTeamname = function(pTeamname){
		teamname = pTeamname;
	}
	
	this.setRole = function(pRole){
		role = pRole;
	}

	this.addRound = function(){
		roundsplayed += 1;
	}

	this.addBonus = function(bonus){
		score += bonus;
	}

	this.setSleeping = function(issleeping){
		if(roundsplayed > 0){
			sleeping = issleeping;
		}
	}

	this.isSleeping = function(){
		return sleeping;
	}

	this.setResponse = function(answerId, betValue){
		response = answerId;
		bet = parseInt(betValue);
		var maxbet = Math.ceil(score / 2);
		if (bet > maxbet){
			bet = maxbet;
		}
		if(!(answerId == false && betValue == 0 ) && sleeping == true){
			sleeping = false;
		}
	}

	this.getResponse = function(){
		return response;
	}

	this.resetResponse = function(){
		response = false;
		bet = 0;
		this.resetLastCorrect();
	}

	this.updateScore = function(answerId,marks,bonusrl, data){
		var checkcorrect = answerId == response;
		if (data && response){
			const ldata = data.map(ans => ans.toLowerCase());
			checkcorrect = ldata.includes(response.toLowerCase());
		}
		if(checkcorrect){
			score += bet;
			if(bonusrl.includes(role)){score += bet;}
			this.setLastCorrect(true);
		}
		else{
    		score -= bet;
			if (score < 0){
				score = 0;
			}
			this.setLastCorrect(false);
		}
	}

	this.resetScore = function(){
		score = startingscore;
	}

	this.getScore = function(){
		return score;
	}

	this.setScore = function(newscore){
		score = newscore;
	}

	this.getRank = function(){
		return rank;
	}

	this.setRank = function(pRank){
		rank = pRank;
	}

	this.setLastCorrect = function(pLastCorrect){
		lastCorrect = pLastCorrect;
	}

	this.isLastCorrect = function(){
		return lastCorrect;
	}

	this.resetLastCorrect = function(){
		lastCorrect = null;
	}

	this.betValue = function(){
		return bet;
	}

	this.initParentParent(pSocket);
	this.setTeamname(pTeamname);
}

function OfficialParticipant(pSocket,pTeamname, pRole, pBrowser){
	this.__proto__ = new RealParticipant();
	this.isOfficialParticipant = true;
	this.tName = pTeamname;
	this.tBrowser = pBrowser;
	this.initParentParent(pSocket);
	this.setTeamname(pTeamname);
	this.setRole(pRole);

	this.getUserType = function(){
		return 'official_participant';
	}
}

function UnofficialParticipant(pSocket,pTeamname){
	this.__proto__ = new RealParticipant();
	this.isUnofficialParticipant = true;

	this.initParentParent(pSocket);
	this.setTeamname(pTeamname);

	this.getUserType = function(){
		return 'unofficial_participant';
	}
}

function Administrator(pSocket, pBrowser){
	this.__proto__ = new Participant();
	this.isAdministrator = true;
	this.tBrowser = pBrowser;
	this.initParent(pSocket);
	this.getUserType = function(){
		return 'admin';
	}
}

function Questions(){
	var currentQuestion = 0;
	var questions = [];

	this.hasNext = function(){
		if(0<=currentQuestion && currentQuestion<questions.length) return true;
		return false;
	}

	this.next = function(){
		var question = questions[currentQuestion];
		currentQuestion++;
		return question;
	}

	this.addQuestion = function(question){
		questions.push(question);
	}

	this.resetPosition = function(){
		currentQuestion = 0;
	}

	this.countQuestions = function(){
		return [currentQuestion, questions.length];
	}
}

function Question(){
	var question = "";
	var answers = [];
	var correctAnswerId = 0;
	var vid = "";
	var bonusrole = [];
	var type = 'mc';

	this.setQuestion = function(pQuestion){
		question = pQuestion;
	}
	
	this.setVid = function(pVid){
		vid = pVid;
	}

	this.getVid = function(){
		return vid;
	}
	
	this.setBonus = function(pBonus){
		bonusrole.push(pBonus);
	}
	
	this.getBonus = function(){
		return bonusrole;
	}

	this.getType = function(){
		return type;
	}

	this.setType = function(t){
		type = t;
	}

	this.addAnswer = function(pAnswer){
		answers.push(pAnswer);
	}

	this.getAnswers = function(){
		return answers;
	}

	this.addCorrectAnswer = function(pAnswer){
		answers.push(pAnswer);
		correctAnswerId = answers.length;
	}

	this.getQuestionOnly = function(){
		return {question:question,answers:answers,vid:vid,bonusrole:bonusrole, type:type};
	}

	this.getAnswerId = function(){
		return correctAnswerId;
	}
}

function Leaderboard(){
	var official_participants = [];
	var unofficial_participants = [];
	var updating = false;

	this.get = function(){
		var leaderboard = {};
		leaderboard['official'] = [];

		for(var i=0;i<official_participants.length;i++){
			var p = official_participants[i];
			leaderboard['official'].push({team: entities.encode(p.getTeamname()), score: p.getScore(), rank: p.getRank(), isLastCorrect: p.isLastCorrect(), response: p.getResponse(), betValue: p.betValue(), issleeping: p.isSleeping(), unique_id: p.getUniqueId()});
		}

		return leaderboard;
	}

	this.updateRank = function(participant){
		var participantScore = participant.getScore();
		var participantArray = [];

		if(participant.isOfficialParticipant) participantArray = official_participants;

		var curRank = 1;

		for(var i=0;i<participantArray.length;i++){
			var curScore = participantArray[i].getScore();
			if(i>0 && curScore != participantArray[i-1].getScore() && participantArray[i-1].isSleeping() == false){
				curRank ++;
			}

			if(participantScore >= curScore ){
				break;
			}
		}

		participant.setRank(curRank);
	}

	this.updateRanks = function(participants){
		if(!updating){
			updating = true;
			var tmp_official_participants = []

			for(var i in participants){
				var p = participants[i];

				if(p.isOfficialParticipant){
					tmp_official_participants.push(p);
				}
			}

			tmp_official_participants.sort(function(a, b) {
				if(a.getScore()!=b.getScore()) return - a.getScore() + b.getScore();
				else{
					return a.getTeamname().localeCompare(b.getTeamname());
				}
			});

			official_participants = tmp_official_participants;

			for(p in official_participants){
				var participant = official_participants[p];
				this.updateRank(participant);
			}

			updating = false;
		}
	}
}

function QuizState(pQuizId){
	var quizId = pQuizId;
	var curState = states.START;
	var stateParams = false;
	var hiddenParams = false;

	this.get = function(){
		return curState;
	}

	this.setStart = function(pStateParams){
		console.log('# Quiz state changed to START ['+quizId+']');
		curState = states.START;
		stateParams = pStateParams;
	}

	this.setStarting = function(pStateParams){
		console.log('# Quiz state changed to STARTING ['+quizId+']');
		curState = states.STARTING;
		stateParams = pStateParams;
	}

	this.setShowQuestion = function(pStateParams){
		console.log('# Quiz state changed to SHOW_QUESTION ['+quizId+']');
		quizzes.setShowedAnswer(quizId, false);
		curState = states.SHOW_QUESTION;
		stateParams = pStateParams;
	}

	this.setShowAnswer = function(pStateParams){
		console.log('# Quiz state changed to SHOW_ANSWER ['+quizId+']');
		quizzes.setShowedAnswer(quizId, true);
		curState = states.SHOW_ANSWER;
		stateParams = pStateParams;
	}
	
	this.setShowVideo = function(){
		console.log('# Quiz state changed to SHOW_VIDEO ['+quizId+']');
		curState = states.SHOW_VIDEO;
	}

	this.setEnd = function(pStateParams){
		console.log('# Quiz state changed to END ['+quizId+']');
		curState = states.END;
		stateParams = pStateParams;
	}

	this.setHiddenParams = function(pHiddenParams){
		hiddenParams = pHiddenParams;
	}

	this.getHiddenParams = function(){
		return hiddenParams;
	}

	this.getSummary = function(){
		var obj = {};
		obj.state = curState;
		obj.stateParams = stateParams;
		return obj;
	}
}

function Quiz(pQuizId){
	var quizId = pQuizId;
	var timer = new Timer();
	var participants = new Participants();
	var questions = new Questions();
	var quizState = new QuizState(quizId);
	var adminPassword = '';
	var quizCode = '';
	var savedanswers = [0,0];
	var questiontype = 'mc';
	var curanswers = [];
	var curquestion = '';
	var curvid = '';
	var showedanswer = false;

	var startWaitTime = 5;

	this.getParticipants = function(){
		return participants.getAll();
	}

	this.emptyQuiz = function(){
		questions = new Questions();
		quizState = new QuizState(quizId);
	}
	this.addParticipant = function(participant){
		participants.addParticipant(participant);
	}

	this.getParticipant = function(participantId){
		return participants.getParticipant(participantId);
	}

	this.removeParticipant = function(uniqueId){
		participants.removeParticipant(uniqueId);
	}

	this.nextQuestion = function(){
		var curState = quizState.get();
		if(!(curState==states.STARTING || curState==states.SHOW_ANSWER || showedanswer == true)) return;

		if(questions.hasNext()){
			var question = questions.next();
			this.showQuestion(question);
		}
		else{
			this.endQuiz();
		}
	}

	this.showVideo = function(quizid, data){
		quizState.setShowVideo();
		this.sendUpdatesToEveryone(data);
	}

	this.showQuestion = function(question){
		participants.resetResponses();
		curanswers = question.getAnswers();
		curquestion = question.getQuestionOnly().question;
		curvid = question.getVid();
		quizState.setShowQuestion(question.getQuestionOnly());
		quizState.setHiddenParams({answerId: question.getAnswerId(),bonusrole: question.getBonus(), type: question.getType()});
		questiontype = question.getType();

		this.sendUpdatesToEveryone({fields: ['rank']});
	}

	this.collectResponse = function(participant,response){
		var curState = quizState.get();
		if(!(curState==states.SHOW_QUESTION || curState==states.TEST_QUESTION || curState==states.PRESCENARIO)) return;

		var submittedAnswerId = response.answerId;
		var betValue = response.bet;
		participant.setResponse(submittedAnswerId, betValue);
		participants.updateRanks();
	}
	
	this.revealAnswer = function(quiz, data){
    	quiz.showAnswer(data);
  	}

	this.updateLeaderboard = function(quiz, leaderboard){
		quiz.newLeaderboard(leaderboard);
	}

	this.showAnswer = function(data){
		var curState = quizState.get();
		if(!(curState==states.SHOW_QUESTION || curState==states.SHOW_VIDEO)) return;

		var hiddenParams = quizState.getHiddenParams();
		var answerId = hiddenParams.answerId;
		var marks = hiddenParams.marks;
		var bonusrl = hiddenParams.bonusrole;

		participants.updateScores(answerId,marks,bonusrl, data);

		var params = {answerId:answerId};
		if(typeof hiddenParams!='undefined' && typeof hiddenParams.test !=='undefined') params.test = true;
		quizState.setShowAnswer(params);

		if (typeof data == undefined){
			this.sendUpdatesToEveryone({fields: ['rank']});
		} else {
			this.sendUpdatesToEveryone({fields: ['rank'], savedanswers: [data,[]]});
		}
	}

	this.newLeaderboard = function(leaderboard){
		this.sendLeaderboardUpdate(leaderboard);
	}

	this.getLeaderboard = function(){
		return [participants.getLeaderboard().get()];
	}

	this.startQuiz = function(){
		var curState = quizState.get();
		if(!(curState==states.START)) return;

		participants.resetScores();
		questions.resetPosition();

		quizState.setStarting({seconds: startWaitTime});
		this.sendUpdatesToEveryone({fields: ['rank'], state: states.STARTING});

		timer.start(startWaitTime,function(quiz){
			return function(){
				quiz.nextQuestion();
			}
		}(this));
	}

	this.endQuiz = function(){
		var curState = quizState.get();
		//if(!(curState==states.SHOW_QUESTION || curState==states.SHOW_ANSWER || showedanswer == true)) return;

		quizState.setEnd();
		this.sendUpdatesToEveryone({state: states.END});

		setTimeout(
		function(gameWorld){
			return function(){
				quizState.setStart(gameWorld.getDetails());
				gameWorld.sendUpdatesToEveryone({});
			};
		}(this),10000);
	}

	this.isValidTeamname = function(teamname){
		return participants.isValidTeamname(teamname);
	}

	this.sendUpdatesToEveryone = function(params){
		var allParticipants = participants.getAll();
		for(var p in allParticipants){
			this.sendUpdates(allParticipants[p],params);
		}
	}

	this.sendLeaderboardUpdate = function(leaderboard){
		var allParticipants = participants.getAll();
		for(var p in allParticipants){
			this.leaderboardUpdates(allParticipants[p],leaderboard);
		}
	}

	this.sendUpdates = function(participant,params){
		var summary = quizState.getSummary();
		participant.sendUpdates(summary,params);
	}

	this.leaderboardUpdates = function(participant,leaderboard){
		var summary = quizState.getSummary();
		participant.leaderboardUpdates(summary,leaderboard);
	}

	this.getId = function(){
		return quizId;
	}

	this.addQuestion = function(question){
		questions.addQuestion(question);
	}

	this.isValidAdminPassword = function(pAdminPassword){
		if(adminPassword == "") return true;
		if(adminPassword == pAdminPassword) return true;
		return false;
	}

	this.isValidQuizCode = function(pQuizCode){
		if(quizCode == '') return true;
		return quizCode == pQuizCode;
	}

	this.setAdminCode = function(pAdminCode){
		if(pAdminCode.length > 20) console.log("# Invalid admin code. Must be less or equal to 20 characters");
		else adminPassword = pAdminCode;
	}

	this.setQuizCode = function(pQuizCode){
		if(pQuizCode.length > 20) console.log("# Invalid quiz code. Must be less or equal to 20 characters");
		else quizCode = pQuizCode;
	}

	this.ready = function(){
		quizState.setStart(this.getDetails());
		this.sendUpdatesToEveryone({});
	}

	this.getQuestionType = function(){
		return questiontype;
	}

	this.getSavedAnswers = function(){
		return savedanswers;
	}

	this.setSavedAnswers = function(good, wrong){
		savedanswers = [good,wrong];
	}

	this.getCurAnswers = function(){
		return curanswers;
	}

	this.getCurQuestion = function(){
		return curquestion;
	}

	this.getCurVid = function(){
		return curvid;
	}

	this.setShowedAnswer = function(bool){
		showedanswer = bool;
	}

	this.countQuestions = function(){
		return questions.countQuestions();
	}

	this.getDetails = function(){
		var details = {};
		return details;
	}
}

function Timer(){
	var timer = false;
	var callback_fn = false;

	this.start = function(seconds,callback){
		callback_fn = callback;

		timer = setTimeout(function(){
			callback_fn();
		}, seconds * 1000);
	}

	this.clear = function(){
		if(timer){
			clearTimeout(globalTimer);
		}

		if(callback_fn){
			callback_fn();
		}
	}
}