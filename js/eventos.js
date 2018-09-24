(function($, w) {

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;

	function OSAppInitialize(callback){

		var speakers_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers?language="+language+"&type=speaker");

		var sessions_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions");
		var session_days_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/days");
		var session_streams = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/streams");

		// var speaker_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/20071");
		// var speaker_sessions_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/20071/sessions");
		//var session_speakers_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions/13974/speakers");

		$.when (speakers_request, sessions_request, session_days_request, session_streams)
			.done(function (data1, data2, data3, data4) {
			  OSApp.setSessions(data2[0]);
			  OSApp.setSpeakers(data1[0]);
			  OSApp.setEventDays(data3[0]);
			  OSApp.setStreams(data4[0]);
			  OSApp.initialize(language);
			  callback();
			}) 
			.fail(function (err1, err2, err3, err4) {
			  console.log(err1);
			  console.log(err2);
			  console.log(err3);
			  console.log(err4);
			})
	}

	OSAppInitialize(function(){
		Init();
	});

	function Init(){
		// console.log("sessions:");
		// console.log(OSApp.getSessions());
		// console.log("speakers:");
		// console.log(OSApp.getSpeakers());
		// console.log("days:");
		// console.log(OSApp.getEventDays());
		// console.log("streams:");
		// console.log(OSApp.getStreams());
		// console.log("rooms:");
		// console.log(OSApp.getRooms());
		
		// console.log("getSessionsByRoom:")
		// console.log(OSApp.getSessionsByRoom("Auditorio Principal", OSApp.getSessionsByDay(83829, "ES")));

		// console.log("getSessionsByDay:");
		// console.log(OSApp.getSessionsByDay(83829, "ES"));
		// console.log(OSApp.getSessionsByDay(83829, "EN"));
		// console.log(OSApp.getSessionsByDay(83830, "ES"));
		// console.log(OSApp.getSessionsByDay(83830, "EN"));
		// console.log(OSApp.getEventProgram());
		

		printDays(OSApp.getEventProgram());
		printSessions(83829, OSApp.getEventProgram());
	}

	function printSessionsByRoom(room_name, sessions){
		var content = document.getElementById("content-sessions");
	 	content.innerHTML = renderSessionsByRoom(room_name, sessions);
	}

	function renderSessionsByRoom(room_name, sessions) {
		var template_sessiones = "";
		template_sessiones += '<h1>'+room_name+'</h1>';
		template_sessiones += '<div class="sesssions">';
		sessions.forEach(function(session){
			template_sessiones += template_session(session);
		});
		template_sessiones += '</div>';
		return template_sessiones;
	}

	function printSessions(day, days) {
		var sessions = []
		for (var i in days) {
			if (days[i].id == day) {
				sessions[i] = [];
				for (var x in days[i].rooms) {
					sessions[i][x] = {};
					sessions[i][x]["name"] = days[i].rooms[x].name;
					sessions[i][x]["sessions"] = [];
					for (var z in days[i].rooms[x].sessions) {
						var session = {
							closing: days[i].rooms[x].sessions[z].closing,
							opening: days[i].rooms[x].sessions[z].opening,
							title: days[i].rooms[x].sessions[z].title,
							speakers: "pepe, maría, tomás, julián"
						}
						sessions[i][x]["sessions"][z] = {};
						sessions[i][x]["sessions"][z] = session;
					}
				}
			}
		}
		
		var content = document.getElementById("content-sessions");
	 	content.innerHTML = renderSessions(sessions);
	}

	function renderSessions(sessions) {
		var template_sala = "";
		sessions.forEach(function(rooms,i,a){
			var template_sessiones = "";
			rooms.forEach(function(sessions,i,a){
				template_sessiones += '<h1>'+sessions.name+'</h1>';
				template_sessiones += '<div class="sesssions">';
				sessions.sessions.forEach(function(session,i,a){
					template_sessiones += template_session(session);
				});
				template_sessiones += '</div>';
			});
			template_sala += template_sessiones;
		});
		return template_sala;
	}


	var template_session = function(session_data) {
		return '<div id="session" class="">\
							<p class="date">'+session_data.opening+' - '+session_data.closing+'</p>\
							<p class="title">\
								<a href="http://example.com" title="">'+session_data.title+'</a>\
							</p>\
							<h3>SPEAKERS</h3>\
							<p class="speakers"></p>\
						</div>';
	}

	function printDays(days) {
		var days_to_print = [];
		for (var i in days) {
			var day = {
					number: parseInt(i)+1,
					closing: days[i].closing,
					date: days[i].date,
					day: days[i].day,
					event_id: days[i].event_id,
					id: days[i].id,
					opening: days[i].id,
					rooms: days[i].rooms
				};
			days_to_print.push(day);
		}
		
		var content = document.getElementById("content-days")
	 	content.innerHTML = renderDays(days_to_print);
	}

	function renderDays(days_to_print) {

		var template = "";
		days_to_print.forEach(function(day){
			template += template_day(day)
		})
		return template;
	}

	var template_day = function(day_data) {
		var line = "";
		var wrapper_start = '<div id="day" class="">\
													<h1>DIA 1</h1>\
													<p class=""><strong>'+day_data.date+'</strong></p>\
													<div class="container">\
														<div class="todos_los_espacios"><a href="#" id="todos" data-dayid="'+day_data.id+'">TODOS LOS ESPACIOS</a></div>\
															<div class="espacios">';
																for (var i in day_data.rooms) {
																	line += '<p><a href="#" id="'+day_data.rooms[i].name+'" data-dayid="'+day_data.id+'">'+ day_data.rooms[i].name +'</a></p>';
																}
		var wrapper_end =				'</div>\
														</div>\
													</div>\
												</div>';

		return wrapper_start + line + wrapper_end;
	}


	//**************************************

	$("#content-days").on("click", function(e){
		e.preventDefault();
		// console.log(e.target.id);
		// console.log(e.target.dataset.dayid);
		switch(e.target.id) {
	    case "todos":
	    		printSessions(e.target.dataset.dayid, OSApp.getEventProgram());
	        break;
	    case "Auditorio Principal":
	    		printSessionsByRoom("Auditorio Principal", OSApp.getSessionsByRoom("Auditorio Principal", OSApp.getSessionsByDay(e.target.dataset.dayid, language)));	
	        break;
	    case "Auditorio Planta Baja":
	    		printSessionsByRoom("Auditorio Planta Baja", OSApp.getSessionsByRoom("Auditorio Planta Baja", OSApp.getSessionsByDay(e.target.dataset.dayid, language)));
	        break;
	    case "Demo Zone":
	    		printSessionsByRoom("Demo Zone", OSApp.getSessionsByRoom("Demo Zone", OSApp.getSessionsByDay(e.target.dataset.dayid, language)));
	        break;
	    default:
	        
		}

	});


})(jQuery, window);




