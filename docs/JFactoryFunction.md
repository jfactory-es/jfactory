[jFactory](../README.md) > [Reference](index.md) > [Classes](index.md#classes-internal-library) > JFactoryFunction

# JFactoryFunction

Composes functions from multiple sets of other functions, running in a specified order.
Mainly used to create factory patterns (wrapper, conditional, pipe ...)

## Wording
- **composer** : an instance a this class
- **composite** : a composed function
- **handlers** : functions that compose a composite
- **handlerGroup** : a named set of handlers

## Specifications

1) handlers can mutate arguments and result
1) handlers can break the execution process
1) handlers can be asynchronous: the composite function will return a promise
1) a composer can compose multiple composites from its handlerGroups, allowing variations
  (execution order, optional handlers, ...)
1) the composite functions run in separated contexts
1) the call scope is preserved inside handlers ("this" keyword)

## JFactoryFunctionComposer
## JFactoryFunctionExpirable
## JFactoryFunctionConditional
## JFactoryFunctionWrappable
