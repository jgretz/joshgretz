import {describe, it, expect} from 'bun:test';
import {resolveType, slugFromFilename, validateUpload} from '../src/Types';

describe('resolveType', function () {
  it('should resolve images and markdown from the extension', function () {
    expect(resolveType('a.PNG')).toEqual({mime: 'image/png', kind: 'image'});
    expect(resolveType('a.jpeg')).toEqual({mime: 'image/jpeg', kind: 'image'});
    expect(resolveType('a.svg')).toEqual({mime: 'image/svg+xml', kind: 'image'});
    expect(resolveType('a.md')).toEqual({mime: 'text/markdown', kind: 'markdown'});
  });

  it('should return undefined for disallowed types', function () {
    expect(resolveType('a.txt')).toBeUndefined();
    expect(resolveType('a.pdf')).toBeUndefined();
    expect(resolveType('noext')).toBeUndefined();
  });
});

describe('slugFromFilename', function () {
  it('should strip the extension and slugify', function () {
    expect(slugFromFilename('My Screenshot.png')).toBe('my-screenshot');
    expect(slugFromFilename('Q3 Report (final).md')).toBe('q3-report-final');
  });
});

describe('validateUpload', function () {
  it('should return the resolved type for a valid upload', function () {
    expect(validateUpload('a.png', 100)).toEqual({mime: 'image/png', kind: 'image'});
  });

  it('should throw on a disallowed type', function () {
    expect(() => validateUpload('a.exe', 100)).toThrow('Unsupported file type');
  });
});
