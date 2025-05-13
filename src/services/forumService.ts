import { forumApi } from "../api/api";
import { CategoriesResponse, Category, CategoryResponse, CreateCategoryResponse, CreatePostResponse, CreateTopicResponse, Post, PostResponse, Topic, TopicResponse, TopicsResponse } from "../types/forum";


type ChatMessageListener = (message: any) => void;

export const ForumService = {
    socket: null as WebSocket | null,
    chatWSUrl: import.meta.env.VITE_CHAT_URL,
    chatMessageListeners: [] as ChatMessageListener[],

    connectToChat: async () => {
        if (ForumService.socket) {
            ForumService.socket.onopen = null;
            ForumService.socket.onmessage = null;
            ForumService.socket.onclose = null;
            ForumService.socket.onerror = null;
            ForumService.socket.close();
        }

        ForumService.socket = new WebSocket(ForumService.chatWSUrl + "?token=" + localStorage.getItem('access_token'));

        ForumService.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data as string);
                ForumService.chatMessageListeners.forEach(listener => listener(message));
            } catch (error) {
                console.error("Failed to parse WebSocket message data:", event.data, error);
            }
        };

        ForumService.socket.onclose = (event) => {
            console.log("WebSocket connection closed.", event.code, event.reason);
            ForumService.socket = null;
        };
    },

    disconnectFromChat: () => {
        if (ForumService.socket) {
            ForumService.socket.onopen = null;
            ForumService.socket.onmessage = null;
            ForumService.socket.onclose = null;
            ForumService.socket.onerror = null;
            ForumService.socket.close();
            ForumService.socket = null;
        }
    },

    addChatMessageListener: (listener: ChatMessageListener) => {
        ForumService.chatMessageListeners.push(listener);
    },

    removeChatMessageListener: (listener: ChatMessageListener) => {
        ForumService.chatMessageListeners = ForumService.chatMessageListeners.filter(l => l !== listener);
    },

    sendMessage: (message: any) => {
        if (ForumService.socket && ForumService.socket.readyState === WebSocket.OPEN) {
            ForumService.socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not connected");
        }
    },

    createCategory: async (title: string, description: string): Promise<number> => {
        if (title === '') {
            throw new Error('Title is required')
        }

        try {
            const res = await forumApi.post<CreateCategoryResponse>('/categories', { title: title, description: description })
            return res.data.id;
        } catch (error) {
            throw error
        }
    },

    deleteCategory: async (categoryId: number): Promise<{ success: boolean }> => {
        if (!categoryId) {
            throw new Error('Category ID is required');
        }

        try {
            await forumApi.delete(`/categories/${categoryId}`);
            return { success: true }
        } catch (error) {
            throw error;
        }
    },

    updateCategory: async (categoryId: number, title: string, description: string): Promise<{ success: boolean }> => {
        if (title === '') {
            throw new Error('Title is required')
        }

        try {
            await forumApi.patch(`/categories/${categoryId}`, { title: title, description: description })
            return {success: true}
        } catch (error) {
            throw error
        }
    },

    getCategories: async (): Promise<Category[]> => {
        try {
            const res = await forumApi.get<CategoriesResponse>('/categories');
            return res.data.categories;
        } catch (error) {
            throw error;
        }
    },

    getCategory: async (categoryId: string): Promise<Category> => {
        try {
            const res = await forumApi.get<CategoryResponse>(`/categories/${categoryId}`);
            return res.data.category
        } catch (error) {
            throw error;
        }
    },

    getTopic: async (topicId: string): Promise<Topic> => {
        try {
            const res = await forumApi.get<TopicResponse>(`/topics/${topicId}`);
            return res.data.topic
        } catch (error) {
            throw error;
        }
    },

    getTopicsByCategory: async (categoryId: string): Promise<Topic[]> => {
        if (!categoryId) {
            throw new Error('Category ID is required');
        }

        try {
            const res = await forumApi.get<TopicsResponse>(`/categories/${categoryId}/topics`);
            return res.data.topics;
        } catch (error) {
            throw error;
        }
    },

    createTopic: async (categoryId: string, title: string): Promise<number> => {
        if (title === "") {
            throw new Error('Title is required')
        }

        try {
            const res = await forumApi.post<CreateTopicResponse>(`/categories/${categoryId}/topics`, { title: title });
            return res.data.id;
        } catch (error) {
            throw error;
        }
    },

    getPostsByTopic: async (topicId: string): Promise<Post[]> => {
        if (!topicId) {
            throw new Error('Topic ID is required');
        }

        try {
            const res = await forumApi.get<PostResponse>(`/topics/${topicId}/posts`);
            return res.data.posts;
        } catch (error) {
            throw error;
        }
    },

    createPost: async (topicId: string, content: string, replyTo: number | null): Promise<number> => {
        if (!topicId) {
            throw new Error('Topic ID is required');
        }

        if (!content || content === '') {
            throw new Error('Content is required');
        }

        try {
            const res = await forumApi.post<CreatePostResponse>(`/topics/${topicId}/posts`, { content: content, reply_to: replyTo });
            return res.data.id;
        } catch (error) {
            throw error;
        }
    },

    deletePost: async (postId: number): Promise<{ success: boolean }> => {
        if (!postId) {
            throw new Error('Post ID is required');
        }

        try {
            await forumApi.delete(`/posts/${postId}`);
            return { success: true }
        } catch (error) {
            throw error;
        }
    },

    updatePost: async (postId: number, content: string): Promise<{ success: boolean }> => {
        if (!postId) {
            throw new Error('Post ID is required');
        }

        if (!content) {
            throw new Error('Content is required')
        }

        try {
            await forumApi.patch(`/posts/${postId}`, { content: content });
            return { success: true }
        } catch (error) {
            throw error;
        }
    }
}
