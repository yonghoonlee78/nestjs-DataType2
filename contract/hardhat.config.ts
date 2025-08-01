import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const privateKey = process.env.PRIVATE_KEY; 
const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL; 

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: sepoliaRpcUrl || "", 
      accounts: privateKey ? [privateKey] : [], 
      chainId: 11155111, 
    },
  },
};

export default config;
