import { viem } from "hardhat";
// import { parseEther } from "viem";
import { parseEther, formatEther } from "viem";

async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    // TODO
    const tokenContract = await viem.deployContract("MyToken");
    console.log(`Contract deployed at ${tokenContract.address}`);

    const initialTotalSupply = await tokenContract.read.totalSupply();
    console.log({ initialTotalSupply });

    // Fetching the role code
    const code = await tokenContract.read.MINTER_ROLE();
    // const mintTx = await tokenContract.write.mint(
    //     [deployer.account.address, parseEther("10")],
    //     { account: account2.account }
    // );
    // await publicClient.waitForTransactionReceipt({ hash: mintTx });

    // Giving role
    const roleTx = await tokenContract.write.grantRole([
      code,
      account2.account.address,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: roleTx });

    //Minting Tokens
    const mintTx = await tokenContract.write.mint([deployer.account.address, parseEther("10")], {account: account2.account});
    await publicClient.waitForTransactionReceipt({hash:mintTx});


    //Fetching token data with Promise.all()
    const [name, symbol, decimals, updatedTotalSupply] = await Promise.all([
      tokenContract.read.name(),
      tokenContract.read.symbol(),
      tokenContract.read.decimals(),
      tokenContract.read.totalSupply(),
    ]);
    console.log({ name, symbol, decimals, totalSupply: updatedTotalSupply });

    // Sending a transaction
    const tx = await tokenContract.write.transfer([
      account1.account.address,
      parseEther("2"),
    ]);
    await publicClient.waitForTransactionReceipt({ hash: tx });

    //View balances
    const myBalance = await tokenContract.read.balanceOf([deployer.account.address])
    console.log(`My balance is ${formatEther(myBalance)} ${symbol}`);
     const account1Balance = await tokenContract.read.balanceOf([account1.account.address])
    console.log(`account1Balance is ${formatEther(account1Balance)}`);
     const account2Balance = await tokenContract.read.balanceOf([account2.account.address])
    console.log(`account2Balance is ${formatEther(account2Balance)}`);
    
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});