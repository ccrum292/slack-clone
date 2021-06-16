import { LOADING, SET_USER, UNSET_USER } from '../../store/actions';
import { useStoreContext } from '../../store/store';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { format } from "date-fns";
import UserAndAuthContext from "../../context/AuthContext";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';

import DashboardList from "../../components/DashboardList";
import SmallLeaderBoard from "../../components/SmallLeaderBoardTable";
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
    height: 230,
  },
  tableDiv: {
    height: "100%"
  },
  secondSmallPaper: {
    marginLeft: theme.spacing(2)
  },
  heading1: {
    textAlign: "center"
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeight, classes.secondSmallPaper);
  const tableDivPaper = clsx(classes.paper, classes.tableDiv);

  const [state, dispatch] = useStoreContext();
  const { user, loading } = state;

  const greeting = () => {
    const time = format(new Date(), "H");
    if (time < 4 || time >= 18) return `Good Evening ${user.name}`;
    if (time >= 4 && time < 12) return `Good Morning ${user.name}`;
    if (time >= 12 && time < 18) return `Good Afternoon ${user.name}`;
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.container}>
      {/* <div className={classes.appBarSpacer}></div>
      {loading ? <LinearProgress color="secondary" /> : null}
      {currentClass ?
        <Grid container spacing={3}>
          <Grid item container direction="row" xs={12} spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className={fixedHeightPaper}>
                <Typography className={classes.heading1} component="h1" variant="h5">
                  {greeting()}
                </Typography>
                <Typography className={classes.heading1} component="h1" variant="h6">
                  you have ...
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={5}>
                    <Typography className={classes.heading1} component="h1" variant="h2">
                      {currentClass ? currentClass.ClassUser.algorithmsCompleted : 0}
                    </Typography>
                    <Typography className={classes.heading1} component="h1" variant="h6">
                      Algorithms Complete
                    </Typography>
                  </Grid>
                  <Grid item container justify="center" alignItems="center" xs={12} md={2}>
                    <Typography className={classes.heading1} component="h1" variant="h4">
                      {"&"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography className={classes.heading1} component="h1" variant="h2">
                      {currentClass ? currentClass.ClassUser.score : 0}
                    </Typography>
                    <Typography className={classes.heading1} component="h1" variant="h6">
                      Points
                        </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <SmallLeaderBoard setLoading={setLoading} />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <DashboardList setLoading={setLoading} />
          </Grid>
        </Grid> :
        <NoClass />

      } */}
    </Container>
  );
}