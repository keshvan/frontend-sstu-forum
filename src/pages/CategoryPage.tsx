import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Category, Topic } from "../types/forum";
import { ForumService } from "../services/forumService";
import TopicItem from "../components/TopicItem";
import { useAuth } from "../components/AuthContext";

export default function CategoryPage() {
    const { id } = useParams();
    const [category, setCategory] = useState<Category>();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const { user } = useAuth()

    const fetchTopics = async () => {
        setIsLoading(true);
        setError(null);
        if (id) {
            try {
                const [category, topics] = await Promise.all([
                    ForumService.getCategory(id),
                    ForumService.getTopicsByCategory(id)
                ]);
                setCategory(category);
                setTopics(topics);
            } catch (error) {
                console.log(error);
                setError("Не удалось загрузить топики")
            } finally {
                setIsLoading(false);
            }
        }
    }
    
    useEffect(() => {
        fetchTopics();
    }, [id])

    const createTopic = async (event: React.FormEvent) => {
        event.preventDefault();

        if (title && title !== '' && id) {
            try {
                await ForumService.createTopic(id, title)
            } catch (error) {
                console.log(error)
                setError('Ошибка при создания топика')
            }
        }

        fetchTopics();
    }

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (category) {
        return (
            <div className="w-full">
                {menuOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-semibold mb-4">Создание новой темы</h2>
                            <form onSubmit={createTopic}>
                                <input
                                  type="text"
                                  placeholder="Заголовок"
                                  className="w-full mb-3 p-2 border rounded"
                                  onChange={(e) => setTitle(e.target.value)}
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
                <h1 className="text-xl font-bold border-b border-gray-300 bg-gray-100 px-2 py-1 mb-2">{category.title}</h1>
                <p className="text-gray-700 px-2 mb-3">{category.description}</p>
                {user && (<button onClick={() => setMenuOpen(true)} className="m-2 flex justify-self-end justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">Новая тема</button>)}
                {topics.length === 0 ? (
                    <p className="px-2">Тем пока нет.</p>
                ) : (
                    topics.map(topic => (<TopicItem key={topic.id} topic={topic} categoryId={id} /> ))
                )}
            </div>
        )
    }
}