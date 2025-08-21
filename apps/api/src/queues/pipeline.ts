import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { AppStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import crawlApp from '../jobs/crawlApp';
import generateWireframes from '../jobs/generateWireframes';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

export const pipelineQueue = new Queue('pipelineQueue', { connection });

new Worker(
  'pipelineQueue',
  async job => {
    const { appId } = job.data as { appId: string };
    switch (job.name) {
      case 'crawlApp':
        await crawlApp({ appId });
        await prisma.app.update({ where: { id: appId }, data: { status: AppStatus.CRAWLED } });
        await pipelineQueue.add('generateWireframes', { appId });
        break;
      case 'generateWireframes':
        await generateWireframes(appId);
        await prisma.app.update({ where: { id: appId }, data: { status: AppStatus.WIREFRAMES } });
        await pipelineQueue.add('generateListing', { appId });
        break;
      case 'generateListing':
        await prisma.app.update({ where: { id: appId }, data: { status: AppStatus.GENERATED_LISTING } });
        await pipelineQueue.add('buildOnePager', { appId });
        break;
      case 'buildOnePager':
        await prisma.app.update({ where: { id: appId }, data: { status: AppStatus.BUILT_ONEPAGER } });
        break;
    }
  },
  { connection }
);
