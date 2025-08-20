import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient, AppStatus } from '@prisma/client';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export const pipelineQueue = new Queue('pipelineQueue', { connection });

const prisma = new PrismaClient();

new Worker(
  'pipelineQueue',
  async job => {
    const { appId } = job.data as { appId: string };
    let status: AppStatus | undefined;
    switch (job.name) {
      case 'crawlApp':
        status = AppStatus.CRAWLED;
        break;
      case 'generateWireframes':
        status = AppStatus.WIREFRAMES;
        break;
      case 'generateListing':
        status = AppStatus.GENERATED_LISTING;
        break;
      case 'buildOnePager':
        status = AppStatus.BUILT_ONEPAGER;
        break;
    }
    if (status) {
      await prisma.app.update({ where: { id: appId }, data: { status } });
    }
  },
  { connection }
);
