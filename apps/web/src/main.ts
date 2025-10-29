import { WebModule } from './web.module';
import { Logger } from '@nestjs/common';
import { FastifyListenOptions } from 'fastify';
import { bootstrapApp, BootstrapConfig, TypedConfigService } from '@/shared-configuration';

/* eslint-disable  @typescript-eslint/no-explicit-any */
declare const module: any;
let serverPort: number;

const bootstrapConfig: BootstrapConfig = {
  includePrefix: false,
  includeSwagger: true,
  includeFilters: true,
  includeInterceptors: true,
};

async function startLocal() {
  Logger.debug(`Démarrage local...`);

  const { app } = await bootstrapApp(WebModule, bootstrapConfig);
  Logger.debug(`Application locale Nest bootstrappée...`);

  serverPort = app.get(TypedConfigService).get('serverPort');
  const config: FastifyListenOptions = { port: serverPort };
  await app.listen(config, (err, address) => {
    Logger.debug(`En écoute sur le port ${serverPort}...`);
    if (err) {
      Logger.error(`Impossible de lancer l'API Chat sur: http://localhost:${serverPort}/`, err, address);
      throw err;
    }
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

startLocal().then(() => {
  Logger.log(`🚀 L'API Chat est accessible via: http://localhost:${serverPort}`);
  if (bootstrapConfig.includeSwagger) Logger.log(`📝  Swagger via: http://localhost:${serverPort}/swagger`);
});
