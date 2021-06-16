import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Link } from 'react-router-dom'
import API from '../../lib/API';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  subHeading: {
    margin: theme.spacing(2),
    textAlign: "center"

  },
  appBarSpacer: theme.mixins.toolbar,

}));

export default function Register() {
  const classes = useStyles();
  const history = useHistory();

  const [redirect, setRedirect] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = emailAddress => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailAddress).toLowerCase());
}

  const checkPassword = () => {
    if(password !== secondPassword) {
      setUserMessage(`Passwords must match.`)
      return false;
    };
    if(password.length > 25 || password.length < 8) {
      setUserMessage(`Passwords must be between 8 and 25 characters long.`)
      return false;
    }
    if(!validateEmail(email)){
      setUserMessage(`Improper Email Address.`)
      return false;
    }
    setUserMessage("");
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault()
    if (!checkPassword()) return
    let name = `${firstName.trim()} ${lastName.trim()}`;
    setLoading(true);
    const res = await API.Users.create(name, email, password);
    setLoading(false);
    if(res.data.errors){
      setUserMessage("An account has already been created with the following email address: " + email);
      return
    }

    setRedirect(true);

    
    return
  }


  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.appBarSpacer}></div>
      {loading ? <LinearProgress color="secondary" /> : null}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Typography color="secondary" className={classes.subHeading} variant="h6">
          {userMessage}
        </Typography>
        <form onSubmit={e => handleSubmit(e)} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
                onChange={e => setFirstName(e.target.value)}
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={e => setLastName(e.target.value)}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={e => setEmail(e.target.value)}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={e => setPassword(e.target.value)}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={e => setSecondPassword(e.target.value)}
                variant="outlined"
                required
                fullWidth
                name="re-enter-password"
                label="Re-enter Password"
                type="password"
                id="re-enter-password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {redirect ? <Redirect to={{
        pathname: "/login",
        state: { registration: true }
      }} /> : null}
    </Container>
  );
}