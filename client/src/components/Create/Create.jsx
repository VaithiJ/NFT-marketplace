import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ethers } from 'ethers';
import React, { useState, useRef, useEffect } from 'react';
import { contractAddress } from '../config.js';
import nftman from './nft11.png';
import { SecondNav } from '../../Navbar';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../../Ipfs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Create.css';
import nvvv from "./nv.png"

const Create = () => {
  const navigate = useNavigate();
  const [contract, setContract] = useState('');
  const [jsonurl, setJsonUrl] = useState('');
  const abi = ['function mint(uint256 price, string memory ipfsHash) public'];

  const [loading, setLoading] = useState(false);
  const [sweetAlertMessage, setSweetAlertMessage] = useState('');


//Connect to the wallet and create a contract instance
  const connectToContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractt = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractt);
    } catch (error) {
      console.error('Error connecting to the contract:', error);
    }
  };


  //fetch data from ipfs hash

  const fetchDataFromIPFS = async (cid) => {
    try {
      const response = await axios.get(cid);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from IPFS:', error);
      return null;
    }
  };

  useEffect(() => {
    connectToContract();
  }, []);


//mint the nft

  const mintnft = async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const imageInput = document.getElementById('file');
    const price = document.getElementById('number');
  
    if (!name || !description || !imageInput.files[0] || !price.value) {
      // Handle missing details here
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required details.',
      });
      return;
    }
  
    setLoading(true);
    setLoading(true);

    try {
      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      const imageInput = document.getElementById('file');
      const price = document.getElementById('number');

      const imageFile = imageInput.files[0];

      if (!imageFile) {
        console.error('No image file selected.');
        return;
      }

      const metadata = {
        name: name,
        description: description,
      };
      const jsonResult = await uploadJSONToIPFS(metadata);
      setJsonUrl(jsonResult.pinataURL);

      const imageCID = await uploadFileToIPFS(imageFile);
      const jsonData = await fetchDataFromIPFS(jsonResult.pinataURL);

      if (jsonData) {
        jsonData.image = imageCID;
        const updatedJsonCID = await uploadJSONToIPFS(jsonData);
        const updatedJsonCIDWithGateway = updatedJsonCID.pinataURL;
        const txResponse = await contract.mint(price.value, updatedJsonCIDWithGateway);
        const receipt = await txResponse.wait();
        setLoading(false);

        setSweetAlertMessage('NFT minted successfully!');
        Swal.fire({
          icon: 'success',
          title: "NFT Minted Successfully",
          confirmButtonText: 'OK',
        });

        navigate('/collections');
       
      } else {
        console.error('Error fetching JSON data from IPFS');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'NFT minting failed!',
      });
    }
  };

  return (
    <div>
      <SecondNav />
      <div className="py-32 px-10 min-h-screen" style={{ backgroundColor: '#934D63' }}>
        <div className="bg-white ml-80 p-10 md:w-3/4 lg:w-1/2 mx-auto rounded-xl">
          <form action="">
            <div className="flex items-center mb-5">
              <label
                htmlFor="name"
                className="inline-block w-20 mr-6 text-right font-bold text-gray-600"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-600 placeholder-gray-400 outline-none"
              />
            </div>
            <div className="flex items-center mb-5">
              <label htmlFor="description" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-600 placeholder-gray-400 outline-none"
              />
            </div>
            <div className="flex items-center mb-5">
              <label htmlFor="number" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">
                Price
              </label>
              <input
                type="number"
                id="number"
                name="number"
                placeholder="Price"
                className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-600 placeholder-gray-400 outline-none"
              />
            </div>
            <div className="flex items-center mb-5">
              <label htmlFor="file" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">
                File
              </label>
              <input
                type="file"
                id="file"
                name="file"
                placeholder="file"
                className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-600 placeholder-gray-400 outline-none"
              />
            </div>
            <div className="text-right">
              <button
                onClick={mintnft}
                type="button"
                className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-9 py-2.5 text-center mr-60 mb-2"
              >
                Mint
              </button>
            </div>
          </form>
        </div>
        <img
  className="float"
  style={{ marginTop: "-380px", marginLeft: "800px", width: "400px" }}
  src={nftman}
/>
        {loading && (
          <div className="loader-container" style={{marginTop:"-200px"}}>
            <div className="relative flex justify-center items-center">
              <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500">
                <img style={{width:"80px", height:"60px",marginTop:"25px", marginLeft:"20px"}} src={nvvv} className="rounded-full h-28 w-28" alt="Loader" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
