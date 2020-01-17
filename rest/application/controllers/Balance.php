<?php
/**
 * @author Ups
 */

defined('BASEPATH') OR exit('No direct script access allowed');

class Balance extends CI_Controller {
    
    public function __construct()
    {
        parent::__construct();
        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

		$this->inputPost = $this->input->post();
        $this->inputGet = $this->input->get();
        $this->load->model('BalanceModel','bm');
    }
    /**
     * @method GET
     * Function to get history balance outcome/withdraw
     */
    public function historyBallance()
    {
        try {
            $iduser = $this->input->get('iduser');
            $data = $this->bm->getHistory($iduser,'');
            if($data){
                $res = returnResult($data);
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
     * Function to get list withdraw
     */
    public function withdrawList()
    {
        try {
            $iduser = $this->input->get('iduser');
            $data = $this->bm->getHistory($iduser,'wd');
            if($data){
                $res = returnResult($data);
            }else{
                $res = returnResultErrorDB();
            }
        } catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());
        }
        $res['last_query'] = $this->db->last_query();
        echo json_encode($res);
    }
    /**
     * @method GET
     * Function to get history data
     */

    /**
     * @method POST
     * Function to save withdraw
     */
    public function data()
    {
        try {
            $dat = array(
                'success'=>true
            );

            $income = $this->db->query("SELECT SUM(credit) as balance FROM balance_history")->row();
            $dat['income'] = (float)$income->balance;

            $outcome = $this->db->query("SELECT SUM(amount) as balance FROM balance_history WHERE `status`=1")->row();
            $dat['outcome'] = (float)$outcome->balance;

            $dat['balance'] = (float)$income->balance -  (float)$outcome->balance;

            $res = $dat;
        }  catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());
        }
        $res['last_query'] = $this->db->last_query();
        echo json_encode($res);
    }

    
    /**
     * @method POST
     * @param id
     * Function to save withdraw
     */
    public function deleteWithdraw()
    {
        try{
            $id = $this->input->post('id');
            if($id!=""){
                $ret = $this->bm->deleteWithdraw($id);
                if($ret){
                    returnResultCustom(true, "Success delete withdraw");
                }else{
                    returnResultCustom(false, "Failed to delete withdraw");
                }
            }else{
                $res = returnResultCustom(false, "Oops, missing parameter");
            }
        } catch (\Throwable $th) {
            $res = returnResultCustom(false,$th->getMessage());
        }
        $res['last_query'] = $this->db->last_query();
        echo json_encode($res);
    }

}

/* End of file Balance.php */
