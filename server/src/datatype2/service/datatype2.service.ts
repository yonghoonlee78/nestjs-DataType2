// server/src/datatype2/service/datatype2.service.ts
import { Injectable } from '@nestjs/common';
import { EthersService } from '../../ethers/ethers.service';
import { exceptions } from '../../exceptions/exception.config';
import { isBytesLike, toUtf8Bytes, encodeBytes32String } from 'ethers';


@Injectable()
export class Datatype2Service {
  constructor(private readonly ethersService: EthersService) {}

  private async getDatatype2Contract() {
    // EthersService의 getContract 메서드를 호출하여 DataType2 컨트랙트 인스턴스를 가져옵니다.
    return await this.ethersService.getContract('DataType2');
  }

  async message(newMessage?: string) {
    try {
      const contract = await this.getDatatype2Contract();
      if (newMessage !== undefined) {
        const tx = await contract.setMessage(newMessage);
        await tx.wait();
        return await contract.getMessage();
      } else {
        return await contract.getMessage();
      }
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async number(index?: number, inputNumber?: number) {
    try {
      const contract = await this.getDatatype2Contract();
      if (index !== undefined) {
        return await contract.getNumber(index);
      } else if (inputNumber !== undefined) {
        const tx = await contract.addNumber(inputNumber);
        await tx.wait();
        return await contract.getNumbers();
      }
      return null;
    } catch (error) {
      if (error.reason && error.reason.includes("Index out of bounds")) {
        throw exceptions.INDEX_OUT_OF_BOUNDS;
      }
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async numbers() {
    try {
      const contract = await this.getDatatype2Contract();
      const result = await contract.getNumbers();
      return result.map((num: bigint) => num.toString());
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async addName(name: string) {
    try {
      const contract = await this.getDatatype2Contract();
      const tx = await contract.addName(name);
      await tx.wait();
      return await contract.getNames();
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async names() {
    try {
      const contract = await this.getDatatype2Contract();
      return await contract.getNames();
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async balance(address: string, value?: number) {
    try {
      const contract = await this.getDatatype2Contract();
      if (value !== undefined) {
        const tx = await contract.setBalance(address, value);
        await tx.wait();
        return await contract.getBalance(address);
      } else {
        return await contract.getBalance(address);
      }
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async user(address: string, name?: string, age?: number) {
    if (name !== undefined && name.trim() === '') {
      throw exceptions.NAME_CANNOT_BE_EMPTY;
    }

    try {
      const contract = await this.getDatatype2Contract();
      if (name !== undefined && age !== undefined) {
        const tx = await contract.setUser(address, name, age);
        await tx.wait();
        const [userName, userAge] = await contract.getUser(address);
        return { name: userName, age: userAge.toString() };
      } else {
        const [userName, userAge] = await contract.getUser(address);
        return { name: userName, age: userAge.toString() };
      }
    } catch (error) {
      if (error.reason && error.reason.includes("User not found")) {
        throw exceptions.USER_NOT_FOUND;
      }
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async fixedData(data?: string) {
    try {
      const contract = await this.getDatatype2Contract();
      if (data !== undefined) {
        let bytes32Data: string;
        if (isBytesLike(data)) {
            bytes32Data = data;
        } else {
            bytes32Data = encodeBytes32String(data);
        }

        const tx = await contract.setFixedData(bytes32Data);
        await tx.wait();
        return await contract.getFixedData();
      } else {
        return await contract.getFixedData();
      }
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async dynamicData(data?: string) {
    try {
      const contract = await this.getDatatype2Contract();
      if (data !== undefined) {
        let bytesData: Uint8Array | string;
        if (isBytesLike(data)) {
            bytesData = data;
        } else {
            bytesData = toUtf8Bytes(data);
        }

        const tx = await contract.setDynamicData(bytesData);
        await tx.wait();
        return await contract.getDynamicData();
      } else {
        return await contract.getDynamicData();
      }
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async getDetails() {
    try {
      const contract = await this.getDatatype2Contract();
      const result = await contract.getDetails();
      return {
        message: result[0],
        numbers: result[1].map((num: bigint) => num.toString()),
        names: result[2],
        fixedData: result[3],
        dynamicData: result[4],
      };
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async patchDetails(state: number) {
    try {
      const contract = await this.getDatatype2Contract();
      // 이 함수는 'state'를 인자로 받지만, Datatype2 컨트랙트에는 'setState' 같은 함수가 없습니다.
      // 이 부분은 Postman의 요청 바디와 연결된 것으로 보입니다.
      // 만약 'state' 값을 사용하는 컨트랙트 함수가 있다면, 아래 주석을 해제하고 사용합니다.
      // 예시: const tx = await contract.setState(state);
      // await tx.wait();

      const result = await contract.getDetails();
      // getDetails 함수와 마찬가지로 객체 형태로 반환하도록 변경합니다.
      return {
        message: result[0],
        numbers: result[1].map((num: bigint) => num.toString()),
        names: result[2],
        fixedData: result[3],
        dynamicData: result[4],
      };
    } catch (error) {
      throw exceptions.createBadRequestException(error.message);
    }
  }
}


