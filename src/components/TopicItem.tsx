import { Link } from "react-router-dom";
import { Topic } from "../types/forum";
import { useAuth } from "./AuthContext";

export default function TopicItem({ topic, categoryId, onDelete, openEdit }: { topic: Topic, categoryId: string | undefined, onDelete: (e: React.MouseEvent, topicId: number) => void, openEdit: (id: number, title: string) => void }) {
  const { user } = useAuth();

  return (
    <div className="border border-gray-300 mb-1 cursor-pointer hover:bg-gray-50">
      <Link to={`/category/${categoryId}/topic/${topic.id}`} className="block px-2 py-2">
        <h3 className="text-base font-semibold text-blue-600 hover:underline">{topic.title}</h3>

        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Автор: <span className="font-medium">{topic.username}</span></span>
          <span>{new Date(topic.created_at).toLocaleString('ru-RU')}</span>
        </div>
      </Link>
      <div className="mt-2 text-right">
        {(user && (user.id === topic.author_id || user.role === 'admin')) && (
          <>
            <button className="text-xs text-blue-600 hover:underline" onClick={(e) => onDelete(e, topic.id)}>Удалить</button>
            <button className="text-xs text-blue-600 hover:underline" onClick={() => openEdit(topic.id, topic.title)}>Редактировать</button>
          </>
        )}
      </div>
    </div>
  )
}