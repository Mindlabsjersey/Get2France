import { Queue, QueueScheduler } from "bullmq"
import IORedis from "ioredis"
export const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379")
export const pipelineQueue = new Queue("pipeline", { connection })
new QueueScheduler("pipeline", { connection })
export async function addJob(name:string, data:any, opts:any={}) {
  return pipelineQueue.add(name, data, { removeOnComplete:true, ...opts })
}
