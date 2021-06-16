import { useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import MemberStatusMenu from "../../components/MemberStatusMenu";

import API from '../../lib/API';
import UserAndAuthContext from "../../context/AuthContext";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  tableCell: {
    fontSize: 16
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
  }
}));


export default function AdminStudentTable({ setLoading, reRender, setReRender }) {
  const classes = useStyles();

  const { authToken, currentClass } = useContext(UserAndAuthContext);
  const [students, setStudents] = useState([]);
  const [modalText, setModalText] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [completeAction, setCompleteAction] = useState(false);

  const getStudentData = async () => {
    try {
      setLoading(true);
      const studentData = await API.Classes.getAllUsersForClass(authToken, currentClass.id);
      setStudents(studentData.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    getStudentData();
  }, [reRender, currentClass]);


  // const handleStudentDelete = async (e) => {
  //   setSubmitMessage("");
  //   try {
  //     const deleteData = await API.Classes.removeStudentFromClass(authToken, currentClass.id, deletionId)
  //     setSubmitMessage("Removal Complete");
  //     setTimeout(() => {
  //       setModalOpen(false);
  //     }, 1000)
  //     setReRender(!reRender)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const typeOfMember = (admin, owner) => {
    if (!admin) return "Student";
    if (admin && !owner) return "Admin";
    else return "Owner Admin";
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>#</TableCell>
            <TableCell className={classes.tableCell} align="left">Name</TableCell>
            <TableCell className={classes.tableCell} align="right">Email</TableCell>
            <TableCell className={classes.tableCell} align="right">Algorithms Completed</TableCell>
            <TableCell className={classes.tableCell} align="right">Score</TableCell>
            <TableCell className={classes.tableCell} align="right">Member Status</TableCell>
            <TableCell className={classes.tableCell} align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(({id, name, email, score, algorithmsCompleted, admin, owner}, i) => (
            <TableRow key={id}>
              <TableCell className={classes.tableCell}>{i + 1}</TableCell>
              <TableCell className={classes.tableCell} align="left">
                {name}
              </TableCell>
              <TableCell className={classes.tableCell} align="right">{email}</TableCell>
              <TableCell className={classes.tableCell} align="right">{algorithmsCompleted}</TableCell>
              <TableCell className={classes.tableCell} align="right">{score}</TableCell>
              <TableCell className={classes.tableCell} align="right">{typeOfMember(admin, owner)}</TableCell>
              <TableCell className={classes.tableCell} align="right">
                <MemberStatusMenu admin={admin} owner={owner}  
                  memberId={id} reRender={reRender} setReRender={setReRender}
                  setLoading={setLoading} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}