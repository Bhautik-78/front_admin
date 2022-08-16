import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Users = React.lazy(() => import('./views/Users'));
const Accounts = React.lazy(() => import("./views/Accounts"));
const Customers = React.lazy(() => import("./views/Customers"));
const Application = React.lazy(() => import("./views/Application"));
const CallBack = React.lazy(() => import("./views/Callback"));
const Geo_target_constant = React.lazy(() => import("./views/Geo_target_constant"));
const Campaign_criterion = React.lazy(() => import("./views/Campaign_criterion"));
const Campaign = React.lazy(() => import("./views/Campaign"));
const Setting = React.lazy(() => import("./views/Setting"));
const newCampaign = React.lazy(() => import("./views/New_Campaign"));
const excelConverter = React.lazy(() => import("./views/Excel_Converter"));
const finalCampaign = React.lazy(() => import("./views/Manage_Campaign"));
const latestCampaign = React.lazy(() => import("./views/Update_Campaign"));
const allCampaign = React.lazy(() => import("./views/New_Dashboard"));

 const routes = [
   {path: '/', name: 'Home', component: DefaultLayout},
   {path: '/dashboard', name: 'Dashboard', component: Dashboard},
   {path: '/userCampaign/users', name: 'Users', component: Users},
   {path: '/userCampaign/accounts', name: 'Accounts', component: Accounts},
   {path: '/userCampaign/customers', name: 'Customers', component: Customers},
   {path: '/userCampaign/setting', name: 'Setting', component:Setting},
   {path: '/application', name: 'Application', component: Application},
   {path: '/callback', name: 'Customers', component: CallBack},
   {path: '/geo_target_constant', name: 'Geo_target_constant', component:Geo_target_constant},
   {path: '/campaign_criterion', name: 'Campaign_criterion', component:Campaign_criterion},
   {path: '/campaign', name: 'Campaign', component:Campaign},
   {path: '/newCampaign', name: 'newCampaign', component:newCampaign},
   {path: '/excelConverter', name: 'excelConverter', component:excelConverter},
   {path: '/finalCampaign', name: 'finalCampaign', component:finalCampaign},
   {path: '/latestCampaign', name: 'latestCampaign', component:latestCampaign},
   {path: '/allCampaign', name: 'allCampaign', component:allCampaign},
 ];

export default routes;
