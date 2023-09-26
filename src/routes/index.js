import React, { useState } from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Dashboard from '../modules/dashboard/index'
import Login from '../modules/auth/login'
import EndorsedApplicant from '../modules/applications/EndorsedApplicant'
import AdminApplicantList from '../modules/applications/AdminApplicantList'
import AccountList from '../modules/applications/AccountList'
import AdminLeaveRequest from '../modules/applications/AdminLeaveRequests'
import AdminViewScholar from '../modules/applications/AdminViewScholar.js'
import Leaves from '../modules/leaves/index.js'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

export default function Routes(){
	const {isLoggedIn} = true;
	return(
		<Switch>
			<Route path="/" 
			exact 
			component={Login}/>
			{/* Protected */}
			<Route path="/dashboard" 
			exact 
			component={isLoggedIn ? Dashboard: () => <Redirect to="/"/>}
			/>
			<Route path="/endorsed_applicant" exact component={EndorsedApplicant}/>
			<Route path="/admin_applicantlist" exact component={AdminApplicantList}/>
			<Route path="/account_list" exact component={AccountList}/>
			<Route path="/admin_leaverequest" exact component={AdminLeaveRequest}/>
			<Route path="/admin_viewscholar" exact component={AdminViewScholar}/>
			<Route path="/leaves" exact component={Leaves}/>
		</Switch>
	)
}