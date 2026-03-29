import { Client } from '@elastic/elasticsearch';
import { env } from './env';
import { logger } from '../utils/logger';

export const elasticClient = new Client({
  node: env.ELASTIC_URL,
});

export const connectElastic = async () => {
  try {
    await elasticClient.info();
  } catch (err) {
    logger.error('Elasticsearch error ❌', err);
  }
};
