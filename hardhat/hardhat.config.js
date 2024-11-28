require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    fefu: {
      url: 'https://fefu-crypto.online',
      accounts: [process.env.PRIVATE_KEY]
    }
  },
};
