const { ethers } = require("hardhat");
const { writeFileSync } = require("fs");
const path = require("path");

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then((f) => f.deployed());
}

async function main() {
  const NFTMarketplaceToken = await deploy("NFTMarketplace");

  console.log("NFTMarketplaceToken deployed to:", NFTMarketplaceToken.address);


}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
