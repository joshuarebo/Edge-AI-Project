// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('tflite');
defaultConfig.resolver.assetExts.push('bin');
defaultConfig.resolver.assetExts.push('txt');

module.exports = defaultConfig;
