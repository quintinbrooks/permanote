import React, { useState } from "react";
import Header from "../Header";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  Link,
  AccordionDetails,
  DialogContentText,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Button,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Lock from "@material-ui/icons/Lock";
import { useHistory } from "react-router-dom";
import Arweave from "arweave";
import { makeStyles } from "@material-ui/core/styles";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import Alert from "@material-ui/lab/Alert";
import "react-mde/lib/styles/css/react-mde-all.css";
const arweave = Arweave.init();

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function Account() {
  let history = useHistory();
  const [value, setValue] = React.useState("**Hello, world!**");
  const [selectedTab, setSelectedTab] = useState("write");
  var wallet_file = JSON.parse(sessionStorage.getItem("arweaveWallet"));
  var wallet_address = sessionStorage.getItem("wallet_address");
  const [balance, setBalance] = useState();
  const [password, setPassword] = useState();
  const [myNotes, setNotes] = useState([]);
  const [noteTXID, setNoteTXID] = useState();
  const [currentTXID, setCurrentTXID] = useState();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  if (sessionStorage.getItem("first_visit")) {
    //pass
  } else {
    sessionStorage.setItem("first_visit", "true");
    history.go(0);
  }

  const classes = useStyles();
  arweave.wallets.getBalance(wallet_address).then((balance) => {
    let ar = arweave.ar.winstonToAr(balance);
    setBalance(ar);
  });

  async function saveNote() {
    try {
      var utc = new Date().toISOString();
      var CryptoJS = require("crypto-js");
      var encrypted_note = CryptoJS.AES.encrypt(value, password).toString();

      let transaction = await arweave.createTransaction(
        {
          data: Buffer.from(encrypted_note, "utf8"),
        },
        wallet_file
      );
      transaction.addTag("App", "permanote");
      transaction.addTag("Date", utc);
      await arweave.transactions.sign(transaction, wallet_file);
      await arweave.transactions.post(transaction);
      setCurrentTXID(transaction.id);
      setOpen(true);
    } catch (err) {
      alert(err);
    }
  }

  async function reloadNotes() {
    const allNotes = await arweave.arql({
      op: "and",
      expr1: {
        op: "equals",
        expr1: "from",
        expr2: wallet_address,
      },
      expr2: {
        op: "equals",
        expr1: "App",
        expr2: "permanote",
      },
    });
    setNotes(allNotes);
  }

  reloadNotes();

  const notesList = myNotes.map((txid) => (
    <ListItem onClick={() => setNoteTXID(txid)}>
      <Link>{txid}</Link>
    </ListItem>
  ));

  if (noteTXID) {
    sessionStorage.setItem("noteTXID", noteTXID);
    history.push("/note");
  } else {
    //pass
  }

  return (
    <>
      <Header />
      <br />
      <Container>
        <Typography variant="h4">Welcome to permanote</Typography>
        <br />
        <br />
        <Grid container spacing={1}>
          <Grid item sm={12} lg={8}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>My Notes</Typography>
                <Typography className={classes.secondaryHeading}>
                  View current notes
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Click on the note TXID that you want to see.{" "}
                  <Link onClick={reloadNotes}>Reload</Link>
                  <br />
                  <List>{notesList}</List>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>New note</Typography>
                <Typography className={classes.secondaryHeading}>
                  Create a new note
                </Typography>
              </AccordionSummary>
              <div className="container">
                <ReactMde
                  value={value}
                  onChange={setValue}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                  }
                />
              </div>
              <br />
              <br />
              <Grid container spacing={1}>
                <Grid item lg={2} />
                <Grid item lg={8}>
                  <Alert severity="info">
                    Password will be used to encrypt the note.
                  </Alert>
                  <br />
                  <TextField
                    variant="outlined"
                    type="password"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                  <br />
                  <br />
                  <Button variant="outlined" color="primary" onClick={saveNote}>
                    Create note
                  </Button>
                </Grid>
                <Grid item lg={2} />
              </Grid>
              <br />
              <br />
              <br />
            </Accordion>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Wallet details</Typography>
                <br />
                <Divider />
                <br />
                <Typography>
                  <b>Wallet address</b>{" "}
                  {sessionStorage.getItem("wallet_address")}
                </Typography>
                <br />
                <Typography>
                  <b>Wallet balance</b> {balance}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Note submitted"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              For preserving your privacy, notes are not named. Please try to
              remember first characters of your TXID. TXID's are listed in order
              at "My Notes".
              <br />
              <b>{currentTXID}</b>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
