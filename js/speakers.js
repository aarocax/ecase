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
		console.log(OSApp.getSpeakers());
		console.log(OSApp.getStreams());
		console.log(OSApp.getSessions());
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


	$("#content-speakers").on("click", "a", function(e){
		e.preventDefault();
		var speaker_id = e.currentTarget.dataset.speaker;
		var speaker_request = OSApp.getSpeakerById(speaker_id);
		console.log(speaker_request);
		var speaker_sessions_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/"+speaker_id+"/sessions")

		$.when (speaker_sessions_request)
			.done(function (data) {
			  var speaker_sessions = [];
			  data.forEach(function(e){
			  	speaker_sessions.push(OSApp.getSessionById(e.id));
			  })
			  printSpeaker(speaker_request);
			  prepareSpeaker(speaker_id);
			}) 
			.fail(function (err1, err2, err3, err4) {
			  console.log(err1);
			})
		
	});



	function prepareSpeaker(speaker_id) {
		var speaker = OSApp.getSpeakerById(speaker_id);
		var speaker_sessions_request = OSApp.get("http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/"+speaker_id+"/sessions")



		$.when (speaker_sessions_request)
			.done(function (data) {
			  var speaker_sessions = [];
			  var sessions = [];
			  console.log(data);
			  // get days
			  data.forEach(function(e,i){
			  	sessions[e.event_day_id] = [];
			  	sessions[e.event_day_id]["day"] = OSApp.getDayById(e.event_day_id);
			  	
			  });
			  speaker_sessions.push(sessions);

			  console.log(speaker_sessions);

			  data.forEach(function(e,i){

			  	speaker_sessions.forEach(function(es){
			  		var sessions = [];
			  		if(es.event_day_id = e.event_day_id) {
			  			console.log("es igual...");
			  			sessions.push(OSApp.getSessionById(e.id));
			  		}
			  	})

			  	// sessions[e.event_day_id] = [];
			  	// sessions[e.event_day_id]["day"] = OSApp.getDayById(e.event_day_id);
			  	// sessions[e.event_day_id]["sessions"] = [];
			  	// // console.log(i);
			  	// var session = OSApp.getSessionById(e.id);
			  	// sessions[i] = [];
			  	// sessions[i][e.event_day_id] = {}
			  	// sessions[i][e.event_day_id] = OSApp.getDayById(e.event_day_id);
			  	// sessions[i][e.event_day_id]["sessions"] = {};
			  	// sessions[i][e.event_day_id]["sessions"][session.id] = session;
			  	

			  	// var session_id = {};
			  	// session_id.id = {}
			  	// session_id.id = session.id;
			  	// session_id.id.session = {};
			  	// session_id.id.session = session;

					
		  	
			  	//sessions.push(session);
			  	// sessions[e.event_day_id]['day'] = OSApp.getDayById(e.event_day_id);
			  	// sessions[e.event_day_id]['day']['sessions'] = [];

			  	// sessions[e.event_day_id]['day']['sessions']['session'] = [];
			  	// sessions[e.event_day_id]['day']['sessions']['session'][session.id] = [];
			  	// sessions[e.event_day_id]['day']['sessions']['session'][session.id].push(session);
			  	//sessions[e.event_day_id].push(session);
			  	//sessions[e.event_day_id]['day']['sessions']['session'].push(session);
			  	//sessions[e.event_day_id]['day']['sessions'][e.id] = 
			  	//sessions[e.event_day_id][e.id].push(OSApp.getDayById(e.event_day_id));
			  	//sessions[e.event_day_id][e.id]['day'] = OSApp.getDayById(e.event_day_id);
			  	//sessions[e.event_day_id][e.id]['session'] = session;
			  	//sessions[e.event_day_id][0].push(session);
			  	
			  	//session.eventday = OSApp.getDayById(e.event_day_id);
			  	// speaker_sessions.push(sessions);
			  	//console.log(OSApp.getDayById(e.event_day_id))
			  	
			  })
			  console.log(speaker_sessions);
			  //var sessions = [];

			}) 
			.fail(function (err1, err2, err3, err4) {
			  console.log(err1);
			})

	}


})(jQuery, window);




