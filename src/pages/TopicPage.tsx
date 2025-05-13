import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Post, Topic } from "../types/forum";
import { ForumService } from "../services/forumService";
import PostItem from "../components/PostItem";
import { useAuth } from "../components/AuthContext";

export default function TopicPage() {
    const { topic_id } = useParams();
    const [topic, setTopic] = useState<Topic>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');
    const [postId, setPostId] = useState<number | null>(null);
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const { user } = useAuth()

    const fetchPosts = async () => {
        setIsLoading(true);
        setError(null);
        if (topic_id) {
            try {
                const [topic, posts] = await Promise.all([
                    ForumService.getTopic(topic_id),
                    ForumService.getPostsByTopic(topic_id)
                ]);
                setTopic(topic);
                setPosts(posts);
            } catch (error) {
                console.log(error);
                setError("Не удалось загрузить топики")
            } finally {
                console.log(posts);
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [topic_id])

    const createPost = async (event: React.FormEvent, reply_to: number | null) => {
        event.preventDefault();
        if (content && content !== '' && topic_id) {
            try {
                await ForumService.createPost(topic_id, content, replyTo)
            } catch (error) {
                console.log(error)
                setError('Ошибка при создании поста')
            }
        }
        setReplyTo(null);
        setMenuOpen(false);
        fetchPosts();
    }

    const editPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content && content !== '' && postId) {
            try {
                await ForumService.updatePost(postId, content)
            } catch (error) {
                console.log(error)
                setError('Ошибка при обновлении поста')
            }
        }
        setPostId(null);
        setContent('');
        setEditOpen(false);
        fetchPosts();
    }

    const onDelete = async (e: React.MouseEvent , postId: number) => {
        e.preventDefault();
        try {
			ForumService.deletePost(postId);
		} catch {
			alert("Ошибка в удалении поста");
		}
        fetchPosts();
    }

    const openEdit = (postId: number, content: string) => {
        setPostId(postId);
        setContent(content);
        setEditOpen(true);
    }

    const openMenu = (replyTo: number) => {
        setReplyTo(replyTo)
        setMenuOpen(true);
    }

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (topic) {
        return (
            <div className="w-full">
                {menuOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl">
                            <h2 className="text-lg font-semibold mb-4">Создание нового ответа</h2>
                            <form onSubmit={(e) => createPost(e, null)}>
                                <textarea
                                    rows={15}
                                    placeholder="Содержимое"
                                    className="w-full mb-3 p-2 border rounded resize-none"
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setMenuOpen(false)}
                                        className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Создать
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {editOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl">
                            <h2 className="text-lg font-semibold mb-4">Редактировать</h2>
                            <form onSubmit={editPost}>
                                <textarea
                                    rows={15}
                                    placeholder="Содержимое"
                                    className="w-full mb-3 p-2 border rounded resize-none"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setMenuOpen(false)}
                                        className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Подтвердить
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>  
                )}

                <h1 className="text-xl font-bold border-b border-gray-300 bg-gray-100 px-2 py-1 mb-2">{topic.title}</h1>
                <div className="text-sm text-gray-600 px-2 mb-3">
                    Автор: <span className="font-medium">{topic.username}</span> | {new Date(topic.created_at).toLocaleDateString()}
                </div>
                {user && (<button onClick={() => setMenuOpen(true)} className="m-2 flex justify-self-end justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">Ответить</button>)}
                {!posts || posts.length === 0 ? (
                    <p className="px-2">Постов пока нет.</p>
                ) : (posts.map(post => {
                    const parentPost = post.reply_to ? posts.find(p => p.id === post.reply_to) : null;
                    if (parentPost) {
                        return <PostItem key={post.id} post={post} parentPost={parentPost} openMenu={openMenu} openEdit={openEdit} onDelete={onDelete} />;
                    }
                    return <PostItem key={post.id} post={post} parentPost={null} openMenu={openMenu} openEdit={openEdit} onDelete={onDelete}/>;
                })
                )}
            </div>
        );
    }
}