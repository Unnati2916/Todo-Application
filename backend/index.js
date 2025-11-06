
require('dotenv').config();
require('./Models/db'); 

const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
const TaskRouter = require('./Routes/TaskRouter');
const bodyParser = require('body-parser');
const cors= require('cors');

app.get('/', (req, res) => {
  res.send("Hello");
});

app.use(cors());
app.use(bodyParser.json());
app.use('/tasks', TaskRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT = ${PORT}`);
});
