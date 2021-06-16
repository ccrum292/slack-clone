import React, { useEffect,} from 'react';
import './App.css';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import API from "../../lib/API";

import Navigation from "../../components/Navigation";
import Register from "../../pages/Register";
import Login from "../../pages/Login";
import Welcome from "../../pages/Welcome";
import Dashboard from "../../pages/Dashboard";
// import Leaderboard from "../../pages/LeaderBoard";
// import Algo from "../../pages/Algo";
// import Members from "../../pages/Members";
// import AdminAlgo from "../../pages/AdminAlgo";
// import CreateClass from "../../pages/CreateClass";
// import Completed from "../../pages/Completed";
import { LOADING, SET_USER, UNSET_USER } from '../../store/actions';
import { useStoreContext } from '../../store/store';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}))

function App(props) {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const { user } = state;

  const history = useHistory();

  const setUserOnPageLoad = async () => {
    try {
      const userData = await API.Users.getMe();

      if (userData.data.user) {
        dispatch({type: SET_USER, user: userData.data.user });
        history.push('/');
        return 
      }

      dispatch({ type: UNSET_USER });
      history.push('/login');

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    try {
      dispatch({ type: LOADING });
      setUserOnPageLoad();
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, history]);

  return (
      <div className={classes.root}>
        <Navigation></Navigation>
        <Switch>
          <Route exact path="/">
            {user ? <Dashboard></Dashboard> : <Welcome></Welcome>}
          </Route>
          <Route  exact path="/register">
            <Register></Register>
          </Route>
          <Route exact path="/login">
            <Login ></Login>
          </Route>
          {/* <Route exact path="/leaderboard">
            {user ? <Leaderboard></Leaderboard> : <Login></Login>}
          </Route>
          <Route exact path="/createclass">
            {user ? <CreateClass></CreateClass> : <Login></Login>}
          </Route>
          <Route exact path="/completed">
            {user ? <Completed></Completed> : <Login></Login>}
          </Route> */}
          {/* <Route exact path="/members">
            {!currentClass ? <Login></Login> : currentClass.ClassUser.admin ? <Members></Members> : <Login></Login>}
          </Route>
          <Route exact path="/adminalgo">
            {!currentClass ? <Login></Login> : currentClass.ClassUser.admin ? <AdminAlgo></AdminAlgo> : <Login></Login>}
          </Route>
          <Route path="/algo/:id">
            {user ? <Algo></Algo> : <Login></Login>}
          </Route> */}
          <Route>
            <Redirect to={{
              pathname: "/"
            }} />
          </Route>
        </Switch>
      </div>
  );
}

export default App;
