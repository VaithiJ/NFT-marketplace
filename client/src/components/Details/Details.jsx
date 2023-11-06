import React, { useState, useEffect } from "react";
import { SecondNav } from "../../Navbar";
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { contractAddress } from '../config.js';
import nvvv from "./nv.png"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom


const Details = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(false); // Add loading state for the "List NFT" button

    const { nftId } = useParams(); // Get the NFT ID from the route parameter
    const [contract, setContract] = useState('');
    const abi = [
        {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              }
            ],
            "name": "getNFTByTokenId",
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
                "internalType": "struct NFTMarketplace.NFT",
                "name": "",
                "type": "tuple"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },

        {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              }
            ],
            "name": "buy",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              }
            ],
            "name": "listForSale",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
    ];
    const [signerr, setSigner] = useState('');
    const [contractLoaded, setContractLoaded] = useState(false);
    const [nftInfo, setNftInfo] = useState(null); // Use the name 'nftInfo' for consistency
    const [isOwner, setIsOwner] = useState(false); // Flag to check if the user is the owner

    const connectToContract = async () => {
        try {
            // Connect to an Ethereum provider (e.g., Metamask or a custom provider)
            const provider = new ethers.BrowserProvider(window.ethereum);
            // Request access to the user's Ethereum wallet
            const signer = await provider.getSigner();
            setSigner(signer.address);
            // Create a contract instance
            const contractInstance = new ethers.Contract(contractAddress, abi, signer);
            setContract(contractInstance);
            setContractLoaded(true);
        } catch (error) {
            console.error('Error connecting to the contract:', error);
        }
    };



    const checkOwnership = async () => {
        if (contractLoaded && contract) {
            try {
                const nftData = await contract.getNFTByTokenId(nftId);
                const creatorAddress = nftData.owner.toLowerCase(); // Convert to lowercase for case-insensitive comparison
                const signerAddress = signerr.toLowerCase();

                // Check if the creator and signer address are the same
                if (creatorAddress === signerAddress) {
                    setIsOwner(true);
                }
            } catch (error) {
                console.error('Error checking ownership:', error);
            }
        }
    };
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

    const buyNft = async(price) => {
        setLoading(true);

        try {
            const priceAsString = price.toString();
            const nftData = await contract.buy(nftId, price, { value: ethers.parseEther(priceAsString), gasLimit: 300000 }); // Adjust the gas limit as needed
            const receipt = await nftData.wait();
            setLoading(false);

            console.log("Transaction receipt:", receipt); 
            Swal.fire({
                title: 'Success',
                text: 'You have bought this NFT.',
              });
            window.location.reload()
        }
        catch(error) {
            console.log(error)
        }
    }
    
    const listforsalee = async()=>{
        setLoadingList(true); // Set loading state to true while performing the listing action

        try{
            const nftData = await contract.listForSale(nftId);
            console.log(nftData)
            const receipt = await nftData.wait();
            console.log(receipt)
            Swal.fire({
                title: 'Success',
                text: 'Listed NFT for sale',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Navigate to the "/collections" page
                    navigate('/collections');
                }
            });
        }catch(error){
            console.log(error)
        }finally {
            setLoadingList(false); // Set loading state back to false after the action is completed
        }
    }
    
    const nftdetails = async () => {
        if (contractLoaded && contract) { // Check that contract, contractLoaded, and nftId are defined
            try {
                const nftData = await contract.getNFTByTokenId(nftId);

                // Assuming nftData is a single object and not an array of objects
                const nftInfo = {
                    id: nftData[0],
                    owner: nftData[1],
                    creator: nftData[2],
                    price: nftData[3],
                    royalty: nftData[4],
                    ipfsHash: nftData[5],
                    forsale: nftData[6]
                };
console.log(nftInfo)
                if (nftInfo.ipfsHash) {
                    try {
                        const ipfsData = await fetchDataFromIPFS(nftInfo.ipfsHash);
                        if (ipfsData) {
                            nftInfo.image = ipfsData.image.pinataURL;
                            nftInfo.name = ipfsData.name;
                            nftInfo.description = ipfsData.description; // Add description
                        }
                    } catch (error) {
                        console.error('Error fetching IPFS data:', error);
                    }
                }

                setNftInfo(nftInfo); // Update the 'nftInfo' state
            } catch (error) {
                console.error('Error fetching NFT data:', error);
            }
        }
    };

    useEffect(() => {
        connectToContract();
    }, []);

    useEffect(() => {
        nftdetails();
        checkOwnership();

    }, [contractLoaded, nftId]);

    return (
        <div>
            <SecondNav />
            <section className="text-gray-600 body-font overflow-hidden mt-10">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <img
                            alt="ecommerce"
                            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                            src={nftInfo ? nftInfo.image : "https://dummyimage.com/400x400"} // Use the image from nftInfo or a placeholder image
                        />
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            
                            <h1 className="text-purple-light dark:text-purple-dark text-3xl title-font font-medium mb-3">
                                 Name: {nftInfo ? nftInfo.name : "NFT Title"} {/* Display NFT title or a placeholder */}
                            </h1>
                            <h1 className="text-purple-light dark:text-purple-dark text-3xl title-font font-medium mb-3">
                                 Description: {nftInfo ? nftInfo.description : "NFT Description"} {/* Display NFT title or a placeholder */}
                            </h1>
                            <h1 className="text-purple-light dark:text-purple-dark text-3xl title-font font-medium mb-3">
                                 Price:  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {nftInfo ? `${nftInfo.price} ETH` : "N/A"} {/* Display NFT price or "N/A" */}
                                </span> {/* Display NFT title or a placeholder */}
                            </h1>
                           
                          
                            <div className="flex">
                              
                                <button
                            onClick={() => buyNft(nftInfo.price)}
                            type="button"
                            className={`flex ml-auto text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center relative right-40 mb-2 ${isOwner ? "hidden" : ""}`}
                        >
                            Buy NFT
                        </button>
                        {loading && (
                                    <div className="loader-container" style={{position:"relative", left:"-500px"}} >
                                        <div className="relative flex justify-center items-center">
                                            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500">
                                                <img style={{width:"80px", height:"60px",marginTop:"40px", marginLeft:"30px"}} src={nvvv} className="rounded-full h-28 w-28" alt="Loader" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                        {isOwner && (
                            <div className="bg-green-500 text-white font-semibold mt-2 py-1 px-2 rounded-md text-right relative left-40">
        You are the owner
    </div>                        )}

                            </div>
                            {!nftInfo ? null : ( // Check if nftInfo is not null
    !nftInfo.forsale ? ( // Check if forsale is false
        <button
            onClick={listforsalee}
            type="button"
            disabled={loadingList} // Disable the button when loadingList is true
            className={`flex ml-auto text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center relative right-40 mb-2`}
        >
            {loadingList ? ( // Use the loading state to determine the button text
                <div className="loader-container" style={{ position: "relative", left: "-200px" }}>
                    <div className="relative flex justify-center items-center">
                        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500">
                            <img style={{ width: "80px", height: "60px", marginTop: "40px", marginLeft: "30px" }} src={nvvv} className="rounded-full h-28 w-28" alt="Loader" />
                        </div>
                    </div>
                </div>
            ) : (
                "List NFT"
            )}
        </button>
    ) : null
)}



                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Details;
