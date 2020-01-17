<?php
/**
 * @author Ups
 *
 */
defined('BASEPATH') OR exit('No direct script access allowed');

header('Access-Control-Allow-Origin:*');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

class Auth extends CI_Controller {


	function __construct() {
        parent::__construct();
        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

		$this->load->model('AuthModel', 'am');
		$this->inputPost = $this->input->post();
		$this->inputGet = $this->input->get();
    }

	/**
     * @method POST
     * @param username VARCHAR
     * @param password VARCHAR
     * @return json 
     * This Function for logging into dashboard
     */
	public function actLogin()
	{
		try {
            if(sizeof($this->inputPost)>0){

                $username = htmlentities(@$this->inputPost['username']);
                $password = htmlentities(@$this->inputPost['password']);
                
                if($username=="" || $password==""){
                    $res = returnResultCustom(false,"Oops, fill cannot be blank");
                }else{
                    $auth = $this->am->fAuth($username,$password);
                    if($auth->num_rows()>0){
                        $res = returnResult($auth);
                    }else{
                        $res = returnResultCustom(false,'Username or password is invalid');
                    }
                }
            }else{
                $res = returnResultCustom(false,"Oops, fill cannot be blank");
            }
            $res['debugquery'] = $this->db->last_query();
            $res['debuginput'] = $this->inputGet;
            
		} catch (\Throwable $th) {
			$res = returnResultCustom(false,$th->getMessage());
		}
		echo json_encode($res);
	}
	
}
