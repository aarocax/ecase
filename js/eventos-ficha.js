(function($, w) {

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;
	var url = window.location.href;
	var matches = url.match(/\b\d{5}\b/g);
	var session_id = matches[0]
	var session_speakers;
	var session;
	var resource_image = OSApp.getMediaUrl()+'random'+getRandomInt(15)+'.jpg';

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

		putSessionDay(session);

		getSpeakersBySession(session_id, printSession);

		var image = "favicon.ico";
		if (session.session_image != null) {
			var image = session[0].session_image;
		}

		$("#photo > img").attr("src", image);

		$("#titulo").append(session.title);
	}

	function putSessionDay(session){
		var day = document.getElementById("day");
		day.innerHTML = (language === "ES") ? "DIA "+parseInt(session.day_num) : "DAY "+parseInt(session.day_num);
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

	function getRandomInt(max) {
  	return Math.floor(Math.random() * Math.floor(max));
	}

	var template_session = function(session) {
		return '<h1 class="title event">'+session.title+'</h1>\
						<div class="container">\
							<div class="video-item big">\
								<img src="'+resource_image+'" alt="" />\
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
		var template = '<div id="container" class="container col-3 grid event-page">';
		session_speakers.forEach(function(speaker){
			template += template_speaker(speaker);
		});
		template +=     '</div>';
		return template;
	}

	var template_speaker = function(speaker){
		return '<div class="col speaker-item">\
							<a href="#'+speaker.id+'" rel="modal:open" data-speaker="'+speaker.id+'" >\
								<img src="https://www.bbvaopensummit.com'+speaker.photo_url+'" alt="" />\
								<span class="speaker-line"></span>\
								<div  class="speaker-name">'+speaker.first_name+' '+speaker.last_name+'</div>\
								<div  class="speaker-position">'+speaker.role+'</div>\
							</a>\
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

	// Speaker lightBox
	function printSpeaker(speaker) {
		var content = document.getElementById("lightbox-speaker");
	 	content.innerHTML = renderSpeaker(speaker);
	 	content.style.display = "block";
	}

	function renderSpeaker(speaker){
		var template = "";
		template += template_single_speaker(speaker);
		speaker.sessions.filter(function(sessions, index){
			template += template_single_day(OSApp.getDayById(index));
			sessions.forEach(function(session){
				template += template_single_sessions(session);
			})
			template += '</div>';
		})
		template += '</div></div>';
		return template;
	}

	var template_single_speaker = function(speaker){
		console.log(speaker);
		var twitter = "";
		var linkedin = "";
		var title = (language === "ES") ? "Eventos" : "Events";
		var photo = "";
		if (speaker.twitter != "") {
			twitter = '<a href="'+speaker.twitter+'" class="button-rrss twitter"></a>';
		}
		if (speaker.linkedin != "") {
			linkedin = '<a href="'+speaker.linkedin+'" class="button-rrss linkedin"></a>';
		}
		if (speaker.photo_url != "") {
			photo = '<div id="photo" class="modal-photo"><img src="'+speaker.photo_url+'" alt="" /></div>';
		}
		return '<div class="modal-container">\
								<a class="close-modal"></a>'+photo+
								'<div id="speaker" class="modal-text">\
									<div class="modal-text-container">\
										<div class="title speaker-modal">'+speaker.first_name+' '+speaker.last_name+'</div>\
										<div class="subtitle speaker-position">'+speaker.role+'</div>\
										<div>'+speaker.description+'</div>\
										<div class="rrss">'+twitter+linkedin+'</div>\
									</div>\
								</div>\
								<div class="modal-event">\
								<div class="modal-event-container">\
									<div class="title event-modal">'+title+'</div>';
	}

	var template_single_day = function(day){
		return '<div id="day" class="event">\
							<div class="event-date">\
								DÍA '+day.day_num+'\
								<span>'+day.date+'</span>\
							</div>';
	}

	var template_single_sessions = function(session){
				return '<div>\
									<div class="event-hours">'+session.opening+' '+session.closing+'</div>\
									<div class="event-title">'+session.title+'</div>\
								</div>';
	}


	$("#content-speakers").on("click", "a", function(e){
		e.preventDefault();

		var speaker_id = e.currentTarget.dataset.speaker;
		var speaker_request = OSApp.getSpeakerById(speaker_id);

		var speaker_sessions_request = OSApp.get(OSApp.getProxyUrl()+"https://www.bbvaopensummit.com/api/v1/events/33882/speakers/"+speaker_id+"/sessions")
		$.when (speaker_sessions_request)
			.done(function (data) {
			  var sessions = prepareSpeaker(data);
			  speaker_request.sessions = sessions;
			  printSpeaker(speaker_request);

			})
			.fail(function (err1, err2, err3, err4) {
			  console.log(err1);
			})

	});



	function prepareSpeaker(data) {

			var speaker_sessions = [];

			// get days
			data.forEach(function(value){
		  	speaker_sessions[value.event_day_id] = [];
		  })

		  data.forEach(function(value, index){
		  	var session = OSApp.getSessionById(value.id);
	    	speaker_sessions[value.event_day_id][index] = session;
	    })
			return speaker_sessions;
	}



})(jQuery, window);
