import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  try {
    if (env.mongoUri) {
      await connectDB(env.mongoUri);
    } else {
      console.warn('MONGODB_URI is not set. API will start without database connection.');
    }

    app.listen(env.port, () => {
      console.log(`ResidentIQ API is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

bootstrap();
