import './env-devel.js';
import { jQuery, jFactory, JFactoryPromise, JFACTORY_MOD, JFACTORY_DEV } from 'jfactory/auto';
const { describe, it, expect } = await import('vitest');

describe('import /mjs-env', function() {
  it('import', function() {
    expect(jQuery).toBeTypeOf('function');
    expect(jFactory).toBeTypeOf('function');
    expect(JFactoryPromise).toBeTypeOf('function');
    expect(JFACTORY_MOD).eq('es');
    expect(JFACTORY_DEV).eq(true);
  });
});