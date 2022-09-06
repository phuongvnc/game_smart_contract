import React, { useState } from "react";
import { useEffect } from "react";
import MyContract from "../utils/contract";
import BuyTicket from "./User/BuyTicket";
import ListTicket from "./User/ListTicket";
// import { Text } from "@pancakeswap-libs/uikit";

let numbers = Array(3);

export default function User(props) {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    (() => {
      const inputNumberElement = document.querySelector("ul");
      inputNumberElement.addEventListener("change", (event) => {
        let value = event.target.value;
        if (value.length > 1) {
          value = value.slice(0, 1);
          event.target.value = value;
        }
        let number = parseInt(value);
        numbers[event.target.name] = value === "" ? -1 : number;
      });
    })();

    fetchTickets();
  }, []);

  const clickBuyTicket = (event) => {
    event.preventDefault();
    buyTicket();
  };

  async function fetchTickets() {
    let ticketCount = await MyContract.getTotalTicket();
    let tmpTickets = [];
    for (let i = 0; i < ticketCount; i++) {
      let ticket = await MyContract.getTicket(i);
      let date = new Date(parseInt(ticket[2]) * 1000);
      let time = date.toString();
      tmpTickets.push({
        number: ticket[0],
        amount: MyContract.web3.utils.fromWei(ticket[1], "ether"),
        time: time,
      });
    }
    setTickets(tmpTickets);
  }

  async function buyTicket() {
    const lottery = Array(3);
    const amount = parseFloat(document.getElementsByName("amount")[0].value);

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] > -1) {
        lottery[i] = numbers[i];
      } else {
        lottery[i] = -1;
      }
    }
    if (lottery.length < 2) {
      return window.alert("Vé số phải từ 2 số trở lên");
    }

    if (amount <= 0 || amount.isNan) {
      return window.alert("Mua vé số mà ko tốn tiền sao");
    }

    MyContract.buyTicket(lottery, amount)
      .then((value) => {
        window.alert("Đã mua vé số thành công!");
        clearInputData();
        fetchTickets();
      })
      .catch((error) => {
        window.alert(`Xảy ra lỗi trong quá trình mua vé số! ${error.message}`);
      });
  }

  return (
    <div>
      <BuyTicket clickBuyTicket={clickBuyTicket}></BuyTicket>
      <ListTicket tickets={tickets}></ListTicket>
    </div>
  );
}

function clearInputData() {
  const names = ["0", "1", "2", "amount"];
  for (const inputName of names.values()) {
    const element = document.getElementsByName(inputName)[0];
    if (element !== null) {
      element.value = "";
    }
  }
  numbers.length = 0;
}
