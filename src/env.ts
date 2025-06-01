import dotenv from 'dotenv';

const config = dotenv.config();

export default {
  ignore: config.parsed?.PROMPTKIT_IGNORE ?? 'node_modules/**',

  md: {
    header: config.parsed?.PROMPTKIT_MD_HEADER ?? 'Use examples below to generate code by prompt',
  },
};
