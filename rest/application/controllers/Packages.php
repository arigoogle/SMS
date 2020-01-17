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

class Packages extends CI_Controller {


	function __construct() {
        parent::__construct();
        header('Access-Control-Allow-Origin:*');
        header("Access-Control-Allow-Credentials: true");
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 1000');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

		$this->load->model('PackagesModel', 'pm');
		$this->inputPost = $this->input->post();
		$this->inputGet = $this->input->get();
    }

    /**
     * @method GET
     * This Function for get All List Packages
     */
    public function listAll()
    {
        try {
            $listAll = $this->pm->getAll();
            if($listAll){
                $res = returnResult($listAll);
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
     * @param id (INT)
     * This Function for get All List Packages
     */
    public function listbyId($id)
    {
        try {
            if($id==""){
                $res = returnResultCustom(false,"Oops, parameter cannot be blank");
            }else{
                $list = $this->pm->findPackageById($id);
                if($list){
                    $res = returnResult($list);
                }else{
                    $res = returnResultErrorDB();
                }
            }
        } catch (\Throwable $th) {
			$res = returnResultCustom(false,$th->getMessage());            
        }
        echo json_encode($res);
    }

    /**
     * @method POST
     * This Function for Add New Packages
     */
    public function addPackage()
    {
        try {
            $arrPackage = array(
                'package_name' => $this->inputPost['packName'],
                'price' => $this->inputPost['packPriceMonth'],
                'total_users' => $this->inputPost['packTotEmpl'],
                'total_course' => $this->inputPost['packTotCourse'],
                'storage' => $this->inputPost['packStorage'],
                // 'package_duration_type' => $this->inputPost['packDurationType'],
                // 'package_duration' => $this->inputPost['packDuration'],
                'additional_notes' => $this->inputPost['packNote'],
                'status' => '1',
                'created_by' => $this->inputPost['iduser'],
                // 'created_date' => date('Y-m-d H:i:s'),
                
            );

            if(@$this->inputPost['packId']!=""){
                $arrPackage['idpackage'] = $this->inputPost['packId'];
                $qInsert = $this->pm->updatePackage($arrPackage);

                $msg = "update";
            }else{
                $msg = "add new";
                $qInsert = $this->pm->insertPackage($arrPackage);
            }
            
            if($qInsert){
                $arrayLog = array(
                    'activity_name' => ucfirst($msg)." Package",
                    'description' => ucfirst($msg)." Package, name " . $this->inputPost['packName'],
                    'created_by' => $this->inputPost['iduser']
                );
                
                saveLog($arrayLog);
                $res = returnResultCustom(true,"Success ".$msg." Package");
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
     * @param id (INT)
     * This Function for get All List Packages
     */
    public function softDelete()
    {
        try {
            $id = $this->input->get('id');
            $qDelete = $this->pm->softDeletePackage($id);
            if($qDelete){
                $res = returnResultCustom(true,"Success delete Package");
            }else{
                $res = returnResultErrorDB();
            }
        } catch (\Throwable $th) {
			$res = returnResultCustom(false,$th->getMessage());            
        }
        echo json_encode($res);
    }
}