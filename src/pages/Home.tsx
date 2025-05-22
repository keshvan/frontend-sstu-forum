import { useEffect, useState } from "react";
import { Category } from "../types/forum";
import { ForumService } from "../services/forumService";
import CategoryItem from "../components/CategoryItem";
import { useAuth } from "../components/AuthContext";


const test_categories = [
    {
        id: 1,
        title: "Видеоигры",
        description: "Обсуждаем видеоигры",
        created_at: "01-05-2025",
        updated_at: "01-05-2025"
    },
    {
        id: 2,
        title: "Компики",
        description: "Обсуждаем компики",
        created_at: "01-05-2025",
        updated_at: "01-05-2025"
    },
]

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const { user } = useAuth()

    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const categories = await ForumService.getCategories();
            setCategories(categories);
        } catch (error) {
            console.log(error)
            setError("Не удалось загрузить категории");
        } finally {
            setIsLoading(false);
            console.log(categories);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const onDelete = async (e: React.MouseEvent, categoryId: number) => {
        e.preventDefault();
        try {
            await ForumService.deleteCategory(categoryId);
        } catch {
            alert("Ошибка в удалении категории");
        }
        fetchCategories();
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (title && title !== '') {
            try {
                await ForumService.createCategory(title, description);
            } catch (error) {
                console.log(error)
                setError('Ошибка при создании категории')
            }
        } else {
            return
        }
        fetchCategories();
        setFormOpen(false);
        setDescription('');
        setTitle('');
    }

    const editCategory = async (event: React.FormEvent) => {
        event.preventDefault();
        if (title && title !== '' && categoryId) {
            try {
                await ForumService.updateCategory(categoryId, title, description);
            } catch (error) {
                console.log(error)
                setError('Ошибка при обновлении категории')
            }
        } else {
            return
        }
        fetchCategories();
        setEditOpen(false);
        setDescription('');
        setTitle('');
        setCategoryId(null);
    }

    const openEdit = (categoryId: number, title: string, description: string) => {
        setCategoryId(categoryId);
        setTitle(title);
        setDescription(description);
        setEditOpen(true);
    }

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="w-full">
            {formOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Создание новой темы</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Заголовок"
                                className="w-full mb-3 p-2 border rounded"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Описание"
                                className="w-full mb-3 p-2 border rounded"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => {setFormOpen(false); setDescription(''); setTitle('')}}
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
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Редактирование категории</h2>
                        <form onSubmit={editCategory}>
                            <input
                                type="text"
                                placeholder="Заголовок"
                                className="w-full mb-3 p-2 border rounded"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Описание"
                                className="w-full mb-3 p-2 border rounded"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => {setEditOpen(false); setTitle(''); setDescription(''); setCategoryId(null)}}
                                    className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {(user && user.role == 'admin') && (<button onClick={() => setFormOpen(true)} className="m-2 flex justify-self-end justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">Создать категорию</button>)}
            <h1 className="text-xl font-bold border-b border-gray-300 bg-gray-100 px-2 py-1 mb-2">Категории</h1>

            {
                categories.length === 0 ? (
                    <p className="px-2">Категорий пока нет.</p>
                ) : (
                    categories.map(category => (<CategoryItem key={category.id} category={category} onDelete={onDelete} openEdit={openEdit}/>))
                )
            }
        </div >
    )
}