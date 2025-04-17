import { Test, TestingModule } from '@nestjs/testing';
import { Datatype2Service } from './datatype2.service';
import { EthersService } from '../../ethers/ethers.service';
import { exceptions } from '../../exceptions/exception.config';

const mockEthersService = {
  getMessage: jest.fn(),
  setMessage: jest.fn(),
  getNumber: jest.fn(),
  addNumber: jest.fn(),
  getNumbers: jest.fn(),
  addName: jest.fn(),
  getNames: jest.fn(),
  getBalance: jest.fn(),
  setBalance: jest.fn(),
  getUser: jest.fn(),
  setUser: jest.fn(),
  getFixedData: jest.fn(),
  setFixedData: jest.fn(),
  isBytesLike: jest.fn(),
  encodeBytes32String: jest.fn(),
  zeroPadValue32: jest.fn(),
  getDynamicData: jest.fn(),
  setDynamicData: jest.fn(),
  toUtf8Bytes: jest.fn(),
  getDetails: jest.fn(),
};

describe('Datatype2Service', () => {
  let service: Datatype2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Datatype2Service,
        { provide: EthersService, useValue: mockEthersService },
      ],
    }).compile();

    service = module.get<Datatype2Service>(Datatype2Service);
  });

  describe('message', () => {
    it('message 값이 없으면 getMessage를 반환해야 합니다.', async () => {
      mockEthersService.getMessage.mockResolvedValue('hello');
      const result = await service.message();
      expect(result).toBe('hello');
    });

    it('message 값이 있으면 setMessage를 실행하고 결과를 반환해야 합니다.', async () => {
      mockEthersService.setMessage.mockResolvedValue('receipt');
      const result = await service.message('new message');
      expect(result).toBe('receipt');
    });
  });

  describe('number', () => {
    it('index가 있으면 getNumber를 실행해야 합니다.', async () => {
      mockEthersService.getNumber.mockResolvedValue(42);
      const result = await service.number(1);
      expect(result).toBe(42);
    });

    it('number가 있으면 addNumber를 실행해야 합니다.', async () => {
      mockEthersService.addNumber.mockResolvedValue('receipt');
      const result = await service.number(undefined, 123);
      expect(result).toBe('receipt');
    });

    it('"Index out of bounds" 오류가 발생하면 INDEX_OUT_OF_BOUNDS 예외를 던져야 합니다.', async () => {
      mockEthersService.getNumber.mockRejectedValue({
        reason: 'Index out of bounds',
      });
      await expect(service.number(999)).rejects.toEqual(
        exceptions.INDEX_OUT_OF_BOUNDS
      );
    });
  });

  describe('addName', () => {
    it('addName을 호출하고 결과를 반환해야 합니다.', async () => {
      mockEthersService.addName.mockResolvedValue('added');
      const result = await service.addName('Bob');
      expect(result).toBe('added');
    });
  });

  describe('names', () => {
    it('getNames를 호출하고 결과를 반환해야 합니다.', async () => {
      mockEthersService.getNames.mockResolvedValue(['Alice', 'Bob']);
      const result = await service.names();
      expect(result).toEqual(['Alice', 'Bob']);
    });
  });

  describe('balance', () => {
    it('value가 없으면 getBalance를 호출해야 합니다.', async () => {
      mockEthersService.getBalance.mockResolvedValue(100);
      const result = await service.balance('0xabc');
      expect(result).toBe(100);
    });

    it('value가 있으면 setBalance를 호출해야 합니다.', async () => {
      mockEthersService.setBalance.mockResolvedValue('receipt');
      const result = await service.balance('0xabc', 100);
      expect(result).toBe('receipt');
    });
  });

  describe('user', () => {
    it('name이 빈 문자열이면 NAME_CANNOT_BE_EMPTY 예외를 던져야 합니다.', async () => {
      await expect(service.user('0x123', '')).rejects.toEqual(
        exceptions.NAME_CANNOT_BE_EMPTY
      );
    });

    it('name과 age가 있으면 setUser를 실행하고 결과를 반환해야 합니다.', async () => {
      mockEthersService.setUser.mockResolvedValue('receipt');
      const result = await service.user('0x123', 'Alice', 25);
      expect(result).toBe('receipt');
    });

    it('getUser 결과의 bigint는 문자열로 변환되어야 합니다.', async () => {
      mockEthersService.getUser.mockResolvedValue(['Alice', BigInt(30)]);
      const result = await service.user('0xabc');
      expect(result).toEqual(['Alice', '30']);
    });

    it('"User not found" 오류가 발생하면 USER_NOT_FOUND 예외를 던져야 합니다.', async () => {
      mockEthersService.getUser.mockRejectedValue({ reason: 'User not found' });
      await expect(service.user('0xabc')).rejects.toEqual(
        exceptions.USER_NOT_FOUND
      );
    });
  });

  describe('numbers', () => {
    it('getNumbers 결과의 bigint는 문자열로 변환되어야 합니다.', async () => {
      mockEthersService.getNumbers.mockResolvedValue([1n, 2n]);
      const result = await service.numbers();
      expect(result).toEqual(['1', '2']);
    });
  });

  describe('fixedData', () => {
    it('data가 없으면 getFixedData를 반환해야 합니다.', async () => {
      mockEthersService.getFixedData.mockResolvedValue('0xabc');
      const result = await service.fixedData();
      expect(result).toBe('0xabc');
    });

    it('data가 바이트 형이면 패딩 후 setFixedData를 실행해야 합니다.', async () => {
      mockEthersService.isBytesLike.mockResolvedValue(true);
      mockEthersService.zeroPadValue32.mockResolvedValue('0xpad');
      mockEthersService.setFixedData.mockResolvedValue('receipt');
      const result = await service.fixedData('0xabc');
      expect(result).toBe('receipt');
    });

    it('data가 문자열이면 인코딩 및 패딩 후 setFixedData를 실행해야 합니다.', async () => {
      mockEthersService.isBytesLike.mockResolvedValue(false);
      mockEthersService.encodeBytes32String.mockResolvedValue('0xenc');
      mockEthersService.zeroPadValue32.mockResolvedValue('0xpad');
      mockEthersService.setFixedData.mockResolvedValue('receipt');
      const result = await service.fixedData('hello');
      expect(result).toBe('receipt');
    });
  });

  describe('dynamicData', () => {
    it('data가 없으면 getDynamicData를 반환해야 합니다.', async () => {
      mockEthersService.getDynamicData.mockResolvedValue('0xdyn');
      const result = await service.dynamicData();
      expect(result).toBe('0xdyn');
    });

    it('data가 바이트 형이면 setDynamicData를 호출해야 합니다.', async () => {
      mockEthersService.isBytesLike.mockResolvedValue(true);
      mockEthersService.setDynamicData.mockResolvedValue('receipt');
      const result = await service.dynamicData('0xabc');
      expect(result).toBe('receipt');
    });

    it('data가 문자열이면 toUtf8Bytes 후 setDynamicData 호출해야 합니다.', async () => {
      mockEthersService.isBytesLike.mockResolvedValue(false);
      mockEthersService.toUtf8Bytes.mockResolvedValue('0xutf8');
      mockEthersService.setDynamicData.mockResolvedValue('receipt');
      const result = await service.dynamicData('hello');
      expect(result).toBe('receipt');
    });
  });

  describe('getDetails', () => {
    it('ethersService.getDetails 결과를 그대로 반환해야 합니다.', async () => {
      const mockResult = [123n, 456n, true, '0xWallet', '0xRecipient'];
      mockEthersService.getDetails.mockResolvedValue(mockResult);
      const result = await service.getDetails();
      expect(result).toEqual(['123', '456', true, '0xWallet', '0xRecipient']);
    });

    it('ethersService.getDetails의 결과에서 bigint를 문자열로 변환해야 합니다.', async () => {
      const mockResult = [123n, 456n, true, '0xWallet', '0xRecipient'];
      mockEthersService.getDetails.mockResolvedValue(mockResult);
      const result = await service.getDetails();
      expect(result).toEqual(['123', '456', true, '0xWallet', '0xRecipient']);
    });
  });
});
