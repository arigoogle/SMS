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

class Dashboard extends CI_Controller {

	function __construct() {
        parent::__construct();
        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

		$this->inputPost = $this->input->post();
        $this->inputGet = $this->input->get();
        $this->load->model('UserModel','um');
    }

    /**
     * @method GET
     * This Function for get Dashboard Counting
     */
    public function countingAll()
    {
        $dash = array(
            'total_leads'=>0,
            'waiting_to_activate'=>0,
            'total_member'=>0,
            'total_income'=>0
        );

        // Total Leads
        $qLeads = $this->db->get('leads')->num_rows();

        // Total Leads
        $qMember = $this->db->get('member')->num_rows();

    }

    /**
     * @method GET
     * Dashboard Information
     */
    public function getDashboardInfo()
    {

        // $this->db->where("MONTH(created_date)",date('m'));
        $this->db->order_by('created_date','DESC');
        $this->db->limit(5);
        $listLeads = $this->db->get('leads');
        $qleads = $this->db->last_query();
        $listLeadsCount = $listLeads->num_rows();

        $this->db->where('status_activated','1');
        $listMembersCount = $this->db->get('members')->num_rows();

        $this->db->where('status_activated','0');
        $listMembersWaitActivateCount = $this->db->get('members')->num_rows();

        $contract = $this->db->get('contracts');
        $listContract = $contract->result();
        $listContractCount = $contract->num_rows();

        $this->db->select('al.*, u.username');
        $this->db->join('users u','u.idusers = al.created_by');
        $this->db->order_by('al.created_date','DESC');
        $actionLog = $this->db->get('action_log al')->result();

        $partner = $this->um->getPartner('')->result();

        $res = array(
            'qleads' => $qleads,
            'leads' => $listLeads->result(),
            'leads_count' => $listLeadsCount,
            'active_members_count' => $listMembersCount,
            'wait_members_count' => $listMembersWaitActivateCount,
            'contract_count' => $listContractCount,
            'contract' => $listContract,
            'partner' => $partner,
            'action_log'=>$actionLog
        );
        echo json_encode($res);
    }

    public function getCountry()
    {
        try {
            $q = $this->db->get('country');
            if($q){
                $res = returnResult($q);
            }else{
                $res = returnResultCustom(false,"Oops, cannot fetch data from database");
            }
        } catch (\Throwable $th) {
            $res = returnResultCustom(false, $th->getMessage());
        }

        echo json_encode($res);
    }

}

/* End of file Dashboard.php */
