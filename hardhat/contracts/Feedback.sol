// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Feedback {

    struct Suggestion {
        uint suggestionId;
        address author;
        string title;
        string content;
        uint createdAt;
        int votes;
        uint[] comments;
    }

    struct Comment {
        uint commentId;
        uint suggestionId;
        address author;
        string content;
        uint createdAt;
    }

    address public owner;
    mapping(address => bool) public creators;

    uint private suggestionCount;
    mapping(uint => Suggestion) public suggestions;
    uint private commentCount;
    mapping(uint => Comment) public comments;

    mapping(uint => mapping(address => int)) public votedSuggestions;

    constructor() {
        owner = msg.sender;
        creators[msg.sender] = true;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not contract owner");
        _;
    }

    modifier creator {
        require(creators[msg.sender], "You are not creator");
        _;
    }

    function setCreator(address user) external onlyOwner {
        creators[user] = true;
    }

    function checkCreator(address user) external view returns (bool) {
        return creators[user];
    }

    function createSuggestion(string calldata title, string calldata content) external creator {
        require(bytes(title).length > 0, "Title cannot be an empty string");
        require(bytes(content).length > 0, "Content cannot be an empty string");

        suggestionCount++;
        suggestions[suggestionCount] = Suggestion(suggestionCount, msg.sender, title, content, block.timestamp, 0, new uint[](0));
    }

    function deleteSuggestion(uint suggestionId) external onlyOwner {
        require(suggestionId > 0 && suggestionId <= suggestionCount, "Suggestion doesn't exist");

        delete suggestions[suggestionId];
    }

    function voteForSuggestion(int vote, uint suggestionId) external {
        require(suggestionId > 0 && suggestionId <= suggestionCount, "Suggestion doesn't exist");
        //require(votedSuggestions[suggestionId][msg.sender] != vote, "You have already given this kind of vote");

        if (votedSuggestions[suggestionId][msg.sender] == vote) {
            suggestions[suggestionId].votes -= vote;
            votedSuggestions[suggestionId][msg.sender] = 0;
        }
        else if (votedSuggestions[suggestionId][msg.sender] == 0) {
            suggestions[suggestionId].votes += vote;
            votedSuggestions[suggestionId][msg.sender] = vote;
        } 
        else {
            suggestions[suggestionId].votes += vote * 2;
            votedSuggestions[suggestionId][msg.sender] = vote;
        }

    }

    function commentSuggestion(uint suggestionId, string calldata content) external {
        require(suggestionId > 0 && suggestionId <= suggestionCount, "Suggestion doesn't exist");

        commentCount++;
        comments[commentCount] = Comment(commentCount, suggestionId, msg.sender, content, block.timestamp);
        suggestions[suggestionId].comments.push(commentCount);
    }

    function getSuggestions() external view returns (Suggestion[] memory) {
        Suggestion[] memory itemsToReturn = new Suggestion[](suggestionCount);
        
        for (uint i = 0; i < suggestionCount; i++) {
            itemsToReturn[i] = suggestions[i+1];
        }

        return itemsToReturn;
    }

    function getSuggestionComments(uint suggestionId) external view returns (Comment[] memory) {
        require(suggestionId > 0 && suggestionId <= suggestionCount, "Suggestion doesn't exist");

        uint[] memory commentIds = suggestions[suggestionId].comments;
        Comment[] memory suggestionComments = new Comment[](commentIds.length);

        for (uint i = 0; i < commentIds.length; i++) {
            suggestionComments[i] = comments[commentIds[i]];
        }

        return suggestionComments;
    }

}