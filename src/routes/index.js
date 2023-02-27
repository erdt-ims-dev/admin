import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Dashboard from '../modules/dashboard/index'
import Login from '../modules/auth/login'
import Endorsedapplicant from '../modules/applications/endorsedapplicant';

export default function Routes(){
	return(
		<Switch>
			<Route path="/" exact component={Login}/>
			<Route path="/dashboard" exact component={Dashboard}/>
			<Route path="/endoresedapplicant" exact component={Endorsedapplicant}/>
		</Switch>
	)
}