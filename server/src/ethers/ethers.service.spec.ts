import { Test, TestingModule } from '@nestjs/testing';
import { EthersService } from './ethers.service';
import { ConfigService } from '@nestjs/config';

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    ethers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({})),
      Wallet: jest.fn().mockImplementation(() => ({
        address: '0xMockSigner',
      })),
      Contract: jest.fn().mockImplementation(() => mockContract),
    },
    zeroPadValue: jest.fn((data, len) => `padded(${data},${len})`),
  };
});

const mockWait = jest.fn().mockResolvedValue('receipt');

const mockContract = {
  getMessage: jest.fn().mockResolvedValue('Hello, Solidity!'),
  setMessage: jest.fn().mockResolvedValue({ wait: mockWait }),

  getNumber: jest.fn().mockResolvedValue(123),
  addNumber: jest.fn().mockResolvedValue({ wait: mockWait }),
  getNumbers: jest.fn().mockResolvedValue([1n, 2n, 3n]),

  addName: jest.fn().mockResolvedValue({ wait: mockWait }),
  getNames: jest.fn().mockResolvedValue(['Alice', 'Bob']),

  setBalance: jest.fn().mockResolvedValue({ wait: mockWait }),
  getBalance: jest.fn().mockResolvedValue(1000n),

  setUser: jest.fn().mockResolvedValue({ wait: mockWait }),
  getUser: jest.fn().mockResolvedValue(['Charlie', 30n]),

  setDynamicData: jest.fn().mockResolvedValue({ wait: mockWait }),
  getDynamicData: jest.fn().mockResolvedValue('0x123456'),

  setFixedData: jest.fn().mockResolvedValue({ wait: mockWait }),
  getFixedData: jest
    .fn()
    .mockResolvedValue(
      '0xabcdef1234560000000000000000000000000000000000000000000000000000'
    ),

  getDetails: jest
    .fn()
    .mockResolvedValue([
      'Hello, Solidity!',
      [1n, 2n],
      ['Alice', 'Bob'],
      '0xabcdef1234560000000000000000000000000000000000000000000000000000',
      '0x123456',
    ]),
};

describe('EthersService', () => {
  let service: EthersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EthersService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'RPC_URL') return 'https://mock.rpc';
              if (key === 'PRIVATE_KEY') return 'mockPrivateKey';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EthersService>(EthersService);
  });

  it('getMessage()는 메시지를 반환해야 합니다.', async () => {
    expect(await service.getMessage()).toBe('Hello, Solidity!');
  });

  it('setMessage()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    expect(await service.setMessage('Hi')).toBe('receipt');
  });

  it('getNumber()는 숫자를 반환해야 합니다.', async () => {
    expect(await service.getNumber(0)).toBe(123);
  });

  it('addNumber()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    expect(await service.addNumber(123)).toBe('receipt');
  });

  it('getNumbers()는 배열을 반환해야 합니다.', async () => {
    expect(await service.getNumbers()).toEqual([1n, 2n, 3n]);
  });

  it('addName()은 트랜잭션 영수증을 반환해야 합니다.', async () => {
    expect(await service.addName('Alice')).toBe('receipt');
  });

  it('getNames()는 이름 배열을 반환해야 합니다.', async () => {
    expect(await service.getNames()).toEqual(['Alice', 'Bob']);
  });

  it('setBalance()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    expect(await service.setBalance('0xabc', 10)).toBe('receipt');
  });

  it('getBalance()는 값을 반환해야 합니다.', async () => {
    expect(await service.getBalance('0xabc')).toBe(1000n);
  });

  it('getUser()는 사용자 정보를 반환해야 합니다.', async () => {
    expect(await service.getUser('0xabc')).toEqual(['Charlie', 30n]);
  });

  it('setUser()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    expect(await service.setUser('0xabc', 'Bob', 25)).toBe('receipt');
  });

  it('getDynamicData()는 데이터를 반환해야 합니다.', async () => {
    expect(await service.getDynamicData()).toBe('0x123456');
  });

  it('setDynamicData()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    expect(await service.setDynamicData('0x4567')).toBe('receipt');
  });

  it('getFixedData()는 고정 데이터를 반환해야 합니다.', async () => {
    expect(await service.getFixedData()).toBe(
      '0xabcdef1234560000000000000000000000000000000000000000000000000000'
    );
  });

  it('setFixedData()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    expect(await service.setFixedData('0xdeadbeef')).toBe('receipt');
  });

  it('getDetails()는 모든 세부 정보를 반환해야 합니다.', async () => {
    expect(await service.getDetails()).toEqual([
      'Hello, Solidity!',
      [1n, 2n],
      ['Alice', 'Bob'],
      '0xabcdef1234560000000000000000000000000000000000000000000000000000',
      '0x123456',
    ]);
  });
});
