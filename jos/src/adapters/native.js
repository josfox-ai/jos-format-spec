/**
 * Native JOS Adapter
 * Connects to the standard JOS Prompts API (e.g. josfox.cloud)
 */
const { apiRequest } = require('../utils/request');

module.exports = {
    type: 'native',

    async optimize(artifact, options, providerUrl, model, apiKey) {
        const res = await apiRequest(`${providerUrl}/optimize`, 'POST', {
            artifact, options, format_version: '0.0.7'
        }, apiKey);
        if (res.status !== 200) throw new Error(res.data?.error?.message || `API ${res.status}`);
        return res.data;
    },

    async validate(artifact, providerUrl, model, apiKey) {
        const res = await apiRequest(`${providerUrl}/validate`, 'POST', {
            artifact, format_version: '0.0.7'
        }, apiKey);
        if (res.status !== 200) throw new Error(res.data?.error?.message || `API ${res.status}`);
        return res.data;
    },

    async generate(intention, options, providerUrl, model, apiKey) {
        const res = await apiRequest(`${providerUrl}/generate`, 'POST', {
            intention, options, format_version: '0.0.7'
        }, apiKey);
        if (res.status !== 200) throw new Error(res.data?.error?.message || `API ${res.status}`);
        return res.data;
    },

    async execute(artifact, providerUrl, model, apiKey) {
        const res = await apiRequest(`${providerUrl}/execute`, 'POST', {
            artifact, format_version: '0.0.7'
        }, apiKey);
        if (res.status !== 200) throw new Error(res.data?.error?.message || `API ${res.status}`);
        return res.data;
    }
};
