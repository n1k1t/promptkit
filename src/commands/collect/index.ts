import path from 'path';
import fs from 'fs/promises';

import { Glob } from 'glob';

import { IAiAnnotation, ICollectCommandParameters, IMatchedFile } from './types';
import { convertFormatToExt, extractAiAnnotations, serializers } from './utils';

import env from '../../env';

export default async (parameters: ICollectCommandParameters) => {
  const timestamp = Date.now();

  const files: IMatchedFile[] = [];
  const cwd = process.cwd();

  const glob = new Glob(parameters.pattern, {
    withFileTypes: true,
    ignore: parameters.ignore ?? env.ignore,
  });

  for await (const dirent of glob.iterate()) {
    if (!dirent.isFile()) {
      continue;
    }

    const location = path.join(dirent.parentPath, dirent.name);
    const code = await fs.readFile(location, 'utf8');

    if (code.includes('@ai')) {
      files.push({
        code,

        lang: path.extname(location).slice(1),
        path: path.relative(cwd, location),
      });
    }
  }

  const annotations = files.reduce<IAiAnnotation[]>((acc, file) => acc.concat(extractAiAnnotations(file)), []);

  if (parameters.output === 'stdout') {
    return console.log(serializers[parameters.format]?.(annotations, parameters));
  }

  const dest = parameters.dest ?? path.join(cwd, `promptkit${convertFormatToExt(parameters.format)}`);
  await fs.writeFile(dest, serializers[parameters.format](annotations, parameters));

  console.log(`Done in ${Date.now() - timestamp}ms`);
};
