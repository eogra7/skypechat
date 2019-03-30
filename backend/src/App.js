import React from 'react';
import MainLayout from './views/MainLayout';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import chatStore from './js/store';
import Login from './views/Login';
import { view } from 'react-easy-state';
import api from './js/api';
import Assign from './views/Assign';
class LoginRoute extends React.Component {
  render() {
    if (!chatStore.isLoggedIn) {
      return <Redirect to="/login"></Redirect>
    } else {
      return <Route path={this.props.path} component={this.props.component} />
    }
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { store: chatStore };
  }
  componentDidMount() {
    api.get('/api/is-admin').then(async (r) => {
      if (r.ok) {
        const result = await r.json();
        chatStore.isLoggedIn = true;
        chatStore.isAdmin = result.admin;
      } else {
        chatStore.isLoggedIn = false;
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state === nextState) {
      console.log('App: Ignored an update');
      return false;
    }
    console.log('App: Updated component');
    return true;
  }

  render() {
    const RedirectToChats = () => {
      return (<Redirect to={{ pathname: '/chats' }} />);
    }
    return (
      <Router>
        <Switch>
          <Route path="/index.html" component={RedirectToChats} />
          <Route path="/login" component={Login} />
          <Route path="/" exact component={RedirectToChats} />
          <LoginRoute path="/chats" component={MainLayout} />
          <LoginRoute path="/users" component={MainLayout} />
          <LoginRoute path="/settings" component={MainLayout} />
          <LoginRoute path="/assign" component={Assign} />
        </Switch>
      </Router>
    );
  }
}


export default view(App);