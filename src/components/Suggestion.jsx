import { useContext, useEffect, useState } from "react";
import Comment from "./Comment";
import { BeatLoader } from "react-spinners";
import { FefuCryptoContext } from "../context/FefuCryptoContext";
import { ethers } from "ethers";
import buttonLogo from '../assets/button-logo.svg'

const Suggestion = ({ suggestion, getSuggestions }) => {

    const [upvote, setUpvote] = useState(false);
    const [downvote, setDownvote] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showFullText, setShowFullText] = useState(false)

    const [comments, setComments] = useState()
    const [commentCreating, setCommentCreating] = useState(false)
    const [commentContent, setCommentContent] = useState("")
    const [commentError, setCommentError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { feedbackContract, currentAccount } = useContext(FefuCryptoContext)

    const createComment = async () => {

        if (commentContent.length == 0) {
            setCommentError(true)
            return;
        }

        try {
            setIsLoading(true)
            let tx = await feedbackContract.commentSuggestion(suggestion.suggestionId, commentContent)
            await tx.wait()
            await getComments()
            await getSuggestions()
            setCommentContent("")
            setIsLoading(false)

        } catch(e) {
            console.log(e);
            setIsLoading(false)
        }
        
    }
    
    const getComments = async () => {
        const userVote = await feedbackContract.votedSuggestions(suggestion.suggestionId, ethers.getAddress(currentAccount.address))
        const comments = await feedbackContract.getSuggestionComments(suggestion.suggestionId)
        setComments(comments)
        
        if (userVote.toString() == "1") {
            setUpvote(true)
            setDownvote(false)
        }
        else if (userVote.toString() == "-1") {
            setUpvote(false)
            setDownvote(true)
        }
        else {
            setUpvote(false)
            setDownvote(false)
        }
    }

    const vote = async (voteType) => {
        try {
            let tx = await feedbackContract.voteForSuggestion(voteType, suggestion.suggestionId)
            await tx.wait()
            await getSuggestions()
        } catch(e) {
            console.log(e);
            setUpvote(false)
            setDownvote(false)
        }
        
        
    }

    useEffect(() => {
        getComments()
    }, [])

    return (
        <>
            <div className="p-5 w-full max-w-lg flex flex-col bg-white/10 custom-blur shadow-2xl rounded-3xl my-4">
                <div onClick={() => setShowFullText(!showFullText)} className="comment text-white/70 font-bold text-2xl mb-5 cursor-pointer">{suggestion.title}</div>
                {showFullText ? <div className="text-white">{suggestion.content}</div>
                              : <div className="text-white">{suggestion.content.length > 40 ? suggestion.content.slice(0, 40) + "..." : suggestion.content}</div>}
                <div className="flex items-center justify-end">
                    <div className="text-white mr-2">{suggestion.comments.length}</div>
                    <svg
                        viewBox="0 0 512 512"
                        fill="currentColor"
                        onClick={() => setShowComments(!showComments)}
                        className="w-7 h-7 text-white cursor-pointer mr-5"
                        >
                        <path d="M256 32C114.6 32 .027 125.1.027 240c0 47.63 19.91 91.25 52.91 126.2-14.88 39.5-45.87 72.88-46.37 73.25-6.625 7-8.375 17.25-4.625 26C5.818 474.2 14.38 480 24 480c61.5 0 109.1-25.75 139.1-46.25 28 9.05 60.2 14.25 92.9 14.25 141.4 0 255.1-93.13 255.1-208S397.4 32 256 32zm.1 368c-26.75 0-53.12-4.125-78.38-12.12l-22.75-7.125-19.5 13.75c-14.25 10.12-33.88 21.38-57.5 29 7.375-12.12 14.37-25.75 19.88-40.25l10.62-28-20.62-21.87C69.82 314.1 48.07 282.2 48.07 240c0-88.25 93.25-160 208-160s208 71.75 208 160S370.8 400 256.1 400z" />
                    </svg>
                    {!upvote ?
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            onClick={() => {
                                setUpvote(true)
                                setDownvote(false)
                                vote(1)
                            }}
                            className="w-7 h-7 text-white cursor-pointer"
                            >
                            <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 004 14h4v7a1 1 0 001 1h6a1 1 0 001-1v-7h4a1.001 1.001 0 00.781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
                        </svg> :
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            onClick={() => {
                                setUpvote(false)
                                vote(1)
                            }}
                            className="w-7 h-7 text-white cursor-pointer"
                        >
                            <path d="M4 14h4v7a1 1 0 001 1h6a1 1 0 001-1v-7h4a1.001 1.001 0 00.781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 004 14z" />
                        </svg>
                    }
                    <div className="text-white mx-1">{suggestion.votes.toString()}</div>
                    {!downvote ?
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            onClick={() => {
                                setDownvote(true)
                                setUpvote(false)
                                vote(-1)
                            }}
                            className="w-7 h-7 text-white cursor-pointer"
                            >
                            <path d="M20.901 10.566A1.001 1.001 0 0020 10h-4V3a1 1 0 00-1-1H9a1 1 0 00-1 1v7H4a1.001 1.001 0 00-.781 1.625l8 10a1 1 0 001.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399L6.081 12H10V4h4v8h3.919L12 19.399z" />
                        </svg> :
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            onClick={() => {
                                setDownvote(false)
                                vote(-1)
                            }}
                            className="w-7 h-7 text-white cursor-pointer"
                        >
                            <path d="M20.901 10.566A1.001 1.001 0 0020 10h-4V3a1 1 0 00-1-1H9a1 1 0 00-1 1v7H4a1.001 1.001 0 00-.781 1.625l8 10a1 1 0 001.562 0l8-10c.24-.301.286-.712.12-1.059z" />
                        </svg>
                    }
                </div>
            </div>
            {showComments &&
                <div className="flex flex-col items-end">
                    {comments && comments.toReversed().map(comment => {
                        return (
                            <Comment key={comment.commentId} comment={comment} />
                        )
                    })}
                    <div className="comment cursor-pointer flex flex-col justify-center items-center p-5 w-full max-w-md bg-white/10 custom-blur shadow-2xl rounded-3xl my-2">
                        {!commentCreating ?
                            <svg
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className="w-7 h-7 text-white"
                                onClick={() => setCommentCreating(true)}
                                >
                                <path
                                    fillRule="evenodd"
                                    d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"
                                />
                            </svg> :
                            <div className="flex flex-col w-full">
                                <div className="w-full flex items-center mb-3">
                                    <svg
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        className="w-5 h-5 mr-2 text-white"
                                        onClick={() => setCommentCreating(false)}
                                        >
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={48}
                                            d="M244 400L100 256l144-144M120 256h292"
                                        />
                                    </svg>
                                    <div className="text-white">Оставить комментарий</div>
                                </div>
                                <textarea id="message" 
                                          rows="4" 
                                          value={commentContent}
                                          onChange={e => {
                                            setCommentContent(e.target.value)
                                            setCommentError(false)
                                          }}
                                          className={commentError ? "pl-5 shadow-2xl bg-red-900/20 border border-red-400 text-red-300 placeholder-red-700 text-md rounded-xl focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                                                                  : "pl-5 bg-white/20 custom-blur overflow-hidden shadow-2xl text-white/70 text-md font-semibold rounded-xl focus:outline-none focus:border-blue-500 block w-full p-2.5"} />                                
                                {commentError && <p className="mt-2 text-sm text-red-400 dark:text-red-500">Недопустимое значение</p>}
                                <div className="w-full flex justify-start">
                                    <button type="button" 
                                            onClick={createComment}
                                            className="mt-3 h-10 w-60 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 me-2">
                                        {!isLoading ?
                                            <>
                                                <img className='h-4 w-4 mr-2' src={buttonLogo} alt='FEFU Crypto Button Logo' />
                                                Выложить комментарий
                                            </> :
                                            <BeatLoader size={10} />                                        }
                                    </button>
                                </div>
                            </div>
                        }  
                    </div>
                </div>
            }
        </>
    )
}

export default Suggestion