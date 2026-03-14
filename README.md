# simple-dropdown

## Table of Contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
  * [Setup](#setup)
    * [Configuration](#configuration)
      * [Global Configuration](#global-configuration)
      * [Configuration via Profiles](#configuration-via-profiles)
      * [Direct Component Configuration](#direct-component-configuration)
    * [Defining Dropdown Items](#defining-dropdown-items)
      * [Dropdown Items Data Format](#dropdown-items-data-format)
      * [Specifying Dropdown Items](#specifying-dropdown-items)
    * [Registering the Component](#registering-the-component)
      * [Default Registration](#default-registration)
      * [Custom Component Name Registration](#custom-component-name-registration)
      * [Registration without Styles](#registration-without-styles)
    * [Including Styles](#including-styles)
    * [Order of Setup Operations](#order-of-setup-operations)
  * [Instantiating `simple-dropdown`](#instantiating-simple-dropdown)
    * [Component Attributes](#component-attributes)
    * [Component Properties](#component-properties)
    * [Instantiating via Markup](#instantiating-via-markup)
    * [Instantiating Programmatically](#instantiating-programmatically)
  * [Replacing a Component's Items](#replacing-a-components-items)
  * [Listening for Value Changes](#listening-for-value-changes)
  * [Including a Dropdown Within a Form](#including-a-dropdown-within-a-form)
  * [Customizing the Default Styles](#customizing-the-default-styles)
* [Component Interaction Modes](#component-interaction-modes)
  * [Mouse Mode](#mouse-mode)
  * [Keyboard Mode](#keyboard-mode)
  * [Interaction CSS classes](#interaction-css-classes)
* [Development](#development)
  * [Development Prerequisites](#development-prerequisites)
  * [Development Setup](#development-setup)
  * [Contributing Changes](#contributing-changes)
* [Caveats](#caveats)
* [Future Features](#future-features)
* [Integration with Frameworks](#integration-with-frameworks)
* [Demo](#demo)

## Introduction

This user interface (UI) component is a highly customizable analogue of a single-value-focused
`select` HTML tag.  `simple-dropdown` offers features that are not available in the native
implementation such as placeholder declaration (for when no value is selected), full visual
customization via Cascading Style Sheets (CSS), clearance of a previously selected value,
component-specific configuration, and data-based specification of dropdown options.  The widget
can be interacted with multimodally via a mouse or a keyboard.  `simple-dropdown` is implemented
as a [web component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) and is
framework-agnostic.  It should work like a typical HTML tag when used within React, Angular, or any
other approach.  As a data intake element, the dropdown integrates with HTML `form`, affecting the
latter's validity and submission data.  Within a browser, `simple-dropdown` is subject to the
appropriate pseudo-classes such as `:invalid` and `:disabled` whenever these are applicable.

## Installation

The component is installed as follows.

```
npm install --save simple-dropdown
```

## Usage

### Setup

#### Configuration

`simple-dropdown` accepts only two configuration parameters: `scrollBehavior` and `triggerImmediately`.
`scrollBehavior` is an object that is passed directly to a native `scrollIntoView()` function and, by
default, is set to `{behavior: 'smooth', block: 'nearest'}`.  This setting instructs a browser to scroll
to an appropriate dropdown option smoothly (visually noticeably) such that the scrolling is stopped once
the option is visible and closest either to the top or bottom of the scrolling container.  `triggerImmediately`
is set to `true` by default and directs a `change` event to be fired right after a newly instantiated
dropdown is initialized with a value.  Note that the `select` element will **not** fire a `change` event when
the tag is instantiated with a selected value.

Configuration parameters can be set in three ways: globally, as a configuration profile (via a reference),
or directly on a specific `simple-dropdown` instance.

##### Global Configuration

Global configurations are changed using `setGlobalConfigs()`.  The latter accepts a partial or a full set of
configurations that override their respective default global settings.

*Applying Partial Configuration*
```javascript
import {setGlobalConfigs} from 'simple-dropdown';

setGlobalConfigs({scrollBehavior: {behavior: 'instant'}});
```

*Applying Full Configuration*
```javascript
import {setGlobalConfigs} from 'simple-dropdown';

setGlobalConfigs({
  scrollBehavior: {
    behavior: 'instant', 
    block: 'end'
  },
  triggerImmediately: false
});
```

##### Configuration via Profiles

Various groups of configuration settings may be linked to their respective aliases using
`setConfigProfile()`.

*Creating Configuration Profile*
```javascript
import {setConfigProfile} from 'simple-dropdown';

setConfigProfile('instant', {scrollBehavior: {behavior: 'instant'}});
```

*Applying Configuration Profile*
```html
<simple-dropdown configsref="instant"></simple-dropdown>
```

When a `simple-dropdown` is instantiated, a configuration referenced by the `instant` alias
is retrieved and will override a part of the global settings.

##### Direct Component Configuration

When a component is instantiated programmatically, a partial or full configuration can be
passed to it directly.

*Configuring Component Directly*
```javascript
let simpleDropdownEl = document.createElement('simple-dropdown');
simpleDropdownEl.configs = {triggerImmediately: false};
```

`{triggerImmediately: false}` declaration does not replace all of the global settings.  It
overrides only the previous `triggerImmediately` configuration.

#### Defining Dropdown Items

##### Dropdown Items Data Format

The full specification of an item includes value, label, and options.  Value is a datum
that is associated with a dropdown and is typically included with a form data submission.
Label is what a user sees when selecting a given value.  Options specify if an item is 
`disabled` and/or `selected`.  The value of a `selected`-marked item will be used to
initialize a dropdown.  If multiple items are designated as selected, then the value of
the first of these will be used.  If a dropdown is initialized with the `selected` attribute
or property, then the latter's value will be used regardless if an item definition includes
a `selected` designation.

##### Specifying Dropdown Items

Several simplified item definitions are supported in addition to the full specification.  The
main feature of the simplification is the use of the same datum as both the value and the label.
`defineItems()` is used to register items.  The function takes an items' reference (`itemsref`)
and an array of item definitions.  Note that items must be defined programmatically before
a dropdown is instantiated via markup.

*Full Specification of Items*
```javascript
import {defineItems} from 'simple-dropdown';

defineItems('numbers', [
  ['one', 'One'],
  ['two', 'Two', {selected: true}],
  ['three', 'Three', {disabled: true}],
  ['four', 'Four']
]);
```

*Items Specification Using Only Values*
```javascript
import {defineItems} from 'simple-dropdown';

defineItems('numbers', ['one', 'two', 'three']);
```

*Items Specification Using Values and Options*
```javascript
import {defineItems} from 'simple-dropdown';

defineItems('numbers', [
  'one', 
  ['two', {selected: true, disabled: true}], 
  'three'
]);
```

#### Registering the Component

##### Default Registration

The library provides `registerSimpleDropdown()` function to add the component
constructor to the `customElements` registry.  The function by default adds the
component's styles to the header of the document.

*Registering `simple-dropdown`*
```javascript
import {registerSimpleDropdown} from 'simple-dropdown';

registerSimpleDropdown();
```

##### Custom Component Name Registration

`registerSimpleDropdown()` uses `simple-dropdown` as the component name.  In a
rare case that there is an already registered component under that name, a custom
component name can be specified.  Default component styles are nested within the
`simple-dropdown` tag selector.  Registering the widget under a custom name will
also appropriately adjust the styles' parent namespace.

*Registering a custom `simple-dropdown`*
```javascript
import {registerSimpleDropdown} from 'simple-dropdown';

registerSimpleDropdown('my-simple-dropdown');
```

##### Registration without Styles

The `simple-dropdown` stylesheet is automatically added by the component registrar.  To
prevent styles being added by `registerSimpleDropdown()` pass the `false` indicator to it.

*Preventing Adding of Styles for Default Registration*
```javascript
import {registerSimpleDropdown} from 'simple-dropdown';

registerSimpleDropdown(false);
```

*Preventing Adding of Styles for Custom Registration*
```javascript
import {registerSimpleDropdown} from 'simple-dropdown';

registerSimpleDropdown('my-simple-dropdown', false);
```

#### Including Styles

Styles are automatically added to the header of the document by the registrar function.
There are two ways to add the styles directly.  First, `simple-dropdown.css` is included
within the package and an absolute path to the stylesheet can be specified in an application
such that a build system (e.g., Webpack) can appropriately add it to a software bundle.
Second, `includeStylesheet()` is provided within this package and may be directly called to
include the styles.

*Adding Styles Directly*
```javascript
import {includeStylesheet} from 'simple-dropdown';

includeStylesheet();
```

#### Order of Setup Operations

All of the setup operations should be performed prior to a component instantiation.  If the component
is registered under a custom name and the styles are added manually, then `includeStylesheet()` should
be called after the component registration.

### Instantiating `simple-dropdown`

#### Component Attributes

The following attributes are specific to `simple-dropdown`: `configsref`, `itemsref`, `placeholder`,
`required`, and `selected`. 

`configsref` is an alias of a configuration profile that includes settings that would override their
respective global controls.

`itemsref` is an alias for the items' data that a `simple-dropdown` instance is to render.

`placeholder` is a component message that is displayed when no item/value is selected.  When no
placeholder is provided, the default `Make a selection` is used.

`required` is a flag that designates when a value must be provided.  Inclusion of the attribute
affects a dropdown's and its form's validity statuses.  Absence of the attribute will display a
clearer control (i.e., `x`), clicking of which will replace a selected value with the empty space
(`""`).

`selected` is a value with which a `simple-dropdown` instance must be initialized.  The value
must occur in the items' data.  If `selected` is an unknown value, then a warning will be displayed
and a component's value will be set to the empty space (`""`).

A component's behavior is also affected by the `disabled` and `name` attributes.  The former
disables a component.  The latter is an alias under which a component's value is included
within a form data.

`simple-dropdown`, by default, adds `tabindex` attribute and sets it to `0`.  This operation is
ignored if `tabindex` is already set.

#### Component Properties

All of the above-listed attributes have equivalent getter and setter properties accessible from an
instance of the dropdown.  Additionally, `simple-dropdown` implements `configs`, `items`, and `value`
properties.  These allow direct passing of their namesake data to a component.  These properties also
function as data getters.

All of the attributes and properties are optional.  Naturally, without specification of the items
a component would not be usable.

#### Instantiating via Markup

To activate a dropdown, simply include an appropriate tag name and the necessary attributes inside HTML.

```html
<simple-dropdown itemsref="sources" required name="source"></simple-dropdown>
```

#### Instantiating Programmatically

A dropdown instance can be created programmatically via the `document`'s `createElement()`.

```javascript
let dropdownEl = document.createElement('simple-dropdown');

dropdownEl.name = 'number';
dropdownEl.items = ['one', 'two', 'three', 'four'];
document.body.appendChild(dropdownEl);
```

### Replacing a Component's Items

Once a dropdown is created, its items can be replaced without reinstantiating the component.
An `itemsref` or a set of `items` should be passed directly to a component.  Or, in the case of
`itemsref` attribute, its value could be changed to trigger the inclusion of new items.

If a dropdown already has a selected value and/or one of its values is marked as a potential
selection, then these will be retained if they occur within a set of the newly loaded items.

### Listening for Value Changes

Value changes of a `simple-dropdown` can be listened to via the three typical event handler
assignments via `onchange` attribute within a markup, `onchange` property, or `change` event
registration.

*Adding a Listener within a Markup*
```javascript
function handleChange(event) {
  console.log(event.target.value);
}
```

```html
<simple-dropdown itemsref="numbers" onchange="handleChange(event)"></simple-dropdown>
```

*Adding a Listener via `onchange` Property*
```javascript
let dropdownEl = document.createElement('simple-dropdown');
dropdownEl.itemsref = 'numbers';
dropdownEl.value = 'one';
dropdownEl.onchange = function(event) {
  console.log(event.target.value);
};
```

*Adding a `change` Event Listener*
```javascript
let dropdownEl = document.createElement('simple-dropdown');
dropdownEl.itemsref = 'numbers';
dropdownEl.value = 'one';
dropdownEl.addEventListener('change', (event) => {
  console.log(event.target.value);
});
```

### Including a Dropdown Within a Form

`simple-dropdown` has been designed and tested to integrate with HTML `form`s.  Linking a dropdown's
value to a form requires a dropdown having the `name` attribute.  A component that has the `required` 
attribute set will affect its own and consequently its form's validity even if the component's `name`
attribute is missing.

The component does **not** support `formAssociatedCallback()` and `formStateRestoreCallback()` form
lifecycle hooks.  `simple-dropdown` does implement `formDisabledCallback()` and `formResetCallback()`.
Whenever a fieldset within which a component is situated is disabled, the component gets disabled also.
Note, however, that whenever that fieldset is re-enabled, the component will stay disabled and will
need to be re-enabled directly.  Resetting a form will reinitialize a component with its initial value
or the empty space (`""`).

### Customizing the Default Styles

This widget does not attach a shadow DOM.  All of the default styles can thus be easily overridden
using rule sets with higher specificity selectors.  Before adding modifications, the existing CSS
structure in the [simple-dropdown.css](./src/simple-dropdown/simple-dropdown.css) should be consulted.

`simple-dropdown` uses container units.  Changing the width of the main element and the heights of 
`.simple-dropdown-selector-wrapper` and `.simple-dropdown-selection` is all that is necessary to get
a dropdown to the needed dimensions.  The minimum height of the `.simple-dropdown-selections-wrapper`
may also need to be adjusted to present a subset of items without visual truncation.

*HTML Markup*
```html
<simple-dropdown class="my-dropdown" disabled itemsref="numbers"></simple-dropdown>
```

*Overriding Disabled Appearance*
```css
simple-dropdown.my-dropdown:disabled {
  opacity: 0.4;
}
```

*Overriding Width and Height*
```css
simple-dropdown.my-dropdown {
  width: 200px;

  .simple-dropdown-selector-wrapper {
    height: 24px;
  }

  .simple-dropdown-selection {
    height: 20px;
  }
}
```

## Component Interaction Modes

### Mouse Mode

The component supports full interaction through the use of a mouse.  Clicking a dropdown displays 
its list of items.  Clicking it again hides the list.  Clicking a non-disabled item selects it and
changes a component's value and triggers the `change` event.  All of these are fundamental functionalities.

### Keyboard Mode

Interaction with a `simple-dropdown` can also be accomplished via a keyboard.  When a component
receives focus (by tabbing), hitting the Space key displays the list of selection options.  Pressing the
key again hides the list.  When items are displayed, up and down arrow keys can be used to navigate them.
`simple-dropdown` is different from other implementations in that an up or down arrow key press scrolls the
items list up or down, respectively, by only one item.  Even when there are contiguous disabled items, they
are not skipped.  Hitting the Escape key when the options list is open, will close the list.  Pressing the
Enter key will change a component's value and trigger the `change` event.  Pressing the Space key when the
items list is open will remove the list while preserving its scroll position and any potential item that was
highlighted for selection.  Pressing the Escape key will reset a highlighted item and the scroll position.

### Interaction CSS classes

This implementation borrows from Angular framework's convention of `dirty` and `touched` classes.  When a
freshly loaded `simple-dropdown`'s items are first displayed, the `simple-dropdown-touched` class is added
to the element.  When any of the non-disabled items are hovered over or focused through the use of up and/or
down keys, the `simple-dropdown-dirty` class is attached to the dropdown.  A dropdown with an initial or
selected value gets tagged with the `simple-dropdown-selected` class.  `simple-dropdown-touched` and
`simple-dropdown-dirty` are permanent: once they are added, they will not be removed.  The
`simple-dropdown-selected` is removed when a component is cleared or reset.

## Development

### Development Prerequisites

The testing setup uses webdriver.io to communicate with Chrome browser.  The latter must be installed locally
and be of a version supported by webdriver configuration.

### Development Setup

Perform the following steps to setup the repository locally.

```
git clone https://github.com/aptivator/simple-dropdown.git
cd simple-dropdown
npm install
```

To start the development mode run `npm run dev` or `npm run dev:coverage`.

To start the visual development mode, run the following commands from within the
`simple-dropdown` directory.

```
cd demo
npm install
npm run dev
```

And then go to an appropriate address (e.g., http://localhost:5173/) using a browser.

### Contributing Changes

The general recommendations for contributions are to use the latest JavaScript features,
have tests with complete code coverage, and include documentation.  The latter may be
necessary only if a new feature is added or an existing documented feature is modified.

## Caveats

This component is written for a modern browser.  A build with `simple-dropdown` that targets
older platforms should be assembled with all of the prerequisite transpilations.

As mentioned in the integration with forms section, `formAssociated()` and `formStateReset()`
form lifecycle hooks are not implemented.  `adoptedCallback()` web component lifecycle hook
is also not supported.

`simple-dropdown` was tested and will work with mobile browsers.  However, its appearance and
visual functioning will be the same as in the desktop browsers.

## Future Features

Future versions of `simple-dropdown` may be expanded to include multi-value selection and
autocomplete.  [form-html-element.js](./src/form-html-element/form-html-element.js) interface
may be moved into its own repository as a dependency for implementing form-integratable web
components.

## Integration with Frameworks

`simple-dropdown` is essentially an HTML component and should work within any framework be it
React, Angular, Vue, etc.  The component was tested within React and worked without any issues.
The only caveat that should be mentioned is assignment of value change event handlers.  When
adding an event handler within a markup, the `onchange` rather than `onChange` (capital `C`)
declaration should be used.

## Demo

Deployed component with several configuration toggles can be seen
[here](https://aptivator.github.io/simple-dropdown/).
