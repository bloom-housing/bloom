# enableHomePageSearchHero

## Name

`enableHomePageSearchHero`

## Description

When true, the home page hero has a search form

## Additional Information

The view of the form change depending on additional configuration:

- "County" filter only appears if the `enableFilterByCounty` feature flag is enabled
- Adding the "welcome.searchSubNote" translation string adds a subnote below the search form
- Adding an image titled `hero-image.jpg` to the `sites/public/public/images` directory displays an image to the side of the form in desktop mode and above in mobile (no image in tablet view). If an image is added make sure to update the "welcome.heroAltText" translation string so the image is accessible.

## Images

### Default view

![image.png](./images/image%2082.png)

### With image and subnote

![image.png](./images/image%2083.png)

### With `enableFilterByCounty` not turned on

![image.png](./images/image%2084.png)
