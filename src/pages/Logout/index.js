import React from "react";
import { useHistory } from "react-router-dom";

export default function Logout() {
  let history = useHistory();

  function logout() {
    sessionStorage.setItem("wallet_file", "");
    sessionStorage.setItem("wallet_address", "");
    history.push("/");
  }

  return <>{logout()}</>;
}
