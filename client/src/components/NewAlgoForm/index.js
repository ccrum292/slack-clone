import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import API from '../../lib/API';
import UserAndAuthContext from '../../context/AuthContext';
import isJsonStr from "../../lib/isJsonStr";

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { MenuItem } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import {UnControlled as CodeMirror} from 'react-codemirror2';
require('../../lib/codemirrorStyles/codemirror.css');
require('../../lib/codemirrorStyles/material.css');
require('codemirror/mode/javascript/javascript.js');


const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    minWidth: "100%"
  },
  formSmall: {
    minWidth: 120
  },
  menuItem: {
    padding: 0
  },
  fullCodeMirror: {
    height: "100%",
  },
  boldRed: {
    color: "red"
  },
  smallCodeMirror: {
    height: 60,
  }
}));


export default function NewAlgoForm ({ setModalOpen, setModalTitle, setExpanded, reRender, setReRender, setLoading }) {
  const classes = useStyles();

  let options = {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
  }

  const { authToken, currentClass } = useContext(UserAndAuthContext);
  const [title, setTitle] = useState(null);
  const [difficulty, setDifficulty] = useState(2);
  const [airDate, setAirDate] = useState(undefined);
  const [airDateBonusModifier, setAirDateBonusModifier] = useState(2);
  const [bonusDuration, setBonusDuration] = useState(45);
  const [directions, setDirections] = useState(null);
  const [starterCode, setStarterCode] = useState("Your Starter Code Here *");
  const [example, setExample] = useState(null);
  const [inputAndOutputArr, setInputAndOutputArr] = useState([]);
  const [input, setInput] = useState("Test Case Input * enter as an array of arguments");
  const [output, setOutput] = useState("Test Case Output * enter exact output");
  const [errorMsg, setErrorMsg] = useState("");

  const handleNewAlgorithmFormSubmit = async e => {
    e.preventDefault();
    console.log("submit");
    setErrorMsg("");

    if (!currentClass.id || !title || !directions || starterCode === "Your Starter Code Here *"
      || !inputAndOutputArr[0] || !airDate || !difficulty) {
        setErrorMsg("Please complete all required fields denoted by the *")
        return
      }

    const classProblemObj = {
      airDate: airDate,
      airDateBonusModifier: airDateBonusModifier,
      airDateBonusLength: bonusDuration
    };

    try{
      setLoading(true);
      const createProblemData = await API.Problems.createProblem(authToken, currentClass.id, title, 
        directions, starterCode, difficulty, [example], inputAndOutputArr, classProblemObj)
      setLoading(false);
      setModalTitle("Algorithm Successfully Created")
      setModalOpen(true);
      setExpanded(false);
      setReRender(!reRender);

      setTitle(null);
      setDifficulty(2);
      setAirDate(undefined);
      setAirDateBonusModifier(2);
      setBonusDuration(45);
      setDirections(null);
      setExample(null);
      setStarterCode("Your Starter Code Here *")
      setInput("Test Case Input * enter as an array of arguments")
      setOutput("Test Case Output * enter exact output")
      setInputAndOutputArr([])

      e.target.reset();

    } catch (err) {
      console.log(err);
    }

  };

  const handleDifficultyChange = e => {
    console.log(e.target.value);
    setDifficulty(e.target.value);
  }

  const checkIfTestIsProperFormat = val => {
    if (!isJsonStr(val)) return false;
    if (Object.prototype.toString.call(JSON.parse(val)) !== '[object Array]') return false;
    return true;
  };

  const handleInputOutputSave = () => {
    if (!checkIfTestIsProperFormat(input)) {
      setErrorMsg("Please enter your input arguments as an array of arguments, thank you.")
      setInput("Test Case Input * enter as an array of arguments");
      setOutput("Test Case Output * enter exact output");  
      return
    }
    
    const val =  {
      input: input,
      output: output
    }
    
    setInputAndOutputArr([...inputAndOutputArr, val])
    setErrorMsg("");
    setInput("Test Case Input * enter as an array of arguments");
    setOutput("Test Case Output * enter exact output");
  };

  const handleInputOutputDelete = e => {
    const newInputOutputArr = inputAndOutputArr.filter(obj => {
      if (obj.input !== e.currentTarget.dataset.input || obj.output !== e.currentTarget.dataset.output) return true;
    })
    setInputAndOutputArr(newInputOutputArr);
  };

  return(
    <form onSubmit={e => handleNewAlgorithmFormSubmit(e)} className={classes.form} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <TextField 
            onChange={e => setTitle(e.target.value)}
            name="createTitle"
            variant="outlined"
            required
            fullWidth
            id="createTitle"
            label="Algo Title"
            autoFocus
            defaultValue={title}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl required variant="outlined" className={classes.formControl}>
            <InputLabel id="difficultyInput">Difficulty</InputLabel>
            <Select
              labelId="difficultyInput"
              id="difficultyOutline"
              value={difficulty}
              defaultValue={difficulty}
              onChange={handleDifficultyChange}
              label="Difficulty"
            >
              <MenuItem value={1}>
                <StarIcon />
                <StarBorderIcon />
                <StarBorderIcon />
                <StarBorderIcon />
                <StarBorderIcon />
              </MenuItem>
              <MenuItem value={2}>
                <StarIcon />
                <StarIcon />
                <StarBorderIcon />
                <StarBorderIcon />
                <StarBorderIcon />
              </MenuItem>
              <MenuItem value={3}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarBorderIcon />
                <StarBorderIcon />
              </MenuItem>
              <MenuItem value={4}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarBorderIcon />
              </MenuItem>
              <MenuItem value={5}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            required
            id="datetime-local"
            label="Air Date"
            type="datetime-local"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => {
              setAirDate(e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="airDateModifier">Air Date Bonus</InputLabel>
            <Select
              labelId="airDateModifier"
              id="airDateModifierBonus"
              value={airDateBonusModifier}
              onChange={e => setAirDateBonusModifier(e.target.value)}
              label="Difficulty"
            >
              <MenuItem value={1}>None</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="bonusDuration">Bonus Duration</InputLabel>
            <Select
              labelId="bunusDuration"
              id="bonusDurationInMinutes"
              value={bonusDuration}
              defaultValue={bonusDuration}
              onChange={e => setBonusDuration(e.target.value)}
              label="bonusDuration"
            >
              <MenuItem value={0}>None</MenuItem>
              <MenuItem value={5}>5 minutes</MenuItem>
              <MenuItem value={10}>10 minutes</MenuItem>
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={20}>20 minutes</MenuItem>
              <MenuItem value={25}>25 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={45}>45 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={120}>2 hours</MenuItem>
              <MenuItem value={180}>3 hours</MenuItem>
              <MenuItem value={1440}>1 day</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={e => setDirections(e.target.value)}
            variant="outlined"
            required
            fullWidth
            id="directions"
            label="Directions"
            name="directions"
            multiline={true}
            rows={5}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CodeMirror
            autoCursor={false}
            className={classes.fullCodeMirror}
            value={starterCode}
            options={options}
            onChange={(editor, data, value) => {
              setStarterCode(value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
              onChange={e => setExample(e.target.value)}
              variant="outlined"
              fullWidth
              id="exampleInputAndOutput"
              label="Displayed Example Input and Output"
              name="exampleInputAndOutput"
              multiline={true}
              rows={3}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <CodeMirror
              autoCursor={false}
              className={classes.smallCodeMirror}
              value={input}
              options={options}
              onChange={(editor, data, value) => {
                setInput(value);
              }}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <CodeMirror
              autoCursor={false}
              className={classes.smallCodeMirror}
              value={output}
              options={options}
              onChange={(editor, data, value) => {
                setOutput(value);
              }}
            />
        </Grid>
        <Grid item container justify="center" alignItems="center"  xs={12} md={2}>
          <Button
          variant="contained"
          color="primary"
          onClick={handleInputOutputSave}
          >
            Add Test Case
          </Button>
        </Grid>
        <Grid item xs={12}>
          <List
          aria-labelledby="test-cases"
          subheader={
            <ListSubheader id="test-cases">
              List of Test Cases
            </ListSubheader>
          }
          >
            <Divider />
            {inputAndOutputArr[0] ? inputAndOutputArr.map((val, i) => (
              <>
                <ListItem key={i}>
                  <ListItemText primary={`Input: ${val.input}`} />
                  <ListItemText primary={`Output: ${val.output}`} />
                  <IconButton data-input={val.input} data-output={val.output} 
                  onClick={handleInputOutputDelete}>
                    <ClearIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </>
            )) :

              <ListItem>
                <ListItemText className={classes.boldRed}  primary="Empty *" />
              </ListItem>
            }
          </List>
        </Grid>
      </Grid>
      <Typography color="secondary" variant="h6">
          {errorMsg}
      </Typography>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Create
      </Button>
      <Grid container justify="flex-end">
        <Grid item>
        </Grid>
      </Grid>
    </form>
  )
}