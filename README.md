# Simple Storage Notes

Stores basic data within smart contract

## License

Optional but should added license to top of all solidity files, some compiles may complain about it

```
//SPDX-License-Identifier: MIT
```

## Solidity Version

All solidity files must specifiy the version of solidity to run at the top of the file.

```
pragma solidity 0.8.14;
```

add ^ to solidity version to allow any solidity above 0.8.2

```
pragma solidity ^0.8.14;
```

add >= if we want a randge of solidity version. Example below is solidity version range from 0.8.0 -> 0.8.10

```
pragma solidity >=0.8.0 <=0.8.10;
```

## Basic Solidity types

5 basic solidity types consist of boolean, uint, int, address, bytes

`boolean` - true false

`uint` - unsigned interger that cant be negative

`int` - positive or negative whole number

`address` - address of wallet or smart contract

Can specify amount of bytes a number or byte object will hold. Defaults to 256 bytes.

```
string favoriteNumberInText = "Five";
int256 favoriteInt = -5;
address myAddress =  0x5908e024c553Eb035d9fe9B12b314e942978b6c3;
bytes32 favoriteBytes = "cat";
bool hasFavoriteNumber = true;
```

## Visibility Types

`public` - visible externally and internally (creates a getter function for storage/state variables)

`private` - only visible in the current contract

`external` - only visible externally (only for functions) - i.e. can only be message-called (via this.func)

`internal` - only visible internally

Variables visibility default to internal type when not specified;

```
uint256 favoriteNumber == uint256 internal favoriteNumber
```

adding public to variable creates getter for anyone to read it

```
uint256 public favoriteNumber
```

## Functions basics

When adding public to a variables visibility type it essentially creates a function like so:

```
function retreive() public view returns(uint256){
     return favoriteNumber;
}
```

For functions that you just want to read data but dont manipulate the blockchain, you should use `view` or `pure` modifiers. To view data this does not cost gas!!

```
 function add() public pure returns(uint256){
     return(1 + 1);
 }
```

To allow a function to be overrided we need to add virtual modifier

```
function store(uint256 _favoriteNumber) public virtual {
    favoriteNumber = _favoriteNumber;
    //if we call retrieve in this function gas price will go up
}
```

When manipulating the block chain you always have to pay gas fees. The more tasks you do the higher the gas fee

## Structs

Structs are custom defined types that can group several variables

Structs are reference types. If you use a reference type, you always have to explicitly provide the data area where the type is stored: memory (whose lifetime is limited to an external function call), storage (the location where the state variables are stored, where the lifetime is limited to the lifetime of a contract) or calldata (special data location that contains the function arguments).

```
//when u have a list of variables inside of an object they automatically get indexed

struct People {
    uint256 favoriteNumber;
    string name;
}
```

add {} let soldity know we will be grabbing from these struct values

```
People public person = People({favoriteNumber: 2, name: "Spencer"});
```

## Array

Array is way to store a list or sequence of objects

```
People[] public people;
```

An array can either be dynamic in size by not specifing size.
Or an array can be fixed size by specifing its size in initialization.

Specifying its size cost less gass!!

```
//Aray size of two, cant be bigger
People[2] public people
```

to append to array use push function

```
people.push(People(_favoriteNumber, _name))
```

## Data Location

There are six places to store data

1. `Stack`
2. `Memory`
3. `Storage`
4. `Calldata`
5. `Code`
6. `Logs`

Reference types only have 3 places to store data these three places consist of `memory`, `storeage` and `callData`

`Memory` - variable will only exist temporarily within this function being called and can be modified

`CallData` - variable will only exist temporarily within this function being called and cannot be modified

`Storage` - variables exist outside function example is favorite Number or People above

### Note:

If you can, try to use calldata as data location because it will avoid copies and also makes sure that the data cannot be modified. Arrays and structs with calldata data location can also be returned from functions, but it is not possible to allocate such types.

## Mapping

Mapping is essentially a dictionary in other programming languages.

Mapping types use the syntax `mapping(KeyType => ValueType)` and variables of mapping type are declared using the syntax `mapping(KeyType => ValueType) VariableName`. The `KeyType` can be any built-in value type, bytes, string, or any contract or enum type. Other user-defined or complex types, such as mappings, structs or array types are not allowed. `ValueType` can be any type, including mappings, arrays and structs.

```
mapping(string => uint256) public nameToFavoriteNumber;
```
