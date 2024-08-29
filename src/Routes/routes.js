import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../Pages/Dashboard";

// Import Utility Pages
import StarterPage from "../Pages/Utility/Starter-Page";
import Maintenance from "../Pages/Utility/Maintenance-Page";
import ComingSoon from "../Pages/Utility/ComingSoon-Page";
import TimeLine from "../Pages/Utility/TimeLine-Page";
import FAQs from "../Pages/Utility/FAQs-Page";
import Pricing from "../Pages/Utility/Pricing-Page";
import Error404 from "../Pages/Utility/Error404-Page";
import Error500 from "../Pages/Utility/Error500-Page";

// Import Tables
import BasicTable from "../Pages/Tables/BasicTable.js";
import ListJs from "../Pages/Tables/ListTables/ListTables";
import DataTable from "../Pages/Tables/DataTables/DataTables";

import AddEditVehicle from "../Pages/Menu/Vehicles/AddEditVehicle.js";
import VehicleListing from "../Pages/Menu/Vehicles/VehicleListing.js";
import LogsListings from "../Pages/Menu/Logs/LogsListings.js";
import AddEditLogs from "../Pages/Menu/Logs/AddEditLogs.js";
import CameraListing from "../Pages/Menu/Camera/CameraListing.js";
import AddEditCamera from "../Pages/Menu/Camera/AddEditCamera.js";
import Signin from "../Pages/Authentication/Signin.js";
import Logout from "../Pages/Authentication/Logout.js";
import Signup from "../Pages/Authentication/Signup.js";
const authProtectedRoutes = [
  //dashboard
  { path: "/dashboard", component: <Dashboard /> },

  // Products
  { path: "/vehicles", component: <VehicleListing /> },
  { path: "/add-vehicle", component: <AddEditVehicle /> },
  { path: "/edit-vehicle/:id", component: <AddEditVehicle /> },

  // Logs
  { path: "/logs", component: <LogsListings /> },
  { path: "/add-log", component: <AddEditLogs /> },
  { path: "/edit-log/:id", component: <AddEditLogs /> },

  // Camera
  { path: "/cameras", component: <CameraListing /> },
  { path: "/add-camera", component: <AddEditCamera /> },
  { path: "/edit-camera/:id", component: <AddEditCamera /> },

  // Profile
  // { path: "/userprofile", component: <UserProfile /> },

  // Utility Pages
  { path: "/pages-starter", component: <StarterPage /> },
  { path: "/pages-timeline", component: <TimeLine /> },
  { path: "/pages-faqs", component: <FAQs /> },
  { path: "/pages-pricing", component: <Pricing /> },

  // Tables pages
  { path: "/tables-basic", component: <BasicTable /> },
  { path: "/tables-listjs", component: <ListJs /> },
  { path: "/table-datatables", component: <DataTable /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/sign-in", component: <Signin /> },
  { path: "/sign-up", component: <Signup /> },

  // Utility Pages
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },
  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-comingsoon", component: <ComingSoon /> },
];

export { authProtectedRoutes, publicRoutes };
