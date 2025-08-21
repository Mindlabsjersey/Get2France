import Fastify from "fastify";
import { z } from "zod";
import { pipelineQueue } from "./queues/pipeline";
import { prisma } from "./lib/prisma";
import OpenAI from "openai";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid";
import { IncomingWebhook } from "@slack/webhook";
import dayjs from "dayjs";
import axios from "axios";
import { greet } from "@shared/greet";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const transporter = nodemailer.createTransport(
  sgTransport({ apiKey: process.env.SENDGRID_API_KEY || "" })
);
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL || "");

const server = Fastify();

server.get("/time", async () => {
  return { now: dayjs().toISOString(), greet: greet("visitor") };
});

server.post("/echo", async (request, reply) => {
  const bodySchema = z.object({ message: z.string() });
  const { message } = bodySchema.parse(request.body);

  await webhook.send({ text: message });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }]
  });

  await transporter.sendMail({
    from: "noreply@example.com",
    to: "user@example.com",
    subject: "Echo",
    text: message
  });

  const { data } = await axios.get("https://api.github.com/zen");

  return {
    message,
    openai: completion.choices[0].message?.content,
    zen: data
  };
});

server.post("/apps", async request => {
  const bodySchema = z.object({
    userId: z.string(),
    name: z.string(),
    platform: z.enum(["IOS", "ANDROID", "WEB"]),
    url: z.string().url().optional()
  });
  const { userId, name, platform, url } = bodySchema.parse(request.body);
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const app = await prisma.app.create({
    data: { userId, name, platform, url, slug }
  });
  await pipelineQueue.add("crawlApp", { appId: app.id });
  return app;
});

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
