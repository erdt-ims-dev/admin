import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Dashboard from '../modules/dashboard/index'
import Login from '../modules/auth/login'
import Endorsedapplicant from '../modules/applications/endorsedapplicant';
import Applicantlist from '../modules/applications/applicantlist';
import Accountlist from '../modules/applications/accountlist';
import AdminLeaveRequests from '../modules/applications/AdminLeaveRequests';

export default function Routes(){
	return(
		<Switch>
			<Route path="/" exact component={Login}/>
			<Route path="/dashboard" exact component={Dashboard}/>
			<Route path="/endorsedapplicant" exact component={Endorsedapplicant}/>
			<Route path="/applicantlist" exact component={Applicantlist}/>
			<Route path="/accountlist" exact component={Accountlist}/>
			<Route path="/admin_leaverequest" exact component={AdminLeaveRequests}/>
		</Switch>
	)
}