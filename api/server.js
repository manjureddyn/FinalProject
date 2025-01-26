
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const JWT_SECRET='ljaksdfja;sdfgjpahfoiiauhwsfmabvokjaijsgbf'

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client's URL
  credentials: true,
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB connection
mongoose.connect('mongodb+srv://user:9iYkbIqtM4I0d6Im@cluster0.z4kwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Task model
const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  category: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: true }
});

const Task = mongoose.model('Task', TaskSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Routes

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).send(error);
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(!user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid login credentials');
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    // console.log(token);
    res.send({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).send(error);
  }
});

// Get user profile
app.get('/api/user', auth, async (req, res) => {
  res.send(req.user);
});

// Create a task
app.post('/api/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user._id
    });
    await task.save();
    
    res.status(201).send(task);
  } catch (error) {

    console.error('Create task error:', error);
    res.status(400).send(error);
  }
});

// Get all tasks for a user
app.get('/api/tasks', auth, async (req, res) => {
  console.log(23);
  try {
    const tasks = await Task.find({ user: req.user._id });
    
    res.send(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).send();
  }
});

// Update a task
app.put('/api/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['text', 'category', 'completed', 'dueDate'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).send(error);
  }
});

// Delete a task
app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).send();
  }
});

app.listen(5001, () => {
  console.log('Server listening on port 5001');
})