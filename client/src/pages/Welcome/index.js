import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CodeIcon from '@material-ui/icons/Code';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Link } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
  subHeading: {
    margin: theme.spacing(2),
    textAlign: "center"

  },
  appBarSpacer: theme.mixins.toolbar,
  headingLg: {
    textAlign: "center"
  }


}));

export default function Login() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.appBarSpacer}></div>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CodeIcon />
        </Avatar>
        <Typography className={classes.headingLg} component="h1" variant="h3">
          Welcome to Algo_Champ
        </Typography>
        <Typography className={classes.subHeading} variant="h5">
          Please Login or Register to Compete in our coding challenges
        </Typography>
        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
          <Grid item>
            <Button to="/login" component={Link} size="large"  variant="contained" color="primary">
              Login
            </Button>
          </Grid>
          <Grid item>
            <Button to="/register" component={Link} size="large" variant="contained" color="primary">
                Register
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}