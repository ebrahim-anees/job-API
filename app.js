require('dotenv').config();
require('express-async-errors');

// swagger setup
const swaggerUI = require('swagger-ui-express'),
  YAML = require('yamljs'),
  swaggerDocument = YAML.load('./swagger.yaml');

// express app setup
const express = require('express'),
  app = express(),
  { connectDB } = require('./db/connect');

// security packages
const helmet = require('helmet'),
  cors = require('cors'),
  rateLimiter = require('express-rate-limit'),
  sanitizeMW = require('./middleware/xss-clean');

// extra packages
const convert = require('convert-units');

// error handler
const notFoundMiddleware = require('./middleware/not-found'),
  errorHandlerMiddleware = require('./middleware/error-handler'),
  auth = require('./middleware/authentication');

// routes
const authRouter = require('./routes/auth'),
  jobsRouter = require('./routes/jobs');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: convert(15).from('min').to('ms'),
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(sanitizeMW);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.send(`
    <h1>Jobs API</h1>
    <a href="/api-docs">Documentation</a>
  `);
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', auth, jobsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
