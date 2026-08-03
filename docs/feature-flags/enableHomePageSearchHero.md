# enableHomePageSearchHero

## Name

`enableHomePageSearchHero`

## Description

When true, the home page hero has a search form

## Additional Information

The view of the form change depending on additional configuration:

- "County" filter only appears if the `enableFilterByCounty` feature flag is enabled
- Adding the "welcome.searchSubNote" translation string adds a subnote below the search form
- Adding an image titled `hero-image.png` to `the sites/public/public/images` directory displays an image to the side of the form in desktop mode

## Images

### Default view

![image.png](./images/image%2077.png)

### With image and subnote

![image.png](./images/image%2078.png)

### With `enableFilterByCounty` not turned on

![image.png](./images/image%2079.png)
