import { useState, useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import UserAndAuthContext from "../../context/AuthContext";

import LargeLeaderBoard from "../../components/LargeLeaderbaordTable";
import NoClass from "../../components/NoClass";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  container: {
    flexGrow: 1,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    flexGrow: 1
  },
  fixedHeight: {
    height: 240,
  },
  tableDiv: {
    height: "100%"
  },
  secondSmallPaper: {
    marginTop: theme.spacing(2),
  }
}));

export default function LeaderBoard() {
  const classes = useStyles();

  const { currentClass } = useContext(UserAndAuthContext);
  const [loading, setLoading] = useState(false)

  return (
        <Container component="main" maxWidth="lg" className={classes.container}>
          <div className={classes.appBarSpacer}></div>
          {loading ? <LinearProgress color="secondary" /> : null}
          {currentClass ? 
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={12}>
                <LargeLeaderBoard setLoading={setLoading} />
              </Grid>
            </Grid> :
            <NoClass />
          }
        </Container>
  );
}