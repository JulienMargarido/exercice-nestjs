const lazyImports = ['@nestjs/microservices', '@nestjs/websockets', '@fastify/view', '@fastify/static'];

// TODO: Investiguer avec des collaborateurs IPPON pour trouver les meilleurs configs de prod avec une lambda proxy
//      (c.a.d pour éviter les erreurs "main.handler is undefined or not exported")
module.exports = (appName, options, webpack) => {
  console.log(`Mode PROD Webpack pour ${appName}...`);

  return {
    mode: 'production',
    entry: [`apps/${appName}/src/${appName}-lambda.ts`],
    output: {
      filename: `apps/${appName}/${appName}-lambda.js`,
      library: {
        type: 'commonjs2',
      },
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          // Ignore les modules superflus pour le déploiement des Lambdas
          return lazyImports.includes(resource);
        },
      }),
    ],
  };
};
