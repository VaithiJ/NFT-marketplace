import React, { useState, useEffect } from "react";
import {ethers} from "ethers";
import "./Home.css"
import nv from "./nvvv.png"
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate()
    const nav = async()=>{
        navigate("/list");
    }
    const [signer, setSigner] = useState("");
    const connectToContract = async () => {
        try {
          // Connect to an Ethereum provider (e.g., Metamask or a custom provider)
          const provider = new ethers.BrowserProvider(window.ethereum);
          // Request access to the user's Ethereum wallet
          const signer = await provider.getSigner();
          setSigner(signer.address);

        
        } catch (error) {
          console.error('Error connecting to the contract:', error);
        }
      };
      const truncateAddress = (address) => {
        if (address.length < 9) return address; // Return as is if it's too short
        const start = address.slice(0, 5);
        const end = address.slice(-4);
        return `${start}...${end}`;
    };
  return (
    <div >
    <div className="bg">
        <img className="nov" src={nv}/>
        {signer ? (
                        <span className="wal" style={{fontFamily:"Nunito",padding:"16px",borderRadius:"15px", position:"relative", top:"-50px",left:"550px", color:"white", backgroundColor:"rgb(28, 132, 229)"}} >{truncateAddress(signer)}</span>
                    ) : (
<button className="wal" onClick={connectToContract}>Connect Wallet</button>
                    )}




    <h1 className="interr">Your Pixels, Your Profits, Your NFTs</h1>
    <button onClick={nav}  style={{marginTop:"40px"}} class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
  <span  class="relative px-12 py-2.5 transition-all ease-in duration-75 bg-blue-500 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
Explore  </span>
</button>   

    </div>
    
  </div>
  )
}

export default Home