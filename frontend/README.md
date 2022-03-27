# Qualified Tutors Single Page Application

The web application users pull up in their browser.

## Running it
- Have NodeJS installed
- `cp .env.dev .env`
- `vim .env` and edit to fit your local dev env
- `npm install`
- `npm run start`

## Building it
- `npm run build`
    - Produces a build in build/ 
    - Crawls links and pre-renders pages under build/
- `npm run build-nosnap`
    - Same as above, expect it doesn't prerender pages
- For building/deploying to staging/production use the Github actions

## Structure
- src/
    - Components/
        - Reusable components used throughout the application
    - Config/
    - Hooks/
        - Custom React hooks
        - @see https://reactjs.org/docs/hooks-intro.html
    - Pages/
        - Components that represent a page within the application.
    - App.js
        - Main entry point, layout and routing
    - index.js
        - Bootstraps react & handles passing data to Google analytics
    - SubjectContext.js, UnreadMessageCountContext.js & UserContext.js
        - Context objects for data shared across the component tree
        - @see https://reactjs.org/docs/context.html
- build/
    Holds build artifacts meant for deployment
- public/
    Houses the publically accessible content including the index.html, robots.txt & img/ subdir

## Stack
- The application is built primarily on React, React-Router and Styled Components
    - @see https://reactjs.org/docs/getting-started.html
    - @see https://v5.reactrouter.com/web/guides/quick-start
    - @see https://styled-components.com/docs
- Axios is used for communication with the backend REST API
    - @see https://axios-http.com/docs/intro
    - @see src/Components/API/index.js

## SEO
- public/index.html has the default meta info for the site. The description and twitter/og tags should be updated.
- Individual pages/components can include a <Helmet> element which will override values in the document head for that specific page. This can be used to provide specific page info to improve SEO. 
    - The most notable example of this is in the tutor profile (src/User/Profile/Tutor/index.js)
- The build process pre-renders all the pages crawable from the index and outputs them in the build folder. Search engines will pick up on these pages, so make sure they're being updated when deploying the site.
- The robots.txt in public/ currently dissallows all indexing. Once the site is ready for public consumption this needs to be updated.