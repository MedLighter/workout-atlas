const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Expo SQLite on web ships its worker as WebAssembly. SDK 57 requires Metro
// to treat `.wasm` as an asset so production exports include it.
config.resolver.assetExts.push('wasm');

module.exports = withNativeWind(config, { input: './global.css' });
