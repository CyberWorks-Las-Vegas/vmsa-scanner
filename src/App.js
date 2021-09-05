//DEPS
import React from "react";
import { Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader";
// COMPONENTS
// import SignInSide from './Components/Pages/Home/MLogin/SignIn';
// import ButtonAppBar from './Components/Pages/Home/MLogin/AppBar';
// import FormContainer from './Components/Pages/Dashboard/MForm/FormContainer';
// import AppLogin from "./Components/Pages/Home/AppLogin/AppLogin";

// import MDashboard from "./Components/Pages/Dashboard/MDashboard/Main";
// import FDDashboard from "./Components/Pages/Dashboard/MDashboard/MainRestricted";
// import VSDashboard from "./Components/Pages/Dashboard/VisitorStation/VisitorStation";

// import PrivateFormRoute from "./Components/Routes/PrivateFormRoute";
// import PrivateAdminRoute from "./Components/Routes/PrivateAdminRoute";
// import PrivateDashboardRoute from "./Components/Routes/PrivateDashboardRoute";
// import PrivateFDDashboardRoute from "./Components/Routes/PrivateFDDasboardRoute";
// import PrivateVSDashboardRoute from "./Components/Routes/PrivateVSDashboardRoute";

// import Error from "./Components/Pages/Error/Error";

import VS from "./Components/VisitorStation/VisitorStation"
// Styles
import Container from '@material-ui/core/Container';

const App = () => {
  return (
    <>
      <Container maxWidth="xl">
        {/* <ButtonAppBar /> */}

        <Switch>
          <Route exact path="/" component={VS} />
          {/* <PrivateAdminRoute path="/applogin" component={AppLogin} />
          <PrivateFormRoute path="/form" component={FormContainer} />
          <PrivateDashboardRoute path="/dashboard/administrator" component={MDashboard} />
          <PrivateFDDashboardRoute path="/dashboard/front_desk" component={FDDashboard} />
          <PrivateVSDashboardRoute path="/dashboard/visitor_station" component={VSDashboard} />
          <Route path="*" component={Error} /> */}
        </Switch>
      </Container>
    </>
  );
};

// helps perserve state on each reload in dev
export default App;
