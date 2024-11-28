const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FeedbackContractModule", (m) => {

    const feedbackInstance = m.contract("Feedback");

    return { feedbackInstance };

})

//0x56e4719AFc9F5417b1df88abaD1bD12a6Db28AD0