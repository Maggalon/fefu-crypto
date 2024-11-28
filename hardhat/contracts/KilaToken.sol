// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract KilaToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {

    constructor(address initialOwner)
        ERC20("KilaToken", "KILA")
        Ownable(initialOwner)
        ERC20Permit("KilaToken")
    {
        _mint(0x9BA12B1f33448A8d34379FcE4d838508f39D11C8, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

}
