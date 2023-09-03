const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { PORT } = require('./constants/index');

app.use(bodyParser.json({ limit: '10000mb' }));

// Set CORS headers before defining routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add 'Content-Type' here
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Only if you need credentials (e.g., cookies)
    next();
  });

app.use(express.json());

// Import routes
const routes = require('./routes/routes');

// Initialize routes
app.use('/api', routes);

// app start
const appStart = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

appStart();