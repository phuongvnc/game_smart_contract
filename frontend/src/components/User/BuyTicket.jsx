import React from "react";

export default function BuyTicket(props) {
  return (
    <div>
      <div className="buy-ticket">
        <ul>
          <li>
            <input className="input-number" type="number" name="0" />
          </li>
          <li>
            <input className="input-number" type="number" name="1" />
          </li>
          <li>
            <input className="input-number" type="number" name="2" />
          </li>
        </ul>
        <div className="amount-div">
          <span>Amount </span>{" "}
          <input
            className="input-number"
            type="number"
            placeholder="0.0"
            name="amount"
          />{" "}
          <span> Ether </span>
        </div>
      </div>
      <button className="button" onClick={props.clickBuyTicket}>
        Buy Ticket
      </button>
    </div>
  );
}
