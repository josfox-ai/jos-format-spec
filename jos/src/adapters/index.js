const NativeAdapter = require('./native');
const OllamaAdapter = require('./ollama');

/**
 * Adapter Factory
 * Returns the appropriate adapter based on provider type
 */
exports.getAdapter = (type) => {
    switch (type) {
        case 'ollama':
            return OllamaAdapter;
        case 'native':
        default:
            return NativeAdapter;
    }
};
