import { FefuCryptoContext } from "../context/FefuCryptoContext"
import { BeatLoader, BounceLoader } from "react-spinners"
import { Scanner } from "@yudiel/react-qr-scanner"
import { ethers, formatEther, isAddress } from "ethers"
import buttonLogo from '../assets/button-logo.svg'


import { useContext, useState } from "react"

// eslint-disable-next-line react/prop-types
export const Token = ({ token }) => {

    const [curToken, setCurToken] = useState(token)

    const {vendorContract, getBalance, currentAccount, getContract, signer} = useContext(FefuCryptoContext)

    const [showSellCard, setShowSellCard] = useState(false)
    const [sellAmount, setSellAmount] = useState("")

    const [tokenAmountError, setTokenAmountError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const [option, setOption] = useState("sell")

    const [receiverAddress, setReceiverAddress] = useState("")
    const [tokenAmount, setTokenAmount] = useState("")
    const [addressError, setAddressError] = useState(false)
    const [amountError, setAmountError] = useState(false)
    const [showScanner, setShowScanner] = useState(false)


    const sellTokens = async () => {
        
        if (Number(sellAmount) > curToken.tokenBalance) {
          setTokenAmountError(true)
          setErrorMessage("Слишком много")
          return
        } else if (sellAmount == "" || sellAmount == "0") {
          setTokenAmountError(true)
          setErrorMessage("Введи число")
          return
        }

        setIsLoading(true)

        const tokenContract = await getContract(curToken.tokenAddress, curToken.tokenABI, signer)

        
        const allowance = await tokenContract.allowance(ethers.getAddress(currentAccount.address), ethers.getAddress("0x9BA12B1f33448A8d34379FcE4d838508f39D11C8"))
        try {
          if (allowance < sellAmount) {
            let tx = await tokenContract.approve(ethers.getAddress("0x9BA12B1f33448A8d34379FcE4d838508f39D11C8"), "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
            await tx.wait();
            getBalance(currentAccount.address)
          } else {
            
            let tx = await vendorContract.sellTokens(ethers.getAddress(curToken.tokenAddress), ethers.parseEther(sellAmount))
            await tx.wait();
            getBalance(currentAccount.address)
            setSellAmount("")
            setCurToken({
              ...curToken,
              tokenBalance: formatEther(await tokenContract.balanceOf(currentAccount.address))
            })
          }
        } catch (e) {
          console.log(e);
          setIsLoading(false)
        }
        
        setIsLoading(false)        
        
    }

    const sendTokens = async (value, to) => {
      let sendAmount;
  
      try {
        sendAmount = ethers.parseEther(value)
      } catch(e) {
        console.log(e);
        setAmountError(true)
        return;
      }
      
      if (!isAddress(to)) {
        setAddressError(true)
        return
      }
  
  
  
      try {
        setIsLoading(true)

        const tokenContract = await getContract(curToken.tokenAddress, curToken.tokenABI, signer)

        let tx = await tokenContract.transfer(ethers.getAddress(receiverAddress), sendAmount)
        
        await tx.wait()
        setTokenAmount("")
        setReceiverAddress("")
        getBalance(currentAccount.address)
        setCurToken({
          ...curToken,
          tokenBalance: formatEther(await tokenContract.balanceOf(currentAccount.address))
        })
        setIsLoading(false)
      } catch (e) {
        console.log(e);
        setIsLoading(false)
      }
    };

    return (
        <>
        <div onClick={() => setShowSellCard(!showSellCard)} className="p-3 my-5 w-full max-w-lg flex items-center justify-between cursor-pointer bg-white/10 custom-blur shadow-2xl rounded-3xl">
            <div className="flex">
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white w-12 h-12"
                    >
                    <path d="M23 12c0 6.08-4.92 11-11 11S1 18.08 1 12 5.92 1 12 1s11 4.92 11 11M13 4.06c2.13.27 4.07 1.39 5.37 3.1l1.74-1A10 10 0 0013 2v2.06m-9.11 2.1l1.74 1A8.022 8.022 0 0111 4.06V2a10 10 0 00-7.11 4.16m-1 9.94l1.73-1a8.03 8.03 0 010-6.2l-1.73-1a9.864 9.864 0 000 8.2M11 19.94a8.022 8.022 0 01-5.37-3.1l-1.74 1A10 10 0 0011 22v-2.06m9.11-2.1l-1.74-1a8.022 8.022 0 01-5.37 3.1v2c2.85-.29 5.44-1.78 7.11-4.1m1-1.74c1.19-2.6 1.19-5.6 0-8.2l-1.73 1a8.03 8.03 0 010 6.2l1.73 1M15 12l-3-5-3 5 3 5 3-5z" />
                </svg>
                <div className="flex items-center mr-5">
                    <div className="ml-2 flex flex-col">
                        <div className="leading-snug text-sm text-white/70 font-bold">{curToken.tokenName}</div>
                        <div className="leading-snug text-xs text-gray-200">{curToken.tokenSymbol}</div>
                    </div>
                </div>
            </div>
            <div className="text-sm text-white/70 font-bold">{Number(curToken.tokenBalance) * curToken.tokenPrice} FEFU</div>
        </div>
        {showSellCard && 
        <div className="flex flex-col items-center">
          <div className="flex mb-5">
            <div onClick={() => setOption("send")} className={`cursor-pointer p-4 flex items-center justify-center w-28 text-white${option == "send" ? "" : "/70"} mx-5 bg-white${option == "send" ? "/40" : "/10"} custom-blur shadow-2xl rounded-3xl`}>Отправить</div>
            <div onClick={() => setOption("sell")} className={`cursor-pointer p-4 flex items-center justify-center w-28 text-white${option == "sell" ? "" : "/70"} mx-5 bg-white${option == "sell" ? "/40" : "/10"} custom-blur shadow-2xl rounded-3xl`}>Продать</div>
          </div>

          {option == "sell" && <>
        <div className="p-5 w-full max-w-lg flex flex-col bg-white/10 custom-blur shadow-2xl rounded-3xl">
        <div className="text-white/70 font-bold text-lg mb-5">Вы отдаете</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white w-12 h-12"
                >
                <path d="M23 12c0 6.08-4.92 11-11 11S1 18.08 1 12 5.92 1 12 1s11 4.92 11 11M13 4.06c2.13.27 4.07 1.39 5.37 3.1l1.74-1A10 10 0 0013 2v2.06m-9.11 2.1l1.74 1A8.022 8.022 0 0111 4.06V2a10 10 0 00-7.11 4.16m-1 9.94l1.73-1a8.03 8.03 0 010-6.2l-1.73-1a9.864 9.864 0 000 8.2M11 19.94a8.022 8.022 0 01-5.37-3.1l-1.74 1A10 10 0 0011 22v-2.06m9.11-2.1l-1.74-1a8.022 8.022 0 01-5.37 3.1v2c2.85-.29 5.44-1.78 7.11-4.1m1-1.74c1.19-2.6 1.19-5.6 0-8.2l-1.73 1a8.03 8.03 0 010 6.2l1.73 1M15 12l-3-5-3 5 3 5 3-5z" />
            </svg>
            <div className="ml-3 text-2xl text-white">{curToken.tokenSymbol}</div>
          </div>
          <div className="flex flex-col items-center">
            <input placeholder="Вводи" 
                   type="text" 
                   value={sellAmount}
                   onChange={(e) => {
                    setSellAmount(e.target.value)
                    setTokenAmountError(false)
                   }}
                   className={tokenAmountError ? "w-48 p-5 text-center bg-red-900/20 border border-red-500 text-white/70 text-2xl focus:outline-none overflow-hidden shadow-2xl rounded-3xl"
                                               : "w-48 p-5 text-center bg-white/10 text-white/70 text-2xl focus:outline-none overflow-hidden shadow-2xl rounded-3xl"} />
            {tokenAmountError && <p className="mt-2 text-sm text-red-400 dark:text-red-500">{errorMessage}</p>}
          </div>
        </div>
      </div>
      <div className="animate-pulse flex justify-center items-center w-16 h-16 m-3 bg-white hover:shadow-xl cursor-pointer rounded-full p-2">
        {isLoading ?
          <BounceLoader size={25} color="#2c3e50" /> :
          <svg
            viewBox="0 0 512 512"
            fill="currentColor"
            onClick={sellTokens}
            className="text-[#2c3e50]"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="M464 208L352 96 240 208M352 113.13V416M48 304l112 112 112-112M160 398V96"
            />
          </svg>
        }
      </div>
      
      <div className="p-5 w-full max-w-lg flex flex-col bg-white/10 custom-blur shadow-2xl rounded-3xl">
        <div className="text-white/70 font-bold text-lg mb-5">Вы получаете</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white w-12 h-12"
                >
                <path d="M23 12c0 6.08-4.92 11-11 11S1 18.08 1 12 5.92 1 12 1s11 4.92 11 11M13 4.06c2.13.27 4.07 1.39 5.37 3.1l1.74-1A10 10 0 0013 2v2.06m-9.11 2.1l1.74 1A8.022 8.022 0 0111 4.06V2a10 10 0 00-7.11 4.16m-1 9.94l1.73-1a8.03 8.03 0 010-6.2l-1.73-1a9.864 9.864 0 000 8.2M11 19.94a8.022 8.022 0 01-5.37-3.1l-1.74 1A10 10 0 0011 22v-2.06m9.11-2.1l-1.74-1a8.022 8.022 0 01-5.37 3.1v2c2.85-.29 5.44-1.78 7.11-4.1m1-1.74c1.19-2.6 1.19-5.6 0-8.2l-1.73 1a8.03 8.03 0 010 6.2l1.73 1M15 12l-3-5-3 5 3 5 3-5z" />
            </svg>
            <div className="ml-3 text-2xl text-white">FEFU</div>
          </div>
          <div className="">
            <input type="text" 
                   disabled 
                   value={Number(sellAmount) * curToken.tokenPrice}
                   className="w-48 p-5 text-center bg-white/10 text-white/70 text-2xl focus:outline-none overflow-hidden shadow-2xl rounded-3xl" />
          </div>
        </div>
      </div>
      </>
      }
          {option == "send" &&
            <>
              {showScanner && <div className="w-96 h-96 m-5"><Scanner classNames={{container: "border-8 border-white rounded-xl"}}  allowMultiple={false} onScan={(result) => setReceiverAddress(result[0].rawValue)} /></div>}

              <div className="w-full max-w-lg mb-6">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-white dark:text-white">Адрес получателя</label>
                <div className={addressError ? "flex items-center bg-red-900/20 border border-red-400 custom-blur overflow-hidden shadow-2xl rounded-full"
                                            : "flex items-center bg-white/20 custom-blur overflow-hidden shadow-2xl rounded-full"}>
                  <input type="text" 
                        value={receiverAddress}
                          id="default-input" 
                          onChange={(e) => {
                            setReceiverAddress(e.target.value)
                            setAddressError(false)
                          }}
                          className="pl-5 bg-transparent text-white/70 text-md font-semibold focus:outline-none focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  <svg
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 text-white/70 cursor-pointer mr-4"
                    onClick={() => setShowScanner(!showScanner)}
                  >
                    <path d="M8 21H4a1 1 0 01-1-1v-4a1 1 0 00-2 0v4a3 3 0 003 3h4a1 1 0 000-2zm14-6a1 1 0 00-1 1v4a1 1 0 01-1 1h-4a1 1 0 000 2h4a3 3 0 003-3v-4a1 1 0 00-1-1zM20 1h-4a1 1 0 000 2h4a1 1 0 011 1v4a1 1 0 002 0V4a3 3 0 00-3-3zM2 9a1 1 0 001-1V4a1 1 0 011-1h4a1 1 0 000-2H4a3 3 0 00-3 3v4a1 1 0 001 1zm8-4H6a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V6a1 1 0 00-1-1zM9 9H7V7h2zm5 2h4a1 1 0 001-1V6a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1zm1-4h2v2h-2zm-5 6H6a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1zm-1 4H7v-2h2zm5-1a1 1 0 001-1 1 1 0 000-2h-1a1 1 0 00-1 1v1a1 1 0 001 1zm4-3a1 1 0 00-1 1v3a1 1 0 000 2h1a1 1 0 001-1v-4a1 1 0 00-1-1zm-4 4a1 1 0 101 1 1 1 0 00-1-1z" />
                  </svg>
                </div>
                {addressError && <p className="mt-2 text-sm text-red-400 dark:text-red-500">Неправильный формат адреса</p>}
              </div>
            
              <div className="w-full max-w-lg mb-6">
                  <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-white dark:text-white">Сумма {curToken.tokenSymbol}</label>
                  <input type="text" 
                        value={tokenAmount}
                          id="default-input" 
                          onChange={(e) => {
                            setTokenAmount(e.target.value)
                            setAmountError(false)
                          }}
                          className={amountError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-500 text-red-300 placeholder-red-700 text-md rounded-full focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5"
                                                : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
                  {amountError && <p className="mt-2 text-sm text-red-400 dark:text-red-500">Ошибка при вводе суммы {curToken.tokenSymbol}</p>}
              </div>
              <button type="button" 
                      onClick={() => sendTokens(tokenAmount, receiverAddress)}
                      className="text-gray-900 w-32 h-10 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 me-2">
                  {!isLoading ?
                      <>
                        <img className='h-4 w-4 mr-2' src={buttonLogo} alt='FEFU Crypto Button Logo' />
                        Отправить
                      </> :
                      <BeatLoader size={10} />                  
                  }
              </button>
            </>
          }
      </div>
      }
      </>
    )
}