// Government Infrastructure Asset Lifecycle Management Server
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Asset Lifecycle Server running in [${process.env.NODE_ENV || 'development'}] on port ${PORT}`);
      console.log(`📍 Base URL: http://localhost:${PORT}/api`);
    });

    const shutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server terminated.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
