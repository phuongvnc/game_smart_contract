import React from "react";
import MyContract from "../utils/contract";

function Owner(props) {
  const contract = MyContract;
  
  const handleClickBuy = async () => {
    await contract.buyTicket([3, 4, 1]);
  };

  return (
    <div>
      <button className="button" onClick={handleClickBuy}>
        Buy Ticket
      </button>
    </div>
  );
}

export default Owner;
