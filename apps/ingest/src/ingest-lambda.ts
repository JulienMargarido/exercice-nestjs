import { bootstrapApp, BootstrapConfig, NestApp } from '@/shared-configuration';
import { HttpStatus, Logger } from '@nestjs/common';
import { Handler } from 'aws-lambda';
import { FastifyInstance } from 'fastify';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { IngestModule } from './ingest.module';
import { IngestService } from './service/ingest.service';

/*
 ****************************************************
 * AWS Lambda Handler (see in cdk/lib)
 ****************************************************
 */

// Déclare un ReplaySubject pour stocker l'instance serverlessExpress.
// Optimisation trouvée par https://medium.com/@rudyard_55741/improve-nestjs-cold-starts-on-lambda-with-rxjs-5dde21675e54
const serverSubject: ReplaySubject<NestApp> = new ReplaySubject();

let appInstance: FastifyInstance;

// N'attends pas que le lambdaHandler soit appelé avant de boostrapper Nest.
// Passe le résultat de bootstrapApp() dans le ReplaySubject
const bootstrapConfig: BootstrapConfig = {
  includePrefix: false,
  includeSwagger: false,
  includeFilters: false,
  includeInterceptors: true,
};
bootstrapApp(IngestModule, bootstrapConfig).then((app: NestApp) => {
  Logger.debug(`Bootstrapping de l'application Ingest...`);

  appInstance = app.instance;
  appInstance.ready();
  Logger.debug(`Préparation de l'instance de l'application Ingest...`);

  serverSubject.next(app);
});

export const handler: Handler = async (event /*, context: Context, callback: Callback*/): Promise<HttpStatus> => {
  Logger.log(`Handler Lambda d'ingestion invoqué`);
  Logger.log(`Événement : ${JSON.stringify(event)}`);

  // Convertit le ReplaySubject en promesse. Attend que le bootstrap ait terminé, puis commence à traiter les requêtes.
  const nestApp = await firstValueFrom(serverSubject);
  return nestApp.app.get(IngestService).ingestEvent(event);
};

module.exports.handler = handler;
