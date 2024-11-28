const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KilaTokenModule", (m) => {

    const kilaTokenInstance = m.contract("KilaToken", [m.getAccount(0)]);

    return { kilaTokenInstance };

})

//0x9BA12B1f33448A8d34379FcE4d838508f39D11C8