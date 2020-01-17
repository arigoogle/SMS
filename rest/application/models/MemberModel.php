<?php
/**
 * @author Ups
 */

defined('BASEPATH') OR exit('No direct script access allowed');

class MemberModel extends CI_Model {
    function getAll($id)
    {
        // $this->db->join('account a','a.idaccount = m.')
        $this->db->select('
            m.*,
            c.contract_number,c.contract_value,c.contract_start_date,c.contract_end_date,c.commision,
            p.package_name,p.idpackage,
            l.first_name,l.last_name,l.company_name,
            u.username as supportUser,
            uf.username as partnerUsername,
            a.name as partnerUser,
        ');
        $this->db->join('contracts c','c.idcontracts = m.contracts_idcontracts','left');
        $this->db->join('packages p','p.idpackage = c.idpackage','left');
        $this->db->join('leads l','l.idleads = m.idleads','left');
        $this->db->join('users u','u.idusers = m.pic_support','left');
        $this->db->join('users uf','uf.idusers = m.pic_finance','left');// ini finance sebenernya partner
        $this->db->join('account a','a.users_idusers = uf.idusers','left');// ini finance sebenernya partner
        $this->db->where('m.status',1);
        if($id!=""){
            $this->db->where('m.idmembers',$id);
        }
        $q = $this->db->get('members m');

        return $q;
    }
    
    function softDeleteMember($id)
    {
        $this->db->where('idmembers',$id);
        return $this->db->update('members',array('status'=>0));
    }
}

/* End of file MemberModel.php */
