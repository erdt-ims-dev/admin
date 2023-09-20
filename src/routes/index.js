import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Dashboard from '../modules/dashboard/index'
import Login from '../modules/auth/login'
import EndorsedApplicant from '../modules/applications/EndorsedApplicant'
import AdminApplicantList from '../modules/applications/AdminApplicantList'
import AccountList from '../modules/applications/AccountList'
import AdminLeaveRequest from '../modules/applications/AdminLeaveRequests'
import AdminViewScholar from '../modules/applications/AdminViewScholar.js'

export default function Routes(){
	return(
		<Switch>
			<Route path="/" exact component={Login}/>
			<Route path="/dashboard" exact component={Dashboard}/>
			<Route path="/endorsed_applicant" exact component={EndorsedApplicant}/>
			<Route path="/admin_applicantlist" exact component={AdminApplicantList}/>
			<Route path="/account_list" exact component={AccountList}/>
			<Route path="/admin_leaverequest" exact component={AdminLeaveRequest}/>
			<Route path="/admin_viewscholar" exact component={AdminViewScholar}/>
		</Switch>
	)
}