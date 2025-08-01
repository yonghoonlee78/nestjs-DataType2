import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ethers,
  zeroPadValue,
  encodeBytes32String,
  isBytesLike,
  toUtf8Bytes,
  BytesLike,
} from 'ethers';
import { abi, address } from '../../abis/DataType2.json';

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey!, this.provider);
    this.contract = new ethers.Contract(address, abi, this.signer);
  }
  getContract(name: string): ethers.Contract {
    if (name === 'DataType2') {
      return this.contract;
    }
    throw new Error(`Contract with name "${name}" not found.`);
  }

  async zeroPadValue32(data: string) {
    return zeroPadValue(data, 32);
  }

  async encodeBytes32String(data: string) {
    return encodeBytes32String(data);
  }

  async isBytesLike(data: string) {
    return isBytesLike(data);
  }

  async toUtf8Bytes(data: string): Promise<Uint8Array> {
    return toUtf8Bytes(data);
  }

  // 위 코드는 지우지 마세요.
  async getMessage() {
    return await this.contract.getMessage();
  }

  async setMessage(newMessage: string) {
    const tx = await this.contract.setMessage(newMessage);
    return await tx.wait(); // tx 영수증 반환
  }

  async getNumber(index: number) {
    return await this.contract.getNumber(index);
  }

  async addNumber(num: number) {
    const tx = await this.contract.addNumber(num);
    return await tx.wait();
  }

  async getNumbers() {
    return await this.contract.getNumbers();
  }

  async addName(name: string) {
    const tx = await this.contract.addName(name);
    return await tx.wait();
  }

  async getNames() {
    return await this.contract.getNames();
  }

  async setBalance(address: string, value: number) {
    const tx = await this.contract.setBalance(address, value);
    return await tx.wait();
  }

  async getBalance(address: string) {
    return await this.contract.getBalance(address);
  }

  async getUser(address: string) {
    return await this.contract.getUser(address);
  }

  async setUser(address: string, name: string, age: number) {
    const tx = await this.contract.setUser(address, name, age);
    return await tx.wait();
  }

  async getDynamicData() {
    return await this.contract.getDynamicData();
  }

  async setDynamicData(data: BytesLike) {
    const tx = await this.contract.setDynamicData(data);
    return await tx.wait();
  }

  async getFixedData() {
    return await this.contract.getFixedData();
  }

  async setFixedData(data: string) {
    const tx = await this.contract.setFixedData(data);
    return await tx.wait();
  }

  async getDetails() {
    return await this.contract.getDetails();
  }
}