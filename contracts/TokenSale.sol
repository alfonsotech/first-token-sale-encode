// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {MyToken} from "./MyToken.sol";

import {MyNFT} from "./MyNFT.sol";

contract TokenSale is Ownable {
    uint256 public ratio;

    constructor(uint256 _ratio) Ownable(msg.sender) {
        ratio = _ratio;
    }
}
