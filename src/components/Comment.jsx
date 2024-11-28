import moment from "moment"

const Comment = ({ comment }) => {
    return (
        <div className="comment flex flex-col p-5 w-full max-w-md bg-white/10 custom-blur shadow-2xl rounded-3xl my-2">
            <div className="flex items-center mb-4">
                <div className="text-white/70 mr-3">{comment.author.slice(0,5) + "..." + comment.author.slice(-3)}</div>
                <div className="text-white/70">• {moment.unix(comment.createdAt.toString()).fromNow()} •</div>
            </div>
            <div className="text-white">{comment.content}</div>
        </div>
    )
}

export default Comment