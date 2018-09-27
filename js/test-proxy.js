(function($, w) {

	console.log('Test Llamadaa a API eventcase...');

	var language = ( window.location.href.indexOf("/en/") === -1 ) ? "ES" : "EN" ;
	var event_id = 33882;
	var speaker_id = 20134;
	var session_id = 13974;

	console.log('Speakers:');
	console.log(window.location.hostname)

	if (window.location.hostname != "localhost") {

	// webpublicas
	var api_speakers_url = 'https://d3tyxp27ycvz01.cloudfront.net/bbva-components/proxy/1532593871837?project=j7ixm52m&event_id='+event_id+'&language='+language;
	var api_sessions_url = 'https://d3tyxp27ycvz01.cloudfront.net/bbva-components/proxy/1538030984068?project=j7ixm52m&event_id='+event_id;
	var api_days_url     = 'https://d3tyxp27ycvz01.cloudfront.net/bbva-components/proxy/1538030744484?project=j7ixm52m&event_id='+event_id;
	var api_streams_url  = 'https://d3tyxp27ycvz01.cloudfront.net/bbva-components/proxy/1538031427332?project=j7ixm52m&event_id='+event_id;
	var api_sponsors_url = "";
	var api_sponsors_url = 'https://d3tyxp27ycvz01.cloudfront.net/bbva-components/proxy/1538044996215?project=j7ixm52m&event_id='+event_id+'&language='+language;
	var speaker_sessions_url = 'https://d3tyxp27ycvz01.cloudfront.net/bbva-components/proxy/1538030130332?project=j7ixm52m&event_id='+event_id+'&speaker_id='+speaker_id;
	var session_speakers_url = 'https://d3tyxp27ycvz01.cloudfront.net/bbva-components/proxy/1538031128708?project=j7ixm52m&event_id='+event_id+'&session_id='+session_id;

} else {

	// localhost
	var api_speakers_url     = 'http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers?language='+language+'&type=speaker';

	var api_sessions_url     = 'http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions';

	var api_days_url         = 'http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/days';

	var api_streams_url      = 'http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/streams';

	var api_sponsors_url     = "http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sponsors?languaje="+language;

	var speaker_sessions_url = 'http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/speakers/'+speaker_id+'/sessions';

	var session_speakers_url = 'http://localhost/opensummit-api/proxy.php?object=https://www.bbvaopensummit.com/api/v1/events/33882/sessions/'+session_id+'/speakers';
}

	//

	var speakers_request = $.getJSON(api_speakers_url);
	var sessions_request = $.getJSON(api_sessions_url);
	var days_request = $.getJSON(api_days_url);
	var streams_request = $.getJSON(api_streams_url);
	var speaker_sessions_request = $.getJSON(speaker_sessions_url);
	var session_speakers_request = $.getJSON(session_speakers_url);

	$.when (speakers_request, sessions_request, days_request, streams_request, speaker_sessions_request, session_speakers_request)
		.then(function (data1, data2, data3, data4, data5, data6) {
		  console.log(data1);
		  console.log(data2);
		  console.log(data3);
		  console.log(data4);
		  console.log(data5);
		  console.log(data6);
		})
		.fail(function (err1, err2, err3, err4, err5, err6) {
		  console.log(err1);
		  console.log(err2);
		  console.log(err3);
		  console.log(err4);
		  console.log(err5);
		  console.log(err6);
		})

				


})(jQuery, window);