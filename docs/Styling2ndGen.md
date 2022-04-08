# Styling 2nd Generation Components

This covers preliminary documentation for the "2nd generation" UI components in the Bloom design system. (General styling information can be found in the README for ui-components.)

First, we'll go over the what & why of the new component architecture, then we'll explain the process for converting a "1st gen" component to 2nd gen.

## What are Bloom Design Tokens?

In this updated system, the Bloom design tokens are defined as [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) (aka CSS Variables). They're values you can insert into (almost) every place you would put an actual property value in CSS.

Bloom design tokens include colors, typography settings, sizes, borders, and so forth. They're located in the `ui-components/global/tokens` folder.

For example, some colors in `tokens/colors.scss`:

```css
--bloom-color-green-800: #216e1f;
--bloom-color-green-700: #2e8540;
--bloom-color-green-300: #b4e5be;
```

and some font sizes in `tokens/fonts.scss`:

```css
--bloom-font-size-lg: 1.25rem;
--bloom-font-size-xl: 1.375rem;
--bloom-font-size-2xl: 1.5rem;
```

Unlike Sass variables, Tailwind theme configs, or other methods of defining design tokens, CSS variables are resolved _at runtime_. In other words, they are evaluated and applied to the styling of the webpage by the browser itself. To use a CSS variable, use the `var` function within a property value:

```css
.my-selector {
  color: var(--bloom-color-green-300);
  font-size: var(--bloom-font-size-xl);
}
```

You can even use `var` within the `style` attribute of an HTML tag as a sort of analog to utility classes (but proceed with caution!).

Like many standard CSS properties, CSS Variables "cascade" through the tree where they're defined, so if you redefine a variable for one element, it will affect that element and its children…but not any siblings.

### What is a 2nd-gen Component?

In a 2nd-gen UI component, previous usage of Tailwind tokens/utility classes via the `@apply` directive is replaced by CSS variables—and in cases where tokens aren't required, "vanilla" CSS properties. We'll cover this process in the next section.

Many of Tailwind's own utility classes now use these same design tokens as well. For example, in your CSS you could use:

```css
.my-selector {
  margin-top: var(--bloom-s3);
}
```

Or in HTML, you could write:

```html
<div class="mt-3">…</div>
```

which would also utilize that same `--bloom-s3` design token (`0.75rem`).

Like in many cases already through the UI component library, defining class names within the component's (S)CSS file is usually preferred over using numerous utility classes within the component's HTML/JSX.

A 2nd-gen component will typically define component-specific CSS variables which are "exported" if you will for easy customizabilty via a site-specific stylesheet. For example, the `PageHeader` component utilizes several component tokens like `--background-color` and `--title-font-size`. Customizing the component via these tokens is as simple as creating a new site-specific stylesheet:

```css
.page-header {
  --title-font-size: 3rem;
}
```

This means the downstream developer doesn't need to know which child element within `PageHeader` actually utilizes this token. Simply defining the token on the containing class of the component HTML structure is enough to allow the CSS variable to "cascade" down to the element which needs it.

These component-specific tokens are documented in new Markdown documentation files within Storybook. The 2nd-gen `Button` component has a corresponding `Button.docs.mdx` file, and `PageHeader` has `PageHeader.docs.mdx`. We can use these docs to explain how to customize components officially (and also how props will affect styling).

By taking the time to analyze which global design tokens a component should employ, which component-specific tokens should be exported, and then documenting the styling API for each component, the ease of altering components or even the global design itself in a site-specific stylesheet is much cleaner and simpler.

## Converting 1st-gen Components to 2nd-gen

Let's compare the `PageHeader` stylesheet before/after:

### 1st-gen:

```scss
.page-header {
  @apply py-8;
  @apply border-t;
  @apply border-gray-450;

  @screen md {
    @apply py-10;
  }

  &.bg-primary-dark {
    @apply text-white;
    @apply border-primary;
  }
}

.page-header__group {
  @apply px-5;
  @apply m-auto;
  @apply max-w-5xl;
}

.page-header__title {
  @apply text-center;

  @screen md {
    @apply text-5xl;
    @apply text-left;
  }
}

.page-header__lead {
  @apply m-auto;
  @apply max-w-5xl;
}
```

