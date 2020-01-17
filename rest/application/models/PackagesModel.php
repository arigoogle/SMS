<?php
/**
 * @author Ups
 *
 */

class PackagesModel extends CI_Model {
    function getAll()
    {
        $this->db->where('status','1');
        $q = $this->db->get('packages');
        return $q;
    }

    function findPackageById($id)
    {
        $this->db->where('idpackage',$id);
        $q = $this->db->get('packages');
        return $q;
    }
    function insertPackage($arr)
    {
        return $this->db->insert('packages',$arr);
    }
    function updatePackage($arr)
    {
        $this->db->where('idpackage',$arr['idpackage']);
        return $this->db->update('packages',$arr);
    }
    function softDeletePackage($id)
    {
        $updates = array(
            'status' => '0'
        );
        $this->db->where('idpackage',$id);
        $q = $this->db->update('packages',$updates);
        return $q;
    }
}