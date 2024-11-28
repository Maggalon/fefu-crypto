import { useContext, useEffect, useState } from "react";
import { FefuCryptoContext } from "../context/FefuCryptoContext";
import { ethers } from "ethers";
import Suggestion from "../components/Suggestion";
import { BeatLoader } from "react-spinners";
import buttonLogo from '../assets/button-logo.svg'


const Feedback = () => {

    const [isCreator, setIsCreator] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [suggestions, setSuggestions] = useState()

    const [titleError, setTitleError] = useState(false)
    const [contentError, setContentError] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const { feedbackContract, currentAccount } = useContext(FefuCryptoContext)

    const checkCreator = async () => {
        const isCreator = await feedbackContract.checkCreator(ethers.getAddress(currentAccount.address))
        setIsCreator(isCreator)
    }

    const getSuggestions = async () => {
        const suggestions = await feedbackContract.getSuggestions()
        setSuggestions(suggestions)        
    }

    const createSuggestion = async () => {

        if (title.length == 0) {
            setTitleError(true)
            return
        }

        if (content.length == 0) {
            setContentError(true)
            return
        }

        try {
            setIsLoading(true)
            let tx = await feedbackContract.createSuggestion(title, content)
            await tx.wait();
            getSuggestions()
            setTitle("")
            setContent("")
            setIsLoading(false)
        } catch (e) {
            console.log(e);
            setIsLoading(false)
        }

    }

    useEffect(() => {
        checkCreator()
        getSuggestions()
    }, [])

    return (
        <div className="max-w-lg w-full mx-auto ">
            {isCreator && 
            <>
            <div className="w-full max-w-lg mb-6">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-white dark:text-white">Заголовок</label>
                <input type="text" 
                       id="default-input" 
                       value={title}
                       onChange={e => {
                        setTitle(e.target.value)
                        setTitleError(false)
                       }}
                       className={titleError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-400 text-red-300 placeholder-red-700 text-md rounded-full focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                                             : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-full focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
                {titleError && <p className="mt-2 text-sm text-red-400">Недопустимое значение</p>}
            </div>
            <div className="w-full max-w-lg mb-6">        
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-white dark:text-white">Содержание</label>
                <textarea id="message" 
                          rows="4" 
                          value={content}
                          onChange={e => {
                            setContent(e.target.value)
                            setContentError(false)
                          }}
                          className={contentError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-400 text-red-300 placeholder-red-700 text-md rounded-xl focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                                                  : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-xl focus:outline-none focus:border-blue-500 block w-full p-2.5"} />
                {contentError && <p className="mt-2 text-sm text-red-400">Недопустимое значение</p>}
            </div>
            <button type="button" 
                    onClick={createSuggestion} 
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
            
            {
                suggestions && suggestions.map(suggestion => {
                    return (
                        <Suggestion key={suggestion.suggestionId} suggestion={suggestion} getSuggestions={getSuggestions} />
                    )
                })
            }
        </div>
    )
}

export default Feedback;