import { Post } from "../types/forum";
import { useAuth } from "./AuthContext";

export default function PostItem({ post, parentPost, openMenu, openEdit, onDelete }: { post: Post, parentPost: Post | null, openMenu: (replyTo: number) => void, openEdit: (postId: number, content: string) => void, onDelete: (e: React.MouseEvent, postId: number) => void }) {
	const { user } = useAuth();
	
	return (
		<div className="flex border border-gray-300 mb-2 text-sm">
			<div className="w-48 bg-gray-100 border-r border-gray-300 p-2">
				<p className="font-semibold text-gray-800 mb-1">{post.username}</p>
				<p className="mt-2 text-xs text-gray-500">
					{new Date(post.created_at).toLocaleString('ru-RU')}
				</p>
			</div>

			<div className="flex-1 p-2">
				{parentPost && (
      				<div className="border-l-4 border-blue-300 pl-3 mb-2 text-gray-600 text-xs bg-blue-50 py-1">
        				<p className="mb-1 font-semibold">{parentPost.username} писал(а):</p>
        				<div className="whitespace-pre-wrap">{parentPost.content}</div>
      				</div>
   				)}
				<div className="text-gray-800 whitespace-pre-wrap mb-2">
					{post.content}
				</div>

				{post.updated_at !== post.created_at && (
					<p className="text-xs text-gray-500 italic">
						Отредактировано: {new Date(post.updated_at).toLocaleString('ru-RU')}
					</p>
				)}

				<div className="mt-2 text-right">
					<button className="text-xs text-blue-600 hover:underline" onClick={(e) => openMenu(post.id)}>
						Ответить
					</button>
					{(user?.id === post.author_id || user?.role === 'admin') && (
						<>
							<button className="text-xs text-blue-600 hover:underline" onClick={(e) => onDelete(e, post.id)}>Удалить</button>
							<button className="text-xs text-blue-600 hover:underline" onClick={(e) => openEdit(post.id, post.content)}>Редактировать</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}