<?php
/**
 * @author Ups
 */

defined('BASEPATH') OR exit('No direct script access allowed');

class ContractModel extends CI_Model {

    function getAll()
    {
        $this->db->join('account a','a.idaccount = c.pic_partner');
        $this->db->join('packages p','c.idpackage = p.idpackage','left');
        return $this->db->get('contracts c');
    }

    function getById($id)
    {
        $q = $this->db->query("SELECT ct.*,st.step , st.status_contract,m.idmembers
                            FROM contracts ct 
                            INNER JOIN step_contract st ON st.idcontract = ct.idcontracts
                            LEFT JOIN members m ON m.contracts_idcontracts = ct.idcontracts
                            WHERE ct.idcontracts = $id");
        return $q;
    }
    
    function insert_contract($arr)
    {
        return $this->db->insert('contracts',$arr);
    }
 
    function update_contract($arr)
    {
        $this->db->where('idcontracts',$arr['idcontracts']);
        return $this->db->update('contracts',$arr);
    }
    
    function rejectContract($id,$reason)
    {
        $this->db->query("UPDATE step_contract SET status_contract=4 WHERE idcontract='$id'");
        
        $arr = array(
            'contract_status' => 4,
            'reason_reject' => $reason,
        );
        $this->db->where('idcontracts',$id);
        return $this->db->update('contracts',$arr);
    }

}

/* End of file ContractModel.php */
