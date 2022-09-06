const Jackpot = artifacts.require("Jackpot");

module.exports = function(deployer) {
  deployer.deploy(Jackpot);
};
