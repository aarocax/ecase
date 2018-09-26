(function($, w) {

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;

	function OSAppInitialize(callback){

		var speakers_request = OSApp.get(OSApp.getApiUrl("speakers"));
		var sessions_request = OSApp.get(OSApp.getApiUrl("sessions"));
		var session_days_request = OSApp.get(OSApp.getApiUrl("days"));
		var session_streams = OSApp.get(OSApp.getApiUrl("streams"));
		
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
		console.log(OSApp.getSessions());
		printDays(OSApp.getEventProgram());
		printSessions(83829, OSApp.getEventProgram());
	}

	function siguienteEvento(){
		console.log('siguiente evento...');
		var a = document.getElementById("siguiente-evento");
	 	a.href = "http://example.com";
	}

	function printSessionsByRoom(room_name, sessions){
		var content = document.getElementById("content-sessions");
	 	content.innerHTML = renderSessionsByRoom(room_name, sessions);
	}

	function renderSessionsByRoom(room_name, sessions) {
		var template_sessiones = "";
		template_sessiones += '<div class="events-zone-container"><div class="events-list-title"><p class="title event-main">'+room_name+'</p></div>';
		template_sessiones += '<div class="sesssions events-list-container">';
		sessions.forEach(function(session){
			template_sessiones += template_session(session);
		});
		template_sessiones += '</div></div>';
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
							id: days[i].rooms[x].sessions[z].id,
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
				template_sessiones += '<div class="events-zone-container"><div class="events-list-title"><p class="title event-main">'+sessions.name+'</p></div>';
				template_sessiones += '<div class="sesssions events-list-container">';
				sessions.sessions.forEach(function(session,i,a){
					template_sessiones += template_session(session);
				});
				template_sessiones += '</div></div>';
			});
			template_sala += template_sessiones;
		});
		return template_sala;
	}

	var template_session = function(session_data) {
		return '<div id="session" class="event">\
							<div class="event-date">'+session_data.opening+' - '+session_data.closing+'</div>\
							<div class="event-title"><a href="'+OSApp.getBaseUrl()+'sesion/'+session_data.id+'/" title="">'+session_data.title+'</a></div>\
							<div class="event-speakers">\
								Speakers\
								<p class="event-speakers-name">\
									<a href="">Simón Taylor</a>, <a href="">Elena Alfaro</a>, <a href="">Marco Whenting</a>, <a href="">Leanne Penk</a></p>\
							</div>\
							<div class="button-event">\
								<a href="#">Open Innovation</a>\
							</div>\
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
		var wrapper_start = '<div id="day" class="event-filter-item">\
													<div class="event-filter-item-menu">\
														DIA '+day_data.number+'\
														<span>'+day_data.date+'</span>\
													</div>\
													<div class="event-filter-item-submenu">\
														<span>\
															<a href="#" id="todos" data-dayid="'+day_data.id+'">TODOS LOS ESPACIOS</a>\
														</span>\
														';
																for (var i in day_data.rooms) {
																	line += '<span><a href="#" id="'+day_data.rooms[i].name+'" data-dayid="'+day_data.id+'">'+ day_data.rooms[i].name +'</a></span>';
																}
		var wrapper_end =				'\
														</div>\
													</div>\
												</div>';

		return wrapper_start + line + wrapper_end;
	}




	//**************************************

	$("#content-days").on("click", function(e){
		e.preventDefault();
		switch(e.target.id) {
	    case "todos":
	    		printSessions(e.target.dataset.dayid, OSApp.getEventProgram());
	        break;
	    case "Bilbao Stage":
	    		printSessionsByRoom("Bilbao Stage", OSApp.getSessionsByRoom("Bilbao Stage", OSApp.getSessionsByDay(e.target.dataset.dayid, language)));	
	        break;
	    case "Mexico Stage":
	    		printSessionsByRoom("Mexico Stage", OSApp.getSessionsByRoom("Mexico Stage", OSApp.getSessionsByDay(e.target.dataset.dayid, language)));
	        break;
	    case "San Francisco Demo Zone":
	    		printSessionsByRoom("San Francisco Demo Zone", OSApp.getSessionsByRoom("San Francisco Demo Zone", OSApp.getSessionsByDay(e.target.dataset.dayid, language)));
	        break;
	    case "Istanbul":
	    		printSessionsByRoom("Istanbul", OSApp.getSessionsByRoom("Istanbul", OSApp.getSessionsByDay(e.target.dataset.dayid, language)));
	        break;
	    default:
		}

	});

})(jQuery, window);