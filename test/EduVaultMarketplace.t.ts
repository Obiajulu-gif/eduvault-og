import { expect } from "chai";
import { ethers } from "hardhat";

describe("EduVaultMarketplace", function () {
  it("lists, buys, and withdraws proceeds", async function () {
    const [seller, buyer] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("EduVaultMarketplace");
    const market = await factory.deploy();
    await market.waitForDeployment();

    await expect(market.connect(seller).listPrompt("0g://metadata-1", ethers.parseEther("0.05")))
      .to.emit(market, "PromptListed");

    expect(await market.hasLicense(1n, buyer.address)).to.equal(false);

    await expect(market.connect(buyer).buyPrompt(1n, { value: ethers.parseEther("0.05") }))
      .to.emit(market, "PromptPurchased");

    expect(await market.hasLicense(1n, buyer.address)).to.equal(true);

    await expect(market.connect(seller).withdrawProceeds()).to.emit(market, "Withdrawn");
  });

  it("rejects invalid listing price and self purchases", async function () {
    const [seller] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("EduVaultMarketplace");
    const market = await factory.deploy();
    await market.waitForDeployment();

    await expect(market.connect(seller).listPrompt("0g://meta", 0)).to.be.revertedWith("Price must be > 0");

    await market.connect(seller).listPrompt("0g://meta", ethers.parseEther("0.01"));
    await expect(market.connect(seller).buyPrompt(1n, { value: ethers.parseEther("0.01") })).to.be.revertedWith(
      "Cannot buy own prompt",
    );
  });
});
