import { describe, it, expect } from 'vitest';
import { capitalize, highlightMatch, getMapUrl } from '../helper';

describe('capitalize', () => {
  it('should capitalize the first letter and lowercase the rest', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
    expect(capitalize('hELLo')).toBe('Hello');
  });

  it('should return empty string when input is empty', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('highlightMatch', () => {
  it('should return original text if searchText is empty', () => {
    expect(highlightMatch('', 'hello world')).toBe('hello world');
  });

  it('should highlight the matching part ignoring case', () => {
    expect(highlightMatch('lo', 'hello world')).toBe('hel<mark>lo</mark> world');
    expect(highlightMatch('WORLD', 'hello world')).toBe('hello <mark>world</mark>');
  });

  it('should escape special regex characters in searchText', () => {
    expect(highlightMatch('h.llo', 'h.llo world')).toBe('<mark>h.llo</mark> world');
  });

});

describe('getMapUrl', () => {
  it('should return google maps url with encoded destination', () => {
    expect(getMapUrl('New York')).toBe('https://www.google.com/maps/dir/?api=1&destination=New%20York');
  });
});
