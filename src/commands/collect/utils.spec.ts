import json2md from 'json2md';

import { IAiAnnotation, ICollectCommandParameters, IMatchedFile } from './types';
import { extractAiAnnotations } from './utils';
import { serializers } from './utils';

// Test generated using Keploy
test('extractAiAnnotations with no @ai comments returns empty array', () => {
  const mockFile: IMatchedFile = {
    path: 'no/ai/comments',
    code: `
    // just some code
    const x = 42;`,
    lang: 'ts',
  };
  const annotations = extractAiAnnotations(mockFile);
  expect(annotations).toEqual([]);
});

// Test generated using Keploy
test('serializers.json serializes annotations array correctly', () => {
  const annotations = <IAiAnnotation[]>[{ prompt: 'testPrompt', code: 'console.log(1);', lang: 'ts' }];
  const result = serializers.json(annotations);
  expect(typeof result).toBe('string');
  const parsed = JSON.parse(result);
  expect(parsed).toEqual(annotations);
});

// Test generated using Keploy
test('serializers.yaml serializes annotations array correctly', () => {
  const annotations = <IAiAnnotation[]>[{ prompt: 'yamlPrompt', code: 'print("hi")', lang: 'py' }];
  const result = serializers.yaml(annotations);
  expect(typeof result).toBe('string');
  expect(result).toContain('yamlPrompt');
  expect(result).toContain('print("hi")');
});

// Test generated using Keploy
test('serializers.md creates markdown with header and annotations', () => {
  const annotations = <IAiAnnotation[]>[{ prompt: 'MD prompt', code: 'const a = 10;', lang: 'js' }];
  const parameters = <ICollectCommandParameters>{ md: { header: 'My Header' } };
  const result = serializers.md(annotations, parameters);
  expect(typeof result).toBe('string');
  expect(result).toContain('# My Header');
  expect(result).toContain('MD prompt');
  expect(result).toContain('const a = 10;');
});

// Test generated using Keploy
test('serializers.finetuning serializes annotations to correct JSONL format', () => {
  const annotations = <IAiAnnotation[]>[
    { prompt: 'first prompt', code: 'let a = 1;', lang: 'js' },
    { prompt: 'second prompt', code: 'let b = 2;', lang: 'ts' }
  ];
  const result = serializers.finetuning(annotations);
  const expectedJsonl = JSON.stringify({
    messages: [
      { role: 'user', content: 'first prompt' },
      { role: 'assistant', content: json2md({ code: { content: 'let a = 1;', language: 'js' } }) }
    ]
  }) + '\n' + JSON.stringify({
    messages: [
      { role: 'user', content: 'second prompt' },
      { role: 'assistant', content: json2md({ code: { content: 'let b = 2;', language: 'ts' } }) }
    ]
  });
  expect(result).toBe(expectedJsonl);
});

// Test generated using Keploy
test('serializers.continuedev correctly includes YAML metadata', () => {
  const annotations = <IAiAnnotation[]>[
    { prompt: 'yaml prompt', code: 'console.log("Hello");', lang: 'js' }
  ];
  const parameters = <ICollectCommandParameters>{ md: { header: 'Custom Header' } };
  const result = serializers.continuedev(annotations, parameters);
  expect(result).toContain('name: PROMPTKIT');
  expect(result).toContain('version: 0.0.1');
  expect(result).toContain('schema: v1');
  expect(result).toContain('yaml prompt');
  expect(result).toContain('console.log("Hello");');
});
