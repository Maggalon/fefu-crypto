import { useContext, useState } from "react"
import { FefuCryptoContext } from "../context/FefuCryptoContext"

import TokenABI from '../utils/TokenABI.json'
import { BeatLoader } from "react-spinners"
import { ethers, isAddress } from "ethers"
import buttonLogo from '../assets/button-logo.svg'


export const Tokens = () => {

    const {vendorContract, pinata, tokensGroup, getTokensGroup, tokens, getContract, currentAccount, getBalance, balance, signer} = useContext(FefuCryptoContext)

    const [isLoading, setIsLoading] = useState(false)

    const [tokenAddress, setTokenAddress] = useState("")
    const [tokenNumber, setTokenNumber] = useState("")
    const [fefuAmount, setFefuAmount] = useState("")

    const defaultInputStyle = "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    const errorInputStyle = "pl-5 shadow-2xl bg-red-900/20 border border-red-400 text-red-300 placeholder-red-700 text-md rounded-full focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"

    const [inputErrorMessage, setInputErrorMessage] = useState("")
    const [inputErrorStyle, setInputErrorStyle] = useState(defaultInputStyle)

    const [tokenNumberError, setTokenNumberError] = useState(false)
    const [fefuAmountError, setFefuAmountError] = useState(false)


    const initialMint = async () =>  {

        

        for (const token of tokens) {
            if (tokenAddress == token.tokenAddress) {
                setInputErrorMessage("Этот токен уже выпущен")
                setInputErrorStyle(errorInputStyle)
                return
            }
        }

        if (!isAddress(tokenAddress)) {
            setInputErrorMessage("Неправильный формат адреса")
            setInputErrorStyle(errorInputStyle)
            return
        }

        if (tokenNumber == "" || tokenNumber == "0" || !Number(tokenNumber) || Number(tokenNumber) > 1000000) {
            setTokenNumberError(true)
            return
        }

        if (fefuAmount == "" || fefuAmount == "0" || !Number(fefuAmount) || Number(fefuAmount) > balance) {
            setFefuAmountError(true)
            return
        }

        setIsLoading(true)
        
        let tx = await vendorContract.mintTokens(ethers.getAddress(tokenAddress), Number(tokenNumber), {value: ethers.parseEther(fefuAmount)});

        await tx.wait();

        setFefuAmount("")
        setTokenAddress("")
        setTokenNumber("")

        const tokenContract = await getContract(tokenAddress, TokenABI.tokenABI, signer)
        const tokenName = await tokenContract.name()
        const tokenSymbol = await tokenContract.symbol()

        const tokenInfo = {
            "tokenName": tokenName,
            "tokenSymbol": tokenSymbol,
            "tokenAddress": tokenAddress,
            "tokenPrice": fefuAmount / tokenNumber,
            "tokenABI": TokenABI.tokenABI
        }


        const upload = await pinata.upload.json(tokenInfo);
        const addToGroup = await pinata.groups.addCids({
            groupId: tokensGroup,
            cids: [upload.IpfsHash]
        })

        console.log("Token upload status: " + addToGroup);

        getTokensGroup(currentAccount.address);

        getBalance(currentAccount.address)

        setIsLoading(false)
    }

    return (
        <>
            <h3 className="text-2xl font-bold text-white">Выпуск токенов</h3>
            <ul className="w-full max-w-lg my-6 px-7 list-disc text-white/70">
                <li className="mb-2">Чтобы инициировать процесс создания токена, напишите @maggalon в ТГ. В ответ вам пришлют адрес токена</li>
                <li className="mb-2">Для того, чтобы выпустить токены, необходимо вставить его адрес в поле &quot;Адрес токена&quot;</li>
                <li className="mb-2">Далее необходимо ввести количество токенов, которое вы хотите выпустить (не более 1 000 000), а также количество FEFU, которое вы хотите потратить на выпуск</li>
                <li className="mb-2">Стоимость токена определится как количество предоставленных FEFU, деленное на количество выпускаемых токенов</li>
                <li>В конце каждого семестра все текущие токены сгорают, и необходимо будет создать новые в начале следующего семестра</li>
            </ul>
            <div className="w-full max-w-lg mb-6">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-white dark:text-white">Адрес токена</label>
                <input type="text" 
                       id="default-input" 
                       onChange={(e) => {
                        setTokenAddress(e.target.value)
                        setInputErrorMessage("")
                        setInputErrorStyle(defaultInputStyle)
                       }}
                       className={inputErrorStyle} />
                <p className="mt-2 text-sm text-red-400">{inputErrorMessage}</p>
            </div>
            <div className="w-full max-w-lg mb-6">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-white dark:text-white">Количество токенов</label>
                <input type="text" 
                       id="default-input" 
                       onChange={(e) => {
                        setTokenNumber(e.target.value)
                        setTokenNumberError(false)
                       }}
                       className={tokenNumberError ? errorInputStyle
                                                   : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
                {tokenNumberError && <p className="mt-2 text-sm text-red-400">Недопустимое значение</p>}
            </div>
            <div className="w-full max-w-lg mb-6">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-white dark:text-white">Сумма FEFU</label>
                <input type="text" 
                       id="default-input" 
                       onChange={(e) => {
                        setFefuAmount(e.target.value)
                        setFefuAmountError(false)
                       }}
                       className={fefuAmountError ? errorInputStyle
                                                  : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5"} />                {fefuAmountError && <p className="mt-2 text-sm text-red-400">Недопустимое значение</p>}
            </div>
            <button type="button" 
                    onClick={initialMint}
                    className="mt-3 h-10 w-60 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 me-2">
                {!isLoading ?
                    <>
                        <img className='h-4 w-4 mr-2' src={buttonLogo} alt='FEFU Crypto Button Logo' />
                        Выложить комментарий
                    </> :
                    <BeatLoader size={10} />                                        }
            </button>
        </>
    )
}