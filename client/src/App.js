import React, {useEffect} from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect,useHistory } from 'react-router-dom'
import {fetchUser} from "./redux/actions/login";

import {useDispatch, useSelector} from "react-redux";
import Welcome from './pages/Welcome';
import LoginPage from './pages/LoginPage';

function App() {
  const login = useSelector( u => u.login);
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(fetchUser())
  },[])

  console.log("login",login.isAuthenticated)
  return (
    <>
    <Router>
    {login.isAuthenticated ?
            <Switch>
              <Redirect exact from="/" to="/app"/>
              <Redirect exact from="/login" to="/app"/>
              <Route path="/app" component={Welcome}/>
            </Switch>  :
            <Switch>
              <Redirect exact from="/" to="/login"/>
              <Route path="/login"  component={LoginPage}/>            
              <Route render={() => <Redirect to="/" />} />
            </Switch>
  }
    </Router>
    </>
  );
}

export default App;

