import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate, } from "react-router-dom";
import { RootState } from "../store";
import { useAuth } from "./AuthContext";
import Chat from "./Chat";
import { useEffect } from "react";
import { ForumService } from "../services/forumService";

export default function Layout() {
    const { user, logout } = useAuth()

    useEffect(() => {
        ForumService.connectToChat();

        return () => {
            ForumService.disconnectFromChat();
        }
    }, []);


    return (
        <div className="flex flex-col h-screen text-sm">
            <header className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex justify-between">
                <Link to={"/"}>
                    <h1 className="text-lg font-bold text-gray-800">Форум</h1>
                </Link>
                <div className="flex gap-5 text-base items-center">
                    {user ? (
                        <>
                            <span className="text-gray-700">{user.username}</span>
                            <button
                                onClick={logout}
                                className="py-1 text-red-600 hover:text-red-500 hover:underline"
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="py-1 text-blue-600 hover:text-blue-500 hover:underline">Войти</Link>
                            <Link to="/register" className="py-1 text-blue-600 hover:text-blue-500 hover:underline">Регистрация</Link>
                        </>
                    )}
                </div>
            </header>
            <div className="flex-1 flex h-0 min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
                <div className="w-[300px] border-l border-gray-300 bg-gray-50 flex flex-col">
                    <div className="flex flex-col h-full max-h-screen">
                        <h2 className="text-base font-semibold px-2 pt-2">Чат</h2>
                        <div className="flex-1 overflow-hidden px-2 pb-2">
                            <Chat />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}