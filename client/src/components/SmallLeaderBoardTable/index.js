import { useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import API from '../../lib/API';
import UserAndAuthContext from "../../context/AuthContext";

const useStyles = makeStyles(theme => ({
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  tableCell: {
    fontSize: 18
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  submitMessage: {
    textAlign: "center"
  },
  gold: {
    backgroundColor: "#FFD700"
  },
  silver: {
    backgroundColor: "silver"
  },
  bronze: {
    backgroundColor: "#CD7F32"
  },
  none: {

  },
  fixedHeight: {
    height: 230,
  },
}));


export default function LargeLeaderBoardTable({ setLoading }) {
  const classes = useStyles();

  const { authToken, currentClass } = useContext(UserAndAuthContext);
  const [students, setStudents] = useState([]);

  

  const getStudentData = async () => {
    try {
      setLoading(true);
      const studentData = await API.Classes.getAllUsersForClass(authToken, currentClass.id);
      const sortForScoreAndFilterOutAdmin = studentData.data.filter(student => !student.admin)
        .sort((a, b) => {
          let comparison = 0;
    
          if (a.score > b.score) {
            comparison = -1;
          } else if (a.score < b.score) {
            comparison = 1;
          }
          return comparison;
        });

      setStudents(sortForScoreAndFilterOutAdmin);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }


  useEffect(() => {
    getStudentData();
  }, [currentClass]);


  const goldSilverBronzeRow = i => {
    const rank = i + 1;
    if(rank === 1) return classes.gold;
    if(rank === 2) return classes.silver;
    if(rank === 3) return classes.bronze;
    return classes.none;
  }


  return (
    <TableContainer className={classes.fixedHeight} component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>#</TableCell>
            <TableCell className={classes.tableCell} align="left">Name</TableCell>
            <TableCell className={classes.tableCell} align="right">Algorithms Completed</TableCell>
            <TableCell className={classes.tableCell} align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(({id, name, score, algorithmsCompleted}, i) => (
            <TableRow className={goldSilverBronzeRow(i)} key={id}>
              <TableCell className={classes.tableCell}>{i + 1}</TableCell>
              <TableCell className={classes.tableCell} align="left">
                {name}
              </TableCell>
              <TableCell className={classes.tableCell} align="right">{algorithmsCompleted}</TableCell>
              <TableCell className={classes.tableCell} align="right">{score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}