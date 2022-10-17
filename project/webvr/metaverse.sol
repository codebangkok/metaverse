//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Metaverse is ERC721Enumerable, Ownable {

    struct Item {
        int8 itemType;
        string texture;  
        int8 x;
        int8 y;
        int8 z;              
        int8 width;        
        int8 depth;
        int8 height;        
        int8 radiusTop;
        int8 radiusBottom;     
        int8 radialSegments;         
    }
    
    mapping(uint => Item) private _items;

    constructor() ERC721("Metaverse", "META") {
        
    }

    function items() public view returns (Item[] memory) {                
        Item[] memory allItems = new Item[](totalSupply());
        for (uint i = 0; i < totalSupply(); i++) {
            uint tokenId = tokenByIndex(i);
            allItems[i] = _items[tokenId];
        }
        return allItems;
    }

    function owners() public view returns (Item[] memory) {     
        uint balance = balanceOf(msg.sender);   
        Item[] memory ownerItems = new Item[](balance);
        for (uint i = 0; i < balanceOf(msg.sender); i++) {
            uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
            ownerItems[i] = _items[tokenId];
        }
        return ownerItems;
    }

    function mint(
        int8 itemType, 
        string memory texture,
        int8 x, 
        int8 y, 
        int8 z, 
        int8 width, 
        int8 depth,
        int8 height,          
        int8 radiusTop,
        int8 radiusBottom,
        int8 radialSegments) public onlyOwner {

        uint tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
        Item memory item = Item(itemType, texture, x, y, z, width, depth, height, radiusTop, radiusBottom, radialSegments);
        _items[tokenId] = item;
    }
}