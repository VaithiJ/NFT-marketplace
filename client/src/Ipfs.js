import axios from "axios";
import FormData from "form-data"
const key = 'ef12a2ea752ec6a47d7f';
const secret = '0c72807e3043b0f2f62006d036083d62f21a755bbaf99063c824d0c84d5f0bee';

export const uploadJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  
    // Return the promise from the axios call
    return axios
      .post(url, JSONBody, {
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      })
      .then(function (response) {
        return {
          success: true,
          pinataURL: "https://orange-additional-prawn-736.mypinata.cloud/ipfs/" + response.data.IpfsHash,
        };
      })
      .catch(function (error) {
        console.log(error);
        return {
          success: false,
          message: error.message,
        };
      });
  };
  
export const uploadFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    
    let data = new FormData();
    data.append('file', file);

 

    return axios 
        .post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data.IpfsHash)
            return {
               pinataURL: "https://orange-additional-prawn-736.mypinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};
  

