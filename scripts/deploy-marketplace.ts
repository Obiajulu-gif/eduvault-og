import { ethers, network } from "hardhat";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const factory = await ethers.getContractFactory("EduVaultMarketplace");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("EduVaultMarketplace deployed at:", address);

  const deploymentDir = path.join(process.cwd(), "deployments");
  mkdirSync(deploymentDir, { recursive: true });

  const payload = {
    contract: "EduVaultMarketplace",
    address,
    network: network.name,
    chainId: network.config.chainId,
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(deploymentDir, `${network.name}.json`);
  writeFileSync(outputPath, JSON.stringify(payload, null, 2));
  console.log("Deployment metadata written to", outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
