import { ethers } from 'ethers';
import React, { useState, useEffect } from "react";
import { SecondNav } from '../../Navbar';
import { contractAddress } from '../config.js';
import "./List.css"


const List = () => {
    const [contract, setContract] = useState('');
    const [contractLoaded, setContractLoaded] = useState(false);
    const [nfts, setNfts] = useState([]);

    const abi = [
        {
            "inputs": [],
            "name": "getAllNFTs",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address payable",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "internalType": "address payable",
                    "name": "creator",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "royalty",
                    "type": "uint256"
                  },
                  {
                    "internalType": "string",
                    "name": "ipfsHash",
                    "type": "string"
                  },
                  {
                    "internalType": "bool",
                    "name": "forSale",
                    "type": "bool"
                  }
                ],
                "internalType": "struct NFTMarketplace.NFT[]",
                "name": "",
                "type": "tuple[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
      ];

    const fetchDataFromIPFS = async (cid) => {
        try {
            const response = await fetch(cid);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from IPFS. Status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching data from IPFS:', error);
            return null;
        }
    };
    const truncateAddress = (address) => {
        if (address.length < 9) return address; // Return as is if it's too short
        const start = address.slice(0, 5);
        const end = address.slice(-4);
        return `${start}...${end}`;
    };

    const details = (id) => {
        // navigate(`/description/${id}`);
        window.location.href = `details/${id}`;
    
      };
    const connectToContract = async () => {
      try {
        // Connect to an Ethereum provider (e.g., Metamask or a custom provider)
        const provider = new ethers.BrowserProvider(window.ethereum);
        // Request access to the user's Ethereum wallet
        const signer = await provider.getSigner();
        // Create a contract instance
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        setContract(contractInstance);
        setContractLoaded(true);
      } catch (error) {
        console.error('Error connecting to the contract:', error);
      }
    };

    useEffect(() => {
        connectToContract();
    }, []);

    useEffect(() => {
        listAllNFT();
    }, [contractLoaded]);


    //list all the minted nfts

    const listAllNFT = async () => {
        if (contractLoaded && contract) {
            try {
                const nftIds = await contract.getAllNFTs();
                console.log(nftIds)
                const nftDataPromises = nftIds
                    .filter(nftId => nftId[6]) // Filter to get NFTs where forSale is true
                    .map(async (nftId) => {
                        const nftInfo = {
                            id: nftId[0],
                            owner: nftId[1],
                            creator: nftId[2],
                            price: nftId[3],
                            royalty: nftId[4],
                            ipfsHash: nftId[5],
                            forSale: nftId[6]
                        };
                        if (nftInfo.ipfsHash) {
                            try {
                                const ipfsData = await fetchDataFromIPFS(nftInfo.ipfsHash);
                                if (ipfsData) {
                                    nftInfo.image = ipfsData.image.pinataURL;
                                    nftInfo.name = ipfsData.name;
                                }
                            } catch (error) {
                                console.error('Error fetching IPFS data:', error);
                            }
                        }
                        return nftInfo;
                    });
                const nftData = await Promise.all(nftDataPromises);
                setNfts(nftData);
            } catch (error) {
                console.error('Error fetching NFT data:', error);
            }
        }
    };
    

    return (
        <div>
            <SecondNav />
            <h1 style={{fontSize:"50px", color:"black", marginTop:"100px", fontWeight:"bold"}}>Marketplace</h1>
            <div className='line1'></div>
            <div className='line2'></div>

            <div className="bg-gradient-to-bl from-blue-50 to-violet-50 flex items-center justify-center lg:h-screen">
                <div className="container mx-auto mx-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                        {nfts.map((nft, index) => (
                            <div key={index} className="bg-white rounded-lg border p-4"   onClick={() => details(nft.id)}
                            >
                                {nft.image && (
                                    <>
                                        <img
                                            src={nft.image}
                                            alt={`NFT Image ${index + 1}`}
                                            className="w-full h-48 rounded-md object-cover"
                                        />
                                        <div className="px-1 py-4">
                                            <div className="font-bold text-xl mb-2">{nft.name}</div>
                                            <p className="text-gray-700 text-base">ID: {nft.id.toString()}</p>
                                            <p>Owner: {truncateAddress(nft.owner)}</p>
                                            <p>Creator: {truncateAddress(nft.creator)}</p>

                                            <p>Price: {nft.price.toString()}</p>
                                            <p>Royalty: {nft.royalty.toString()}</p>
                                        </div>
                                        <div className="px-1 py-4">
                                        <button onClick={() => details(nft.id)} type="button" class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">View</button>

                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List;
