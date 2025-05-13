import { useEffect, useRef } from "react";
import { useState } from "react";
import { ForumService } from "../services/forumService";

export default function Chat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleNewMessage = (message: any) => {
            setMessages(prevMessages => [...prevMessages, message]);
        };

        ForumService.addChatMessageListener(handleNewMessage);

        return () => {
            ForumService.removeChatMessageListener(handleNewMessage);
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim()) {
            ForumService.sendMessage({ type: 'new_message', content: newMessage });
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {messages.map((msg, index) => (
                    <div key={index} className="bg-white rounded p-2 shadow text-sm">
                        {msg.type == 'new_message' && (
                            <>
                                <strong>{msg.payload.username}:</strong> {msg.payload.content}
                                <div className="text-gray-400 text-xs">
                                    {new Date(msg.payload.created_at).toLocaleString()}
                                </div>   
                            </>
                        )}

                        {msg.type == "error" && (
                            <>
                                <strong className="text-red-500">ОШИБКА</strong> {msg.payload.content}
                            </>
                        )}

                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="pt-2 border-t border-gray-200 flex gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                    Отправить
                </button>
            </div>
        </div>
    );
}
