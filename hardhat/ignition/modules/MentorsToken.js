const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MentorsTokenModule", (m) => {

    const mentorsTokenInstance = m.contract("MentorsToken", [m.getAccount(0)]);

    return { mentorsTokenInstance };

})

//0x0B62E01e2dECADa09E2C1932a4c923575db48eC1