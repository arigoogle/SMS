<?php
/**
 * @author Ups
 */

defined('BASEPATH') OR exit('No direct script access allowed');

class Contract extends CI_Controller {

	function __construct() {
        parent::__construct();
        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

		$this->load->model('LeadsModel', 'lm');
		$this->load->model('UserModel', 'um');
		$this->load->model('PackagesModel', 'pm');
		$this->load->model('ContractModel', 'cm');
		$this->inputPost = $this->input->post();
		$this->inputGet = $this->input->get();
    }

    public function getStep()
    {
        # code...
    }

    /**
     * @method GET
     * This Function for get All List Contract
     */
    public function list()
    {
        try {
            $listAll = $this->cm->getAll();
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
     * @param id INT
     * This Function for find Contract by ID
     */
    public function findById()
    {
        try {
            $id = $this->inputGet['id'];
            $listAll = $this->cm->getById($id);
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
     * @method POST
     * @param idpackage
     * @param idleads
     * @param idpartner
     * This Function for assign leads
     */
    public function insert_contract()
    {
        try {
            $idpackage = $this->inputPost['idpackage'];
            $idleads = $this->inputPost['idleads'];
            $idpartner = $this->inputPost['idpartner'];


            $r          = $this->db->query("SELECT MAX(idcontracts) as num FROM contracts")->row();
            $num_padded = sprintf("%04d", $r->num + 1);

            $findLeads = $this->lm->findLeadsById($idleads)->row();
            $clientName =  $findLeads->company_name;
            
            $findPartner = $this->um->getPartner($idpartner)->row();
            $partnerName =  $findPartner->name;
            // $ctvalue = $findPartner->price;
            
            // $findPackage = $this->pm->findPackageById($idpackage)->row();
            // $packageName =  $findPackage->package_name;
            // $ctvalue = $findPackage->price;
            
            $ctnumber = "AJAR".date('Ymd'). $num_padded;
            
            $arr = array(
                'contract_number'=>$ctnumber,
                'client_name'=>$clientName,
                'contract_start_date'=>date('Y-m-d H:i:s'),
                // 'idpackage'=>$idpackage,
                // 'contract_value'=>$ctvalue,
                'contract_priority'=>'1',
                'pic_partner'=>$idpartner,
                'id_leads'=>$idleads
            );

            $q = $this->cm->insert_contract($arr);
            if($q){
                $idct = $this->db->insert_id();
                $arrayLog = array(
                    'activity_name' => "Assign Leads",
                    'description' => "Assign new Leads " . $clientName . " with Partner ".$partnerName,
                    'created_by' => $this->inputPost['iduser']
                );
                
                saveLog($arrayLog);

                $step = array(
                    'idusers'=>$idleads,
                    'idcontract'=>$idct,
                    'step'=>1
                );
                $this->db->insert('step_contract',$step);
                $res = returnResultCustom(true,"Success assign new Leads");
            }else{
                $res = returnResultErrorDB();
            }
            
        } catch (\Throwable $th) {
			$res = returnResultCustom(false,$th->getMessage());            
        }
        echo json_encode($res);
    }

    /**
     * @method POST
     * @param idpackage
     * This Function for input contract
     */
    public function update_contract()
    {
        try {
            $step = @$this->inputPost['step'];
            $idpackage = @$this->inputPost['idpackage'];
            $idleads = @$this->inputPost['idleads'];
            $idct = @$this->inputPost['idcontract'];
            $contract_number = @$this->inputPost['contract_number'];
            $iduser = @$this->inputPost['iduser'];
            $idmember = @$this->inputPost['idmember'];
            $username = @$this->inputPost['username'];
            $ctstart = @$this->inputPost['ct_start_date'];
            $ctend = @$this->inputPost['ct_end_date'];
            $note = @$this->inputPost['note'];
            $picsupport = @$this->inputPost['assignPIC'];
            $reason = @$this->inputPost['reason'];
            $commision = @$this->inputPost['commision'];
            $feedback = @$this->inputPost['feedback'];
            $contractValue = @$this->inputPost['contractValue'];

            $findPackage = $this->pm->findPackageById($idpackage)->row();
            $packageName =  $findPackage->package_name;
            $ctvalue = $findPackage->price;
            
            $findLeads = $this->lm->findLeadsById($idleads)->row();
            $clientName =  $findLeads->company_name;

            $arr = array(
                'contract_start_date'=>$ctstart,
                'contract_end_date'=>$ctend,
                'idcontracts'=>$idct,
                'idpackage'=>$idpackage,
                'contract_value'=>$ctvalue,
                'note'=>$note,
                'contract_priority'=>'1',
                'contract_status'=>$step,
            );

            $q = $this->cm->update_contract($arr);
            if($q){
                if($step==1){
                    $arrayLog = array(
                        'activity_name' => "Input Contract",
                        'description' => "Input new Contract for " . $clientName . " by Partner ".$username,
                        'created_by' => $this->inputPost['iduser']
                    );
    
                    $step = array(
                        'idusers'=>$idleads,
                        'idcontract'=>$idct,
                        'step'=>2
                    );
                }else if($step==2){
                    $arrayLog = array(
                        'activity_name' => "Approval Contract",
                        'description' => "Approved Contract for " . $contract_number,
                        'created_by' => $this->inputPost['iduser']
                    );

                    // Inserting to member when finance approve
                    $arrayMember = array(
                        'contracts_idcontracts' => $idct,
                        'date_submitted' => date('Y-m-d H:i:s'),
                        'description' => $reason,
                        'pic_finance' => $iduser,
                        'idleads' => $idleads
                    );
                    $this->db->insert('members',$arrayMember);

                    //update final income
                    $finalIncome = (float)$contractValue - (float)$commision;
                    $this->db->query("UPDATE contracts SET final_income=$finalIncome,commision=$commision,contract_status=3 WHERE idcontracts=$idct");
    
                    $step = array(
                        'idusers'=>$idleads,
                        'idcontract'=>$idct,
                        'step'=>3
                    );
                }else if($step==3){
                    $arrayLog = array(
                        'activity_name' => "Activation Members",
                        'description' => "Activated Members for " . $contract_number,
                        'created_by' => $this->inputPost['iduser']
                    );
                    
                    //activating users
                    $q = $this->db->query("UPDATE members SET status_activated = '1',pic_support = '$picsupport' WHERE idmembers = '$idmember'");

                    $step = array(
                        'idusers'=>$idleads,
                        'idcontract'=>$idct,
                        'step'=>4
                    );
                }else if($step==4){
                    $arrayLog = array(
                        'activity_name' => "Feedback Members",
                        'description' => "Feedback Members from " . $contract_number,
                        'created_by' => $this->inputPost['iduser']
                    );
                    //inserting member feedback
                    $q = $this->db->query("UPDATE contracts SET feedback = '$feedback' WHERE idcontracts = '$idct'");

                    $step = array(
                        'idusers'=>$idleads,
                        'idcontract'=>$idct,
                        'step'=>5
                    );
                }
                

                saveLog($arrayLog);
                $this->db->where('idcontract',$idct);
                $this->db->update('step_contract',$step);
                $res = returnResultCustom(true,"Success input Contract");
                $res['idcontracts'] = $idct;
            }else{
                $res = returnResultErrorDB();
            }
            
        } catch (\Throwable $th) {
			$res = returnResultCustom(false,$th->getMessage());            
        }
        echo json_encode($res);
    }

    public function addAttachment() {
        $data       = $this->input->post('data');
        $fileName   = $this->input->post('name');
        $serverFile = $fileName;

        list($type, $data) = explode(';', $data);
        list(, $data) = explode(',', $data);
        $data       = base64_decode($data);
        file_put_contents('./data/contract_attachment/' . $serverFile, $data);
        $returnData = array("serverFile" => $serverFile);
        echo json_encode($returnData);
    }
    public function updateDataContract() {
        $id        = $this->input->post('id');
        $name      = $this->input->post('name');
        $arrUpdate = array('file_attach' => $name);
        $this->db->where('idcontracts', $id);
        $q         = $this->db->update('contracts', $arrUpdate);
        if ($q) {
            $result = array('success' => true, 'msg' => 'Success update transaction');
        } else {
            $result = array('success' => false, 'msg' => 'Failed update transaction');
        }
        echo json_encode($result);
    }

    public function reject_contract()
    {
        try {
            $id = $this->inputGet['id'];
            $reasons = $this->inputGet['reasons'];
            if($id!=""){
                $sql = $this->cm->rejectContract($id,$reasons);
                if($sql){
                    $res = returnResultCustom(true,'Success reject contract');
                }else{
                    $res = returnResultErrorDB();
                }
            }else{
                $res = returnResultCustom(false,"Oops, missing parameter");
            }
        } catch (\Exception $th) {
            $res = returnResultCustom(false, $th->getMessage());
        }

        echo json_encode($res);
    }

}

/* End of file Contract.php */
