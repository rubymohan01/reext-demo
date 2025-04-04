module.exports = (nextConfig = {}) => {
    return {
      ...nextConfig,
      webpack(config, options) {
        // Define the global variable
        config.plugins.push(
          new options.webpack.DefinePlugin({
            '__IS_REEXT_RUNNING__': JSON.stringify('true'),
          })
        );
  
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }
        return config;
      }
    };
  };