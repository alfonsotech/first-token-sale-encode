import {expect} from "chai";
import {viem} from "hardhat";
import { parseEther, formatEther} from "viem";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
// import { TokenSale } from './../artifacts/contracts/TokenSale.sol/TokenSale';

const TEST_RATIO = 100n;
const TEST_PRICE = 10n;
const TEST_PURCHASE_SIZE = parseEther("1");
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
const TEST_RETURN_TOKENS_SIZE = parseEther("50");

async function deployContractFixture() {
  const publicClient = await viem.getPublicClient();
  const [owner, otherAccount] = await viem.getWalletClients();
  
  const myTokenContract = await viem.deployContract("MyToken", []);
  const myNFTContract = await viem.deployContract("MyNFT", []);
   const tokenSaleContract = await viem.deployContract("TokenSale", [
    TEST_RATIO,
    TEST_PRICE,
    myTokenContract.address,
    myNFTContract.address
  ]);
  // const giveMinterRoleTokenTx = await myTokenContract.write.grantRole([await myTokenContract.read.MINTER_ROLE(), tokenSaleContract.address]);
  //hard code minter role from error message, since it's always the same
   const giveMinterRoleTokenTx = await myTokenContract.write.grantRole([MINTER_ROLE, tokenSaleContract.address]);
  //is transaction receipt here necessary or optional?
  await publicClient.waitForTransactionReceipt({hash: giveMinterRoleTokenTx})
  return {
    publicClient,
    owner,
    otherAccount,
    tokenSaleContract,
    myTokenContract,
    myNFTContract
  };
  
}
describe("NFT Shop", async () => {


  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const {tokenSaleContract} = await loadFixture(deployContractFixture)
        // const tokenSaleContract = await viem.deployContract("TokenSale", [TEST_RATIO,]);
        const ratio = await tokenSaleContract.read.ratio();
        expect(ratio).to.equal(TEST_RATIO);
    })
    it("defines the price as provided in parameters", async () => {
      const {tokenSaleContract} = await loadFixture(deployContractFixture)
      // const tokenSaleContract = await viem.deployContract("TokenSale", [TEST_RATIO, TEST_PRICE, ]);
      const price = await tokenSaleContract.read.price();
      expect(price).to.equal(TEST_PRICE);
    });
    it("uses a valid ERC20 as payment token", async () => {
      //  const {tokenSaleContract} = await loadFixture(deployContractFixture)
     throw new Error("Not implemented");
    });
    it("uses a valid ERC721 as NFT collection", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user buys an ERC20 from the Token contract", async () => {  
    it("charges the correct amount of ETH", async () => {
      const {publicClient, tokenSaleContract, myTokenContract, otherAccount} = await loadFixture(deployContractFixture)
      const ethBalanceBefore = await publicClient.getBalance({address: otherAccount.account.address}); 

      //Buy Tokens
     const buyTokensTx = await tokenSaleContract.write.buyTokens({value: TEST_PURCHASE_SIZE, account: otherAccount.account,}); 

      //Get Receipt
      const receipt = await publicClient.getTransactionReceipt({hash: buyTokensTx})
      if(!receipt.status || receipt.status !== "success") {
        throw new Error("Transaction failed");
      }
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.effectiveGasPrice;
      const txCost = gasUsed * gasPrice;

      const ethBalanceAfter = await publicClient.getBalance({address: otherAccount.account.address});
    
      const diff = ethBalanceBefore - ethBalanceAfter - txCost;
      
      expect(diff).to.equal(TEST_PURCHASE_SIZE);
    })
    it("gives the correct amount of tokens", async () => {
      const {publicClient, tokenSaleContract, myTokenContract, otherAccount} = await loadFixture(deployContractFixture)
      const tokenBalanceBefore = await myTokenContract.read.balanceOf([otherAccount.account.address,]); 

      //Buy Tokens
     const buyTokensTx = await tokenSaleContract.write.buyTokens({value: TEST_PURCHASE_SIZE, account: otherAccount.account,}); 

      //Get Receipt
      const receipt = await publicClient.getTransactionReceipt({hash: buyTokensTx})
      if(!receipt.status || receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      const tokenBalanceAfter = await myTokenContract.read.balanceOf([otherAccount.account.address,]);
    
      const diff = tokenBalanceAfter - tokenBalanceBefore;
      expect(diff).to.equal(TEST_PURCHASE_SIZE * TEST_RATIO);
    });
  })
  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    })
    it.only("burns the correct amount of tokens", async () => {
      const {publicClient, tokenSaleContract, myTokenContract, otherAccount} = await loadFixture(deployContractFixture)
   

      //Buy Tokens
     const buyTokensTx = await tokenSaleContract.write.buyTokens({value: TEST_PURCHASE_SIZE, account: otherAccount.account,}); 

      //Get Receipt
      const receipt = await publicClient.getTransactionReceipt({hash: buyTokensTx})
      if(!receipt.status || receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      const tokenBalanceBefore = await myTokenContract.read.balanceOf([otherAccount.account.address,]); 

      //Approve Tx
      const approveTokensTx = await myTokenContract.write.approve([tokenSaleContract.address, TEST_RETURN_TOKENS_SIZE], {account: otherAccount.account})
      const approveTokensTxReceipt = await publicClient.getTransactionReceipt({hash: approveTokensTx, })
      if(!approveTokensTxReceipt.status || approveTokensTxReceipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      //Burn - return tokens
      const returnTokensTx = await tokenSaleContract.write.returnTokens([TEST_RETURN_TOKENS_SIZE, ], { account: otherAccount.account })
      const returnTokensTxReceipt = await publicClient.getTransactionReceipt({hash: returnTokensTx, })
      if(!returnTokensTxReceipt.status || returnTokensTxReceipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      const tokenBalanceAfter = await myTokenContract.read.balanceOf([otherAccount.account.address,]);
      //TEST_RETURN_TOKENS_SIZE
      const diff = tokenBalanceBefore - tokenBalanceAfter;
      expect(diff).to.equal(TEST_RETURN_TOKENS_SIZE);

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