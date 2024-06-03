import React, { useState } from "react";
import { Switch } from "react-router-dom";
import Route from "./route";
import Login from "modules/auth/login";
import Register from "modules/auth/register.js";

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
      
          {/* default */}
          <Route component={Login} />

    </Switch>
  );
}
