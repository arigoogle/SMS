<?php
/**
 * @author Sony Surahman
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Users extends CI_Controller {

	function __construct() {
        parent::__construct();
        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

		$this->load->model('UserModel', 'um');
		$this->inputPost = $this->input->post();
		$this->inputGet = $this->input->get();
    }

    /**
     * @method GET
     * @param int id_user
     * @return json datauser
     */
    public function getDataAuth()
    {
        try {
            $id = $this->inputGet['id'];
            $privilege = $this->um->getPrivilegeDetail($id);
            if($privilege){
                $res = returnResult($privilege);
            }else{
                $res = returnResultCustomDB();
            }

        } catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());
        }
        echo json_encode($res);
    }

    /**
     * @method GET
     * @return json datapartner
     */
    public function getDataPartner()
    {
        try {
            $id = $this->input->get('idpartner');
            $privilege = $this->um->getPartner($id);
            if($privilege){
                $res = returnResult($privilege);
            }else{
                $res = returnResultCustomDB();
            }

        } catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());
        }
        echo json_encode($res);
    }
    
    /**
     * @method GET
     * @return json datasupport
     */
    public function getDataSupport()
    {
        try {
            $id = $this->input->get('idsupport');
            $privilege = $this->um->getSupport($id);
            if($privilege){
                $res = returnResult($privilege);
            }else{
                $res = returnResultCustomDB();
            }

        } catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());
        }
        echo json_encode($res);
    }

    /**
     * @method GET
     * @return json datasupport
     */
    public function getListAll()
    {
        try {
            $this->db->select('u.*,urt.name as user_type');
            $this->db->join('users_role_type urt', 'urt.idusers_type = u.idusers_type');
            $this->db->where('u.status',1);
            $privilege = $this->db->get('users u');
            if($privilege){
                $res = returnResult($privilege);
            }else{
                $res = returnResultCustomDB();
            }

        } catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());
        }
        echo json_encode($res);
    }

    public function saveUser()
    {
        try {
            $idtype = $this->inputPost['idusers_type'];
            $array = array(
                'username'=>$this->inputPost['username'],
                'password'=>md5($this->inputPost['password']),
                'retype_password'=>$this->inputPost['password'],
                'created_date'=>date('Y-m-d H:i:s'),
                'idusers_type'=>$idtype,
            );
            if($this->inputPost['idusers']){
                $array['idusers'] = $this->inputPost['idusers'];
                $msgType = "Update";
                $qinsertuser = $this->um->update($array);
            }else{
                $msgType = "Add";
                $qinsertuser = $this->um->insert($array);
            }
            // afterinsert users
            if($qinsertuser){
                $iduser = $this->db->insert_id();
                if($idtype=="3"){//partner insert
                    $partner = array(
                        'users_idusers'=>$iduser,
                        'name'=>$this->inputPost['fullname'],
                        'email'=>$this->inputPost['email'],
                        'phone_number'=>$this->inputPost['phone_number'],
                        'city'=>$this->inputPost['city'],
                        'country_idcountry'=>$this->inputPost['country'],
                        'authorized'=>$this->inputPost['authorized'],
                        'default_commision'=>$this->inputPost['default_commision']
                    );
                    $res = returnResultCustom(true,"Success add Partner");
                    $arrayLog = array(
                        'activity_name' => "Add Partner",
                        'description' => "Add Partner " . $this->inputPost['fullname'],
                        'created_by' => $this->inputPost['iduser']
                    );

                    saveLog($arrayLog);

                    $this->um->insertPartner($partner);
                }else{
                    $arrayLog = array(
                        'activity_name' => $msgType." User",
                        'description' => $msgType." User " . $this->inputPost['fullname'],
                        'created_by' => $this->inputPost['iduser']
                    );

                    saveLog($arrayLog);
                }
                $res = returnResultCustom(true,"Success ".$msgType." user");
            }else{
                $res = returnResultErrorDB();
            }
        } catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());
        }

        echo json_encode($res);
    }

    public function softDelete()
    {
        try {
            $id=$this->inputGet['id'];
            $q = $this->um->deleteUser($id);
            if($q){
                $res = returnResultCustom(true,"Success delete");
            }else{
                $res = returnResultErrorDB();
            }
        } catch (\Throwable $th) {
            $res = returnResultCustom(false, $th->getMessage());
        }
        echo json_encode($res);
    }
}

/* End of file Users.php */
