import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Loadable from 'react-loadable';
import axios from "axios";
import PrivateRoute from './privateRoute'
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import './App.scss';
import appConfig from "./config";

const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"/></div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});
const Login = Loadable({
  loader: () => import('./views/Login'),
  loading
});
const SignUp = Loadable({
  loader: () => import('./views/SignUp'),
  loading
});

class App extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount = () => {
    this.checkAuth();
  }

  checkAuth = () => {
    if(localStorage.getItem('token')){
      axios.get('http://localhost:8000/auth/checkauth' , {
        headers: {
          Authorization: appConfig.token
        }
      })
        .then(res => {
         console.log("sign in")
        })
        .catch(error => {
          localStorage.setItem('token',"");
          window.location.href= "/login"
        })
    }
  };

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" name="Login" component={Login} {...this.props}/>
          <Route path="/signup" component={SignUp} {...this.props}/>
          <PrivateRoute path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
