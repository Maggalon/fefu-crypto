const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AbobaTokenModule", (m) => {

    const abobaTokenInstance = m.contract("AbobaToken", [m.getAccount(0)]);

    return { abobaTokenInstance };

})

//0xf5f99392aB002b1cFe517e1e0E18C633aDDfCE60