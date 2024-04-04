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
      <Route
        path="/register"
        exact
        component={Register}
      />
      {/* Protected Routes */}
      
          <Route path="/dashboard" exact component={Dashboard} isPrivate/>

          <Route path="/endorsements" exact component={EndorsementList} isPrivate/>
          <Route path="/applications" exact component={ApplicantList} isPrivate/>
          <Route path="/new_application" exact component={NewApplicant} isPrivate/>

          <Route path="/admin_leaverequest" exact component={AdminLeaveRequest} isPrivate/>
          <Route path="/scholars" exact component={ScholarList} isPrivate/>

          <Route path="/scholars/scholar_details" exact component={ScholarDetails} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_details" component={ScholarDetails} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_tasks" component={ScholarTasks} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_requests" component={ScholarRequests} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_portfolio" component={ScholarPortfolio} isPrivate/>
          <Route path="/scholars/:scholarId/scholar_leave_applications" component={ScholarLeaveApplication} isPrivate/>
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
