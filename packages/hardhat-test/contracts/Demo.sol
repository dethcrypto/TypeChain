// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

contract Demo {
    struct ConstructorArgs {
        uint a;
        uint b;
    }
    ConstructorArgs _ca;
    constructor(ConstructorArgs memory ca) public {
        _ca = ca;
    }
}
