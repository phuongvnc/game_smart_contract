import { Button, Text } from "@pancakeswap-libs/uikit";
import React from "react";
// import { BiWalletAlt } from "react-icons/bi";

function TopHeader(props) {
  const isConnected = props.account !== null && props.account !== undefined;

  return (
    <header id="header">
      <div className="site-nav-left"></div>
      <div className="site-nav-middle">
        <div className="header-title">
          <TitleComponent {...props} />
        </div>
      </div>
      <div className="site-nav-right">
        <div className="header-metamask">
          <WalletComponent
            isConnected={isConnected}
            {...props}
          ></WalletComponent>
        </div>
      </div>
    </header>
  );
}

function TitleComponent(props) {
  if (
    props.account !== null &&
    props.account !== undefined &&
    props.owner !== null
  ) {
    if (props.owner.toLowerCase() === props.account.toLowerCase()) {
      return (
        <Text fontSize="20px" bold={true}>
          {" "}
          OWNER DASHBOARD
        </Text>
      );
    } else {
      return (
        <Text fontSize="20px" bold={true}>
          {" "}
          USER DASHBOARD
        </Text>
      );
    }
  } else {
    return <div></div>;
  }
}

function WalletComponent(props) {
  if (props.isConnected) {
    let address =
      props.account.slice(0, 2) +
      "..." +
      props.account.slice(props.account.length - 5);
    return (
      <div className="wallet-connected">
        {walletSVG}
        <Text bold={true} fontWeight={600} st>
          {address}
        </Text>
      </div>
    );
  } else {
    return (
      <Button height={32} onClick={props.clickConnectWallet}>
        {"Connect Wallet"}
      </Button>
    );
  }
}

const walletSVG = (
  <svg
    viewBox="0 0 24 24"
    color="1fc8d4"
    width="24px"
    style={{ fill: "#1fc8d4" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 4C18.5 4 19 4.5 19 6L19 8C20.1046 8 21 8.89543 21 10L21 17C21 19 20 20 17.999 20H6C4 20 3 19 3 17L3 7C3 5.5 4.5 4 6 4L17 4ZM5 7C5 6.44772 5.44772 6 6 6L19 6L19 8L6 8C5.44772 8 5 7.55229 5 7ZM17 16C18 16 19.001 15 19 14C18.999 13 18 12 17 12C16 12 15 13 15 14C15 15 16 16 17 16Z"></path>
  </svg>
);

export default TopHeader;
