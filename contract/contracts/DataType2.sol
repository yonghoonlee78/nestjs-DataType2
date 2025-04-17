// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataType2 {
    // 1️⃣ 문자열 (String)
    string private message = "Hello, Solidity!";

    // 2️⃣ 배열 (Array)
    uint256[] private numbers;
    string[] private names;

    // 3️⃣ 구조체 (Struct)
    struct User {
        string name;
        uint256 age;
    }

    mapping(address => uint256) private balances;
    mapping(address => User) private users;

    bytes private dynamicData;
    bytes32 private fixedData =
        0xabcdef1234560000000000000000000000000000000000000000000000000000;

    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function addNumber(uint256 num) public {
        numbers.push(num);
    }

    function getNumber(uint256 index) public view returns (uint256) {
        require(index < numbers.length, "Index out of bounds");
        return numbers[index];
    }

    function getNumbers() public view returns (uint256[] memory) {
        return numbers;
    }

    function addName(string memory _name) public {
        names.push(_name);
    }

    function getNames() public view returns (string[] memory) {
        return names;
    }

    function setBalance(address _user, uint256 _amount) public {
        balances[_user] = _amount;
    }

    function getBalance(address _user) public view returns (uint256) {
        return balances[_user];
    }

    function setUser(address _addr, string memory _name, uint256 _age) public {
        require(
            keccak256(bytes(_name)) != keccak256(bytes("")),
            "Name cannot be empty"
        );
        users[_addr] = User(_name, _age);
    }

    function getUser(
        address _addr
    ) public view returns (string memory, uint256) {
        require(
            keccak256(bytes(users[_addr].name)) != keccak256(bytes("")),
            "User not found"
        );
        return (users[_addr].name, users[_addr].age);
    }

    function setDynamicData(bytes memory _data) public {
        dynamicData = _data;
    }

    function getDynamicData() public view returns (bytes memory) {
        return dynamicData;
    }

    function setFixedData(bytes32 _data) public {
        fixedData = _data;
    }

    function getFixedData() public view returns (bytes32) {
        return fixedData;
    }

    function getDetails()
        public
        view
        returns (
            string memory,
            uint256[] memory,
            string[] memory,
            bytes32,
            bytes memory
        )
    {
        return (message, numbers, names, fixedData, dynamicData);
    }
}
