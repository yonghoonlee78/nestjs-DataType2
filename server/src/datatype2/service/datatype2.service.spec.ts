import { Test, TestingModule } from '@nestjs/testing';
import { Datatype2Service } from './datatype2.service';
import { EthersService } from '../../ethers/ethers.service';
import { exceptions } from '../../exceptions/exception.config';

const mockContract = {
  getMessage: jest.fn(),
  setMessage: jest.fn(),
  getNumber: jest.fn(),
  addNumber: jest.fn(),
  getNumbers: jest.fn(),
  addName: jest.fn(),
  getNames: jest.fn(),
  setBalance: jest.fn(),
  getBalance: jest.fn(),
  getUser: jest.fn(),
  setUser: jest.fn(),
  setFixedData: jest.fn(),
  getFixedData: jest.fn(),
  setDynamicData: jest.fn(),
  getDynamicData: jest.fn(),
  getDetails: jest.fn(),
};

const mockEthersService = {
  getContract: jest.fn(),
};

describe('Datatype2Service', () => {
  let service: Datatype2Service;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockEthersService.getContract.mockResolvedValue(mockContract);

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
      mockContract.getMessage.mockResolvedValue('hello');
      const result = await service.message();
      expect(result).toBe('hello');
    });

    it('message 값이 있으면 setMessage를 실행하고 결과를 반환해야 합니다.', async () => {
      mockContract.setMessage.mockResolvedValue({ wait: async () => {} });
      mockContract.getMessage.mockResolvedValue('changed');
      const result = await service.message('changed');
      expect(result).toBe('changed');
    });
  });

  describe('number', () => {
    it('index가 있으면 getNumber를 실행해야 합니다.', async () => {
      mockContract.getNumber.mockResolvedValue(42);
      const result = await service.number(1);
      expect(result).toBe(42);
    });

    it('number가 있으면 addNumber를 실행해야 합니다.', async () => {
      mockContract.addNumber.mockResolvedValue({ wait: async () => {} });
      mockContract.getNumbers.mockResolvedValue(['123']);
      const result = await service.number(undefined, 123);
      expect(result).toEqual(['123']);
    });

    it('"Index out of bounds" 오류가 발생하면 INDEX_OUT_OF_BOUNDS 예외를 던져야 합니다.', async () => {
      mockContract.getNumber.mockRejectedValue({ reason: 'Index out of bounds' });
      await expect(service.number(999)).rejects.toEqual(
        exceptions.INDEX_OUT_OF_BOUNDS,
      );
    });
  });

  describe('addName', () => {
    it('addName을 호출하고 결과를 반환해야 합니다.', async () => {
      mockContract.addName.mockResolvedValue({ wait: async () => {} });
      mockContract.getNames.mockResolvedValue(['Alice', 'Bob']);
      const result = await service.addName('Bob');
      expect(result).toEqual(['Alice', 'Bob']);
    });
  });

  describe('names', () => {
    it('getNames를 호출하고 결과를 반환해야 합니다.', async () => {
      mockContract.getNames.mockResolvedValue(['Alice', 'Bob']);
      const result = await service.names();
      expect(result).toEqual(['Alice', 'Bob']);
    });
  });

  describe('balance', () => {
    it('value가 없으면 getBalance를 호출해야 합니다.', async () => {
      mockContract.getBalance.mockResolvedValue(100);
      const result = await service.balance('0xabc');
      expect(result).toBe(100);
    });

    it('value가 있으면 setBalance를 호출해야 합니다.', async () => {
      mockContract.setBalance.mockResolvedValue({ wait: async () => {} });
      mockContract.getBalance.mockResolvedValue(100);
      const result = await service.balance('0xabc', 100);
      expect(result).toBe(100);
    });
  });

  describe('user', () => {
    it('name이 빈 문자열이면 NAME_CANNOT_BE_EMPTY 예외를 던져야 합니다.', async () => {
      await expect(service.user('0x123', '')).rejects.toEqual(
        exceptions.NAME_CANNOT_BE_EMPTY,
      );
    });

    it('name과 age가 있으면 setUser를 실행하고 결과를 반환해야 합니다.', async () => {
      mockContract.setUser.mockResolvedValue({ wait: async () => {} });
      mockContract.getUser.mockResolvedValue(['Alice', 25]);
      const result = await service.user('0x123', 'Alice', 25);
      expect(result).toEqual({ name: 'Alice', age: '25' });
    });

    it('getUser 결과의 bigint는 문자열로 변환되어야 합니다.', async () => {
      mockContract.getUser.mockResolvedValue(['Alice', 30]);
      const result = await service.user('0xabc');
      expect(result).toEqual({ name: 'Alice', age: '30' });
    });

    it('"User not found" 오류가 발생하면 USER_NOT_FOUND 예외를 던져야 합니다.', async () => {
      mockContract.getUser.mockRejectedValue({ reason: 'User not found' });
      await expect(service.user('0xabc')).rejects.toEqual(
        exceptions.USER_NOT_FOUND,
      );
    });
  });

  describe('numbers', () => {
    it('getNumbers 결과의 bigint는 문자열로 변환되어야 합니다.', async () => {
      mockContract.getNumbers.mockResolvedValue([1, 2]);
      const result = await service.numbers();
      expect(result).toEqual(['1', '2']);
    });
  });

  describe('fixedData', () => {
    it('data가 없으면 getFixedData를 반환해야 합니다.', async () => {
      mockContract.getFixedData.mockResolvedValue('0xabc');
      const result = await service.fixedData();
      expect(result).toBe('0xabc');
    });

    it('data가 바이트 형이면 패딩 후 setFixedData를 실행해야 합니다.', async () => {
      // 서비스 내부에서는 isBytesLike, encodeBytes32String 등 직접 사용이므로
      // 이 테스트에서는 그 부분을 직접 mock 할 필요 없음
      mockContract.setFixedData.mockResolvedValue({ wait: async () => {} });
      mockContract.getFixedData.mockResolvedValue('0xpad');
      const result = await service.fixedData('0xabc');
      expect(result).toBe('0xpad');
    });

    it('data가 문자열이면 인코딩 및 패딩 후 setFixedData를 실행해야 합니다.', async () => {
      mockContract.setFixedData.mockResolvedValue({ wait: async () => {} });
      mockContract.getFixedData.mockResolvedValue('0xpad');
      const result = await service.fixedData('hello');
      expect(result).toBe('0xpad');
    });
  });

  describe('dynamicData', () => {
    it('data가 없으면 getDynamicData를 반환해야 합니다.', async () => {
      mockContract.getDynamicData.mockResolvedValue('0xdyn');
      const result = await service.dynamicData();
      expect(result).toBe('0xdyn');
    });

    it('data가 바이트 형이면 setDynamicData를 호출해야 합니다.', async () => {
      mockContract.setDynamicData.mockResolvedValue({ wait: async () => {} });
      mockContract.getDynamicData.mockResolvedValue('0xreceipt');
      const result = await service.dynamicData('0xabc');
      expect(result).toBe('0xreceipt');
    });

    it('data가 문자열이면 toUtf8Bytes 후 setDynamicData 호출해야 합니다.', async () => {
      mockContract.setDynamicData.mockResolvedValue({ wait: async () => {} });
      mockContract.getDynamicData.mockResolvedValue('0xreceipt');
      const result = await service.dynamicData('hello');
      expect(result).toBe('0xreceipt');
    });
  });

  describe('getDetails', () => {
    it('ethersService.getDetails 결과를 그대로 반환해야 합니다.', async () => {
      const mockResult = [
        'msg',
        ['1', '2'],
        ['Alice', 'Bob'],
        '0xfixed',
        '0xdyn',
      ];
      mockContract.getDetails.mockResolvedValue(mockResult);
      const result = await service.getDetails();
      expect(result).toEqual({
        message: 'msg',
        numbers: ['1', '2'],
        names: ['Alice', 'Bob'],
        fixedData: '0xfixed',
        dynamicData: '0xdyn',
      });
    });

    it('ethersService.getDetails의 결과에서 bigint를 문자열로 변환해야 합니다.', async () => {
      const mockResult = [
        'msg',
        [1, 2],
        ['Alice', 'Bob'],
        '0xfixed',
        '0xdyn',
      ];
      mockContract.getDetails.mockResolvedValue(mockResult);
      const result = await service.getDetails();
      expect(result).toEqual({
        message: 'msg',
        numbers: ['1', '2'],
        names: ['Alice', 'Bob'],
        fixedData: '0xfixed',
        dynamicData: '0xdyn',
      });
    });
  });
});
