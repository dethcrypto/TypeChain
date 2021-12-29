pragma solidity ^0.6.4;

// based on https://github.com/dethcrypto/TypeChain/issues/428#issuecomment-980761453

contract A {
    event Committed(address[] whitelist);
}

contract B is A {
    event Committed(uint256 timelock);
}
