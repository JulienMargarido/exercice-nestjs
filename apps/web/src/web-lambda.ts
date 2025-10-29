import { awsLambdaFastify, CallbackHandler } from '@fastify/aws-lambda';
import { bootstrapApp, BootstrapConfig, NestApp, TypedConfigService } from '@/shared-configuration';
import { Logger } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import { FastifyInstance, FastifyListenOptions } from 'fastify';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { WebModule } from './web.module';

/*
 ****************************************************
 * AWS Lambda Handler (cf: cdk/lib)
 ****************************************************
 */

// Déclare un ReplaySubject pour stocker l'instance serverlessExpress.
// Optimization trouvée par https://medium.com/@rudyard_55741/improve-nestjs-cold-starts-on-lambda-with-rxjs-5dde21675e54
const serverSubject: ReplaySubject<CallbackHandler> = new ReplaySubject();
let appInstance: FastifyInstance;

// N'attends pas que le lambdaHandler soit appelé avant de boostrapper Nest.
// Passe le résultat de bootstrapApp() dans le ReplaySubject
const bootstrapConfig: BootstrapConfig = {
  includePrefix: true,
  includeSwagger: false,
  includeFilters: true,
  includeInterceptors: true,
};
bootstrapApp(WebModule, bootstrapConfig)
  .then((app) => {
    Logger.debug(`Bootstrapping de l'application Web...`);

    appInstance = app.instance;
    const appFastify = awsLambdaFastify(appInstance);
    Logger.debug(`Fastifying de l'application Web...`);

    appInstance.ready();
    Logger.debug(`Préparation de l'instance de l'application Web...`);

    serverSubject.next(appFastify);

    return app;
  })
  .then((app: NestApp) => {
    // Permet le lancement en local de l'app "web" build en mode production
    if (process.env.LOCAL_ENV === 'true') {
      const config = app.app.get(TypedConfigService);
      const serverPort = config.get('serverPort');
      const options: FastifyListenOptions = { port: serverPort };
      app.instance.listen(options, (err, address) => {
        Logger.log(`🚀 L'API Chat est accessible via: http://localhost:${serverPort}/`);
        if (err) {
          Logger.error(`Impossible de lancer l'API Chat sur: http://localhost:${serverPort}/`, err, address);
          throw err;
        }
      });
    }
  });

export const handler: Handler = async (event: unknown, context: Context, callback: Callback): Promise<void> => {
  Logger.log(`Invocation du handler de Lambda Web`);

  // Convertit le ReplaySubject en promesse. Attend que le bootstrap ait terminé, puis commence à traiter les requêtes.
  const server: CallbackHandler = await firstValueFrom(serverSubject);

  return server(event, context, callback);
};

module.exports.handler = handler;
