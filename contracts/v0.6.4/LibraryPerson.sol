pragma solidity ^0.6.4;
// Remember to set corret version in Typchain: 0.6.4 - 0.8.9

/**
 * Define Person Library
 */
library PersonLib {

    // Define person structure
    struct Data {
        bool isActive;
        bytes hashOfData;
        string handle;
    }

    // Event for update isActive
    event runMarkActive(
        bool isActive
    );

    // Define getter
    function getIsActive(Data storage self) public view returns (bool) {
        return self.isActive;
    }

    function getHashOfData(Data storage self) public view returns (bytes memory) {
        return self.hashOfData;
    }

    function getHandle(Data storage self) public view returns (string memory) {
        return self.handle;
    }

    // Define setter
    function setMarkActive(Data storage self) internal {
        emit runMarkActive(true);
        self.isActive = true;
    }

    function setHandle(Data storage self, string memory newHandle) internal {
        self.handle = newHandle;
    }

    function setHashOfData(Data storage self, string memory stringToHash) internal {
        bytes memory hashed = bytes(stringToHash);
        self.hashOfData = hashed;
    }
}