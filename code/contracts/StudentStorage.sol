// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
contract StudentStoage{
  struct Student {
    uint id;
    string name;
    uint age;
    address account;
  }
  Student[] public StudentList;


  function addList(uint _age, string memory _username) public returns(uint){
    uint count = StudentList.length;
    uint index = count + 1;
    StudentList.push(Student(index, _username, _age, msg.sender));
    return StudentList.length;
  }

  function getList() public view returns(Student[] memory){
    Student[] memory list = StudentList;
    return list;
  }
}