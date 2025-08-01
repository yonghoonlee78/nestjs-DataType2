// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract DataType2 {

    string private message = "Hello, Solidity!"; 

  
    function getMessage() public view returns (string memory) {
        return message;
    }

    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }

   
    uint256[] private numbers; 

    function getNumbers() public view returns (uint256[] memory) {
        return numbers;
    }

    function addNumber(uint256 _number) public {
        numbers.push(_number);
    }

    function getNumber(uint256 _index) public view returns (uint256) {
        require(_index < numbers.length, "Index out of bounds"); 
        return numbers[_index];
    }

    
    string[] private names; 

    function getNames() public view returns (string[] memory) {
        return names;
    }

    function addName(string memory _name) public {
        names.push(_name);
    }

   
    struct User {
        string name;
        uint256 age;
    }

    mapping(address => uint256) private balances;
    mapping(address => User) private users;

    function setBalance(address _userAddress, uint256 _amount) public {
        balances[_userAddress] = _amount;
    }

    function getBalance(address _userAddress) public view returns (uint256) {
        return balances[_userAddress];
    }

    function setUser(address _userAddress, string memory _name, uint256 _age) public {
        require(bytes(_name).length > 0, "Name cannot be empty"); // 이름 비어있는지 확인
        users[_userAddress] = User(_name, _age);
    }

    function getUser(address _userAddress) public view returns (string memory, uint256) {
        require(bytes(users[_userAddress].name).length > 0, "User not found");
        return (users[_userAddress].name, users[_userAddress].age);
    }

    bytes private dynamicData; 

    function getDynamicData() public view returns (bytes memory) {
        return dynamicData;
    }

    function setDynamicData(bytes memory _data) public {
        dynamicData = _data;
    }

    bytes32 private fixedData = 0xabcdef1234560000000000000000000000000000000000000000000000000000;

    function getFixedData() public view returns (bytes32) {
        return fixedData;
    }

    function setFixedData(bytes32 _data) public {
        fixedData = _data;
    }


    function getDetails() public view returns (
        string memory,
        uint256[] memory,
        string[] memory,
        bytes32,
        bytes memory
    ) {
        return (message, numbers, names, fixedData, dynamicData);
    }
}
