// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add asset extensions for TensorFlow and other binary files
defaultConfig.resolver.assetExts.push('tflite');
defaultConfig.resolver.assetExts.push('bin');
defaultConfig.resolver.assetExts.push('txt');

// Increase timeouts and buffer size for large files
defaultConfig.server = {
  ...defaultConfig.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Increase timeout for all requests
      req.setTimeout(30000); // 30 seconds
      middleware(req, res, next);
    };
  },
};

// Increase max workers for faster bundling
defaultConfig.maxWorkers = 4;

// Increase buffer size for handling large files
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  minifierConfig: {
    ...defaultConfig.transformer.minifierConfig,
    compress: {
      ...defaultConfig.transformer.minifierConfig?.compress,
      drop_console: false, // Keep console logs during development
    },
  },
  assetPlugins: [...(defaultConfig.transformer.assetPlugins || [])],
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = defaultConfig;
