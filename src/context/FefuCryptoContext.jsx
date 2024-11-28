import { createContext, useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";

import VendorABI from '../utils/Vendor.json'
import FeedbackABI from '../utils/Feedback.json'

import { PinataSDK } from "pinata-web3"

import { createWallet, restoreWallet, getWallet } from "./WalletBrain";

import { Buffer } from "buffer";
import { SigningKey } from "ethers";

export const FefuCryptoContext = createContext();

export const FefuCryptoProvider = ({children}) => {

    const pinata = new PinataSDK({
        pinataJwt: `${import.meta.env.VITE_PINATA_JWT}`,
        pinataGateway: `${import.meta.env.VITE_GATEWAY_URL}`
    })

    const rpc_url = "https://fefu-crypto.online/"

    const [isLoading, setIsLoading] = useState(true)
    const [provider, setProvider] = useState()
    const [signer, setSigner] = useState();

    const [currentAccount, setCurrentAccount] = useState()
    const [chainId, setChainId] = useState()
    const [balance, setBalance] = useState()

    const [vendorContract, setVendorContract] = useState();
    const [feedbackContract, setFeedbackContract] = useState();

    const [tokensGroup, setTokensGroup] = useState();
    const [tokens, setTokens] = useState();

    
    const connectWallet = async (password) => {
      try {
        const result = await getWallet(password)
        setCurrentAccount(result)
        
        const curProvider = new ethers.JsonRpcProvider(rpc_url)
        setProvider(curProvider)
        const signingKey = new SigningKey(result.privateKey)
        
        const curSigner = new ethers.Wallet(signingKey, curProvider)
        setSigner(curSigner)
        
        await getChain()
        await getBalance(result.address)

        await getVendorContract(curSigner)
        await getFeedbackContract(curSigner)
        
      } catch (e) {
        console.log(e);
        throw Error;
      }
    }

    const makeRequest = async (method, params) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
          "method": method,
          "params": params,
          "id": 706970,
          "jsonrpc": "2.0"
      });

      var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };

      const res = await fetch(
          rpc_url,
          requestOptions,
      )
      const resJson = await res.json();
      
      return resJson.result;
    }

    const getBalance = async (addr) => {
      const bal = await makeRequest("eth_getBalance", [addr, "latest"])
      setBalance(formatEther(bal))
    }
    
    const getChain = async () => {
      const ch = await makeRequest("eth_chainId", [])      
      setChainId(Number(ch))
    }

    const getTokensGroup = async () => {
        try {
            const group = await pinata.groups.list().name("Fefu Crypto tokens")
            if (group[0]) {
                setTokensGroup(group[0].id)

                const files = await pinata.listFiles().group(group[0].id);

                const tokensInfo = []
                for await (const file of files) {
                    const tokenCID = await pinata.gateways.convert(file.ipfs_pin_hash);
                    const response = await fetch(tokenCID);
                    const tokenJson = await response.json();
                    
                    tokensInfo.push(tokenJson);
                }
                setTokens(tokensInfo)
                setIsLoading(false)
            } else {
                console.log("Failed to fetch tokens group id");
            }
        } catch(e) {
            console.log(e);
        }
    }

    const getContract = async (contractAddress, contractABI, curSigner) => {

        const contract = new ethers.Contract(contractAddress, contractABI, provider)
        const contractWithSigner = contract.connect(curSigner)

        return contractWithSigner;
    }

    const getVendorContract = async (curSigner) => {
        const vContract = await getContract("0x9BA12B1f33448A8d34379FcE4d838508f39D11C8", VendorABI.abi, curSigner)        
        setVendorContract(vContract)
    }

    const getFeedbackContract = async (curSigner) => {
        const fContract = await getContract("0x56e4719AFc9F5417b1df88abaD1bD12a6Db28AD0", FeedbackABI.abi, curSigner)        
        setFeedbackContract(fContract)
    }

    useEffect(() => {
        window.Buffer = window.Buffer || Buffer
        getTokensGroup()
    }, []);

    return(
        <FefuCryptoContext.Provider value={{signer,
                                            vendorContract,
                                            feedbackContract, 
                                            pinata,
                                            tokensGroup,
                                            tokens,
                                            getTokensGroup,
                                            getContract,
                                            currentAccount, 
                                            connectWallet,
                                            getBalance,
                                            chainId,
                                            balance,
                                            isLoading,
                                            setIsLoading,
                                            createWallet,
                                            getWallet,
                                            restoreWallet,
                                            setCurrentAccount
                                            }}>
            {children}
        </FefuCryptoContext.Provider>
    )
    
}