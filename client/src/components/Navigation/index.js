import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, IconButton, Typography, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import CodeIcon from '@material-ui/icons/Code';
import DoneIcon from '@material-ui/icons/Done';
import UserClass from '../../components/UserClass';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import clsx from 'clsx';
import { useStoreContext } from '../../store/store';
import { LOGOUT, SET_SOCKET, UNSET_USER } from '../../store/actions';
import API from "../../lib/API";

import { Link, Redirect } from 'react-router-dom'
import { useState } from 'react';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: '#fff',
    textDecoration: 'none'
  }, 
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    height: "100vh",
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const [state, dispatch] = useStoreContext();
  const { user, socket } = state;
  const [navOpen, setNavOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const handleLogout = async e => {
    e.preventDefault();
    console.log(socket);
    dispatch({ type: LOGOUT })
    // socket.disconnect();
    console.log(socket);

    try {
      const logoutData = await API.Users.logout();
      dispatch({ type: UNSET_USER })
      setRedirect(true);
    } catch (err) {
      console.log(err);
      setRedirect(true);
    }
  }

  return(
    <div>
      <AppBar className={clsx(classes.appBar, navOpen && classes.appBarShift)} position="absolute">
        <Toolbar className={classes.toolbar}>
          <IconButton 
            onClick={() => setNavOpen(true)} 
            className={clsx(classes.menuButton, navOpen && classes.menuButtonHidden)} 
            edge="start"  color="inherit" aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" >
            <Link className={classes.link} to="/">
              Chat_App
            </Link>
          </Typography>
          { !user ? 
          <>
            <Button to="/login" component={Link} color="inherit">
                Login
            </Button>
            <Button to="/register" component={Link} color="inherit">
                Register
            </Button>
          </>
          :
          <Typography  variant="h6" >
            {user.email}
          </Typography>
          }
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !navOpen && classes.drawerPaperClose),
        }}
        open={navOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={() => setNavOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        {
          user ? 
          <>
            <Divider />
            <List>
              <ListItem button to="/" component={Link}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              {/* <ListItem button to="/leaderboard" component={Link}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Leader Board" />
              </ListItem>
              <ListItem button to="/completed" component={Link}>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="Completed Algos" />
              </ListItem> */}
              {/* {!currentClass ? null : currentClass.ClassUser.admin ? 
              <>
              <ListItem button to="/members" component={Link}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Members" />
              </ListItem>
              <ListItem button to="/adminalgo" component={Link}>
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText primary="Algorithms" />
              </ListItem>
              </> :
              null
            } */}
            </List>
            <Divider />
            <List>
              {/* <ListItem button to="/createclass" component={Link}>
                <ListItemIcon>
                  <CreateNewFolderIcon />
                </ListItemIcon>
                <ListItemText primary="Create Class" />
              </ListItem> */}
              <ListItem button onClick={e => handleLogout(e)}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </>
          : null
        }
      </Drawer>
      {redirect ? <Redirect to={{
        pathname: "/"
      }} /> : null}
    </div>
  );
}