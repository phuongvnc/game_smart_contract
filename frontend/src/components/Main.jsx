import React from "react";
import Owner from "./Owner";
import User from "./User";

function Main(props) {
  if (props.hasMetaMask) {
    if (
      props.account !== null &&
      props.account !== undefined &&
      props.owner !== null
    ) {
      if (props.owner.toLowerCase() === props.account.toLowerCase()) {
        return <Owner {...props}></Owner>;
      } else {
        return <User {...props}></User>;
      }
    } else {
      return <div></div>;
    }
  } else {
    return (
      <div>
        <p> Chưa cài đặt metamask</p>
      </div>
    );
  }
}

export default Main;
