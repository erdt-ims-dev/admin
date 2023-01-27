import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Landing from '../modules/landing/index'
export default function Routes(){
	return(
		<Switch>
			<Route path="/" exact component={Landing}/>
		</Switch>
	)
}