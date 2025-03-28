const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for blog posts
let blogPosts = [];
let nextId = 1;

// Routes
app.get('/', (req, res) => {
  res.render('index', { posts: blogPosts });
});

app.get('/new-post', (req, res) => {
  res.render('new-post');
});

app.post('/create-post', (req, res) => {
  const { title, content } = req.body;
  
  if (title && content) {
    const newPost = {
      id: nextId++,
      title,
      content,
      createdAt: new Date()
    };
    
    blogPosts.push(newPost);
    res.redirect('/');
  } else {
    res.status(400).send('Title and content are required');
  }
});

app.get('/edit-post/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = blogPosts.find(p => p.id === postId);
  
  if (post) {
    res.render('edit-post', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.post('/update-post/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  
  const postIndex = blogPosts.findIndex(p => p.id === postId);
  
  if (postIndex !== -1) {
    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      title,
      content
    };
    
    res.redirect('/');
  } else {
    res.status(404).send('Post not found');
  }
});

app.get('/delete-post/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  
  blogPosts = blogPosts.filter(p => p.id !== postId);
  
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});