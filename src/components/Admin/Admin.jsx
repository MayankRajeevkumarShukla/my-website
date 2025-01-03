import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import styles from './Admin.module.css';

function Admin() {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState(null);
    const [previewBlog, setPreviewBlog] = useState(null);
    const [tags, setTags] = useState({});

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/get-blogs');
            setBlogs(response.data);
        } catch (err) {
            setError('Failed to fetch blogs.');
        }
    };

    const handleTagChange = (blogId, newTags) => {
        setTags({ ...tags, [blogId]: newTags.split(',').map((tag) => tag.trim()) });
    };

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };

    const handleAccept = async (blog) => {
        try {
            const blogSlug = blog.slug || generateSlug(blog.title);

            const blogMarkdown = `---
slug: ${blogSlug}
title: ${blog.title}
authors: [${blog.name.toLowerCase().replace(/\s+/g, '-')}]
tags: [${(tags[blog._id] || blog.tags).join(', ')}]
date: ${new Date().toISOString().split('T')[0]}
---

${blog.content}`;

            const authorYaml = {
                id: blog.name.toLowerCase().replace(/\s+/g, '-'),
                name: blog.name,
                title: 'Contributor',
                image_url: 'https://via.placeholder.com/150',
            };

            const response = await axios.post('http://localhost:5000/api/accept-blog', {
                _id: blog._id,
                markdown: blogMarkdown,
                authorYaml,
                slug: blogSlug,
            });

            alert(response.data.message);
            setBlogs(blogs.filter((b) => b._id !== blog._id));
        } catch (err) {
            alert('Failed to accept the blog. Please try again.');
        }
    };

    const handleReject = async (blogId) => {
        try {
            const response = await axios.post('http://localhost:5000/api/reject-blog', { blogId });
            alert(response.data.message);
            setBlogs(blogs.filter((b) => b._id !== blogId));
        } catch (err) {
            alert('Failed to reject the blog. Please try again.');
        }
    };

    const handlePreview = (blog) => {
        setPreviewBlog(blog);
    };

    // Navigate to the main page
    const goToMainPage = () => {
        window.location.href = '/'; // Redirects to the homepage (you can adjust the URL if needed)
    };

    return (
        <div className={styles.container}>
            <h1>Admin Panel</h1>
            {error && <div className={styles.error}>{error}</div>}

            {previewBlog && (
                <div className={styles.previewModal}>
                    <div className={styles.previewContent}>
                        <h2>{previewBlog.title}</h2>
                        <ReactMarkdown>{previewBlog.content}</ReactMarkdown>
                        <button onClick={() => setPreviewBlog(null)}>Close Preview</button>
                    </div>
                </div>
            )}

            {blogs.length === 0 ? (
                <p>No blogs to review.</p>
            ) : (
                blogs.map((blog) => (
                    <div key={blog._id} className={styles.blogCard}>
                        <h2>{blog.title}</h2>
                        <p><strong>Author:</strong> {blog.name}</p>
                        <p><strong>Email:</strong> {blog.email}</p>
                        <p><strong>Domain:</strong> {blog.domain}</p>
                        <p><strong>Tags:</strong> {blog.tags.join(', ')}</p>
                        <p><strong>Slug:</strong> {blog.slug}</p>

                        <div className={styles.tagInput}>
                            <label>Additional Tags (comma-separated):</label>
                            <input
                                type="text"
                                onChange={(e) => handleTagChange(blog._id, e.target.value)}
                                placeholder="tag1, tag2, tag3"
                            />
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={styles.previewButton}
                                onClick={() => handlePreview(blog)}
                            >
                                Preview
                            </button>
                            <button
                                className={styles.acceptButton}
                                onClick={() => handleAccept(blog)}
                            >
                                Accept
                            </button>
                            <button
                                className={styles.rejectButton}
                                onClick={() => handleReject(blog._id)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            )}

            <div className={styles.goToMainButton}>
                <button onClick={goToMainPage}>Go to Main Page</button>
            </div>
        </div>
    );
}

export default Admin;
