(function($, w) {

	var OSApp = (function () {

		var sessions;
		var speakers;
		var event_days;
		var streams;
		var rooms;

    var get = function(url) {
      return $.getJSON(url);
    }

    var setSessions = function(data){
    	sessions = data;
    }

    var getSessions = function(){
    	return sessions;
    }

    var setSpeakers = function(data){
    	speakers = data;
    }

    var getSpeakers = function(){
    	return speakers;
    }

    var setEventDays = function(data){
    	event_days = data;
    }

    var getEventDays = function(){
    	return event_days;
    }

    var setStreams = function(data){
    	streams = data;
    }

    var getStreams = function(){
    	return streams;
    }

    var setRooms = function(){
	    var lookup  = [];
	    for (var i in sessions) {
	      lookup[sessions[i]["room"]] = "nombre de la sala ("+sessions[i].room+")";
	    }
	    rooms = lookup;
    }

    var getRooms = function(){
    	return rooms;
    }

    function getSessionsByDay(day_id, lang) {
    	return sessions.filter(function(e){
    		return (e.event_day_id == day_id && e.languaje == lang);
    	});
    }

    function getSessionsByRoom(room_id, array_sessions) {
    	return array_sessions.filter(function(e){
    		return (e.room == room_id);
    	});
    }

    var getRoomsByDay = function(day_id) {
    	var day_list = listByDays();
    	var rooms = [];
    	//console.log(day_list);
    	for (var i in day_list) {
    		//console.log(day_list[i].id);
    		if (day_list[i].id == day_id ) {
	    		for (var x in day_list[i].rooms) {
	    			rooms.push(x);
	   				//console.log(day_list[i].rooms[x]);
	    		}
    		}
    	}
    	
    	return rooms;
    }

    var listByDays = function() {
			var day_list = {};
			var event_days = getEventDays();
			
			event_days.forEach(function(value, index, array){
				var event_day = value;
				event_day['date'] = UnixTimestampToDate(array[index].day);
				var day_sessions = getSessionsByDay(value.id, "ES");
				var rooms = [];
				day_sessions.forEach(function(value, index, array){
					rooms[value.room] = "nombre de la sala ("+value.room+")";
				});
				var sessions_by_room = {};
				rooms.forEach(function(value, index, array){
					sessions_by_room[index] = getSessionsByRoom(index, day_sessions);
				});
				event_day['rooms'] = sessions_by_room;
				day_list[index] = event_day;		
			});
			return day_list;
		}


    function UnixTimestampToDate(t)
		{
			var dt = new Date(t*1000);
			var year = dt.getUTCFullYear();
			var month = dt.getUTCMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
			var day = dt.getUTCDate();
			var hr = dt.getHours();
			var m = "0" + dt.getMinutes();
			var s = "0" + dt.getSeconds();
			return day+'/'+month+'/'+year+' '+hr+ ':' + m.substr(-2) + ':' + s.substr(-2);  
		}

    return {
      get: get,
      setSessions: setSessions,
      getSessions: getSessions,
      setSpeakers: setSpeakers,
      getSpeakers: getSpeakers,
      setEventDays: setEventDays,
      getEventDays: getEventDays,
      setStreams: setStreams,
      getStreams: getStreams,
      setRooms: setRooms,
      getRooms: getRooms,
      getSessionsByDay: getSessionsByDay,
      getSessionsByRoom: getSessionsByRoom,
      UnixTimestampToDate: UnixTimestampToDate,
      listByDays: listByDays,
      getRoomsByDay: getRoomsByDay

    }

  })();

  w.OSApp = OSApp;
	

})(jQuery, window);




