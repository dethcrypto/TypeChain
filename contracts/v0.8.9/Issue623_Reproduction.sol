// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// https://github.com/dethcrypto/TypeChain/issues/623
contract Issue623_Reproduction {
  event ProposalCreated(
    uint256[] values
  );

  function createProposal() public {
    uint256[] memory values = new uint256[](3);
    values[0] = 0;
    values[1] = 1;
    values[2] = 2;
    emit ProposalCreated(values);
  }
}


