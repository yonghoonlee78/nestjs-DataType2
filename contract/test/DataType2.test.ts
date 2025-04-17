import { expect } from 'chai';
import { ethers, artifacts } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

describe('DataType2', function () {
  let contract: any;
  let newWallet: any;

  beforeEach(async function () {
    [newWallet] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory('DataType2');
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  describe('라이선스 및 Solidity 버전 검사', function () {
    it('컨트랙트에서 SPDX 주석으로 라이선스가 있어야 합니다.', async function () {
      const contractPath = path.join(__dirname, '../contracts/DataType2.sol');
      const sourceCode = fs.readFileSync(contractPath, 'utf8');
      expect(sourceCode.match(/\/\/ SPDX-License-Identifier:/)).to.not.be.null;
    });

    it('컨트랙트에서 Solidity 버전이 0.8.0 이상, 0.9.0 미만이어야 합니다.', async function () {
      const contractPath = path.join(__dirname, '../contracts/DataType2.sol');
      const sourceCode = fs.readFileSync(contractPath, 'utf8');

      const versionMatch = sourceCode.match(/pragma solidity\s+([^;]+);/);
      expect(versionMatch).to.not.be.null;

      const solidityVersion = versionMatch![1].trim();
      const validVersions = ['>=0.8.0 <0.9.0', '^0.8.0'];

      expect(validVersions.includes(solidityVersion)).to.be.true;
    });
  });

  describe('String 값 검사', function () {
    it('string 타입의 상태변수 message의 초기값은 "Hello, Solidity!"이어야 합니다.', async function () {
      expect(await contract.getMessage()).to.equal('Hello, Solidity!');
    });

    it('string 타입의 상태변수 message는 private로 선언되어야 합니다.', async function () {
      try {
        await contract.message();
      } catch (e) {
        return;
      }

      expect.fail('message 호출 시 에러가 발생해야 합니다.');
    });

    it('함수 getMessage 호출 후 message의 값이 리턴되어야 합니다.', async function () {
      const isExist = (await contract.getMessage()) ? true : false;
      expect(isExist).to.equal(true);
    });

    it('함수 setMessage 호출 후 message의 값이 변경되어야 합니다.', async function () {
      const setMessage = await contract.setMessage('Hello, Insu!');
      await setMessage.wait();
      expect(await contract.getMessage()).to.equal('Hello, Insu!');
    });
  });

  describe('Array 값 검사', function () {
    describe('uint256 타입의 Array 값 검사', function () {
      it('uint256 타입의 배열 numbers는 private로 선언되어야 합니다.', async function () {
        try {
          await contract.numbers();
        } catch (e) {
          return;
        }

        expect.fail('numbers 호출 시 에러가 발생해야 합니다.');
      });

      it('uint256 타입의 배열 numbers의 초기값은 빈 배열 []이어야 합니다.', async function () {
        expect((await contract.getNumbers()).length).to.deep.equal(0);
      });

      it('함수 getNumbers 호출 후 numbers의 값이 리턴되어야 합니다.', async function () {
        const isExist = (await contract.getNumbers()) ? true : false;
        expect(isExist).to.equal(true);
      });

      it('함수 addNumber 호출 시 인자(uint256)를 받아 numbers의 값이 추가되어야 합니다.', async function () {
        const prevNumbers = (await contract.getNumbers()).length;

        const addNumber = await contract.addNumber(1);
        await addNumber.wait();

        const newNumbers = (await contract.getNumbers()).length;

        expect(prevNumbers < newNumbers).to.equal(true);
      });

      it('함수 getNumber는 index를 인자로 받아 numbers의 요소를 리턴해야 합니다.', async function () {
        const addNumber = await contract.addNumber(88);
        await addNumber.wait();

        const getNumber = await contract.getNumber(0);
        expect(getNumber).to.equal(88);
      });

      it('함수 getNumber에서 유효하지 않은 index를 요청하면 "Index out of bounds" 에러가 발생해야 합니다.', async function () {
        await expect(contract.getNumber(0)).to.be.revertedWith(
          'Index out of bounds'
        );
      });
    });

    describe('string 타입의 Array 값 검사', function () {
      it('string 타입의 배열 names는 private로 선언되어야 합니다.', async function () {
        try {
          await contract.names(0);
        } catch (e) {
          return;
        }

        expect.fail('names 호출 시 에러가 발생해야 합니다.');
      });

      it('string 타입의 배열 names의 초기값은 빈 배열 []이어야 합니다.', async function () {
        expect((await contract.getNames()).length).to.deep.equal(0);
      });

      it('함수 getNames 호출 후 names의 값이 리턴되어야 합니다.', async function () {
        const isExist = (await contract.getNames()) ? true : false;
        expect(isExist).to.equal(true);
      });

      it('함수 addName 호출 시 인자(string)을 받아 names의 값이 추가되어야 합니다.', async function () {
        const prevNames = (await contract.getNames()).length;
        const addName = await contract.addName('Alice');
        await addName.wait();
        const newNames = (await contract.getNames()).length;

        expect(prevNames < newNames).to.equal(true);
      });
    });
  });

  describe('mapping & struct 값 검사', function () {
    it('구조체(User)가 존재해야 합니다. 구조체는 string타입의 name과 uint256타입의 age가 있어야 합니다.', async function () {
      const contractPath = path.join(__dirname, '../contracts/DataType2.sol');
      const sourceCode = fs.readFileSync(contractPath, 'utf8');

      expect(sourceCode.match(/\bstruct\s+User\b/)).to.not.be.null;
      expect(sourceCode.match(/\bstring\s+name\b/)).to.not.be.null;
      expect(sourceCode.match(/\buint256\s+age\b/)).to.not.be.null;
    });

    it('address 타입을 Key로 uint256 타입을 Value로 갖고 있는 매핑 balances는 private로 선언되어야 합니다.', async function () {
      try {
        await contract.balances(newWallet.address);
      } catch (e) {
        return;
      }

      expect.fail('balances 호출 시 에러가 발생해야 합니다.');
    });

    it('address 타입을 Key로 User 구조체를 Value로 갖고 있는 매핑 users는 private로 선언되어야 합니다.', async function () {
      try {
        await contract.users(newWallet.address);
      } catch (e) {
        return;
      }

      expect.fail('users 호출 시 에러가 발생해야 합니다.');
    });

    it('함수 setBalance 호출 시 인자(address, uint256)를 받아 balances의 값이 추가되어야 합니다.', async function () {
      const isExisted = (await contract.getBalance(newWallet.address))
        ? true
        : false;

      const setBalance = await contract.setBalance(newWallet.address, 10);
      await setBalance.wait();

      const isExist = (await contract.getBalance(newWallet.address))
        ? true
        : false;

      expect(isExisted).to.not.equal(isExist);
    });

    it('함수 getBalance 호출 후 balances의 값이 리턴되어야 합니다.', async function () {
      const setBalance = await contract.setBalance(newWallet.address, 10);
      await setBalance.wait();

      const isExist = (await contract.getBalance(newWallet.address))
        ? true
        : false;
      expect(isExist).to.equal(true);
    });

    it('함수 setUser 호출 시 인자(address, string, uint256)를 받아 users 매핑에 User 구조체가 올바르게 저장되어야 합니다.', async function () {
      const tx = await contract.setUser(newWallet.address, 'Alice', 10);
      await tx.wait();

      const [name, age] = await contract.getUser(newWallet.address);

      expect(name).to.equal('Alice');
      expect(age).to.equal(10);
    });

    it('setUser에서 빈 이름 입력 시 "Name cannot be empty" 오류가 발생해야 합니다.', async function () {
      await expect(
        contract.setUser(newWallet.address, '', 10)
      ).to.be.revertedWith('Name cannot be empty');
    });

    it('getUser에서 등록되지 않은 사용자 조회 시 "User not found" 오류가 발생해야 합니다.', async function () {
      await expect(contract.getUser(newWallet.address)).to.be.revertedWith(
        'User not found'
      );
    });
  });

  describe('bytes 값 검사', function () {
    describe('가변 크기 bytes 검사', function () {
      it('bytes 타입을 갖고있는 dynamicData는 private로 선언되어야 합니다.', async function () {
        try {
          await contract.dynamicData();
        } catch (e) {
          return;
        }

        expect.fail('dynamicData 호출 시 에러가 발생해야 합니다.');
      });

      it('초기값으로 dynamicData가 비어 있어야 합니다.', async function () {
        expect(await contract.getDynamicData()).to.equal('0x');
      });

      it('setDynamicData 호출 후 dynamicData가 올바르게 변경되어야 합니다.', async function () {
        const isExisted =
          (await contract.getDynamicData()) === '0x' ? false : true;
        const newDynamicData = '0x1234567890abcdef';
        const setDynamicData = await contract.setDynamicData(newDynamicData);
        await setDynamicData.wait();

        const isExist =
          (await contract.getDynamicData()) === '0x' ? false : true;

        expect(isExisted).to.not.equal(isExist);
      });

      it('함수 getDynamicData 호출 시 dynamicData의 값이 리턴 되어야 합니다.', async function () {
        const newDynamicData = '0x1234567890abcdef';
        const setDynamicData = await contract.setDynamicData(newDynamicData);
        await setDynamicData.wait();

        expect(await contract.getDynamicData()).to.equal('0x1234567890abcdef');
      });
    });

    describe('고정 크기 (bytes1 ~ bytes32) 검사', function () {
      it('bytes32 타입을 갖고있는 fixedData는 private로 선언되어야 합니다.', async function () {
        try {
          await contract.fixedData();
        } catch (e) {
          return;
        }

        expect.fail('fixedData 호출 시 에러가 발생해야 합니다.');
      });

      it('fixedData는 초기값으로 0xabcdef1234560000000000000000000000000000000000000000000000000000 이 있어야 합니다.', async function () {
        expect(await contract.getFixedData()).to.equal(
          '0xabcdef1234560000000000000000000000000000000000000000000000000000'
        );
      });

      it('setFixedData 호출 시 인자(bytes32)를 받아 fixedData가 올바르게 변경되어야 합니다.', async function () {
        const isChanged =
          (await contract.getFixedData()) ===
          '0xabcdef1234560000000000000000000000000000000000000000000000000000'
            ? false
            : true;
        const newFixedData =
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const setFixedData = await contract.setFixedData(newFixedData);
        await setFixedData.wait();

        const isChange =
          (await contract.getFixedData()) ===
          '0xabcdef1234560000000000000000000000000000000000000000000000000000'
            ? false
            : true;

        expect(isChanged).to.not.equal(isChange);
      });

      it('함수 getFixedData 호출 시 fixedData의 값이 리턴 되어야 합니다.', async function () {
        const newFixedData =
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        const setFixedData = await contract.setFixedData(newFixedData);
        await setFixedData.wait();

        expect(await contract.getFixedData()).to.equal(
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        );
      });
    });
  });

  describe('getDetails() 함수 테스트', function () {
    it('getDetails() 호출 시 모든 값들이 올바르게 반환되어야 합니다.(message, numbers, names, fixedData, dynamicData)', async function () {
      await contract.setMessage('Hello, Insu!');
      await contract.addNumber(10);
      await contract.addName('Alice');
      await contract.setFixedData(
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      );
      await contract.setDynamicData(ethers.toUtf8Bytes('Dynamic Bytes Test'));

      const details = await contract.getDetails();

      // console.log(details);

      expect(details[0]).to.equal('Hello, Insu!');
      expect(details[1].map((n: any) => Number(n))).to.deep.equal([10]);
      expect(details[2]).to.deep.equal(['Alice']);
      expect(details[3]).to.equal(
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      );
      expect(ethers.toUtf8String(details[4])).to.equal('Dynamic Bytes Test');
    });
  });
});
