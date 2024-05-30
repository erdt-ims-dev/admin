import React, { useState } from "react";
import { Switch } from "react-router-dom";
import Route from "./route";
import AnnouncementDashboard from "modules/dashboard/AnnouncementDashboard";
import Login from "modules/auth/login";
import AdminLeaveRequest from "modules/applications/index";
import { ScholarList, ScholarDetails, ViewScholar, ScholarPortfolio, ScholarLeaveApplication, ScholarTasks, ScholarRequests } from "modules/scholar";
import ScholarDashboard  from "modules/scholardashboard/index.js";
import Leaves from "modules/leaves/index.js";
import Accounts from "modules/accounts/index.js";
import Settings from "modules/settings/index.js";
import Register from "modules/auth/register.js";

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

          <Route path="/endorsements" exact component={EndorsementList} isPrivate/>
          <Route path="/applications" exact component={ApplicantList} isPrivate/>
          <Route path="/new_application" exact component={NewApplicant} isPrivate/>


          <Route path="/scholar_dashboard" component={ScholarDashboard} isPrivate/>
          <Route path="/announcements" component={SystemAnnouncements} isPrivate/> 

          <Route path="/leaves" exact component={Leaves} isPrivate/>
          <Route path="/settings" exact component={Settings} isPrivate/>
          <Route path="/register" exact component={Register} isPrivate/>
        


          {/* default */}
          <Route component={Login} />

    </Switch>
  );
}
