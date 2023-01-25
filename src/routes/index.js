import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Dashboard from '../modules/landing/test'
export default function Routes(){
	return(
		<Switch>
			<Route path="/" exact component={Dashboard}/>
		</Switch>
	)
}