import React, { useState } from "react";
import { Switch } from "react-router-dom";
import Route from "./route";
import Dashboard from "modules/dashboard/index";
import Login from "modules/auth/login";
// import EndorsedApplicant from "modules/applications/EndorsedApplicant";
// import AdminApplicantList from "modules/applications/AdminApplicantList";
<<<<<<< HEAD
// import AccountList from "modules/accounts/index";
import AdminLeaveRequest from "modules/applications/AdminLeaveRequests";
import ScholarDashboard from "modules/scholardashboard/index.js";
// import AdminViewScholar from "modules/applications/AdminViewScholar.js";
import { ScholarList, ViewScholar } from "modules/scholar";
=======
import AccountList from "modules/accounts/index";
import AdminLeaveRequest from "modules/applications/index";
// import AdminViewScholar from "modules/applications/AdminViewScholar.js";
import { ScholarList, ScholarDetails, ViewScholar, ScholarPortfolio, ScholarLeaveApplication, ScholarTasks, ScholarRequests } from "modules/scholar";
>>>>>>> a2ae650014440ae9b61d49609c03df5619cdbf94

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
import SystemAnnouncements from "modules/announcements/index";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";

export default function Routes() {
  const isLoggedIn = useSelector(state=> state.isLoggedIn)
  console.log("::", isLoggedIn)
  return (
    <Switch>
      {/* Public Routes */}
      <Route
        path="/login"
        exact
        component={Login}
      />
<<<<<<< HEAD
       {/* Protected */}
      {/* <Route path="/dashboard" 
			exact 
			component={isLoggedIn ? Dashboard: () => <Redirect to="/"/>}
			/> */}
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/scholar_dashboard" exact component={ScholarDashboard} />
      {/* Applicant Management */}
      <Route path="/applications" exact component={ApplicantList}/>
      <Route path="/new_application" exact component={NewApplicant}/>
=======
      <Route
        path="/register"
        exact
        component={Register}
      />
      {/* Protected Routes */}
>>>>>>> a2ae650014440ae9b61d49609c03df5619cdbf94
      
          <Route path="/dashboard" exact component={Dashboard} isPrivate/>

          <Route path="/endorsements" exact component={EndorsementList} isPrivate/>
          <Route path="/applications" exact component={ApplicantList} isPrivate/>
          <Route path="/new_application" exact component={NewApplicant} isPrivate/>

<<<<<<< HEAD
      
      {/* <Route path="/endorsed_applicant" exact component={EndorsedApplicant} />
      <Route path="/admin_applicantlist" exact component={AdminApplicantList} />
      <Route path="/account_list" exact component={AccountList} />
      <Route path="/admin_viewscholar" exact component={AdminViewScholar} />
      <Route path="/scholars/:scholarId" component={ViewScholar} />
      <Route path="/applicants" exact component={ApplicantList} />
      <Route path="/applicants/add" exact component={AddApplicant} />
      <Route path="/applicants/:applicantId" component={ViewApplicant} />*/}
      <Route path="/admin_leaverequest" exact component={AdminLeaveRequest} />
      <Route path="/scholars" exact component={ScholarList} />
      <Route path="/announcements" exact component={SystemAnnouncements} /> 
=======
          <Route path="/admin_leaverequest" exact component={AdminLeaveRequest} isPrivate/>
          <Route path="/scholars" exact component={ScholarList} isPrivate/>

          <Route path="/scholars/scholar_details" exact component={ScholarDetails} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_details" component={ScholarDetails} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_tasks" component={ScholarTasks} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_requests" component={ScholarRequests} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_portfolio" component={ScholarPortfolio} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_leave_applications" component={ScholarLeaveApplication} isPrivate/>
>>>>>>> a2ae650014440ae9b61d49609c03df5619cdbf94
      {/* Replacements */}
          <Route path="/scholars/:scholarId/scholar_details" component={ScholarDetails} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_tasks" component={ScholarTasks} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_requests" component={ScholarRequests} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_portfolio" component={ScholarPortfolio} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_leave_applications" component={ScholarLeaveApplication} isPrivate/>
          <Route path="/announcements" component={SystemAnnouncements} isPrivate/> 

          <Route path="/leaves" exact component={Leaves} isPrivate/>
          <Route path="/accounts" exact component={Accounts} isPrivate/>
          <Route path="/settings" exact component={Settings} isPrivate/>
          <Route path="/register" exact component={Register} isPrivate/>
          <Route path="/home" exact component={Home} />
        
    </Switch>
  );
}
