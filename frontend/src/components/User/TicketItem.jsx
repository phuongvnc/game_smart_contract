import React from "react";

export default function TicketItem(props) {
  let key = props.index;
  let number = props.number;
  let amount = props.amount;
  let time = props.time;
  return (
    <tr key={key}>
      <td className="number-col">{number}</td>
      <td className="amount-col">{amount} ether</td>
      <td className="time-col">{time}</td>
    </tr>
  );
}
