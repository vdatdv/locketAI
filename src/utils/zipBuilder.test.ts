import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStoreZip, crc32 } from './zipBuilder';

test('crc32 computes standard IEEE 802.3 checksum', () => {
  assert.equal(crc32(Buffer.from('123456789', 'utf8')), 0xcbf43926);
});

test('buildStoreZip produces valid ZIP signatures and EOCD count', () => {
  const zip = buildStoreZip([
    { name: 'hello.txt', data: Buffer.from('world', 'utf8') },
    { name: 'src/app.ts', data: Buffer.from('export const x = 1;', 'utf8') },
  ]);

  // Starts with PK\x03\x04 local file header signature
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  // Ends with EOCD signature PK\x05\x06 and entry count = 2
  const eocdOffset = zip.length - 22;
  assert.equal(zip.readUInt32LE(eocdOffset), 0x06054b50);
  assert.equal(zip.readUInt16LE(eocdOffset + 8), 2);
  assert.equal(zip.readUInt16LE(eocdOffset + 10), 2);
});