(function($, w) {

	function OSAppStar(callback){
		var speakers_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers?language=en&type=speaker");
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
			  OSApp.setRooms();
			  OSApp.getRooms();
			  callback();
			}) 
			.fail(function (err1, err2, err3, err4) {
			  console.log(err1);
			  console.log(err2);
			  console.log(err3);
			  console.log(err4);
			})
	}

	OSAppStar(function(){
		Init();
	});

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


	var template_room = function(room_data) {
		return '<div id="room" class="">\
							<h1>Di_mad</h1>\
							<p class="">Demo Zone</p>\
						</div>';
	}

	var template_day = function(day_data) {
		var line = "";
		var wrapper_start = '<div id="day" class="">\
													<h1>DIA 1</h1>\
													<p class=""><strong>'+day_data.date+'</strong></p>\
													<div class="container">\
														<div class="todos_los_espacios"><a href="#">TODOS LOS ESPACIOS</a></div>\
															<div class="espacios">';
																for (var i in day_data.rooms) {
																	line += '<p><a href="#">'+ day_data.rooms[i] +' DI_MAD - DEMO ZONE</a></p>';
																}
		var wrapper_end =				'</div>\
														</div>\
													</div>\
												</div>';

		return wrapper_start + line + wrapper_end;
	}




	function Init(){
		console.log(OSApp.getSessions());
		// console.log(OSApp.getSpeakers());
		//console.log(OSApp.getEventDays());
		//console.log(OSApp.getRooms());
		// console.log(OSApp.getStreams());
	  // ListDays();
	 	// listSessions(83829, "ES");
	 	console.log(OSApp.listByDays());
	 	console.log(OSApp.getRoomsByDay(83829));

	 	var list = OSApp.listByDays();

	 	//printPrueba(list);
	 	printDays(OSApp.getEventDays())
	 	//printSessions(83829, 6123, list);
	 	printAllSessionsByRoomsOfDay(83829, list);

	 	
	}


	function printDays(days) {
		var template = "";
		
		for (var i in days) {
				var day = {
					closing: days[i].closing,
					date: days[i].date,
					day: days[i].day,
					event_id: days[i].event_id,
					id: days[i].id,
					opening: days[i].id,
					rooms: OSApp.getRoomsByDay(days[i].id)
				};
			template += template_day(day);
			var content = document.getElementById("content-days")
	 		content.innerHTML = template;
		}
	}

	function printAllSessionsByRoomsOfDay(day, list) {
		var template = "";
		for (var i in list) {
			if (list[i].id == day) {
				var rooms = OSApp.getRoomsByDay(day);
				rooms.forEach(function(value, index){
					template += '<div>';
					template += '<h1>'+index+'Di_.....</h1>';
					template += rederSessions(day, value, list);
					template += '</div>';
				});
			}
		}
		var content = document.getElementById("content-sessions");
	 	content.innerHTML = template;
	}

	function printSessions(day, room, list) {
		var content = document.getElementById("content-sessions");
	 	content.innerHTML = rederSessions(day, room, list);
	}	

	function rederSessions(day, room, list) {
		var template = "";
		var sessions;
		for (var i in list) {
			if (list[i].id == day) {
				for (var x in list[i].rooms) {
					if (x == room) {
						sessions = list[i].rooms[x];
					}
				}
			}
		}
		sessions.forEach(function(value){
			template += template_session(value);
		});
		return template;
	}


	function printPrueba(list) {
		var template = "";
	 	for (var i in list) {
	 		var rooms_tpl = "";
	 		for (var x in list[i].rooms) {
	 			var session_tpl = "";
	 			for (var z in list[i].rooms[x]) {
	 				// var element = '<div class="">\
	  			// 							<p><strong>'+list[i].rooms[x][z].title+':</strong> time: '+list[i].rooms[x][z].opening+' - '+list[i].rooms[x][z].closing+'</p>\
	  			// 							<p> room: '+list[i].rooms[x][z].room+': day_id: '+list[i].rooms[x][z].event_day_id+'</p>\
	 				// 					</div>';

	 				//session_tpl += element;
	 				session_tpl += template_session(list[i].rooms[x][z]);
	 			}
	 			rooms_tpl += '<div class=""><h3>room</h3>'+session_tpl+'</div>';
	 		}
	  	
	 	  template += '<div class=""><h1>'+list[i].date+' id: '+list[i].id+'</h1>'+rooms_tpl+'</div>';
	  }
	  
	 	var content = document.getElementById("content")
	 	content.innerHTML = template;
	}


	function ListDays(){
		var event_days = OSApp.getEventDays();
		event_days.forEach(function(value, index, array){
			console.log('ID: '+array[index].id);
			console.log('Date: '+OSApp.UnixTimestampToDate(array[index].day));
			listSessions(array[index].id, "ES");
		});
	}


	function listSessions(day_id, lang) {
		var day_sessions = OSApp.getSessionsByDay(day_id, lang);
		day_sessions.forEach(function(value, index, array){
			console.log('----opening: '+value.opening+' - '+value.closing);
			console.log('----title: '+value.title);
			console.log('----room: '+value.room);
		})
	}


})(jQuery, window);




