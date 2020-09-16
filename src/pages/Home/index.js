import React, { useState } from "react";
import Header from "../Header";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Link,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useHistory } from "react-router-dom";
import Arweave from "arweave";
const arweave = Arweave.init();

export default function Home() {
  let history = useHistory();

  const [open, setOpen] = useState(false);
  let fileReader;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileRead = (e) => {
    const content = fileReader.result;
    try {
      var wallet_file = JSON.parse(content);
      arweave.wallets.jwkToAddress(wallet_file).then((address) => {
        sessionStorage.setItem("wallet_address", address);
      });
      sessionStorage.setItem("arweaveWallet", content);
      history.push("/account");
    } catch (err) {
      alert("Bad wallet file", alert);
    }
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <>
      <Header />
      <br />
      <Container>
        <Typography variant="h4">Encrypted notes that lasts forever</Typography>
        <Typography variant="h5">Your encrypted online diary.</Typography>
        <br />
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Login with Arweave
        </Button>
        <br />
        <br />
        <Grid container spacing={1}>
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Secure</Typography>
                <Typography>
                  Your notes are encrypted and only visible to you, with
                  RSA-OAEP.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Markdown-supported</Typography>
                <Typography>
                  Use Markdown while writing your notes, markdown is supported.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Permaweb</Typography>
                <Typography>
                  Magic happens on the client-side, encryption and saving notes
                  forever.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Login with Arweave"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Arweave wallet is required to login this application. Please see{" "}
            <Link href="https://arweave.org">Arweave</Link> for getting a
            wallet.
          </DialogContentText>

          <input
            style={{ display: "none" }}
            id="raised-button-file"
            onChange={(e) => handleFileChosen(e.target.files[0])}
            type="file"
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="contained"
              color="default"
              startIcon={<CloudUploadIcon />}
              component="span"
            >
              Upload
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
