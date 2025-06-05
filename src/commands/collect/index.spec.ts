import { Glob } from 'glob';
import fs from 'fs/promises';

import collect from './index';
import { serializers } from './utils';

// Test generated using Keploy
jest.spyOn(console, 'log');

it('should output to stdout when output is "stdout"', async () => {
  const mockAnnotations = [{ content: 'test annotation' }];
  const mockSerializer = jest.fn().mockReturnValue('serialized data');
  serializers['json'] = mockSerializer;

  const parameters = {
    pattern: 'test_pattern',
    format: 'json',
    output: 'stdout',
  };

  mockSerializer.mockReturnValueOnce("test serialized output")
  await collect({...parameters, dest: undefined} as any);

  expect(console.log).toHaveBeenCalledWith('test serialized output');
});

// Test generated using Keploy
jest.spyOn(fs, 'writeFile').mockImplementation(() => Promise.resolve());

it('should write to destination when dest is provided', async () => {
  const mockAnnotations = [{ content: 'test annotation' }];
  const mockSerializer = jest.fn().mockReturnValue('serialized data');
  serializers['json'] = mockSerializer;

  const parameters = {
    pattern: 'test_pattern',
    format: 'json',
    dest: 'test_dest.json',
    output: 'file'
  };

  await collect(parameters as any);

  expect(fs.writeFile).toHaveBeenCalledWith(parameters.dest, 'serialized data');
});

// Test generated using Keploy
it('should skip non-file directory entries', async () => {
  const parameters = {
    pattern: 'test_pattern',
    format: 'json',
    dest: 'test_dest.json',
    output: 'file'
  };

  const mockGlob = {
    iterate: () => {
      return [
        {
          isFile: () => false,
          parentPath: 'mock_parent_path',
          name: 'mock_directory',
        },
      ];
    },
  } as any;

  jest.spyOn(Glob.prototype, 'iterate').mockImplementation(mockGlob.iterate);
  jest.spyOn(console, 'log');

  await collect(parameters as any);

  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Done in'));
});
