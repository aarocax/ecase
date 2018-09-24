(function($, w) {

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;

	function OSAppInitialize(callback){

		var speakers_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers?language="+language+"&type=speaker");

		var sessions_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions");
		var session_days_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/days");
		var session_streams = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/streams");

		// var speaker_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/20071");
		// var speaker_sessions_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/20126/sessions");
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
		
		
		var session = OSApp.getSessionById(13974);
		console.log(session);

		//getSpeakerSessions(20126);
		getSpeakersBySession(13974);
		//getSpeaker(20126);

		var image = "favicon.ico";	
		if (session.session_image != null) {
			var image = session[0].session_image;	
		}

		$("#photo > img").attr("src", image);

		$("#titulo").append(session.title);



	}


	function getSpeakerSessions(speaker_id) {
		var speaker_sessions_request = OSApp.get('http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/'+speaker_id+'/sessions');
		$.when (speaker_sessions_request)
			.done(function (data) {
				console.log("Speaker sessions: 20126");
			  console.log(data);
			}) 
			.fail(function (err1) {
			  console.log(err1);
			})
	}


	function getSpeakersBySession(session_id) {
		var session_speakers_request = OSApp.get('http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions/'+session_id+'/speakers');
		$.when (session_speakers_request)
			.done(function (data) {
				console.log("Speaker by sessions: 13974");
			  console.log(data);
			}) 
			.fail(function (err1) {
			  console.log(err1);
			})
	}

	function getSpeaker(speaker_id) {
		var speaker_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/"+speaker_id);
		$.when (speaker_request)
			.done(function (data) {
				console.log("Speaker: 20126");
			  console.log(data);
			}) 
			.fail(function (err1) {
			  console.log(err1);
			})
	}

	


})(jQuery, window);




