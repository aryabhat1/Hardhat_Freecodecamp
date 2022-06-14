// const hre = require("hardhat");

// const ethers = require("ethers");
const { ethers, run, network } = require("hardhat");
// const fs = require("fs-extra");

async function main() {
  // const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");

  //   const Greeter = await hre.ethers.getContractFactory("Greeter");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.deployed();

  console.log(`SimpleStorage deployed to: ${simpleStorage.address}`);
  //   console.log("The contract deployed: ", simpleStorage);
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  // const currentFavoriteNumber = await simpleStorage.retrieve();
  // console.log(currentFavoriteNumber);

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract....");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
// }
