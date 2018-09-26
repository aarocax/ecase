(function($, w) {

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;
	var url = window.location.href;
	var matches = url.match(/\b\d{5}\b/g);
	var session_id = matches[0]
	var session_speakers;
	var session;
	var resource_image = OSApp.getMediaUrl()+"bbva-opensummit-video.png";

	function OSAppInitialize(callback){

		var speakers_request = OSApp.get(OSApp.getApiUrl("speakers"));
		var sessions_request = OSApp.get(OSApp.getApiUrl("sessions"));
		var session_days_request = OSApp.get(OSApp.getApiUrl("days"));
		var session_streams = OSApp.get(OSApp.getApiUrl("streams"));

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

		nextSession(session_id);

		session = OSApp.getSessionById(session_id);

		getSpeakersBySession(session_id, printSession);

		var image = "favicon.ico";	
		if (session.session_image != null) {
			var image = session[0].session_image;	
		}

		$("#photo > img").attr("src", image);

		$("#titulo").append(session.title);
	}

	function nextSession(session_id){
		var next_event = OSApp.getNextSession(session_id);
		var a = document.getElementById("siguiente-evento");
	 	a.href = OSApp.getBaseUrl()+'sesion/'+next_event.id+'/';
	 	a.innerHTML = next_event.title;
	}

	function printSession(){
		var content = document.getElementById("content-session");
	 	content.innerHTML = renderSession(session, session_speakers);
	 	printSpeakers();
	}

	function renderSession(session, session_speakers) {
		var template = "";
		template += template_session(session);
		return template;
	}

	var template_session = function(session) {
		return '<h1 class="title event way">'+session.title+'</h1>\
						<div class="container">\
							<div class="video-item">\
								<img src="'+resource_image+'" alt="" />\
								<div class="button-video">\
              		<a class="video-play" href="#"><img src="'+OSApp.getMediaUrl()+'bbva-play-white.svg" alt=""></a>\
            		</div>\
            		<span class="video-gradient"></span>\
            		<div class="video-info">\
		              <p class="video-info-title">DÍA '+parseInt(session.day_num)+' '+session.opening+' - '+session.closing+'</p>\
		              <p class="video-info-title">'+session.sala+'</p>\
		            </div>\
							</div>\
						</div>';
	}


	function printSpeakers(){
		var content = document.getElementById("content-speakers");
	 	content.innerHTML = renderSpeakers(session_speakers);
	}

	function renderSpeakers(session_speakers) {
		var template = '<div id="container col-3 grid">';
		session_speakers.forEach(function(speaker){
			template += template_speaker(speaker);	
		});
		template +=     '</div>';
		return template;
	}

	var template_speaker = function(speaker){
		return '<div class="col speaker-item way">\
							<img src="https://www.bbvaopensummit.com'+speaker.photo_url+'" alt="" />\
							<span class="speaker-line"></span>\
							<div  class="speaker-name">'+speaker.first_name+' '+speaker.last_name+'</div>\
							<div  class="speaker-position">'+speaker.role+'</div>\
						</div>';
	}


	function getSpeakersBySession(session_id, callback) {
		var session_speakers_request = OSApp.get(OSApp.getProxyUrl()+'https://www.bbvaopensummit.com/api/v1/events/33882/sessions/'+session_id+'/speakers');

		$.when (session_speakers_request)
			.done(function (data) {
			  session_speakers = data;
			  callback();
			}) 
			.fail(function (err1) {
			  console.log(err1);
			});
	}

	


})(jQuery, window);




