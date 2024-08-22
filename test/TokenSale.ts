import {expect} from "chai";
import {viem} from "hardhat";
// import { TokenSale } from './../artifacts/contracts/TokenSale.sol/TokenSale';

const TEST_RATIO = 100n;
const TEST_PRICE = 1n;

async function deployContractFixture() {
const publicClient = await viem.getPublicClient();
const [owner, otherAccount] = await viem.getWalletClients();
const tokenSaleContract = await viem.deployContract("TokenSale", [
TEST_RATIO, TEST_PRICE
]);
return {
publicClient,
owner,
otherAccount,
tokenSaleContract,
};
}

describe("NFT Shop", async () => {
  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
        const tokenSaleContract = await viem.deployContract("TokenSale", [TEST_RATIO,]);
        const ratio = await tokenSaleContract.read.ratio();
        expect(ratio).to.equal(TEST_RATIO);
    })
    it.only("defines the price as provided in parameters", async () => {
      const tokenSaleContract = await viem.deployContract("TokenSale", [TEST_PRICE, ]);
      const price = await tokenSaleContract.read.getPrice();
      expect(price).to.equal(TEST_PRICE);

      // throw new Error("Not implemented");
    });
    it("uses a valid ERC20 as payment token", async () => {
      throw new Error("Not implemented");
    });
    it("uses a valid ERC721 as NFT collection", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user buys an ERC20 from the Token contract", async () => {  
    it("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    })
    it("gives the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    })
    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    })
    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When the owner withdraws from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    })
    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});