// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketplace is  IERC2981, ERC721URIStorage {
    struct NFT {
        uint256 id;
        address payable owner;
        address payable creator; // Add a creator field
        uint256 price;
        uint256 royalty;
        string ipfsHash; // Store IPFS CID here
        bool forSale; // Add a forSale field
    }

    uint256 public nextTokenId = 0;
    mapping(uint256 => NFT) public nfts;

    event NFTMinted(uint256 indexed tokenId, address owner, uint256 price, uint256 royalty, string ipfsHash);
    event NFTBought(uint256 indexed tokenId, address buyer);
    event NFTListedForSale(uint256 indexed tokenId, address owner);

    constructor() ERC721("NFT Marketplace", "NFTM") {}

    function mint(uint256 price, string memory ipfsHash) public {
        uint256 newTokenId = nextTokenId;
        _mint(msg.sender, newTokenId);
        
        // Calculate the royalty as 10% of the price
        uint256 royalty = (price * 10) / 100;

        nfts[newTokenId] = NFT(newTokenId, payable(msg.sender), payable(msg.sender), price, royalty, ipfsHash, false); // Store the creator's address

        // Set the token's URI using the provided IPFS hash
        _setTokenURI(newTokenId, ipfsHash);

        nextTokenId++;
        emit NFTMinted(newTokenId, msg.sender, price, royalty, ipfsHash);
    }

    function listForSale(uint256 tokenId) public {
        NFT storage nft = nfts[tokenId];
        require(msg.sender == nft.owner, "Only the owner can list the NFT for sale");

        nft.forSale = true;

        emit NFTListedForSale(tokenId, msg.sender);
    }

    function getNFTByTokenId(uint256 tokenId) public view returns (NFT memory) {
        require(tokenId < nextTokenId, "Token with the given tokenId does not exist");
        return nfts[tokenId];
    }

    function buy(uint256 tokenId, uint256 price) public payable {
        require(msg.value >= price, "Incorrect price");

        NFT storage nft = nfts[tokenId];

        // Calculate the royalty amount
        uint256 royaltyAmount = (msg.value * nft.royalty) / 100;

        // Transfer the purchase price minus the royalty to the current owner
        nft.owner.transfer(msg.value - royaltyAmount);

        // Transfer the royalty amount to the NFT's creator
        nft.creator.transfer(royaltyAmount); // Pay the royalty to the creator

        // Transfer the NFT to the buyer
        _transfer(nft.owner, msg.sender, tokenId);
        nft.owner = payable(msg.sender);
        nft.forSale = false;

        emit NFTBought(tokenId, msg.sender);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        NFT memory nft = nfts[tokenId];
        return (nft.owner, (salePrice * nft.royalty) / 100);
    }

    function getAllNFTs() public view returns (NFT[] memory) {
        NFT[] memory _nfts = new NFT[](nextTokenId); // Initialize with the correct length
        for (uint i = 0; i < nextTokenId; i++) {
            _nfts[i] = nfts[i];
        }
        return _nfts;
    }

    function getNFTsByOwner(address owner) public view returns (NFT[] memory) {
        uint count = 0;
        for (uint i = 0; i < nextTokenId; i++) {
            if (nfts[i].owner == owner) {
                count++;
            }
        }

        NFT[] memory _nfts = new NFT[](count); // Initialize with the correct length
        uint index = 0;
        for (uint i = 0; i < nextTokenId; i++) {
            if (nfts[i].owner == owner) {
                _nfts[index] = nfts[i];
                index++;
            }
        }
        return _nfts;
    }
}
