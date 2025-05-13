export interface CategoriesResponse {
    categories: Category[];
}

export interface CategoryResponse {
	category: Category
}

export interface CreateCategoryResponse {
	id: number
}

export interface TopicsResponse {
    topics: Topic[];
}

export interface TopicResponse {
	topic: Topic
}

export interface CreateTopicResponse {
	id: number
}

export interface PostResponse {
    posts: Post[];
}

export interface CreatePostResponse {
	id: number
}

export interface Category {
    id: number,
    title: string,
    description: string,
    created_at: string,
    updated_at: string
}

export interface Topic {
    id: number,
	category_id: number,
	title: string,
	author_id: number | null,
	username: string,
	created_at: string,
	updated_at: string
}

export interface Post {
    id: number,
	topic_id: number,
	author_id: number | null,
	username: string, 
	content: string, 
	reply_to: number | null,
	created_at: string,
	updated_at: string
}