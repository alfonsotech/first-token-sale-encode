// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {MyToken} from "./MyERC20.sol";

import {MyNFT} from "./MyERC721.sol";

contract TokenSale is Ownable, AccessControl {
    uint256 public ratio;
    uint256 public price;
    MyToken public paymentToken;
    MyNFT public nftContract;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(
        uint256 _ratio,
        uint256 _price,
        MyToken _paymentToken,
        MyNFT _nftContract
    ) Ownable(msg.sender) {
        ratio = _ratio;
        price = _price;
        paymentToken = _paymentToken;
        nftContract = _nftContract;
        _grantRole(MINTER_ROLE, address(this));
    }

    function buyTokens() public payable {
        uint256 amountToMint = msg.value * ratio;
        require(
            hasRole(MINTER_ROLE, address(this)),
            "Must have minter role to mint"
        );
        paymentToken.mint(msg.sender, amountToMint);
    }

    function returnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        //Give back eth
        payable(msg.sender).transfer(amount / ratio);
        //Take tokens inside
    }
}
