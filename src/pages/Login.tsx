import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useAuth } from "../components/AuthContext";

export default function Login() {
    const navigate = useNavigate(); // Для перенаправления после регистрации
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuth();
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        if (username && password) {
            const res = await AuthService.login({username, password});
            setUser(res.user);
            navigate("/");
        } else {
            setError('Произошла ошибка при входе.');
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-start pt-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-md">
                <div>
                    <h2 className="text-center text-2xl font-bold">
                        Войти
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1">
                            Имя пользователя
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Пароль
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </div>
                     <div className="text-sm text-center">
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                            Нет аккаунта? Зарегестрироваться
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}