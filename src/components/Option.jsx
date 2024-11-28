import { useContext, useState } from "react"
import QRModal from "./QRModal"
import { FefuCryptoContext } from "../context/FefuCryptoContext"
import { ethers } from "ethers"
import { BeatLoader } from "react-spinners"
import buttonLogo from '../assets/button-logo.svg'

export const Option = ({ value, name, price }) => {

    const { signer, getBalance, currentAccount } = useContext(FefuCryptoContext)

    const [showQR, setShowQR] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const sendTransaction = async (value) => {
        const to = '0x7964ae03647f3eee15d905b7a3e6daeeb02f4ea1';
        
        setIsLoading(true)
        try {
            
            let tx = await signer.sendTransaction({
                to: to,
                value: ethers.parseEther(value)
            })
            await tx.wait()
            getBalance(currentAccount.address)
            setShowQR(true)
            setIsLoading(false)
        } catch (e) {
            console.log(e);
            setIsLoading(false)
        }
    };

    return (
        <div className="p-3 my-5 flex items-center justify-between cursor-pointer bg-white/10 custom-blur shadow-2xl rounded-lg">
            <div className="flex items-center mr-5">
                <div className="ml-2 flex flex-col">
                    <div className="leading-snug text-sm text-white/70 font-bold">{name}</div>
                    <div className="leading-snug text-xs text-gray-200">{price} FEFU</div>
                </div>
            </div>
            <QRModal showQR={showQR} setShowQR={setShowQR} value={value} />
            <button type="button" 
                    onClick={() => {sendTransaction(price)}} 
                    className="text-gray-900 w-40 h-10 bg-white/70 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 my-2">
                {!isLoading ?
                    <>
                        <img className='h-4 w-4 mr-2' src={buttonLogo} alt='FEFU Crypto Button Logo' />
                        Использовать
                    </> :
                    <BeatLoader size={10} />                
                }
            </button>
        </div>
    )
}