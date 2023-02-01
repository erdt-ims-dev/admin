import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Dashboard from '../modules/dashboard/index'
import Login from '../modules/auth/login'
import Signup from '../modules/auth/signup'
export default function Routes(){
	return(
		<Switch>
			<Route path="/" exact component={Dashboard}/>
			<Route path="/login" exact component={Login}/>
			<Route path="/signup" exact component={Signup}/>
		</Switch>
	)
}