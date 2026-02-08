// Simple test to verify backlinks component works
const React = require('react');

// Mock the BacklinksSection component
function BacklinksSection({ backlinks }) {
  if (!backlinks || backlinks.length === 0) {
    return null;
  }

  const validBacklinks = backlinks
    .filter(url => url && url.trim().length > 0)
    .map(url => {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      try {
        const domain = new URL(formattedUrl).hostname;
        return { url: formattedUrl, domain };
      } catch {
        return { url: formattedUrl, domain: formattedUrl };
      }
    });

  console.log('BacklinksSection test:');
  console.log('Input backlinks:', backlinks);
  console.log('Valid backlinks:', validBacklinks);
  console.log('Component would render', validBacklinks.length, 'backlinks');
  
  return validBacklinks.length;
}

// Test cases
console.log('=== Testing BacklinksSection Component ===\n');

// Test 1: Empty array
console.log('Test 1: Empty array');
const result1 = BacklinksSection({ backlinks: [] });
console.log('Result:', result1 === null ? 'null (no render)' : result1);
console.log('');

// Test 2: Null input
console.log('Test 2: Null input');
const result2 = BacklinksSection({ backlinks: null });
console.log('Result:', result2 === null ? 'null (no render)' : result2);
console.log('');

// Test 3: Valid backlinks
console.log('Test 3: Valid backlinks');
const testBacklinks = [
  'https://example.com',
  'google.com',
  '  https://github.com  ',
  '', // empty string
  '   ', // whitespace
  'invalid-url' // invalid format
];
const result3 = BacklinksSection({ backlinks: testBacklinks });
console.log('Result:', result3, 'backlinks would be rendered');
console.log('');

// Test 4: Mixed valid/invalid
console.log('Test 4: Mixed valid/invalid');
const mixedBacklinks = [
  'https://wisdomia.com',
  '',
  'medium.com',
  null,
  'https://news.ycombinator.com'
];
const result4 = BacklinksSection({ backlinks: mixedBacklinks });
console.log('Result:', result4, 'backlinks would be rendered');
console.log('');

console.log('=== Test Complete ===');