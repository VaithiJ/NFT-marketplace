import React, { useState, useEffect, Fragment, useRef } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { contractAddress } from '../src/components/config.js';
import nova from "./nova.png"


export const SecondNav = () => {
    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false);
    const [toggleState, setToggleState] = useState(1);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const drawerRef = useRef(null);
    const [contract, setContract] = useState('');
    const [signer, setSigner] = useState(null); // Initialize signer as null
    const abi = ["function mint(uint256 price, uint256 royalty, string memory ipfsHash) public"]
    
    const connectToContract = async () => {
        try {
            // Connect to an Ethereum provider (e.g., Metamask or a custom provider)
            const provider = new ethers.BrowserProvider(window.ethereum);
            // Request access to the user's Ethereum wallet
            const signer = await provider.getSigner();
            setSigner(signer.address); // Set the signer's address if connected
            // Create a contract instance
            const contractt = new ethers.Contract(contractAddress, abi, signer);
            setContract(contractt);
        } catch (error) {
            console.error('Error connecting to the contract:', error);
        }
    };



    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleDrawer = () => {
        const ethereum = window.ethereum;
        const ownerAddress = ethereum?.selectedAddress;

        if (ownerAddress) {
            // Owner address is present, open the drawer
            setIsDrawerOpen(!isDrawerOpen);
        } else {
            // Owner address is not present, show an alert
            Swal.fire({
                title: "Connect your wallet",
                icon: "info",
                confirmButtonText: "OK",
            });
        }
    };
    const truncateAddress = (address) => {
        if (address.length < 9) return address; // Return as is if it's too short
        const start = address.slice(0, 5);
        const end = address.slice(-4);
        return `${start}...${end}`;
    };
    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleOutsideClick = (event) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target)) {
            closeDrawer();
        }
    };

    useEffect(() => {
        // Attach event listener using the handleOutsideClick function
        document.addEventListener("mousedown", handleOutsideClick);

        // Cleanup by removing the event listener when the component unmounts
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center">
                    <img
                        src={nova}
                        className="h-auto w-32 sm:w-40 mr-3"
                        alt="Artrix Logo"
                    />
                </a>

                <div className="flex md:order-2 space-x-3">
                    {signer ? (
                        <span class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">{truncateAddress(signer)}</span>
                    ) : (
<button onClick={connectToContract} type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Connect Wallet</button>
                    )}
                    <button
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 t-2"
                        type="button"
                        data-drawer-target="drawer-navigation"
                        data-drawer-show="drawer-navigation"
                        aria-controls="drawer-navigation"
                        onClick={toggleDrawer}>
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    id="drawer-navigation"
                    ref={drawerRef}
                    className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${
                        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    } bg-white dark:bg-gray-800`}
                    tabIndex={-1}
                    aria-labelledby="drawer-navigation-label">
                    <h5
                        id="drawer-navigation-label"
                        className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
                        Menu
                    </h5>
                    <button
                        type="button"
                        data-drawer-hide="drawer-navigation"
                        aria-controls="drawer-navigation"
                        onClick={closeDrawer}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 0 1 .708 0l3 3a1 1 0 0 1 0 .708l-10 10a1 1 0 0 1-.168.11l-5 2a1 1 0 0 1-.65-.65l2-5a1 1 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a1 1 0 0 1 1 1v.5h.5a1 1 0 0 1 1 1v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A1 1 0 0 1 5 12.5V12h-.5a1 1 0 0 1-.5-.5V11h-.5a1 1 0 0 1-.468-.325z" />
                        </svg>
                        <span className="sr-only">Close menu</span>
                    </button>
                    <div className="py-4 overflow-y-auto">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <a
                                    href="/list"
                                    className="flex itemsc-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg
                                        className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 21">
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                    <span className="ml-12">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/collections"
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 18 18">
                                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143v-4.286A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                    </svg>
                                    <span className="flex-1 ml-3 whitespace-nowrap">My Collections</span>
                                </a>
                            </li>
              <li>
                <a                   href="/create"

                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                  </svg>
                  <span className="flex-1  whitespace-nowrap" >
                    Create NFT
                  </span>
                </a>
              </li>
            
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
