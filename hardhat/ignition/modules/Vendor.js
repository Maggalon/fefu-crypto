const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VendorModule", (m) => {

    const vendorInstance = m.contract("Vendor", [m.getAccount(0)]);

    return { vendorInstance };

})

//0xf885E7EF4DB9156b3Cd835A67f7F265D6C77D773