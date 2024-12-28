const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from your frontend origin

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Mongoose Schema and Model
const blogSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        title: { type: String, required: true },
        domain: { type: String, required: true },
        tag: { type: String, required: true, unique: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

// Routes
app.post('/api/submit-blog', async (req, res) => {
    try {
        const { name, email, title, domain, tag, content } = req.body;

        // Validate input
        if (!name || !email || !title || !domain || !tag || !content) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for duplicate tag
        const existingBlog = await Blog.findOne({ tag });
        if (existingBlog) {
            return res
                .status(400)
                .json({ message: 'Tag must be unique. A blog with this tag already exists.' });
        }

        // Save blog
        const blog = new Blog({ name, email, title, domain, tag, content });
        await blog.save();

        res.status(200).json({ message: 'Blog submitted successfully!' });
    } catch (error) {
        console.error('Error saving blog:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
