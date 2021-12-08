module.exports = {
    reactStrictMode: true,
    webPackDevMiddleware: (config) => {
        config.watchOptions.poll = true;
        return config;
    },
};
