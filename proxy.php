<?php
require __DIR__ . '/vendor/autoload.php';

use \Curl\Curl;


define('EVENT_ID', 33882);

$object = $_GET['object'];

$curl = new Curl();
$curl->setHeader('accept', 'application/json');
$curl->setHeader('Signature', 'WVRjMFptUTVabU0yWldFNFl6YzBOVFUzTjJJeE9UYzJOVFEyTVdRek1qYz0=');
$curl->setHeader('Authorization', 'Bearer 657796cceb68f160d4fe3b8022880ba19a0ba67d');

$curl->get($object);

// $curl->get('https://www.bbvaopensummit.com/api/v1/events/'.EVENT_ID.'/speakers?language=en&type=speaker');
// $curl->get('https://www.bbvaopensummit.com/api/v1/events/'.EVENT_ID.'/speakers/20071');
// $curl->get('https://www.bbvaopensummit.com/api/v1/events/'.EVENT_ID.'/speakers/20071/sessions');

// $curl->get('https://www.bbvaopensummit.com/api/v1/events/'.EVENT_ID.'/days');

// $curl->get('https://www.bbvaopensummit.com/api/v1/events/'.EVENT_ID.'/sessions');
// $curl->get('https://www.bbvaopensummit.com/api/v1/events/'.EVENT_ID.'/sessions/13974/speakers');

// $curl->get('https://www.bbvaopensummit.com/api/v1/events/'.EVENT_ID.'/streams');


if ($curl->error) {
    echo json_encode('Error: ' . $curl->errorCode . ': ' . $curl->errorMessage . "\n");
} else {
    echo json_encode($curl->response);
}

$curl->close();

//var_dump($curl->requestHeaders);
//var_dump($curl->responseHeaders);