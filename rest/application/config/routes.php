<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'hello';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

// Authentication
$route['auth_user'] = 'Auth/actLogin';
$route['list_partner'] = 'Users/getDataPartner/';
$route['list_support'] = 'Users/getDataSupport/';
$route['list_users'] = 'Users/getListAll/';
$route['add_users'] = 'Users/saveUser/';

// Contract
$route['list_contract'] = 'Contract/list/';
$route['find_contract_by_id'] = 'Contract/findById';
$route['add_contract'] = 'Contract/insert_contract/';
$route['update_contract'] = 'Contract/update_contract/';
$route['reject_contract'] = 'Contract/reject_contract/';

// Data Source
$route['list_country'] = 'Dashboard/getCountry/';

// Packages
$route['add_package'] = 'Packages/addPackage/';
$route['list_package'] = 'Packages/listAll/';
$route['list_package/(:any)'] = 'Packages/listbyId/$1';


// Packages
$route['add_leads'] = 'Leads/addLeads/';
$route['list_leads'] = 'Leads/listAll/';
$route['list_leads/(:any)'] = 'Leads/listbyId/$1';

// Members
$route['list_member'] = 'Members/list/';
$route['update_member'] = 'Members/update/';
$route['find_member_by_id/(:any)'] = 'Members/listbyId/$1';

// Balance
$route['list_balance_history'] = 'Balance/historyBallance';
$route['list_withdraw'] = 'Balance/withdrawList';
$route['save_withdraw'] = 'Balance/saveWithdraw';
$route['update_withdraw'] = 'Balance/saveWithdraw';
