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
test('serializers.continuedev formats annotations as YAML string', () => {
  const annotations = <IAiAnnotation[]>[{ prompt: 'rulePrompt', code: 'rule code', lang: 'json' }];
  const parameters = <ICollectCommandParameters>{ md: { header: 'My Header' } };
  const output = serializers.continuedev(annotations, parameters);
  expect(typeof output).toBe('string');
  expect(output).toContain('PROMOTKIT');
  expect(output).toContain('schema: v1');
});
