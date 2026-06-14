const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/users.routes');
const todosRouter = require('./routes/todos.routes');
const loginRouter = require('./routes/login.routes');
const postsRouter = require('./routes/posts.routes');
const commentsRouter = require('./routes/comments.routes');
const registerRouter = require('./routes/register.routes');

const app = express();

app.use(cors());          // allow the React dev server (port 5173) to call us (port 3000)
app.use(express.json());  // parse JSON request bodies into req.body

// One line per resource - each router file holds the real work for that resource.
app.use('/users', usersRouter);
app.use('/todos', todosRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
