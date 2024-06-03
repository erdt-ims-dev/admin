import React, { useState } from "react";
import { Switch } from "react-router-dom";
import Route from "./route";
import AnnouncementDashboard from "modules/dashboard/AnnouncementDashboard";
import Login from "modules/auth/login";
import AdminLeaveRequest from "modules/applications/index";
//import { ScholarList, ScholarDetails, ViewScholar, ScholarPortfolio, ScholarLeaveApplication, ScholarTasks, ScholarRequests } from "modules/scholar/pages";
import ScholarDashboard  from "modules/scholardashboard/index.js";
import Leaves from "modules/leaves/index.js";
import Accounts from "modules/accounts/index.js";
import Settings from "modules/settings/index.js";
import Register from "modules/auth/register.js";

import ScholarTasks from "modules/scholar/pages/ScholarTasks.js";
import ScholarPortfolio from "modules/scholar/pages/ScholarPortfolio.js";
import ScholarLeaveApplication from "modules/scholar/pages/ScholarLeaveApplication.js";
//import ScholarRequests from "modules/scholar/pages/ScholarRequests.js";

import ApplicantList from "modules/applications/index.js";
import EndorsementList from "modules/endorsements/index";
import NewApplicant from "modules/applications/new_application/newApplicant";
import SystemAnnouncements from "modules/announcements/index";


export default function Routes() {
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
      
          <Route path="/dashboard" exact component={AnnouncementDashboard} isPrivate/>

          <Route path="/scholar_dashboard" component={ScholarDashboard} isPrivate/>
          {/* <Route path="/scholar_details" component={ScholarDetails} isPrivate/> */}
          <Route path="/scholar_tasks" component={ScholarTasks} isPrivate/>
          {/* <Route path="/scholar_requests" component={ScholarRequests} isPrivate/> */}
          <Route path="/scholar_portfolio" component={ScholarPortfolio} isPrivate/>
          <Route path="/scholar_leave_applications" component={ScholarLeaveApplication} isPrivate/>

          <Route path="/leaves" exact component={Leaves} isPrivate/>
          <Route path="/accounts" exact component={Accounts} isPrivate/>
          <Route path="/settings" exact component={Settings} isPrivate/>
          <Route path="/register" exact component={Register} isPrivate/>
        


          {/* default */}
          <Route component={Login} />

    </Switch>
  );
}
