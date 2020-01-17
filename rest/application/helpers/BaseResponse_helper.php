<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//save datalog
if ( ! function_exists('saveLog'))
{
    function saveLog($data = '')
    {
        $CI =& get_instance();
        $dt = $data;
        
        $result = array(
            'activity_name'=>$dt['activity_name'],
            'description'=>$dt['description'],
            'created_date'=>date("Y-m-d H:i:s"),
            'created_by'=>$dt['created_by']
        );
        $q = $CI->db->insert('action_log',$result);
        return $q;
    }
}


//Utilities
if ( ! function_exists('returnResult'))
{
    function returnResult($data = '')
    {
        $result = array(
            'success'=>true,
            'rowCount'=>$data->num_rows(),
            'row'=>$data->result()
        );
        return $result;
    }
}


if ( ! function_exists('returnResultErrorDB'))
{
    function returnResultErrorDB()
    {
        return array(
            'success'=>false,
            'msg'=>'Failed fetch data from database'
        );
    }
}


if ( ! function_exists('returnResultCustom'))
{
    function returnResultCustom($t,$msg)
    {
        return array(
            'success'=>$t,
            'msg'=>$msg
        );
    }
}