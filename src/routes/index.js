import React, { useState } from "react";
import { Switch } from "react-router-dom";
import Route from "./route";
import Dashboard from "modules/dashboard/index";
import Login from "modules/auth/login";
// import EndorsedApplicant from "modules/applications/EndorsedApplicant";
// import AdminApplicantList from "modules/applications/AdminApplicantList";
// import AccountList from "modules/accounts/index";
// import AdminLeaveRequest from "modules/applications/AdminLeaveRequests";
// import AdminViewScholar from "modules/applications/AdminViewScholar.js";
// import { ScholarList, ViewScholar } from "modules/scholar";

import Leaves from "modules/leaves/index.js";
import Accounts from "modules/accounts/index.js";
import Settings from "modules/settings/index.js";
import Register from "modules/auth/register.js";

import ApplicantList from "modules/applications/index";
import NewApplicant from "modules/applications/newApplicant";
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
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        exact
        component={(props) => <Login {...props} onLogin={handleLogin} />}
      />
       {/* Protected */}
      <Route path="/dashboard" 
			exact 
			component={isLoggedIn ? Dashboard: () => <Redirect to="/"/>}
			/>
      {/* <Route path="/dashboard" exact component={Dashboard} /> */}
      {/* Applicant Management */}
      <Route path="/applications" exact component={ApplicantList}/>
      <Route path="/new_application" exact component={NewApplicant}/>
      
      {/* Endorsement Management */}


      
      {/* <Route path="/endorsed_applicant" exact component={EndorsedApplicant} />
      <Route path="/admin_applicantlist" exact component={AdminApplicantList} />
      <Route path="/account_list" exact component={AccountList} />
      <Route path="/admin_leaverequest" exact component={AdminLeaveRequest} />
      <Route path="/admin_viewscholar" exact component={AdminViewScholar} />
      <Route path="/scholars" exact component={ScholarList} />
      <Route path="/scholars/:scholarId" component={ViewScholar} />
      <Route path="/applicants" exact component={ApplicantList} />
      <Route path="/applicants/add" exact component={AddApplicant} />
      <Route path="/applicants/:applicantId" component={ViewApplicant} />
      <Route path="/announcements" exact component={SystemAnnouncements} /> */}
      {/* Replacements */}
      <Route path="/leaves" exact component={Leaves} />
      <Route path="/accounts" exact component={Accounts} />
      <Route path="/settings" exact component={Settings} />
      <Route path="/register" exact component={Register} />
    </Switch>
  );
}
