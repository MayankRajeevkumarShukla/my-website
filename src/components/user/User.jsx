import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import slugify from 'slugify';
import styles from './User.module.css';

// Separate component for the editor to be used with BrowserOnly
const MarkdownEditor = ({ value, onChange }) => {
  const SimpleMDE = require('react-simplemde-editor').default;
  require('simplemde/dist/simplemde.min.css');

  return <SimpleMDE value={value} onChange={onChange} />;
};

function User() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState(''); // Added domain field
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const cloudName = 'dkvmzgzd7'; // Your Cloudinary cloud name
  const uploadPreset = 'DcodeBlock'; // Your Cloudinary upload preset

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setPreviewUrl(URL.createObjectURL(file)); // Show a local preview of the selected image

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }

      const data = await response.json();
      setImageLink(data.secure_url); // Set the generated image URL
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const copyImageLink = () => {
    navigator.clipboard.writeText(imageLink);
    alert('Image link copied to clipboard!');
  };

  const submitBlog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const blogData = { name, email, title, domain, slug, tags, content }; // Included domain in blogData

    try {
      const response = await fetch('http://localhost:5000/api/submit-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Submission error:', error.message);
        alert(`Error: ${error.message}`);
        return;
      }

      const data = await response.json();
      alert(data.message);

      // Clear form after successful submission
      setName('');
      setEmail('');
      setTitle('');
      setDomain(''); // Clear domain
      setSlug('');
      setTags('');
      setContent('');
      setImageLink('');
      setPreviewUrl(null);
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
        {error && <div className={styles.error}>{error}</div>}

        {/* Image Upload Section */}
        <div className={styles.formGroup}>
          <label>Upload Image:</label>
          <input type="file" onChange={handleImageUpload} className={styles.input} />
          {isUploading && <p>Uploading...</p>}
          {previewUrl && (
            <div className={styles.preview}>
              <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            </div>
          )}
          {imageLink && (
            <div className={styles.imageLink}>
              <label>Image Link:</label>
              <input type="text" value={imageLink} readOnly className={styles.input} />
              <button type="button" onClick={copyImageLink} className={styles.copyButton}>
                Copy Link
              </button>
              <p>Copy this link and paste it into your blog content where needed.</p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className={styles.formGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value, { lower: true }));
            }}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Domain:</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Slug (auto-generated from title):</label>
          <input type="text" value={slug} readOnly className={`${styles.input} ${styles.readOnlyInput}`} />
        </div>

        <div className={styles.formGroup}>
          <label>Tags (comma-separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. react, docusaurus, blog"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Blog Content:</label>
          <BrowserOnly>
            {() => <MarkdownEditor value={content} onChange={(value) => setContent(value)} />}
          </BrowserOnly>
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
