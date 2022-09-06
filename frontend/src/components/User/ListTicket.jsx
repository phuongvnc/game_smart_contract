import React from "react";
import TicketItem from "./TicketItem";

export default function ListTicket(props) {
  let tickets = props.tickets;
  return (
    <div id="ticket-container">
      <table>
        <tbody>
          <tr>
            <th className="number-col">Number</th>
            <th className="amount-col">Amount</th>
            <th className="time-col">Time</th>
          </tr>
          {tickets.map((ticket, index) => (
            <TicketItem
              key={index}
              number={ticket.number}
              amount={ticket.amount}
              time={ticket.time}
            ></TicketItem>
          ))}
        </tbody>
      </table>
    </div>
  );
}
