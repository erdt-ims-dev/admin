import React from 'react';
import {Switch} from 'react-router-dom';
import Route from './route'
import Landing from '../modules/landing/index'
import Test from '../modules/landing/test'
export default function Routes(){
	return(
		<Switch>
			<Route path="/" exact component={Landing}/>
			<Route path="/test" exact component={Test}/>
		</Switch>
	)
}