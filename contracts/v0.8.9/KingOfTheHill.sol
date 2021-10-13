// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Withdrawable {
    mapping(address => uint) pendingWithdrawals;

    function saveWithdrawal(address payable addr, uint256 value) internal {
        pendingWithdrawals[addr] += value;
    }

    function withdraw() external {
        uint amount = pendingWithdrawals[msg.sender];
        // zero the pending refund to prevent reentrancy attack
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}


contract KingOfTheHill is Withdrawable {
  struct Bid { address payable bidder; uint256 value; }

  event HighestBidIncreased(Bid bid);
  error BidNotHighEnough(uint256 value, uint256 highestBidValue);

  Bid public highestBid;

  constructor() payable {
    highestBid = Bid(payable(msg.sender), msg.value);
  }

  function bid() external payable {
    if (msg.value > highestBid.value) {
      saveWithdrawal(highestBid.bidder, highestBid.value);
      highestBid = Bid(payable(msg.sender), msg.value);
      emit HighestBidIncreased(highestBid);
    } else {
      revert BidNotHighEnough(msg.value, highestBid.value);
    }
  }
}

