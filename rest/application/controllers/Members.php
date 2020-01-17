<?php
/**
 * @author Ups
 */

defined('BASEPATH') OR exit('No direct script access allowed');

class Members extends CI_Controller {

    function __construct() {
        parent::__construct();
        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

		$this->load->model('MemberModel', 'mm');
		$this->inputPost = $this->input->post();
		$this->inputGet = $this->input->get();
    }

    /**
     * @method GET
     * Function to get all list members
     */
    public function list()
    {
        try {
            $data = $this->mm->getAll('');
            if($data){
                $res = returnResult($data);
            }else{
                $res = returnResultErrorDB();
            }
        } catch (\Throwable $th) {
            $res = returnResultCustom(false, $th->getMessage());
        }

        echo json_encode($res);
    }

    /**
     * @method GET
     * @param id (INT)
     * This Function for get All Member by ID
     */
    public function listbyId($id)
    {
        try {
            if($id==""){
                $res = returnResultCustom(false,"Oops, parameter cannot be blank");
            }else{
                $list = $this->mm->getAll($id);
                if($list){
                    $res = returnResult($list);
                }else{
                    $res = returnResultErrorDB();
                }
            }
        } catch (\Throwable $th) {
			$res = returnResultCustom(false,$th->getMessage());            
        }
        echo json_encode($res);
    }

    public function update()
    {
        try{
            $id = $this->inputPost['memberId'];
            $idleads = $this->inputPost['idleads'];
            $fname = $this->inputPost['memberfName'];
            $lname = $this->inputPost['memberlName'];
            $compname = $this->inputPost['memberCompName'];
            $memberstatus = $this->inputPost['memberStatus'];

            $edit = array(
                'first_name'=>$fname,
                'last_name'=>$lname,
                'company_name'=>$compname
            );
            $this->db->where('idleads',$idleads);
            $q = $this->db->update('leads',$edit);
            if($q){
                $this->db->where('idmembers',$id);
                $this->db->update('members',array('status_activated'=>$memberstatus));
                $res = returnResultCustom(true,"Success edit data member");
            }
        } catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());            
        }
        echo json_encode($res);
    }

    /**
     * @method GET
     * @param id (INT)
     * This Function for delete members
     */
    public function softDelete()
    {
        try {
            $id = $this->input->get('id');
            $qDelete = $this->mm->softDeleteMember($id);
            if($qDelete){
                $res = returnResultCustom(true,"Success delete Member");
            }else{
                $res = returnResultErrorDB();
            }
        } catch (\Throwable $th) {
			$res = returnResultCustom(false,$th->getMessage());            
        }
        echo json_encode($res);
    }

}

/* End of file Members.php */
