import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const DataType2 = await ethers.getContractFactory('DataType2');
  const contract = await DataType2.deploy();
  await contract.waitForDeployment();

  console.log(`DataType2 contract deployed at: ${contract.target}`);
  await makeAbi('DataType2', contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
