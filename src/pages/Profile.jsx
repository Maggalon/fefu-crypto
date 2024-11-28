import { useContext, useState } from 'react'
import { FefuCryptoContext } from '../context/FefuCryptoContext'
import { Option } from '../components/Option'
import { Tooltip } from 'react-tooltip'

import buttonLogo from '../assets/button-logo.svg'
import fefuCryptoLogo from '../assets/fefu-crypto.svg'

import validator from 'validator'

const Profile = () => {

    const {currentAccount, connectWallet, chainId, balance, createWallet, restoreWallet} = useContext(FefuCryptoContext)

    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState(false)

    const [restoreWalletToggle, setRestoreWalletToggle] = useState(false)
    const [mnemonic, setMnemonic] = useState("")
    const [mnemonicError, setMnemonicError] = useState(false)
    const [restorePassword, setRestorePassword] = useState("")
    const [restorePasswordError, setRestorePasswordError] = useState(false)

    const [newWallet, setNewWallet] = useState(false)
    const [newWalletInfo, setNewWalletInfo] = useState(false)
    const [newWalletAddress, setNewWalletAddress] = useState("")
    const [newWalletMnemonic, setNewWalletMnemonic] = useState("")
    const [newWalletPassword, setNewWalletPassword] = useState("")
    const [newWalletPasswordError, setNewWalletPasswordError] = useState(false)

    const handleLogin = async () => {
        try {
            await connectWallet(password)            
        } catch (e) {
            console.log(e);
            setPasswordError(true)
        }
    }

    const handleWalletRestoration = async () => {
        if (mnemonic.length == 0) {
            setMnemonicError(true)
            return
        }
        if (!isValid(restorePassword)) {
            setRestorePasswordError(true)
            return
        }
        try {
            await restoreWallet(mnemonic, restorePassword)
            setTimeout(async () => {
                await connectWallet(restorePassword)
            }, 500)
            
        } catch(e) {
            console.log(e);
            setMnemonicError(true)
        }
    }

    const handleWalletCreation = async () => {
        if (!isValid(newWalletPassword)) {
            setNewWalletPasswordError(true)
            return
        }
        try {
            const {mnemonic, readableAddress} = await createWallet(newWalletPassword)
            
            setNewWalletMnemonic(mnemonic)
            setNewWalletAddress(readableAddress)
            setNewWalletInfo(true)
            
        } catch(e) {
            console.log(e);
            
        }
    }

    const finishWalletCreation = async () => {
        await connectWallet(newWalletPassword)
        setNewWallet(false)
        setNewWalletInfo(false)
    }

    const isValid = (password) => {
        if (validator.isStrongPassword(password, {
            minLength: 8,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return true
        }

        return false
    }

    const options = [
        {
            value: "Dining",
            name: 'Талон на питание',
            price: '1000'
        },
        {
            value: "Gym",
            name: 'Посещение спортзала',
            price: '1500'
        },
        {
            value: "Laundry",
            name: 'Стирка',
            price: '500'
        },
    ]

    if (!currentAccount) {
        return (
            <>
                <div className="w-full max-w-lg mb-6">
                    <label htmlFor="default-input" className="block mb-2 text-md font-medium text-white text-center">Пароль от кошелька</label>
                    <input type="password" 
                        id="default-input" 
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setPasswordError(false)
                        }}
                        className={passwordError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-500 text-red-300 placeholder-red-700 text-md rounded-full focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5"
                                                 : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
                    {passwordError && <p className="mt-2 text-sm text-red-400">Неправильный пароль</p>}
                </div>
                <button type="button" onClick={handleLogin} className="text-white bg-white/20 hover:shadow-2xl border-2 border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-lg px-8 py-4 text-center inline-flex items-center">
                    <img className='h-6 w-6 rounded-md mr-3' src={fefuCryptoLogo} alt='FEFU Crypto Logo' />
                    Войти
                </button>
                <hr className="w-48 h-1 mx-auto my-10 bg-white/70 border-0 rounded" />
                {newWallet &&
                    <>
                        
                        <div className="w-full max-w-lg mb-6 mr-5">
                            <label htmlFor="new-password" className="block mb-2 text-sm font-medium text-white dark:text-white">Новый пароль (минимум 8 символов, 1 большая, 1 маленькая буквы, 1 цифра, 1 спец. символ)</label>
                            <div className='flex items-center'>
                                <input type="password" 
                                    id="new-password" 
                                    onChange={e => {
                                        setNewWalletPassword(e.target.value)
                                        setNewWalletPasswordError(false)
                                    }}
                                    className={newWalletPasswordError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-400 text-red-300 placeholder-red-700 text-md rounded-full focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                                                            : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
                                <button type="button" 
                                        onClick={handleWalletCreation} 
                                        className="text-gray-900 w-32 h-10 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 ml-2">
                                    <img className='h-4 w-4 mr-2' src={buttonLogo} alt='FEFU Crypto Button Logo' />
                                    Создать
                                </button>
                            </div>
                            {newWalletPasswordError && <p className="mt-2 text-sm text-red-400">Ненадежный пароль</p>}
                        </div>
                        
                        
                        {newWalletInfo &&
                        <>    
                        <div className="w-full max-w-lg mb-6">
                            <label htmlFor="new-address" className="block mb-2 text-sm font-medium text-white dark:text-white">Адрес аккаунта</label>
                            <input type="text" 
                                id="new-address" 
                                disabled
                                value={newWalletAddress}
                                className="pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5" />
                        </div>
                        <div className="w-full max-w-lg mb-6 pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-xl focus:outline-none focus:border-blue-500 block p-2.5">
                            <div className="">
                                <label htmlFor="seedPhrase" className="sr-only">Seed-фраза (ВАЖНО: сохраните фразу в надежном месте. При потере пароля восстановить аккаунт можно будет только по ней!)</label>
                                <textarea id="seedPhrase" 
                                          rows="4" 
                                          value={newWalletMnemonic}
                                          disabled
                                          className='w-full bg-transparent resize-none'></textarea>
                            </div>
                            <div className="flex items-center justify-end">
                                <div data-tooltip-id="copied" 
                                    data-tooltip-content={"Скопировано"}
                                    data-tooltip-place="top"
                                    onClick={() => navigator.clipboard.writeText(newWalletMnemonic)}
                                    className="p-2 cursor-pointer active:bg-white/30 rounded-full">
                                    <svg
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 text-white/70"
                                    >
                                    <path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-4v4a2 2 0 01-2 2H2a2 2 0 01-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 012 2v4h4V2H8v4zM2 8v10h10V8H2z" />
                                    </svg>
                                </div>
                                <Tooltip id="copied" openOnClick={true} delayHide={1000} />
                            </div>
                        </div>
                        <button type="button" 
                                onClick={finishWalletCreation} 
                                className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 me-2 mb-6">
                            Я сохранил фразу в надежном месте
                        </button>
                        </>
                        }
                    </>
                }
                <button type="button" onClick={() => setNewWallet(!newWallet)} className="flex justify-center items-center w-80 text-white bg-white/20 hover:shadow-2xl border-2 border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-lg px-8 py-4 text-center inline-flex items-center">
                    <img className='h-6 w-6 rounded-md mr-3' src={fefuCryptoLogo} alt='FEFU Crypto Logo' />
                    Создать кошелек
                </button>
                {restoreWalletToggle &&
                    <>
                    <div className="w-full max-w-lg my-6">        
                        <label htmlFor="seedPhrase" className="block mb-2 text-sm font-medium text-white dark:text-white">Seed-фраза</label>
                        <textarea id="seedPhrase" 
                                rows="4" 
                                value={mnemonic}
                                onChange={e => {
                                    setMnemonic(e.target.value)
                                    setMnemonicError(false)
                                }}
                                className={mnemonicError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-400 text-red-300 placeholder-red-700 text-md rounded-xl focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                                                        : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-xl focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
                        {mnemonicError && <p className="mt-2 text-sm text-red-400">Неправильная Seed-фраза</p>}
                    </div>
                    <div className="w-full max-w-lg mb-6">
                        <label htmlFor="default-input1" className="block mb-2 text-sm font-medium text-white dark:text-white">Новый пароль (минимум 8 символов, 1 цифра, 1 спец. символ)</label>
                        <input type="password" 
                            id="default-input1" 
                            onChange={e => {
                                setRestorePassword(e.target.value)
                                setRestorePasswordError(false)
                            }}
                            className={restorePasswordError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-400 text-red-300 placeholder-red-700 text-md rounded-full focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                                                    : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
                        {restorePasswordError && <p className="mt-2 text-sm text-red-400">Ненадежный пароль</p>}
                    </div>
                    <button type="button" 
                            onClick={handleWalletRestoration} 
                            className="text-gray-900 w-32 h-10 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 me-2">
                        <img className='h-4 w-4 mr-2' src={buttonLogo} alt='FEFU Crypto Button Logo' />
                        Восстановить
                    </button>
                    </>
                }
                <button type="button" 
                        onClick={() => setRestoreWalletToggle(!restoreWalletToggle)}
                        className="flex justify-center items-center w-80 text-white bg-white/20 hover:shadow-2xl border-2 border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-lg px-8 py-4 text-center inline-flex items-center mt-4">
                    Восстановить кошелек
                </button>
            </>
        )
    } else {
        return (
            <>
            <div className="w-full max-w-lg bg-white/10 custom-blur overflow-hidden shadow-2xl rounded-2xl">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-white">
                    Профиль пользователя
                </h3>
            </div>
            <div className="px-4 py-5 sm:p-0">
                <dl>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white/70">
                            Статус
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {currentAccount ? 
                                <span className="bg-green-300 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Подключено</span> :
                                <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Отключено</span>}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white/70">
                            Сеть
                        </dt>
                        <dd className="mt-1 text-sm text-white font-medium sm:mt-0 sm:col-span-2">
                            {chainId == 706970 ? "FEFU Mainnet" : "Неопознанная сеть"}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white/70">
                            Адрес аккаунта
                        </dt>
                        <dd className="mt-1 text-sm text-white font-medium sm:mt-0 sm:col-span-2">
                            {currentAccount.address}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-white/70">
                            Баланс
                        </dt>
                        <dd className="mt-1 text-sm text-white font-medium sm:mt-0 sm:col-span-2">
                            {`${balance} FEFU`}
                        </dd>
                    </div>
                </dl>
            </div>
            </div>
            <div className="w-full max-w-lg p-5 mt-10 bg-white/10 custom-blur overflow-hidden shadow-2xl rounded-2xl">
                <h5 className="text-lg font-bold text-white mb-3">Доступные опции</h5>
                {
                    options.map(option => {
                        return (
                            <Option key={option.name}
                                    value={option.value}
                                    name={option.name}
                                    price={option.price}
                                    />
                        )
                    })
                }
            </div>
            </>
        )
    }
}

export default Profile;