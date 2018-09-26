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
	
	// path url
	var protocol = window.location.protocol+"//";
	var hostname = window.location.hostname;
	var pathname;
	var base_url;
	var media_url;

	// API url's
	var proxy_url;
	var api_speakers_url;
	var api_sessions_url;
	var api_days_url;
	var api_streams_url;

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;

	switch(window.location.hostname) {
    case 'opensummit.bbva.com':
				pathname = "";
				proxy = "http://d3tyxp27ycvz01.cloudfront.net/bbva-components/proxy/1532593871837?project=j7ixm52m&event_id=33882?language=en";
				proxy_url = protocol+hostname+pathname+proxy;
				base_url = ((language === "ES") ? protocol+hostname+pathname : protocol+hostname+pathname+'/en/');
				media_url =  protocol+hostname+pathname+'wp-content/themes/opensummit/assets/';
        break;
    case 'centauri.mmedios.local':
    		api_speakers_url = "http://centauri.mmedios.local/bbva/opensummit18/wordpress/wp-content/themes/opensummit/inc/eventcase-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers?language="+language+"&type=speaker"
				api_sessions_url = "http://centauri.mmedios.local/bbva/opensummit18/wordpress/wp-content/themes/opensummit/inc/eventcase-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions";
				api_days_url     = "http://centauri.mmedios.local/bbva/opensummit18/wordpress/wp-content/themes/opensummit/inc/eventcase-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/days";
				api_streams_url  = "http://centauri.mmedios.local/bbva/opensummit18/wordpress/wp-content/themes/opensummit/inc/eventcase-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/streams";
				pathname = "/bbva/opensummit18/wordpress/";
				proxy = "wp-content/themes/opensummit/inc/eventcase-api/proxy.php?object=";
				proxy_url = protocol+hostname+pathname+proxy;
				base_url = ((language === "ES") ? protocol+hostname+pathname : protocol+hostname+pathname+'en/');
				media_url =  protocol+hostname+pathname+'wp-content/themes/opensummit/assets/';
        break;
    default:
    		api_speakers_url = "http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers?language="+language+"&type=speaker"
				api_sessions_url = "http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions";
				api_days_url     = "http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/days";
				api_streams_url  = "http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/streams";
				pathname = "/opensummit-api/";
				proxy = "proxy.php?object=";
				proxy_url = protocol+hostname+pathname+proxy;
				base_url = ((language === "ES") ? protocol+hostname+pathname : protocol+hostname+pathname+'/en/');
				media_url =  protocol+hostname+pathname+'assets/';
				break;
	}

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
	   		sessions[i]['date'] = timestampToDate(sessions[i].time, language);
	   		sessions[i]['date_en'] = timestampToDate(sessions[i].time, "EN");
	   		sessions[i]['day_num'] = i+1;
	   		// get names of rooms
	   		lookup[sessions[i]["sala"]] = sessions[i].sala;
	    }

	    for (var x in lookup) {
	    	rooms.push(lookup[x]);
	    }

	    // set readable date in event_days
	    event_days.forEach(function(value, index, array){
	    	array[index]['date'] = timestampToDate(array[index].day, language);
	    	array[index]['date_en'] = timestampToDate(array[index].day, "EN");  // fecha en inglés para operar
	    	array[index]['day_num'] = index+1;
	    })

	    event_program = generateEventProgram();
    }

    var get = function(url) {
      return $.getJSON(url);
    }

    var getApiUrl = function(api){
    	var url = "";
    	switch(api) {
    		case 'speakers':
						url = api_speakers_url;
		        break;
		    case 'sessions':
						url = api_sessions_url;
		        break;
		    case 'days':
						url = api_days_url;
		        break;
		    case 'streams':
						url = api_streams_url;
		        break;
		    default:
		    		url = null;
		    		break;
    	}
    	return url;
    }

    var getProxyUrl = function(api){
    	return proxy_url;
    }

    var getBaseUrl = function(){
    	return base_url;
    }

   var getMediaUrl = function(){
   		return media_url;
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
    	for (var i in day_list) {
    		if (day_list[i].id == day_id ) {
	    		for (var x in day_list[i].rooms) {
	    			rooms.push(x);
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

		var getNextSession = function(id){
			var x = OSApp.getSessions().length;
			var next_session = null;
			for (var i = 0; i < x; i++) {
				if (sessions[i].id == id) {
					for (var y = i+1; y < x; y++) {
						if (sessions[y].languaje == language) {
							next_session = sessions[y];
							break;
						}
					}
				}
			}
			// if last event get first in same language
			if (next_session === null) {
				for (var i = 0; i < x; i++) {
					if (sessions[i].languaje == language) {
						next_session = sessions[i];
						break;
					}
				}
			}
			return next_session;	
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
			var day = event_days.filter(function(e){
    		return (e.id == id);
    	});
    	return day[0];
		}

    function timestampToDate(t, lang){
			var dt = new Date(t*1000);
			var year = dt.getUTCFullYear();
			var month = dt.getUTCMonth() + 1;
			var day = dt.getUTCDate();
			// var hr = dt.getHours();
			// var m = "0" + dt.getMinutes();
			// var s = "0" + dt.getSeconds();
			if (lang == "ES") {
				var date = day+'/'+month+'/'+year;
			} else {
				var date = year+'/'+month+'/'+day;
			}
			return date;  
		}

    return {
      get: get,
      getApiUrl: getApiUrl,
      getProxyUrl: getProxyUrl,
      getBaseUrl: getBaseUrl,
      getMediaUrl: getMediaUrl,
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
      getNextSession: getNextSession,
      getSpeakerById: getSpeakerById,
      getDayById: getDayById,
      initialize: initialize
    }

  })();

  w.OSApp = OSApp;
	
})(jQuery, window);
