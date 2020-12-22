<?php

/**
 * Description of Server
 *
 * @author pcwang
 */
class Server {
    protected $_connection = null;
    protected $_request = null;
    protected $_response = null;
    
    public function __construct() {
        $this->_response = array(
            "success" => false,
            "message" => NULL
        );
    }
    
    public function __destruct() {}
    
    public function setRequest ($req){
        $this->_request = $req;
    }
    
    public function response(){
        return $this->_response;
    }
    
    public function run(){
        $this->_response = array(
                "success" => false,
                "message" => "default server"
            );
    }
    
	public function setDB($_connection){
		$this->_connection = $_connection;
	}
}
