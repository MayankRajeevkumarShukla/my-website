// User.jsx
import React, { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import slugify from 'slugify';
import styles from './User.module.css';  // We'll create this CSS module

function User() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitBlog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const blogData = {
      name,
      email,
      title,
      domain,
      tag,
      content,
    };

    try {
      const response = await fetch('http://localhost:5000/api/submit-blog', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(blogData),
      });

      if (!response.ok) {
          const error = await response.json();
          console.error('Submission error:', error.message);
          alert(`Error: ${error.message}`);
          return;
      }

      const data = await response.json();
      console.log('Success:', data);
      alert(data.message);
  } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong. Please try again.');
  } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitBlog} className={styles.form}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        <div className={styles.formGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTag(slugify(e.target.value, { lower: true }));
            }}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Domain:</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Tag (auto-generated from title):</label>
          <input
            type="text"
            value={tag}
            readOnly
            className={styles.readOnlyInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Blog Content:</label>
          <SimpleMDE
            value={content}
            onChange={(value) => setContent(value)}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Blog'}
        </button>
      </form>
    </div>
  );
}

export default User;