### 2nd-gen:

```scss
.page-header {
  /* Component Variables */
  --background-color: var(--bloom-color-primary-lighter);
  --border-color: var(--bloom-color-gray-450);
  --text-color: inherit;
  --inverse-background-color: var(--bloom-color-primary-dark);
  --inverse-border-color: var(--bloom-color-primary);
  --inverse-text-color: var(--bloom-color-white);
  --title-font-size: var(--bloom-font-size-5xl);

  /* Base Styles */
  padding: var(--bloom-s8) 0;
  background-color: var(--background-color);
  border-top: var(--bloom-border-1) solid var(--border-color);
  color: var(--text-color);

  @media (min-width: $screen-sm) {
    padding: var(--bloom-s10) 0;
  }

  /* Variants */
  &.is-inverse {
    --background-color: var(--inverse-background-color);
    --border-color: var(--inverse-border-color);
    --text-color: var(--inverse-text-color);
  }
}

.page-header__group {
  padding: 0 var(--bloom-s5);
  margin: auto;
  max-width: var(--bloom-width-5xl);
}

.page-header__title {
  text-align: center;

  @media (min-width: $screen-md) {
    font-size: var(--title-font-size);
    text-align: left;
  }
}

.page-header__lead {
  margin: auto;
  max-width: var(--bloom-width-5xl);
}
```

Other than the use of the Sass variable `$screen-sm` in a media query (unfortunately CSS custom properties cannot be used within media queries), all of the properties have been converted to "vanilla" CSS and in most cases uss the CSS variables from the design system.

`@apply max-w-5xl` becomes `max-width: var(--bloom-width-5xl)`  
`@apply border-t; @apply border-gray-450` becomes `border-top: var(--bloom-border-1) solid var(--border-color)`  
and so on.

You'll notice `--border-color` is one of the new component-specific design tokens for `PageHeader` (which defaults to `--bloom-color-gray-450`).

This conversion was also an opportunity to define a proper "inverse" variant style, which is triggered via a component prop, and inverse-specific design tokens are also used and can be redefined.

### Updating Component Stories

Take a look at `PageHeader.stories.tsx`, you'll see there's a few updates to the default export to reference the corresponding documentation MDX file, as well the badge to indicate it's a 2nd-gen component. We also add a little flag emoji to show up in the Storybook sidebar (while keeping the correct id):

```js
import { BADGES } from "../../.storybook/constants"
import PageHeaderDocumentation from "./PageHeader.docs.mdx"

export default {
  title: "Headers/Page Header 🚩",
  id: "headers/page-header",
  parameters: {
    docs: {
      page: PageHeaderDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}
```

Corresponding `.docs.mdx` files can be added for components to explain component variants and the 2nd-gen styling API. We also have the ability to show React prop documentation through JSDoc comments on the TypeScript prop interfaces (not part of the 2nd-gen conversion process strictly speaking, but helpful nonetheless).

## The Future: a Possible Path to 3rd-gen?

It's worth noting what we _didn't_ consider for this upgrade effort.

As the [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) spec has matured and solidified in all evergreen browsers, many design systems are starting to migrate to using web component technology as the substrate, with "wrappers" generated for specific JS frameworks like React, Vue, Angular, etc. (plus they're completely usable directly within "vanilla" HTML). While web components can be authored completely vanilla without any framework or build process, lightweight libraries such as [Lit](https://lit.dev) have made web components DX rival "legacy" frameworks such as React. Component systems ranging from the open source [Shoelace](https://shoelace.style) to closed source [Nord Health](https://nordhealth.design/components/) show us the breadth of what's possible with this approach.

However, porting Bloom components over to a pure web components toolchain (possibly using Lit) and then exporting React wrappers for use elsewhere seems like a bridge too far at this juncture, particularly since all `ui-components` consumers at present are only using React. The good news is: by migrating to our 2nd-gen styling API based on vanilla CSS techniques, it positions us to consider a web components-based solution farther down the road. While we don't have the ability to use [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), [shadow parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part), and [slots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots#adding_flexibility_with_slots) to aid in our component architecture, we are able to get pretty far simply by utilizing CSS variables and a close 1:1 convention between React props and CSS class-based variants.
