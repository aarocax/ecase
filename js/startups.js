(function($, w) {

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;

	function OSAppInitialize(callback){

		var speakers_request = OSApp.get(OSApp.getApiUrl("speakers"));
		var sessions_request = OSApp.get(OSApp.getApiUrl("sessions"));
		var session_days_request = OSApp.get(OSApp.getApiUrl("days"));
		var session_streams = OSApp.get(OSApp.getApiUrl("streams"));
		var session_sponsors = OSApp.get(OSApp.getApiUrl("sponsors"));

		$.when (speakers_request, sessions_request, session_days_request, session_streams, session_sponsors)
			.done(function (data1, data2, data3, data4, data5) {
			  OSApp.setSessions(data2[0]);
			  OSApp.setSpeakers(data1[0]);
			  OSApp.setEventDays(data3[0]);
			  OSApp.setStreams(data4[0]);
			  OSApp.setSponsors(data5[0]);
			  OSApp.initialize(language);
			  callback();
			})
			.fail(function (err1, err2, err3, err4, err5) {
			  console.log(err1);
			  console.log(err2);
			  console.log(err3);
			  console.log(err4);
			  console.log(err5);
			})
	}

	OSAppInitialize(function(){
		Init();
	});

	function Init(){
		console.log(OSApp.getSponsors());
		printSpeakers(OSApp.getSponsors());
	}

	function printSpeakers(sponsors) {
		var content = document.getElementById("content-speakers");
	 	content.innerHTML = renderSpeakers(sponsors);
	}

	function renderSpeakers(sponsors){
		var template = "";
		sponsors.forEach(function(sponsor){
			template += template_speaker(sponsor);
		});
		return template;
	}

	var template_speaker = function(sponsor){
		return '<div id="container" class="col startup-item">\
							<a href="#'+sponsor.id+'" rel="modal:open" data-speaker="'+sponsor.id+'" >\
								<div class="startup-logo">\
									<img src="'+sponsor.image+'" alt="" />\
								</div>\
								<span class="startup-line"></span>\
								<div class="startup-name">'+sponsor.title+'</div>\
								<div class="startup-web">'+sponsor.link.replace(/(^\w+:|^)\/\//, '')+'</div>\
							</a>\
						</div>';
	}


	// Speaker lightBox

	function printSpeaker(sponsor) {
		var content = document.getElementById("lightbox-speaker");
	 	content.innerHTML = renderSpeaker(sponsor);
	 	content.style.display = "block";
	}

	function renderSpeaker(sponsor){
		var template = "";
		template += template_single_speaker(sponsor);
		return template;
	}

	var template_single_speaker = function(sponsor){
		return '<div class="modal-container startup">\
								<a class="close-modal startup"></a>\
								<div id="photo" class="modal-photo startup">\
									<img src="'+sponsor.image+'" alt="" />\
								</div>\
								<div id="speaker" class="modal-text startup">\
									<div class="modal-text-container startup">\
										<div class="title speaker-modal">'+sponsor.title+'</div>\
										<div class="subtitle speaker-position">'+sponsor.link.replace(/(^\w+:|^)\/\//, '')+'</div>\
										<div>'+sponsor.description+'</div>\
									</div>\
								</div>\
            </div>';
	}


	$("#content-speakers").on("click", "a", function(e){
		e.preventDefault();
		var sponsor_id = e.currentTarget.dataset.speaker;
		var sponsor_request = OSApp.getSponsorById(sponsor_id);
		printSpeaker(sponsor_request);


	});






})(jQuery, window);
