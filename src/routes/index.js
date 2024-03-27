import React, { useState } from "react";
import { Switch } from "react-router-dom";
import Route from "./route";
import Dashboard from "modules/dashboard/index";
import Login from "modules/auth/login";
// import EndorsedApplicant from "modules/applications/EndorsedApplicant";
// import AdminApplicantList from "modules/applications/AdminApplicantList";
import AccountList from "modules/accounts/index";
import AdminLeaveRequest from "modules/applications/index";
// import AdminViewScholar from "modules/applications/AdminViewScholar.js";
import { ScholarList, ScholarDetails, ViewScholar, ScholarPortfolio, ScholarLeaveApplication, ScholarTasks, ScholarRequests } from "modules/scholar";

import Leaves from "modules/leaves/index.js";
import Accounts from "modules/accounts/index.js";
import Settings from "modules/settings/index.js";
import Register from "modules/auth/register.js";
import Home from "home/index.js";

import ApplicantList from "modules/applications/index.js";
import EndorsementList from "modules/endorsements/index";
import NewApplicant from "modules/applications/new_application/newApplicant";
// import {
//   AddApplicant,
//   ApplicantList,
//   ViewApplicant,
// } from "../modules/applicants";
import { SystemAnnouncements } from "../modules/announcements";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default function Routes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  return (
    <Switch>
      <Route
        path="/login"
        exact
        component={Login}
      />
       {/* Protected */}
      {/* <Route path="/dashboard" 
			exact 
			component={isLoggedIn ? Dashboard: () => <Redirect to="/"/>}
			/> */}
      <Route path="/dashboard" exact component={Dashboard} />
      {/* Applicant Management */}
      <Route path="/applications" exact component={ApplicantList}/>
      <Route path="/endorsements" exact component={EndorsementList}/>
      <Route path="/new_application" exact component={NewApplicant}/>
      


      
      
      <Route path="/admin_leaverequest" exact component={AdminLeaveRequest} />
      
      
      <Route path="/scholars" exact component={ScholarList} />

      <Route path="/scholar_details" exact component={ScholarDetails} />
      <Route path="/scholars/scholar_details" exact component={ScholarDetails} />
      <Route path="/scholars/:scholarId/scholar_details" component={ScholarDetails} />
      <Route path="/scholars/:scholarId/scholar_tasks" component={ScholarTasks} />
      <Route path="/scholars/:scholarId/scholar_requests" component={ScholarRequests} />
      <Route path="/scholars/:scholarId/scholar_portfolio" component={ScholarPortfolio} />
      <Route path="/scholars/:scholarId/scholar_leave_applications" component={ScholarLeaveApplication} />
      <Route path="/announcements" exact component={SystemAnnouncements} /> 
      {/* Replacements */}
      <Route path="/leaves" exact component={Leaves} />
      <Route path="/accounts" exact component={Accounts} />
      <Route path="/settings" exact component={Settings} />
      <Route path="/register" exact component={Register} />
      <Route path="/home" exact component={Home} />
    </Switch>
  );
}
