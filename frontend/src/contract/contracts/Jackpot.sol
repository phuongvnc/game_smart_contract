
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library String {
    function concat(string memory _x, string memory _y) pure internal returns (string memory) {
        bytes memory _xBytes = bytes(_x);
        bytes memory _yBytes = bytes(_y);
        
        string memory _tmpValue = new string(_xBytes.length + _yBytes.length);
        bytes memory _newValue = bytes(_tmpValue);
        
        uint i;
        uint j;
        
        for(i=0;i<_xBytes.length;i++) {
            _newValue[j++] = _xBytes[i];
        }
        
        for(i=0;i<_yBytes.length;i++) {
            _newValue[j++] = _yBytes[i];
        }
        
        return string(_newValue);
    }
}

contract Jackpot is Ownable {

    using String for string;
    
    int[3] public winNumber;
    Winner[] public winners;
    
    mapping(address => Ticket[]) public tickets;

    uint256 internal constant PRECISION = 1 ether;
    uint256 internal constant RATIO2NUMBER = 70;
    uint256 internal constant RATIO3NUMBER = 350;
    address[] public players;
    bool internal isLock = false;
    
    event BuyTicket(address, int[3], uint256, uint);
    event WinnerPrize(Winner[]);

    struct Ticket {
        int[3] numbers;
        uint256 amount;
        uint time;
    }

    enum Prize { Win2Number, Win3Number }

    struct Winner {
        address payable player;
        Ticket ticket;
        Prize prize;   
    }

    // External 
    function buyTicket(int[3] memory numbers) public onlyUnLock payable {
        require(msg.value > 0, "Value smallest equal 0");
        require(numbers.length > 0, "Ticket number is null");
        require(msg.sender != address(0));

        bool isExist = false;
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == msg.sender) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            players.push(msg.sender);
        }
        
        tickets[msg.sender].push(
            Ticket(numbers, msg.value, atNow())
        );

        emit BuyTicket(msg.sender, numbers , msg.value, atNow());
    }

    function setWinNumber(int[3] memory numbers) public onlyOwner onlyLock {
        winNumber = numbers;

        for (uint k = 0; k < players.length; k++) {
            Ticket[] storage userTickets = tickets[players[k]];
            for (uint i = 0; i < userTickets.length; i++) {
                Ticket storage ticket = userTickets[i];
                uint point = 0;
                for (uint j = 0; j < ticket.numbers.length; j++) {
                    point += winNumber[j] == ticket.numbers[j] ? 1 : 0;
                }

                if (point == 2) {
                    winners.push(
                        Winner(payable(players[k]), ticket, Prize.Win2Number)
                    );
                } else if (point == 3) {
                    winners.push(
                        Winner(payable(players[k]), ticket, Prize.Win3Number)
                    );
                }
            }
        }

        emit WinnerPrize(winners);
    }

    function awardWinner() public onlyOwner onlyLock isEnoughAmount {
        for (uint i= 0; i < winners.length; i++) {
            Winner storage winner = winners[i];
            if (winner.prize == Prize.Win2Number) {
                uint amount = winner.ticket.amount * RATIO2NUMBER;
                winner.player.transfer(amount);
            } else if (winner.prize == Prize.Win3Number) {
                uint amount = winner.ticket.amount * RATIO3NUMBER;
                winner.player.transfer(amount);
            }
        }

        delete winners;
        for (uint i = 0; i < players.length; i++) {
            delete tickets[players[i]];
        }
        delete players;
    }

    function getTotalTicket(address from) public view returns(uint) {
        return tickets[from].length;
    }

    function getTicket(address from ,uint index) public view returns (string memory, uint256, uint) {
        Ticket storage ticket = tickets[from][index];
        string memory numberText = "";
        for (uint i = 0; i < ticket.numbers.length; i++) {
            if (ticket.numbers[i] > -1) {
                numberText = numberText.concat(Strings.toString(uint(ticket.numbers[i])));
            }
        }
        uint256 amount = ticket.amount;
        uint time = ticket.time;
        return (numberText, amount, time);
    }

    function withdraw() public onlyOwner isRewardForAll returns (bool)  {
        payable(msg.sender).transfer(address(this).balance);
        return true;
    }

    function withdraw(address payable _to, uint _value) public onlyOwner isRewardForAll {
        require(_to != address(0), "Address isn't exist");
        uint value = _value * 1 ether;
        require(value <= address(this).balance);
        _to.transfer(value);
    }

    function unlock() public onlyLock onlyOwner {
        isLock = false;
    }

    function lock() public onlyUnLock onlyOwner {
        isLock = true;
    }

    fallback() external payable {}

    receive() external payable {}

    function winnerAmount() public view returns (uint256) {
        uint256 amount = 0;
        for (uint i = 0; i < winners.length; i++) {
            Winner storage winner = winners[i];
            if (winner.prize == Prize.Win2Number) {
                amount += winner.ticket.amount * RATIO2NUMBER;
            } else if (winner.prize == Prize.Win3Number) {
                amount += winner.ticket.amount * RATIO3NUMBER;
            }
        }
        return amount;
    }

    function totalAmount() public view returns (uint256) {
        return getBalance() + PRECISION;
    }

    //Internal
    function atNow() internal view returns (uint) {
        return block.timestamp;
    }

    //Private
    function getBalance() private view returns (uint256) {
        return address(this).balance;
    }

    //Modifier

    modifier onlyUnLock() {
        require(isLock == false, "Function invoke when contract unlock ");
        _;
    }

    modifier onlyLock() {
        require(isLock == true, "Function invoke when contract lock ");
        _;
    }

    modifier isEnoughAmount() {
        require(winnerAmount() <= totalAmount(), "Balance of contract not enough");
        _;
    }

    modifier isRewardForAll() {
        require(players.length == 0  && winners.length == 0, "Please reward for all ticket");
        _;
    }
}