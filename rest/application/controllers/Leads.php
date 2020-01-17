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

class Leads extends CI_Controller {


	function __construct() {
        parent::__construct();
        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

		$this->load->model('LeadsModel', 'lm');
		$this->inputPost = $this->input->post();
		$this->inputGet = $this->input->get();
    }

    /**
     * @method GET
     * This Function for get All List Leads
     */
    public function listAll()
    {
        try {
            $listAll = $this->lm->getAll();
            if($listAll){
                $res = returnResult($listAll);
            }else{
                $res = returnResultErrorDB();
            }
        } catch (\Throwable $th) {
			$res = returnResultCustom(false,$th->getMessage());            
        }
        echo json_encode($res);
    }

    /**
     * @method GET
     * @param id (INT)
     * This Function for get All List Leads by Id
     */
    public function listbyId($id)
    {
        try {
            if($id==""){
                $res = returnResultCustom(false,"Oops, parameter cannot be blank");
            }else{
                $list = $this->lm->findLeadsById($id);
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
    /**
     * @method GET
     * This Function for Save new Leads
     */
    public function addLeads()
    {
        try {
            $arrLeads = array(
                'first_name' => $this->inputPost['leadsFname'],
                'last_name' => $this->inputPost['leadsLname'],
                'email' => $this->inputPost['leadsEmail'],
                'phone' => $this->inputPost['leadsPhone'],
                'company_name' => $this->inputPost['leadsComName'],
                'job_title' => $this->inputPost['leadsJtitle'],
                'company_url' => $this->inputPost['leadsComUrl'],
                'idcountry' => $this->inputPost['leadsCountry'],
                'city' => $this->inputPost['leadsCity'],
                // 'idpackages' => $this->inputPost['leadsPackage'],
                'date_start' => $this->inputPost['leadsDateStart'],
                'date_end' => $this->inputPost['leadsDateEnd'],
            );
            if( $this->inputPost['idleads']!=""){
                $msg = "update";
                $qInsert = $this->lm->updateLeads($arrLeads,$this->inputPost['idleads']);
                $arrayLog = array(
                    'activity_name' => "Update Leads",
                    'description' => "Update Leads with name " . $this->inputPost['leadsComName'],
                    'created_by' => $this->inputPost['iduser']
                );
            }else{
                $msg = "add new";
                $qInsert = $this->lm->insertLeads($arrLeads);
                $arrayLog = array(
                    'activity_name' => "Create new Leads",
                    'description' => "Creating new Leads with name " . $this->inputPost['leadsComName'],
                    'created_by' => $this->inputPost['iduser']
                );
            }
            if($qInsert){
                
                saveLog($arrayLog);
                $res = returnResultCustom(true,"Success ".$msg." Leads");
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
            $q = $this->lm->deleteLeads($id);
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