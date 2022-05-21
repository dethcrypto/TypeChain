pragma solidity ^0.6.4;// Remember to set corret version in Typchain: 0.6.4 - 0.8.9

// Import Person Library
import "./LibraryPerson.sol";

/**
 * Define Contract for consume person lib
 */
contract PersonConsumer {

    PersonLib.Data requester;
    PersonLib.Data contributor;

    constructor() public {}

    event RequesterHandleUpdated(
        string newHandle
    );

    event ContributorHandleUpdated(
        string newHandle
    );

    function requesterHandle() public view returns (string memory) {
        return requester.handle;
    }
    
    function updateRequesterHandle(string memory newHandle) public {
        emit RequesterHandleUpdated(newHandle);
        PersonLib.setHandle(requester, newHandle);
    }

    function contributorHandle() public view returns (string memory) {
        return contributor.handle;
    }

    function updateContributorHandle(string memory newHandle) public {
        emit ContributorHandleUpdated(newHandle);
        PersonLib.setHandle(contributor, newHandle);
    }
}