import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';

export interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}
