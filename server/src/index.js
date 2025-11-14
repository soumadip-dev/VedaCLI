import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello from VedaCLI API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
