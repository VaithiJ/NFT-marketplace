import './App.css';
import { ethers } from 'ethers';
import React, { useState, useRef, useEffect } from "react";
import { SecondNav } from './Navbar';
import List from './components/List/List';
import Create from './components/Create/Create';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './components/Home/Home';
import Collection from './components/Collection/Collection';
import Details from './components/Details/Details';


function App() {
  const [contract, setContract] = useState('');
  const contAddr = "0x7D0E28384d2098d7F6036FCd85e055A70D7BBd5D";
  const abi = ["function mint(uint256 price, string memory ipfsHash) public"]
  const connectToContract = async () => {
    try {
      // Connect to an Ethereum provider (e.g., Metamask or a custom provider)
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Request access to the user's Ethereum wallet
const signer = await provider.getSigner();
console.log(signer)
      // Create a contract instance
      const contractt = new ethers.Contract(contAddr, abi, signer);
      setContract(contractt);
    } catch (error) {
      console.error('Error connecting to the contract:', error);
    }
  };

  useEffect(() => {
    connectToContract();
  }, []);


  const mintnft = async () => {
    try {
        const txResponse = await contract.mint(10, "QmYLd96QyzbHiAvmkin8GMs34CWF5XAXNgABP6nBeckaNF");
        console.log("Transaction sent. Waiting for confirmation...");

        // Wait for the transaction to be mined and confirmed
        const receipt = await txResponse.wait();

        console.log("Transaction confirmed.");
        console.log("Transaction receipt:", receipt);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}


  return (
    <div className="App">
       <Router>
        <Routes>
        <Route path='/' element={<Home/>}/>

      <Route path='/list' element={<List/>}/>
      <Route path='/create' element={<Create/>}/>
      <Route path='/collections' element={<Collection/>}/>
      <Route path='/details/:nftId' element={<Details/>}/>


      </Routes>
      </Router>
    </div>
  );
}

export default App;
