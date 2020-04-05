pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract DataTypesPure {
  function pure_uint8() public pure returns (uint8) {
    return 42;
  }
  function pure_uint256() public pure returns (uint256) {
    return 10**18;
  }
  function pure_int8() public pure returns (int8) {
    return 42;
  }
  function pure_int256() public pure returns (int256) {
    return 10**18;
  }
  function pure_bool() public pure returns (bool) {
    return true;
  }
  function pure_address() public pure returns (address) {
    return 0x70b144972C5Ef6CB941A5379240B74239c418CD4;
  }
  function pure_bytes1() public pure returns (bytes1) {
    return 0xAA;
  }
  function pure_bytes() public pure returns (bytes memory) {
    return "TypeChain";
  }
  function pure_string() public pure returns (string memory) {
    return "TypeChain";
  }
  function pure_stat_array() public pure returns (uint8[3] memory) {
    return [1, 2, 3];
  }
  function pure_tuple() public pure returns (uint256, uint256) {
    return (1, 2);
  }
  struct Struct1 {
      uint256 uint256_0;
      uint256 uint256_1;
  }
  function pure_struct() public pure returns (Struct1 memory) {
    return Struct1(1, 2);
  }
  enum Enum1 { On, Off, Undefined }
  function pure_enum() public pure returns (Enum1) {
    return Enum1.Off;
  }

  // @TODO: can we return dynamic arrays from pure functions? I couldnt make it work
}
