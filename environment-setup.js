const jsonfile = require('jsonfile');
const DatabaseLinks = require('docker-links').parseLinks(process.env);
const ip = require('ip');

const DevelopmentConfigPath = './env/dev.json';
const ProductionConfigPath = './env/prod.json';
const DevelopmentConfig = jsonfile.readFileSync(DevelopmentConfigPath);
const ProductionConfig = jsonfile.readFileSync(ProductionConfigPath);

module.exports = (nodeEnvironment) => {
  const isProduction = (nodeEnvironment === 'production')? true : false;
  return (!isProduction) ? {
    tileServerUrl:  'http://' + DatabaseLinks.tiles.hostname + ':' + DatabaseLinks.tiles.port + '/tiles-leaflet-8-fixed/{z}/{x}/{y}.png',
    apiServerUrl: 'http://' + DatabaseLinks.api.hostname + ':' + DatabaseLinks.api.port,
    hostname: ip.address(),
    environmentName: 'development'
  } : {
    tileServerUrl:  ProductionConfig.TILE_SERVER_URL,
    apiServerUrl: ProductionConfig.API_SERVER_URL,
    hostname: '0.0.0.0',
    environmentName: 'production'
  };
};

