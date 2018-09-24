// 
// 
// 
(function($, w) {

	var sessions; 	// Array with all sessions objects
	var speakers; 	// Array with all speakers objects
	var event_days; // Array of days objects
	var streams; 		// Array of streams objects
	var rooms = []; // Array with rooms names
	var event_program; // JOSN with all program of event
	var language;

	var OSApp = (function () {

		var initialize = function(lan){
			language = lan;
    	var lookup  = [];
	    for (var i in sessions) {
	    	// set stream and room name in each session
	   		var result = streams.filter(function(obj){
	   			return obj.id == sessions[i].event_stream_id
	   		})
	   		sessions[i]['sala'] = result[0].name;
	   		sessions[i]['stream'] = result[0];
	   		// get names of rooms
	   		lookup[sessions[i]["sala"]] = sessions[i].sala;
	    }

	    for (var x in lookup) {
	    	rooms.push(lookup[x]);
	    }

	    // set readable date in event_days
	    event_days.forEach(function(value, index, array){
	    	array[index]['date'] = timestampToDate(array[index].day);
	    })

	    event_program = generateEventProgram();
    }

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

    var getRooms = function(){
    	return rooms;
    }

    var getEventProgram = function(){
    	return event_program;
    }

    function getSessionsByDay(day_id) {
    	return sessions.filter(function(e){
    		return (e.event_day_id == day_id && e.languaje == language);
    	});
    }

    var getRoomsByDay = function(day_id) {
    	var day_list = rooms;
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

    // Return array with sessions in room name
    var getSessionsByRoom = function(room_name, array_sessions) {
    	return array_sessions.filter(function(e, i){
    		return (e.sala == room_name);
    	});
    }

    var getSessionById = function(id){
			var session = OSApp.getSessions().filter(function(s){
				return s.id == id;
			});
			return session[0];
		}

		var getSpeakerById = function(id){
			var speaker = speakers.filter(function(e){
    		return (e.id == id && e.languaje == language);
    	});
    	return speaker[0];
		}

    var generateEventProgram = function() {
			var day_list = {};
			var event_days = getEventDays();
			event_days.forEach(function(value, index, array){
				var event_day = value;
				event_day['date'] = timestampToDate(array[index].day);
				var day_sessions = getSessionsByDay(value.id, language);
				var sessions_by_room = {};
				rooms.forEach(function(value, index, array){
					if( getSessionsByRoom(value, day_sessions).length > 0) {
						var data = {
							name: value,
							sessions: getSessionsByRoom(value, day_sessions)
						}
						sessions_by_room[index] = data;
					}
				});
				event_day['rooms'] = sessions_by_room;
				day_list[index] = event_day;		
			});
			return day_list;
		}

		var getDayById = function(id){
			return event_days.filter(function(e){
    		return (e.id == id);
    	});
		}

    function timestampToDate(t){
			var dt = new Date(t*1000);
			var year = dt.getUTCFullYear();
			var month = dt.getUTCMonth() + 1;
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
      getRooms: getRooms,
      getEventProgram: getEventProgram, 
      getRoomsByDay: getRoomsByDay,
      getSessionsByDay: getSessionsByDay,
      getSessionsByRoom: getSessionsByRoom,
      getSessionById: getSessionById,
      getSpeakerById: getSpeakerById,
      getDayById: getDayById,
      initialize: initialize
    }

  })();

  w.OSApp = OSApp;
	
})(jQuery, window);
