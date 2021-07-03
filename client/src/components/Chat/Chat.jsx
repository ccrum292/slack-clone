import React, { useEffect, useRef, useState } from 'react';
import { useStoreContext } from '../../store/store';
import { LOADING, SET_USER } from '../../store/actions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import API from '../../lib/API';
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client';

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
    marginTop: theme.spacing(1),
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


export default function Chat() {
  const classes = useStyles();
  const socket = useRef();
  const [state, dispatch] = useStoreContext();
  const [msgInput, setMsgInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState("60df6a70c3ad5c38a4bb812a-60d3927f90a0510790ccf8eb");
  const [chatState, setChatState] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault()
    if (!currentRoom || msgInput.length < 1) return;

    const msgObj = {
      userId: state.user._id,
      name: state.user.name,
      msg: msgInput
    }
    console.log("emit msg", currentRoom, msgObj);
    socket.current.emit("clientMsg", currentRoom, msgObj, (obj) => {
      console.log(obj);
    })
  }

  const getChats = async () => {
    const chatData = await API.Chats.getAll(state.user._id);
    console.log("chat data", chatData); 
    setChatState(chatData.data);
  }

  
  useEffect(() => {
    console.log("chat.js useEffect")
    getChats()
    socket.current = io();
    socket.current.on("connection", () => {
      console.log("user connected");
    });
    socket.current.on("disconnect", () => {
      console.log("user disconnected");
    });
    socket.current.on("serverMsg", (msgObj) => {
      console.log(msgObj);
    });
  }, []);
  
  useEffect(() => {
    if (!chatState) return;
    const socketRoomNamesArr = chatState.map(val => val.socketRoomName);

    socket.current.emit("joinManyRooms", socketRoomNamesArr, obj => {
      console.log(obj);
    })
  }, [chatState]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.appBarSpacer}></div>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ChatIcon />
        </Avatar>
        {/* <Typography component="h1" variant="h5">
          Chat
        </Typography> */}
        <form onSubmit={e => handleSubmit(e)} className={classes.form} noValidate>
          <TextField
            onChange={e => setMsgInput(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="chat"
            label=""
            name="chat"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Enter
          </Button>
        </form>
      </div>
    </Container>
  );
}