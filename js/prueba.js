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

		var all = function(array){
		    var deferred = $.Deferred();
		    var fulfilled = 0, length = array.length;
		    var results = [];

		    if (length === 0) {
		        deferred.resolve(results);
		    } else {
		        array.forEach(function(promise, i){
		            $.when(promise()).then(function(value) {
		                results[i] = value;
		                fulfilled++;
		                if(fulfilled === length){
		                    deferred.resolve(results);
		                }
		            });
		        });
		    }

		    return deferred.promise();
		};
		
		var promises = [];
		var sessions = OSApp.getSessions();
		var i = 0;
		sessions.forEach(function(session, index) {
				console.log(index);
				if (i < 50) {
					i++;
					console.log(session);
			    promises.push(function() {
			        return $.Deferred(function(dfd) {
			            $.get(
			            	OSApp.getProxyUrl()+"https://www.bbvaopensummit.com/api/v1/events/33882/sessions/"+session.id+"/speakers", function(data) {
			               dfd.resolve(data);
			            });
			        }).promise();
			    });
		    }
		});

		$.when(all(promises))
			.done(function(results) {
			    console.log(results);
			    var content = document.getElementById("content-sessions");
	 				content.innerHTML = "<h1>Terminó</h1>";
			})
			.fail(function(errors) {
			    console.log(errors);
			})
			.then(function(results) {
			    console.log(results);
			},function(errors) {
			    console.log(errors);
			})
		
	}

	




})(jQuery, window);
