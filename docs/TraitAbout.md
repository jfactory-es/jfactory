[jFactory](index.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitAbout

# TraitAbout 

Provides a data Object used to identify the Component. It contains the property `name` passed as first argument to [`jFactory()`](ref-components.md#create-a-component-literal)
. 

## Properties
Storred in `myComponent.$.about`

### `name`
Type: `string`
Validate: `/^[\w[\]#]+$/`

A custom explicit name to identify the component during logs and debugging

### `uid`
Type: `number` 

Autogenerated uniq id. Useful to identify the component.

### `fingerprint`
Type: `string`
Validate: `/^[\w]+$/`
 
Autogenerated reliable string based on the name and the uid. Can be used to generate css classnames or listener namespaces.  