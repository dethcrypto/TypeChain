pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract DataTypesView {
  function view_uint8() public view returns (uint8) {
    return 42;
  }
  function view_uint256() public view returns (uint256) {
    return 10**18;
  }
  function view_int8() public view returns (int8) {
    return 42;
  }
  function view_int256() public view returns (int256) {
    return 10**18;
  }
  function view_bool() public view returns (bool) {
    return true;
  }
  function view_address() public view returns (address) {
    return 0x70b144972C5Ef6CB941A5379240B74239c418CD4;
  }
  function view_bytes1() public view returns (bytes1) {
    return 0xAA;
  }
  function view_bytes() public view returns (bytes memory) {
    return "TypeChain";
  }
  function view_string() public view returns (string memory) {
    return "TypeChain";
  }
  function view_stat_array() public view returns (uint8[3] memory) {
    return [1, 2, 3];
  }
  function view_tuple() public view returns (uint256, uint256) {
    return (1, 2);
  }
  function view_named() public view returns (uint256 uint256_1, uint256 uint256_2) {
    uint256_1 = 1;
    uint256_2 = 2;
  }
  struct Struct1 {
      uint256 uint256_0;
      uint256 uint256_1;
  }
  function view_struct() public view returns (Struct1 memory) {
    return Struct1(1, 2);
  }
  enum Enum1 { On, Off, Undefined }
  function view_enum() public view returns (Enum1) {
    return Enum1.Off;
  }

  // @TODO: can we return dynamic arrays from view functions? I couldnt make it work
}
