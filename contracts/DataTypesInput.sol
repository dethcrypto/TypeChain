pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract DumbContract {
  function input_uint8(uint8 input1) public pure returns (uint8) {
    return input1;
  }
  function input_uint256(uint256 input1) public pure returns (uint256) {
    return input1;
  }
  function input_int8(int8 input1) public pure returns (int8) {
    return input1;
  }
  function input_int256(int256 input1) public pure returns (int256) {
    return input1;
  }
  function input_bool(bool input1) public pure returns (bool) {
    return input1;
  }
  function input_address(address input1) public pure returns (address) {
    return input1;
  }
  function input_bytes1(bytes1 input1) public pure returns (bytes1) {
    return input1;
  }
  function input_bytes(bytes memory input1) public pure returns (bytes memory) {
    return input1;
  }
  function input_string(string memory input1) public pure returns (string memory) {
    return input1;
  }
  function input_stat_array(uint8[3] memory input1) public pure returns (uint8[3] memory) {
    return input1;
  }
  function input_tuple(uint256 input1, uint256 input2) public pure returns (uint256, uint256) {
    return (input1, input2);
  }
  struct Struct1 {
      uint256 uint256_0;
      uint256 uint256_1;
  }
  function input_struct(Struct1 memory input1) public pure returns (Struct1 memory) {
    return input1;
  }
  enum Enum1 { On, Off, Undefined }
  function input_enum(Enum1 input1) public pure returns (Enum1) {
    return input1;
  }
}
