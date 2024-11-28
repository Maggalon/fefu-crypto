// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function name() external view returns(string calldata);
    function symbol() external view returns(string calldata);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Vendor is Ownable {

    constructor(address initialOwner) Ownable(initialOwner) {}

    event BuyTokens(
        address indexed to,
        uint256 fefuAmount,
        uint256 tokensNumber,
        uint256 tokenPrice,
        string tokenName,
        string tokenSymbol
    );

    event SellTokens(
        address indexed user,
        uint256 tokens,
        uint256 fefu
    );

    mapping(address => uint256) tokenPrices;

    function mintTokens(address tokenAddress, uint256 tokenNumber) external payable {
        IERC20 token = IERC20(tokenAddress);

        require(msg.value > 0, "Send FEFU to mint tokens");
        require(token.balanceOf(address(this)) > tokenNumber, "Not enough tokens available");

        uint256 tokenInitialPrice = msg.value / tokenNumber;

        require(token.transfer(msg.sender, tokenNumber * 1e18), "Token transfer failed");

        tokenPrices[tokenAddress] = tokenInitialPrice;

        emit BuyTokens(msg.sender, msg.value, tokenNumber, tokenInitialPrice, token.name(), token.symbol());
    }

    function sellTokens(address tokenAddress, uint256 tokensToSell) external {
        IERC20 token = IERC20(tokenAddress);

        require(tokensToSell > 0, "Token amount must be greater than zero");
        require(token.balanceOf(msg.sender) >= tokensToSell, "You don't have so much tokens");

        uint256 fefuTransferAmount = (tokensToSell / 1e18) * tokenPrices[tokenAddress];
        require(address(this).balance >= fefuTransferAmount, "Vendor does not have enough FEFU to satisfy your request");

        require(token.transferFrom(msg.sender, address(this), tokensToSell), "Failed to transfer tokens from user to vendor");

        (bool sent,) = msg.sender.call{value: fefuTransferAmount}("");
        require(sent, "Failed to send FEFU to the user");

        emit SellTokens(msg.sender, tokensToSell, fefuTransferAmount);
    }

}