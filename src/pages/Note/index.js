import React, { useState } from "react";
import Header from "../Header";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Arweave from "arweave";
const arweave = Arweave.init();

export default function Note() {
  const ReactMarkdown = require("react-markdown");
  let history = useHistory();
  const noteTXID = sessionStorage.getItem("noteTXID");
  const [password, setPassword] = useState();
  const [markdown, setMarkdown] = useState();
  const [tagList, setTagList] = useState();

  if (sessionStorage.getItem("first_visit")) {
    //pass
  } else {
    sessionStorage.setItem("first_visit", "true");
    history.go(0);
  }

  function goBack() {
    history.push("/account");
  }

  function getNote() {
    arweave.transactions
      .getData(noteTXID, { decode: true, string: true })
      .then((data) => {
        var CryptoJS = require("crypto-js");
        var decrypted = CryptoJS.AES.decrypt(data, password);
        var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        setMarkdown(plaintext);
      });
  }

  function setTags() {
    var tags = [];
    arweave.transactions.get(noteTXID).then((transaction) => {
      transaction.get("tags").forEach((tag) => {
        let key = tag.get("name", { decode: true, string: true });
        let value = tag.get("value", { decode: true, string: true });
        tags.push({ key: key, value: value });
        const listItems = tags.map((tag) => (
          <>
            <b>{tag.key}</b> {tag.value}
            <br />
          </>
        ));
        setTagList(listItems);
      });
    });
  }

  setTags();

  return (
    <>
      <Header />
      <br />
      <Container>
        <br />
        <Grid container spacing={1}>
          <Grid item sm={12} lg={8}>
            <Card>
              <CardContent>
                <ReactMarkdown source={markdown} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent>
                <Button variant="outlined" color="primary" onClick={goBack}>
                  Go back
                </Button>
                <br />
                <br />
                <Typography variant="h5">Note details</Typography>
                <br />
                <Divider />
                <br />
                <Typography>
                  <b>TXID</b> {noteTXID}
                  <br />
                  {tagList}
                </Typography>
                <br />
                <br />
                <Grid container spacing={1}>
                  <Grid item lg={6}>
                    <TextField
                      variant="outlined"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password"
                    />
                  </Grid>
                  <Grid item lg={6}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={getNote}
                    >
                      Decrypt
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
      </Container>
    </>
  );
}
