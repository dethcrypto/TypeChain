// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

struct Vector2 {
  uint256 x; uint256 y;
}

contract StructsInConstructor {
  constructor(Vector2[2] memory segment) {}
}
