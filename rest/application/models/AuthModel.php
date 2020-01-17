<?php
/**
 * @author Ups
 * 
 */
class AuthModel extends CI_Model
{
    function fAuth($username,$password)
    {
        $this->db->select('u.*,urt.name as rolename');
        $this->db->where('username',$username);
        $this->db->where('password',md5($password));
        $this->db->join('users_role_type urt', 'urt.idusers_type = u.idusers_type');
        $q = $this->db->get('users u');
        return $q;
    }
}