import json2md, { DataObject } from 'json2md';
import yaml from 'yaml';

import * as typescript from 'recast/parsers/typescript';
import * as babel from 'recast/parsers/babel-ts';

import * as comment from 'comment-parser';
import * as recast from 'recast';

import { IAiAnnotation, ICollectCommandParameters, IMatchedFile } from './types';
import { TCollectFormat } from '../../types';
import { buildCounter } from '../../utils';
import { TFunction } from '../../../types';

import env from '../../env';

export const extractAiAnnotations = (file: IMatchedFile): IAiAnnotation[] => {
  const extracted: Record<string, IAiAnnotation> = {}
  const ast = recast.parse(file.code, { parser: ['js', 'ts'].includes(file.lang) ? typescript : babel });

  const counter = buildCounter(Date.now());

  recast.types.visit(ast, {
    visitComment(visited) {
      const parsed = comment.parse(`/*${visited.value['value']}*/`).pop();

      const meta = parsed?.tags.find((line) => line.tag === 'ai');
      if (!meta) {
        return this.traverse(visited);
      }

      const group = meta.type || String(counter());
      const code = recast.print(Object.assign<any, object>(visited.node, { comments: [] })).code

      if (extracted[group]) {
        extracted[group].code += `\n${code}`;
        return this.traverse(visited);
      }

      extracted[group] = {
        path: file.path,
        lang: file.lang,

        prompt: `${meta.name} ${meta.description}`.trim(),
        code: recast.print(Object.assign<any, object>(visited.node, { comments: [] })).code,
      };

      this.traverse(visited);
    },
  });

  return Object.values(extracted);
};

export const convertFormatToExt = (format: TCollectFormat) => ({
  continuedev: '.yaml',
  finetuning: '.jsonl',
  yaml: '.yaml',
  json: '.json',
  md: '.md',
} satisfies Record<TCollectFormat, string>)[format];

export const serializers = {
  json: (annotations) => JSON.stringify(annotations),
  yaml: (annotations) => yaml.stringify(annotations),

  finetuning: (annotations) => annotations
    .map(({ code, lang, prompt }) => JSON.stringify({
        messages:[
          { role: 'user', content: prompt },
          { role: 'assistant', content: json2md({ code: { content: code, language: lang } }) }
        ]
      }))
    .join('\n'),

  md: (annotations, parameters) => json2md(<DataObject[]>[
    { h1: parameters.md?.header ?? env.md.header },

    ...annotations.map<DataObject[]>(({ code, lang, prompt }) => ([
      { h3: prompt },
      { code: { content: code, language: lang } },
    ])),
  ]),

  continuedev: (annotations, parameters) => yaml.stringify({
    name: 'PROMPTKIT',
    version: '0.0.1',
    schema: 'v1',
    rules: [
      json2md(<DataObject[]>[
        { h1: parameters.md?.header ?? env.md.header },

        ...annotations.map<DataObject[]>(({ code, lang, prompt }) => ([
          { h3: prompt },
          { code: { content: code, language: lang } },
        ])),
      ])
    ],
  }),
} satisfies Record<TCollectFormat, TFunction<string, [IAiAnnotation[], ICollectCommandParameters]>>;
