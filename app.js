var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
	pingInterval: 10000, // Send a ping every 10 seconds
	pingTimeout: 5000,   // If no pong is received within 5 seconds, consider the connection closed
  });
var express_session = require("express-session")({
    secret: "c60ebe0a696ee406ad598621c0a70c15",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");
require('string.prototype.startswith');

var Entities = require('html-entities').XmlEntities;
var entities = new Entities();

var fs = require('fs');
eval(fs.readFileSync('quiz.js')+'');
eval(fs.readFileSync('public/content/questions.js')+'');
eval(fs.readFileSync('public/content/endgame.js')+'');

app.use(express_session);
app.use(express.static('public'));
io.use(sharedsession(express_session, {autoSave:true} ));

var quizzes = new Quizzes();

app.get('/quiz/:quiz_id', function(req, res){
	try{
		var quiz_id = req.params.quiz_id;
		
		if(!quizzes.isValidQuizId(quiz_id)){
			res.redirect('/');
		}
		else{
			req.session.quiz_id = quiz_id;
			res.redirect('/connect.html?type=admin');
		}
	}
	catch(e){
		console.log(e);
		console.trace();
	}
});

app.get('/digiboard/:quiz_id', function(req, res){
	try{
		var quiz_id = req.params.quiz_id;
		
		if(!quizzes.isValidQuizId(quiz_id)){
			res.redirect('/');
		}
		else{
			req.session.quiz_id = quiz_id;
			res.redirect('/connect.html?quiz_id='+quiz_id+'&type=spectator');
		}
	}
	catch(e){
		console.log(e);
		console.trace();
	}
});
app.get('/join/:quiz_id', function(req, res){
	try{
		var quiz_id = req.params.quiz_id;
		
		if(!quizzes.isValidQuizId(quiz_id)){
			res.redirect('/geenquiz.html');
		}
		else{
			req.session.quiz_id = quiz_id;
			res.redirect('/connect.html?quiz_id='+quiz_id+'&type=player');
		}
	}
	catch(e){
		console.log(e);
		console.trace();
	}
});

var isAdmin = function(socket,session){
	if(!session.ready_for_quiz){
		socket.emit('quiz_init_nok');	
		console.log('sent back to index because did something for admins while not being admin.');
		return false;
	}
	
	var participantId = session.participantId;
	var participant = quizzes.getParticipant(session.quiz_id,participantId);
	
	if(!(participant.isAdministrator)){
		socket.emit('quiz_init_nok');
		console.log('sent back to index because did something for admins while not being admin.');		
		return false;			
	}
	
	return true;
}

io.on('connection', function(socket){
	try{
		socket.on('disconnect', (reason) => {
			console.log(`${socket.handshake.session.participantName} (${socket.handshake.session.unique_id} | ${socket.handshake.session.browser}) disconnected. Reason: ${reason}`);
		});

		socket.on('connect',function(data){
			console.log(`(re)connected${socket.handshake.session.participantName} (${socket.handshake.session.unique_id} | ${socket.handshake.session.browser}).`);
			//socket.emit('redirect_to_quiz'); 
		});

		var session = socket.handshake.session;
		
		var tryReconnect = function(uniqueId, socket){
			var currentquizzes = quizzes.getAll();
			var socketquiz_id = socket.handshake.session.quiz_id;
			if(uniqueId !== null){
				for (cq in currentquizzes){
					var participants = currentquizzes[cq].getParticipants();
					for (cp in participants){
						if(uniqueId == participants[cp].getUniqueId()){ //maak nog werkend voor spectator en admin!
							if (socketquiz_id == currentquizzes[cq].getId()){
								socket.emit('redirect_to_quiz'); 
								console.log('haha i still had a socket');
							} else {
								var oldpart = participants[cp];
								var participant = new OfficialParticipant(socket,oldpart.getTeamname(),oldpart.getRole(), 'auto-reconnected');
								participant.setScore(oldpart.getScore());
								currentquizzes[cq].removeParticipant(uniqueId);
								currentquizzes[cq].addParticipant(participant);
								quizzes.updateLeaderboard(currentquizzes[cq].getId(), quizzes.getLeaderboard(currentquizzes[cq].getId()));
								socket.emit('connect_connect_ok', uniqueId);
								console.log('reconnected lost client:'+oldpart.getTeamname());
							}
						}
					}
				}
			}
		}

		/*index.html*/
		socket.on('index_init',function(data){
			tryReconnect(data,socket);
			var currentquizzes = quizzes.getAll();
			socket.emit('index_init_ok',currentquizzes);
		});

		/*socket.on('refresh_me',function(uniqueId){
			var currentquizzes = quizzes.getAll();
			var socketquiz_id = socket.handshake.session.quiz_id;
			for (cq in currentquizzes){
				var participants = currentquizzes[cq].getParticipants();
				for (cp in participants){
					if(uniqueId == participants[cp].getUniqueId()){ //maak nog werkend voor spectator en admin!
						var oldpart = participants[cp];
						var participant = new OfficialParticipant(socket,oldpart.getTeamname(),oldpart.getRole(), 'auto-reconnected');
						participant.setScore(oldpart.getScore());
						currentquizzes[cq].removeParticipant(uniqueId);
						currentquizzes[cq].addParticipant(participant);
						quizzes.updateLeaderboard(currentquizzes[cq].getId(), quizzes.getLeaderboard(currentquizzes[cq].getId()));
						//socket.emit('refresh', uniqueId);
						console.log('refreshed client')
					}
				}
			}
		});*/
		
		/*connect.html*/	
		socket.on('connect_init',function(data){
			var quiz_id = session.quiz_id;
			//var potentialquiz = quizzes.potentialQuiz(data);
			if(session.ready_for_quiz) socket.emit('connect_init_ok_ready_quiz');
			else if(!quizzes.isValidQuizId(quiz_id)){
				/*if(potentialquiz !== undefined){
					console.log('doe een connect');
				}*/
				socket.emit('connect_init_nok');
			}else{
				var quiz_details = quizzes.getQuizDetails(quiz_id);
				var quiz_desc = quiz_details.desc;
				var quiz_pic = quiz_details.pic;

				socket.emit('connect_init_ok',{quiz_desc:quiz_desc,quiz_pic:quiz_pic});
			}
		});
		
		socket.on('connect_connect',function(data){
			var type = data.type;
			var participant;
			
			if(type=='official' || type=='unofficial'){
				var team_name = data.team_name;
				var answerweights = {
					q1: {
						1: [0,1],
						2: [0.5,0],
						3: [0,0.5],
						4: [1,0],
						5: [0,0.5],
						6: [1,0]
					},
					q2: {
						1: [0,1],
						2: [0,1],
						3: [1,0],
						4: [0,0],
						5: [1,0],
						6: [0,0]
					},
					q3: {
						1: [0,0],
						2: [1,0],
						3: [0,0],
						4: [1,0],
						5: [0,0],
						6: [0,1]
					},
					q4: {
						1: [0,1],
						2: [0.5,0],
						3: [1,0],
						4: [0,0],
						5: [1,0],
						6: [0,0]
					},
					q5: {
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
				for (let quest in data.pregameanswers){
					for (let rl in rolescores){
						rolescores[rl] += answerweights[quest][rl][parseInt(data.pregameanswers[quest])];
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
				var role = rolenames[maxKey];

				if(team_name) team_name = team_name.toUpperCase();
				
				if(!quizzes.isValidTeamname(session.quiz_id,team_name)){
					socket.emit('connect_connect_nok_invalid_team_name');
					return;
				}	
				
				if(type=='official'){
					var quiz_code = data.quiz_code;
					
					if(!quizzes.isValidQuizCode(session.quiz_id,quiz_code)){
						socket.emit('connect_connect_nok_invalid_quiz_code');
						return;
					}
					else{
						participant = new OfficialParticipant(socket,team_name,role, data.browser);
						//socket.emit('quiz_get_leaderboard');
					}
				}
				else if(type=='unofficial'){
					participant = new UnofficialParticipant(socket,team_name);
				}
			}
			else if(type=='spectator'){
				participant = new Spectator(socket, data.browser);
			}
			else if(type=='admin'){
				var admin_password = data.admin_password;
				
				if(admin_password == 'tttt'){
					if(data.endgame){
						quizzes.enableEndgame(session.quiz_id);
					}
					quizzes.addQuestions(session.quiz_id,data.questions);
					participant = new Administrator(socket, data.browser);
				} else if(quizzes.isValidAdminPassword(session.quiz_id,admin_password)){
					participant = new Administrator(socket, data.browser);
				}
				else{
					socket.emit('connect_connect_nok_invalid_admin_password');
					return;
				}
			}
			quizzes.addParticipant(participant);
			socket.emit('connect_connect_ok', participant.getUniqueId());
		});
		
		/*quiz.html*/
		socket.on('quiz_init',function(data){
			if(!session.ready_for_quiz){
				tryReconnect(data, socket);
				socket.emit('quiz_init_nok');	
				console.log('did try reconnect');	
				return;
			}
			
			var participantId = session.participantId;
			var participant = quizzes.getParticipant(session.quiz_id,participantId);
			
			socket.emit('quiz_init_ok',{userType: participant.getUserType(), quizId: session.quiz_id });
			
			participant.updateSocket(socket);
			quizzes.sendUpdates(participant);
			var leaderboard = quizzes.getLeaderboard(session.quiz_id);
			//socket.emit('quiz_leaderboard',leaderboard);
			socket.emit('new_leaderboard', leaderboard);
		});
		
		socket.on('quiz_send_answer',function(data){
			if(!session.ready_for_quiz){
				socket.emit('quiz_init_nok');	
				console.log('did try reconnect');	
				return;
			}
			
			var participantId = session.participantId;
			var participant = quizzes.getParticipant(session.quiz_id,participantId);
			
			if(participant.isRealParticipant){
				quizzes.collectResponse(session.quiz_id,participant,data);
			}
		});

		socket.on('destroy',function(data){
			socket.removeAllListeners();  // Remove all event listeners
  			socket.disconnect(true);
			console.log('socket removed from server');
		});
		
		socket.on('quiz_leave_quiz',function(data){
			quizzes.removeParticipant(session);
			var leaderboard = quizzes.getLeaderboard(session.quiz_id);
			//socket.emit('quiz_leaderboard',leaderboard);
			session.ready_for_quiz = false;
			session.participantId = false;
			socket.emit('quiz_init_nok');
		});
		
		socket.on('quiz_get_leaderboard',function(data){
			if(!session.ready_for_quiz){
				socket.emit('quiz_init_nok');	
				console.log('quiz_init_nok leaderboard');	
				return;
			}
			
			var participantId = session.participantId;
			var participant = quizzes.getParticipant(session.quiz_id,participantId);
					
			var leaderboard = quizzes.getLeaderboard(session.quiz_id);
			socket.emit('quiz_leaderboard',leaderboard);
			console.log('quiz_leaderboard from quiz_get_leaderboard');
		});
		
		/*admin functions*/
		socket.on('quiz_admin_start_quiz',function(data){
			if(isAdmin(socket,session)){
				quizzes.startQuiz(session.quiz_id);
				var leaderboard = quizzes.getLeaderboard(session.quiz_id);
				quizzes.updateLeaderboard(session.quiz_id, leaderboard);
			}
		});
		
		socket.on('quiz_admin_test_question',function(data){
			if(isAdmin(socket,session)){
				quizzes.showTestQuestion(session.quiz_id);
			}
		});
		
		socket.on('quiz_admin_next_question',function(data){
			if(isAdmin(socket,session)){
				quizzes.showNextQuestion(session.quiz_id);
			}
		});
		
		socket.on('quiz_admin_cancel_last_question',function(data){
			if(isAdmin(socket,session)){
				quizzes.cancelLastQuestion(session.quiz_id);
			}
		});
		
		socket.on('quiz_admin_reveal_answer',function(data){
			if(isAdmin(socket,session)){
				quizzes.revealAnswer(session.quiz_id, data);
			}
		});

		socket.on('update_leaderboard',function(data){
			var leaderboard = quizzes.getLeaderboard(session.quiz_id);
			quizzes.updateLeaderboard(session.quiz_id, leaderboard);
		});
		
		socket.on('show_video',function(data){
			if(isAdmin(socket,session)){
				quizzes.hideCoins(session.quiz_id, data);
			}
		});

		socket.on('start_endgame',function(data){
			if(isAdmin(socket,session)){
				quizzes.startEndgame(session.quiz_id);
				var leaderboard = quizzes.getLeaderboard(session.quiz_id);
				quizzes.updateLeaderboard(session.quiz_id, leaderboard);
			}
		});

		socket.on('spin_endgame',function(data){
			if(isAdmin(socket,session)){
				quizzes.spinEndgame(session.quiz_id, data);
			}
		});

		socket.on('next_scenario',function(data){
			if(isAdmin(socket,session)){
				quizzes.nextScenario(session.quiz_id, data);
			}
		});
		
		socket.on('quiz_admin_end_quiz',function(data){
			if(isAdmin(socket,session)){
				quizzes.endQuiz(session.quiz_id);
			}	
		});
	}
	catch(e){
		console.log(e);
		console.trace();
	}
});

server.listen(3000);