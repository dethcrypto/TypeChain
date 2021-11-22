// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
pragma experimental ABIEncoderV2;

contract Demo {
    struct Struct1 {
        uint a;
        uint b;
    }
    struct Struct2 {
        uint a;
        uint b;
    }
    constructor(Struct1 memory input1, Struct2[] memory input2) {}
}
