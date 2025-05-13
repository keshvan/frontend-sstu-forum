import { Link } from "react-router-dom";
import { Category } from "../types/forum";
import { useAuth } from "./AuthContext";


export default function CategoryItem({ category, onDelete, openEdit }: { category: Category, onDelete: (e: React.MouseEvent, categoryId: number) => void, openEdit: (id: number, title: string, description: string) => void }) {
  const { user } = useAuth();
  return (
    <div className="border border-gray-300 mb-1 cursor-pointer hover:bg-gray-50">
      <Link to={`/category/${category.id}`} className="block px-2 py-2">
        <h2 className="text-lg font-semibold text-blue-600 hover:underline">{category.title}</h2>
        <p className="text-gray-700">{category.description}</p>
        <div className="text-xs text-gray-500 mt-1">
          Создано: {new Date(category.created_at).toLocaleDateString()}
        </div>
      </Link>
      <div className="mt-2 text-right">
        {(user && user.role === 'admin') && (
          <>
            <button className="text-xs text-blue-600 hover:underline" onClick={(e) => onDelete(e, category.id)}>Удалить</button>
            <button className="text-xs text-blue-600 hover:underline" onClick={() => openEdit(category.id, category.title, category.description)}>Редактировать</button>
          </>
        )}
      </div>
    </div>
  )
}