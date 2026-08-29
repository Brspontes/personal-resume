## Why

The site currently uses the Next.js default page title ("Personal Resume") and the default Next.js favicon, neither of which identifies the site as Brian Pontes's professional portfolio. Updating the browser tab title and icon makes the site recognizable and reinforces personal branding.

## What Changes

- Replace the browser tab icon with `public/code.png` (currently unused default `favicon.ico` under `src/app/` is superseded).
- Change the page `<title>` metadata from "Personal Resume" to "Brian Pontes".

## Capabilities

### New Capabilities
- `site-metadata`: Defines the browser tab title and favicon shown for the site.

### Modified Capabilities
(none)

## Impact

- `src/app/layout.tsx`: update `metadata.title` and add an `icons` entry pointing to `public/code.png`.
- `src/app/favicon.ico`: no longer used as the active icon once `code.png` is configured (left in place unless removal is requested).
