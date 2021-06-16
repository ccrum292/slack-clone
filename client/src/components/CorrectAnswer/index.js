import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { UnControlled as CodeMirror } from 'react-codemirror2';
require('../../lib/codemirrorStyles/codemirror.css');
require('../../lib/codemirrorStyles/material.css');
require('codemirror/mode/javascript/javascript.js');

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  container: {
    flexGrow: 1,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  outerGrid: {
    height: 600
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 480,
  },
  fixedHeightConsole: {
    height: 360,
  },
  grow: {
    flexGrow: 1,
  },
  secondSmallPaper: {
    marginTop: theme.spacing(2),
  },
  fullCodeMirror: {
    height: "100%"
  },
  mb1: {
    marginBottom: theme.spacing(1)
  }
}));

let options = {
  mode: 'javascript',
  theme: 'material',
  lineNumbers: true,
}

export default function CorrectAnswer ({name, codeMirrorValue}) {

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);


  return(
    <Paper className={classes.paper}>
      <Grid container spacing={1} direction="column">
        <Grid item>
          <Typography>
            Written by {name}
          </Typography>
        </Grid>
        <Grid item>
          <CodeMirror
            autoCursor={false}
            className={classes.fullCodeMirror}
            value={codeMirrorValue}
            options={options}
          />        
        </Grid>
      </Grid>
    </Paper>
  )
}