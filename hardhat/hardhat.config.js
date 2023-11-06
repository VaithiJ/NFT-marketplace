require("@nomiclabs/hardhat-ethers");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: { version: "0.8.20" },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY]
    },
    apothem: {
      url: process.env.APOTHEM_URL,
      accounts: [
        process.env.PRIVATE_KEY]
      
      // chainId:51,
    },

    hardhat: {
      chainId: 1337,
    },
  },
};
