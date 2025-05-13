import { Link } from "react-router-dom";
import { Topic } from "../types/forum";

export default function TopicItem({topic, categoryId}: {topic: Topic, categoryId: string | undefined}) {
    return (
      <div className="border border-gray-300 mb-1 cursor-pointer hover:bg-gray-50">
        <Link to={`/category/${categoryId}/topic/${topic.id}`} className="block px-2 py-2">
          <h3 className="text-base font-semibold text-blue-600 hover:underline">{topic.title}</h3>

          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Автор: <span className="font-medium">{topic.username}</span></span>
            <span>{new Date(topic.created_at).toLocaleString('ru-RU')}</span>
          </div>
        </Link>
      </div>
    )
}