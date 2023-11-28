const express = require('express');
const booksRoutes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/books', booksRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
