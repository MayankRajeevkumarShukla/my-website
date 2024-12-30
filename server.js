const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

const blogSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        title: { type: String, required: true },
        domain: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
                },
                message: (props) => `${props.value} is not a valid URL!`,
            },
        },
        tag: { type: String, required: true, unique: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

const updateAuthorYaml = async (authorData) => {
    const authorYamlPath = path.join(__dirname, 'blog', 'authors.yml');
    let authors = {};

    try {
        // Read the existing content
        const existingContent = await fs.readFile(authorYamlPath, 'utf8');
        authors = yaml.load(existingContent) || {};
    } catch (error) {
        if (error.code !== 'ENOENT') throw error; // Ignore file-not-found errors
    }

    // Add or update the new author
    authors[authorData.id] = {
        name: authorData.name,
        title: authorData.title,
        url: authorData.url && authorData.url.trim() !== '' ? authorData.url : '#', // Default to '#' if empty
        image_url: authorData.image_url,
    };

    // Write the updated content back to the file
    await fs.writeFile(authorYamlPath, yaml.dump(authors), 'utf8');
};


app.post('/api/submit-blog', async (req, res) => {
    try {
        const { name, email, title, domain, tag, content } = req.body;

        if (!name || !email || !title || !domain || !tag || !content) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingBlog = await Blog.findOne({ tag });
        if (existingBlog) {
            return res.status(400).json({ message: 'Tag must be unique' });
        }

        const blog = new Blog({ name, email, title, domain, tag, content });
        await blog.save();

        res.status(200).json({ message: 'Blog submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/get-blogs', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
});

app.post('/api/accept-blog', async (req, res) => {
    try {
        const { _id, markdown, authorYaml, tag } = req.body;

        // Sanitize filename
        const safeTag = tag.replace(/[^a-z0-9-]/gi, '-').toLowerCase();

        // Save markdown file to 'blog' folder
        const blogPath = path.join(__dirname, 'blog', `${safeTag}.md`);
        await fs.mkdir(path.join(__dirname, 'blog'), { recursive: true });
        await fs.writeFile(blogPath, markdown);

        // Update authors.yml
        await updateAuthorYaml(authorYaml);

        // Remove blog from MongoDB
        await Blog.findByIdAndDelete(_id);

        res.json({ message: 'Blog accepted and saved successfully!' });
    } catch (error) {
        console.error('Error in accepting blog:', error);
        res.status(500).json({ message: 'Failed to accept blog. Please try again.' });
    }
});

app.post('/api/reject-blog', async (req, res) => {
    try {
        const { blogId } = req.body;
        await Blog.findByIdAndDelete(blogId);
        res.json({ message: 'Blog rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject blog' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
