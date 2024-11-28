import { useContext, useState, useEffect, useRef } from "react"
import { FefuCryptoContext } from "../context/FefuCryptoContext"

import { ethers, formatEther, isAddress } from "ethers"
import { Token } from "../components/Token"

import QRCodeStyling from "qr-code-styling";
import { Tooltip } from "react-tooltip"

import { Scanner } from "@yudiel/react-qr-scanner";
import { BeatLoader } from "react-spinners"

import buttonLogo from '../assets/button-logo.svg'

const Home = () => {

  const { balance, tokens, getContract, currentAccount, signer, getBalance } = useContext(FefuCryptoContext)

  const [tokensInfo, setTokensInfo] = useState()
  const [showQR, setShowQR] = useState(false)

  const [showSellForm, setShowSellForm] = useState(false)
  const [receiverAddress, setReceiverAddress] = useState("")
  const [fefuAmount, setFefuAmount] = useState("")

  const [options] = useState({
    width: 300,
    height: 300,
    type: 'svg',
    data: currentAccount,
    image: '',
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 20,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: '#ffffff',
      type: 'rounded'
    },
    backgroundOptions: {
      color: 'none',
    },
    cornersSquareOptions: {
      color: '#ffffff',
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: '#ffffff',
      type: 'dot',
    }
  });

  const [qrCode] = useState(new QRCodeStyling(options))
  const ref = useRef(null)

  const [showScanner, setShowScanner] = useState(false)

  const [addressError, setAddressError] = useState(false)
  const [amountError, setAmountError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getTokensBalance = async () => {
    const tempInfo = []
    if (tokens) {
      for await (const token of tokens) {
        const tokenContract = await getContract(token.tokenAddress, token.tokenABI, signer)
        const tokenBalance = formatEther(await tokenContract.balanceOf(currentAccount.address))

        tempInfo.push({
          ...token,
          tokenBalance
        })
      }

      setTokensInfo(tempInfo)      
    }
  }

  const sendTransaction = async (value, to) => {
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
      let tx = await signer.sendTransaction({
          to: to,
          value: sendAmount
      })
      await tx.wait()
      setFefuAmount("")
      setReceiverAddress("")
      getBalance(currentAccount.address)
      setIsLoading(false)
    } catch (e) {
      console.log(e);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    setShowScanner(false)
  }, [receiverAddress])

  useEffect(() => {
    getTokensBalance()
  }, [tokens])

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref, showQR]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options, showQR]);

  return (
      <>
      <p className="font-semibold text-xs text-center text-white/70 mb-2">ТЕКУЩИЙ БАЛАНС</p>
      <h3 className="text-3xl font-medium text-center tracking-wide text-white mb-10">{`${Math.round(balance * 100) / 100} FEFU`}</h3>
      <div className="flex items-center justify-around w-full max-w-xs">
        <div className="flex flex-col">
          <div onClick={() => setShowSellForm(!showSellForm)}
               className="p-5 cursor-pointer flex items-center justify-center text-center bg-white/10 text-white/70 text-xl overflow-hidden shadow-2xl rounded-full">
            <svg
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-5 h-5 text-white"
            >
              <path
                fillRule="evenodd"
                d="M8.636 3.5a.5.5 0 00-.5-.5H1.5A1.5 1.5 0 000 4.5v10A1.5 1.5 0 001.5 16h10a1.5 1.5 0 001.5-1.5V7.864a.5.5 0 00-1 0V14.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z"
              />
              <path
                fillRule="evenodd"
                d="M16 .5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793L6.146 9.146a.5.5 0 10.708.708L15 1.707V5.5a.5.5 0 001 0v-5z"
              />
            </svg>
          </div>
          <div className="text-white mt-2">Отправить</div>
        </div>
        <div className="flex flex-col">
          <div onClick={() => setShowQR(!showQR)}
               className="p-5 cursor-pointer flex items-center justify-center text-center bg-white/10 text-white/70 text-xl overflow-hidden shadow-2xl rounded-full">
            <svg
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-5 h-5 text-white"
            >
              <path
                fillRule="evenodd"
                d="M9.636 2.5a.5.5 0 00-.5-.5H2.5A1.5 1.5 0 001 3.5v10A1.5 1.5 0 002.5 15h10a1.5 1.5 0 001.5-1.5V6.864a.5.5 0 00-1 0V13.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z"
              />
              <path
                fillRule="evenodd"
                d="M5 10.5a.5.5 0 00.5.5h5a.5.5 0 000-1H6.707l8.147-8.146a.5.5 0 00-.708-.708L6 9.293V5.5a.5.5 0 00-1 0v5z"
              />
            </svg>
          </div>
          <div className="text-white mt-2">Получить</div>
        </div>
      </div>
      {showScanner && <div className="w-96 h-96 m-5"><Scanner classNames={{container: "border-8 border-white rounded-xl"}}  allowMultiple={false} onScan={(result) => setReceiverAddress(result[0].rawValue)} /></div>}

      {showSellForm &&
        <>
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
              <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-white dark:text-white">Сумма FEFU</label>
              <input type="text" 
                     value={fefuAmount}
                      id="default-input" 
                      onChange={(e) => {
                        setFefuAmount(e.target.value)
                        setAmountError(false)
                      }}
                      className={amountError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-500 text-red-300 placeholder-red-700 text-md rounded-full focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5"
                                             : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
              {amountError && <p className="mt-2 text-sm text-red-400 dark:text-red-500">Ошибка при вводе суммы FEFU</p>}
          </div>
          <button type="button" 
                  onClick={() => sendTransaction(fefuAmount, receiverAddress)} 
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
      {showQR && 
        <>
          <div ref={ref} />
          <div className="text-white text-lg">{currentAccount.address}</div>
          <div data-tooltip-id="copied" 
               data-tooltip-content={"Скопировано"}
               data-tooltip-place="top"
               onClick={() => navigator.clipboard.writeText(currentAccount.address)}
               className="p-2 cursor-pointer active:bg-white/30 rounded-full">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-4v4a2 2 0 01-2 2H2a2 2 0 01-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 012 2v4h4V2H8v4zM2 8v10h10V8H2z" />
            </svg>
          </div>
          <Tooltip id="copied" openOnClick={true} delayHide={1000} />
        </>}
      <div className="max-w-lg w-full mx-auto mt-10">
        <h5 className="text-xl font-bold text-white mb-3">Мои токены</h5>
        {
          tokensInfo && tokensInfo.map(token => {
            return <Token key={token.tokenAddress} token={token} />
          })
        }
      </div>
      
      </>
  )
}

export default Home;