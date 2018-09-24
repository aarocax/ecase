(function($, w) {

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;

	function OSAppInitialize(callback){

		var speakers_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers?language="+language+"&type=speaker");

		var sessions_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions");
		var session_days_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/days");
		var session_streams = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/streams");

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
		// console.log(OSApp.getSpeakers());
		// console.log(OSApp.getStreams());
		// console.log(OSApp.getSessions());
		console.log(OSApp.getEventProgram());
		console.log(OSApp.getEventDays());

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
		speakers.forEach(function(speaker){
			template += template_speaker(speaker);
		});
		return template;
	}

	var template_speaker = function(speaker){
		return '<a href="#" title="" data-speaker="'+speaker.id+'">\
							<div id="container" >\
								<div id="photo" class="">\
									<img src="https://www.bbvaopensummit.com'+speaker.photo_url+'" alt="" />\
								</div>\
								<div id="speaker" class="">\
									<p class="name">'+speaker.first_name+' '+speaker.last_name+'</p>\
									<p class="role">'+speaker.role+'</p>\
								</div>\
							</div>\
						</a>';
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
		return '<div id="lightBox" >\
								<div id="photo" class="">\
									<img src="'+speaker.photo_url+'" alt="" />\
								</div>\
								<div id="speaker" class="">\
									<p class="name">'+speaker.first_name+' '+speaker.last_name+'</p>\
									<p class="role">'+speaker.role+'</p>\
									<p class="linkedin"><a href="'+speaker.linkedin+'">linkedin</a></p>\
									<p class="twitter"><a href="'+speaker.twitter+'">twitter</a></p>\
									<p class="description">'+speaker.description+'</p>\
								</div>\
						</div>';
	}

	var template_single_day = function(day){
		return '<div id="day" >\
							<p class="description">DÍA '+day.day_num+'</p>\
							<p class="description">'+day.date+'</p>\
						</div>';
	}

	var template_single_sessions = function(session){
		return '<div id="lightBox" >\
								<div id="speaker" class="">\
									<p class="name">'+session.opening+' '+session.closing+'</p>\
									<p class="role">'+session.title+'</p>\
								</div>\
						</div>';
	}


	$("#content-speakers").on("click", "a", function(e){
		e.preventDefault();
		
		var speaker_id = e.currentTarget.dataset.speaker;
		var speaker_request = OSApp.getSpeakerById(speaker_id);
		
		var speaker_sessions_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/"+speaker_id+"/sessions")
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




