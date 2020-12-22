<?php
include_once 'php/DBConfig.php';
include_once 'php/Server.php';
include_once 'php/ImageServer.php';

session_start();

$_connection = null;
$_requests = json_decode($_REQUEST["request"]);
$_results = array();

if (connectDB()){
	$sv = new Server();

	foreach ($_requests as $request) {
		$reqtype = explode("_", $request->type)[0];
		if ($reqtype === "IMAGE") {
			$sv = new ImageServer();
		}
		$sv->setDB($_connection);
		$sv->setRequest($request);
		$sv->run();
		array_push($_results, $sv->response());
	}

	disconnectDB();

	$_response = [
		"success" => true,
		"num" => count($_results),
		"results" => $_results
	];
}

$response = json_encode($_response);
header('Content-length: '.strlen($response));	//防止出现 net::ERR_INCOMPLETE_CHUNKED_ENCODING 错误
echo $response;

function connectDB(){
	global $_connection,$_response;
	if($_connection){
		pg_close($_connection);
	}

	$_connection = pg_connect("host=".HOST
			." port=".PORT." dbname=".DBNAME
			." user=".USER." password=".PASSWORD);
	if(!$_connection){
		$_response = array(
			"success" => false,
			"message" => "无法连接数据库"
		);
		return false;
	}
	return true;
}

function disconnectDB(){
	global $_connection;
	if($_connection){
		pg_close($_connection);
	}
}