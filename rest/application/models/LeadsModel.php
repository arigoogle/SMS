<?php
/**
 * @author Ups
 *
 */

class LeadsModel extends CI_Model {
    function getAll()
    {
        $this->db->where('status',1);
        $q = $this->db->get('leads');
        return $q;
    }

    function findLeadsById($id)
    {
        $this->db->where('idleads',$id);
        $q = $this->db->get('leads');
        return $q;
    }
    function insertLeads($arr)
    {
        return $this->db->insert('leads',$arr);
    }
    function updateLeads($arr,$idleads)
    {
        $this->db->where('idleads',$idleads);
        return $this->db->update('leads',$arr);
    }
    function deleteLeads($id)
    {
        $array = array(
            'status'=>0
        );
        $this->db->where('idleads',$id);
        return $this->db->update('leads',$array);
    }
}