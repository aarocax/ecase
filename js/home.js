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
		printSpeakers(OSApp.getSpeakers());
	}

	function printSpeakers(speakers) {
		var content = document.getElementById("content-speakers");
	 	content.innerHTML = renderSpeakers(speakers);
	}

	function renderSpeakers(speakers){
		var template = "";
		for (var i = 0; i < 3; i++) {
			template += template_speaker(speakers[i]);
		}
		// speakers.forEach(function(speaker){
		// 	template += template_speaker(speaker);
		// });
		return template;
	}

	var template_speaker = function(speaker){
		return '<div id="container" class="col speaker-item">\
							<a href="#'+speaker.id+'" rel="modal:open" data-speaker="'+speaker.id+'" >\
								<img src="https://www.bbvaopensummit.com'+speaker.photo_url+'" alt="" />\
								<span class="speaker-line"></span>\
								<div class="speaker-name">'+speaker.first_name+' '+speaker.last_name+'</div>\
								<div class="speaker-position">'+speaker.role+'</div>\
							</a>\
						</div>';
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

		})
		return template;
	}

	var template_single_speaker = function(speaker){
		return '<div class="modal-container">\
								<a class="close-modal"></a>\
								<div id="photo" class="modal-photo">\
									<img src="'+speaker.photo_url+'" alt="" />\
								</div>\
								<div id="speaker" class="modal-text">\
									<div class="modal-text-container">\
										<div class="title speaker-modal">'+speaker.first_name+' '+speaker.last_name+'</div>\
										<div class="subtitle speaker-position">'+speaker.role+'</div>\
										<div>'+speaker.description+'</div>\
										<div class="rrss">\
											<a href="'+speaker.linkedin+'" class="button-rrss linkedin"></a>\
											<a href="'+speaker.twitter+'" class="button-rrss twitter"></a>\
										</div>\
									</div>\
								</div>\
								<div class="modal-event"><div class="modal-event-container">\
								<div class="title event-modal">\
                  Eventos\
                </div>';
	}

	var template_single_day = function(day){
		return '<div id="day" class="event">\
							<div class="event-date">\
								DÍA '+day.day_num+'\
								<span>'+day.date+'</span>\
							</div>';
	}

	var template_single_sessions = function(session){
		return '<div id="lightBox" >\
							<div id="speaker">\
								<div class="event-hours">'+session.opening+' '+session.closing+'</div>\
								<div class="event-title">'+session.title+'</div>\
							</div>\
						</div>\
						</div>\
						</div>';
	}


	$("#content-speakers").on("click", "a", function(e){
		e.preventDefault();

		var speaker_id = e.currentTarget.dataset.speaker;
		var speaker_request = OSApp.getSpeakerById(speaker_id);

		var speaker_sessions_request = OSApp.get(OSApp.get(OSApp.getProxyUrl()+'1538030130332?project=j7ixm52m&event_id=33882&speaker_id='+speaker_id)
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
