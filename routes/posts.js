const router = require('express').Router();
const auth = require('../middleware/auth');
const { Post, validatePost } = require('../models/posts');

// Get all posts
router.get('/', auth, async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

// Create new post (corrected route definition)
router.post('/', auth, async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const post = new Post(req.body);

  try {
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500).send('Error creating post: ' + err.message);
  }
});

// Get a single post
router.get('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) return res.send(post);
  res.sendStatus(404);
});

router.delete('/:id', auth, async(req, res) => {
  const deleted = await Post.deleteOne({_id:req.params.id});
  res.send(deleted);
});

module.exports = router;
