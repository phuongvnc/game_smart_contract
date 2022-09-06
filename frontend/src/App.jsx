import "./App.css";
import React, { useState, useEffect } from "react";
import Main from "./components/Main";
import MyContract from "./utils/contract";
import TopHeader from "./components/Header";

export default function App() {
  const [account, setAccount] = useState(null);
  const [owner, setOwner] = useState(null);
  const hasMetaMask = checkMetaMask();
  const contract = MyContract;

  const clickConnectWallet = async () => {
    let account = await requestMetaMaskAccount();
    setAccount(account);
  };

  contract.getContractOwner().then((owner) => {
    setOwner(owner);
  });

  useEffect(() => {
    (async () => {
      setAccount(await checkMetaMaskLogin());
    })();

    (async () => {
      console.log(await MyContract.getCurrentAccount());

      contract.getTotalTicket()
        .then((value) => {
          console.log(value);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);

  window.ethereum.on("accountsChanged", function (accounts) {
    setAccount(accounts[0]);
  });

  return (
    <div className="App">
      <TopHeader
        account={account}
        owner={owner}
        clickConnectWallet={clickConnectWallet}
      ></TopHeader>
      <Main hasMetaMask={hasMetaMask} account={account} owner={owner}></Main>
    </div>
  );
}

async function checkMetaMask() {
  return typeof window.ethereum !== "undefined";
}

async function checkMetaMaskLogin() {
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts[0];
}

async function requestMetaMaskAccount() {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];
  return account;
}
