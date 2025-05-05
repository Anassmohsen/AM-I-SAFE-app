'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

const Posts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div key={post.id} className="border p-4 rounded">
                    <h2 className="text-xl font-bold">{post.title}</h2>
                    <p className="text-gray-600">{post.content}</p>
                    <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default Posts; 