import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Dashboard from '../modules/dashboard/index'
import Login from '../modules/auth/login'
import EndorsedApplicant from '../modules/applications/EndoresedApplicant'
import ApplicantList from '../modules/applications/ApplicantList'
import AccountList from '../modules/applications/AccountList'

export default function Routes(){
	return(
		<Switch>
			<Route path="/" exact component={Login}/>
			<Route path="/dashboard" exact component={Dashboard}/>
			<Route path="/endorsed_applicant" exact component={EndorsedApplicant}/>
			<Route path="/applicant_list" exact component={ApplicantList}/>
			<Route path="/account_list" exact component={AccountList}/>
		</Switch>
	)
}