import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

// import { connectMongo } from './config/mongo';
// import { connectElastic } from './config/elastic';

app.listen(env.PORT, async () => {
  //   await connectMongo();
  //   await connectElastic();
  logger.info(`Server running on port ${env.PORT}`);
});
