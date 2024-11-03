import { jQuery, jFactory, JFactoryPromise, JFACTORY_MOD, JFACTORY_DEV } from 'jfactory';
import { describe, it, expect } from 'vitest';

describe('import /es', function() {
  it('import', function() {
    expect(jQuery).toBeTypeOf('function');
    expect(jFactory).toBeTypeOf('function');
    expect(JFactoryPromise).toBeTypeOf('function');
    expect(JFACTORY_MOD).eq('es');
    expect(JFACTORY_DEV).eq(false);
  });
});