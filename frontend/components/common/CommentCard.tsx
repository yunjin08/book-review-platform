import { CardContent } from '../ui/card'

interface CommentProps {
    username: string
    body: string
}

const CommentCard: React.FC<CommentProps> = ({ username, body }) => {
    return (
        <CardContent className="p-3 rounded-lg bg-slate-200">
            <div className="flex flex-col">
                <span className="font-medium">
                    <b>{username}</b>
                </span>
                <p className="text-sm text-gray-700 mt-2">{body}</p>
            </div>
        </CardContent>
    )
}

export default CommentCard
