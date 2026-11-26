// craco.config.js
const path = require("path");
require("dotenv").config();

module.exports = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Add ignored patterns to reduce watched directories
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/build/**',
          '**/dist/**',
          '**/coverage/**',
        ],
      };
      if (webpackConfig.mode === 'production') {
        for (const minimizer of webpackConfig.optimization?.minimizer || []) {
          if (['TerserPlugin', 'CssMinimizerPlugin'].includes(minimizer?.constructor?.name)) {
            minimizer.options.parallel = 1;
          }
        }
      }
      return webpackConfig;
    },
  },
};
