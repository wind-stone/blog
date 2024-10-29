import px2rem from 'postcss-plugin-px2rem';
import safeParser from 'postcss-safe-parser';
import FixflexBugs from 'postcss-flexbugs-fixes';
import presetEnv from 'postcss-preset-env';

export default {
  plugins: [
    safeParser,
    FixflexBugs,
    presetEnv({ autoprefixer: {}, stage: 3 }),
    px2rem({
      rootValue: 100,
      minPixelValue: 2
    }),
  ],
};
