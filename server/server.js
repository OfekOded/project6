/**
 * File: server/server.js
 * Purpose: Express entry point - global middleware + ONE app.use line per resource router.
 * Owner: Partner A | SHARED INFRA - written once at kickoff, then FROZEN.
 *        (Partner B never edits this file; if a change is needed - message Partner A.)
 * Stage: B (שלב ב)
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/users.routes');       // Partner A
const todosRouter = require('./routes/todos.routes');       // Partner A
const loginRouter = require('./routes/login.routes');       // Partner A
const postsRouter = require('./routes/posts.routes');       // Partner B
const commentsRouter = require('./routes/comments.routes'); // Partner B
const registerRouter = require('./routes/register.routes'); // Partner B

const app = express();

app.use(cors());          // allow the React dev server (port 5173) to call us (port 3000)
app.use(express.json());  // parse JSON request bodies into req.body

// One line per resource. This is what keeps server.js conflict-free:
// each partner's real work lives inside their OWN router file.
app.use('/users', usersRouter);
app.use('/todos', todosRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

/* EXAM NOTES (בעל-פה):
 * - למה cors? הלקוח רץ על origin אחר (5173) והדפדפן חוסם בקשות cross-origin
 *   אלא אם השרת מחזיר כותרות CORS מתאימות. ‎cors()‎ מוסיף אותן.
 * - למה express.json()? בלעדיו req.body יהיה undefined בבקשות POST/PUT עם JSON.
 * - middleware = פונקציה שרצה על כל בקשה לפני ה-routes (שרשרת: cors -> json -> router).
 * - node --watch מחליף את nodemon (מובנה ב-Node, בלי ספרייה חיצונית).
 */
