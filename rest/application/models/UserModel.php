<?php
/**
 * @author Sony Surahman
 */

defined('BASEPATH') OR exit('No direct script access allowed');

class UserModel extends CI_Model {

    function getPrivilegeDetail($params)
    {
        $q = $this->db->query("SELECT 
                                urthm.*, sub.*
                            FROM
                                users_role_type_has_menu urthm
                                    INNER JOIN
                                menu menu ON menu.idmodule = urthm.menu_idmodule
                                    INNER JOIN
                                submenu sub ON sub.idsubmenu = submenu_idsubmenu
                            WHERE
                                urthm.users_role_type_idusers_type = (SELECT 
                                        idusers_type
                                    FROM
                                        users
                                    WHERE
                                        idusers = $params)");
        return $q;
    }

    function getPartner($id)
    {
        $q = "SELECT 
            *,
            a.name as account_name,
            (SELECT 
                    SUM(commision)
                FROM
                    contracts
                WHERE
                    pic_partner = a.idaccount) AS moneySales ,
            (SELECT 
                    COUNT(*)
                FROM
                    contracts
                WHERE
                    pic_partner = a.idaccount) AS countSales 
            FROM
            account a
                INNER JOIN
            users u ON u.idusers = a.users_idusers
        ";
        if($id){
            $q .= " WHERE a.idaccount = '$id' ";
        }
        $sql = $this->db->query($q);
        return $sql;
    }

    function getSupport($id)
    {
        if($id){
            $this->db->where('idusers',$id);
        }
        $this->db->where('idusers_type',5);
        return $this->db->get('users');
    }

    function insertPartner($arr)
    {
        return $this->db->insert('account',$arr);
    }
    
    function insert($array)
    {
        $q = $this->db->insert('users',$array);
        return $q;
    }

    function update($array)
    {
        $this->db->where('idusers',$array['idusers']);
        $q = $this->db->update('users',$array);
        return $q;
    }

    function deleteUser($id)
    {
        $this->db->where('idusers',$id);
        return $this->db->update('users',array('status'=>0));
    }

}

/* End of file UserModel.php */
