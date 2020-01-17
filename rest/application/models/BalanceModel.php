<?php
/**
 * @author Ups
 */

defined('BASEPATH') OR exit('No direct script access allowed');

class BalanceModel extends CI_Model {

    function getHistory($id,$type)
    {
        $this->db->select('bh.*,c.*,a.partner_credit');
        if($id!="" && $id!=1){
            $this->db->where('bh.created_by',$id);
            $this->db->where('bh.type_mutation',2);
        }else{
            
        }
        if($type=='wd'){
            $this->db->where('bh.type_mutation',2);
        }
        $this->db->join('contracts c','c.idcontracts=bh.idcontracts');
        $this->db->join('account a','a.users_idusers = bh.created_by','left');
        $q = $this->db->get('balance_history bh');
        return $q;
    }

    function insert($ar)
    {
        return $this->db->insert('balance_history',$ar);
    }
    function update($ar)
    {
        $this->db->where('idbalance',$ar['idbalance']);
        return $this->db->update('balance_history',$ar);
    }

    function deleteWithdraw($id=null)
    {
        $this->db->where('idbalance',$id);
        return $this->db->delete('balance_history');
    }

}

/* End of file BalanceModel.php */
