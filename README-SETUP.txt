NETLIFY VISUAL EDITOR - TIMELINE PAGE STARTER
==============================================

This starter is designed for the existing legacy Casazza HTML site.

IMPORTANT:
- Existing HTML pages are not converted or rewritten.
- New Visual Editor pages are stored as JSON in content/timeline/.
- The build script turns those JSON files into normal HTML pages in timeline/.
- New images uploaded by Visual Editor are intended to go into image/timeline/.
- The example content file uses the real Hootiefest image paths from the supplied page.

FILES:
1. stackbit.config.ts
   Netlify Visual Editor configuration.

2. content/timeline/hootiefest-example.json
   Example of the content structure.

3. scripts/build-timeline.js
   Converts each JSON timeline page into HTML.

4. package.json
   Provides the build command.

NEXT STEPS:
1. Copy these files into the root of the website repository.
2. Do NOT delete or replace existing website files.
3. Install the Visual Editor development packages:
   npm install
4. Test the page generator:
   npm run build
5. It should create:
   timeline/hootiefest-example.html
6. Open that generated HTML through the site and confirm the layout.
7. Then configure Netlify Visual Editor for this repository and use the
   TimelinePage model.

NOTE:
The exact Netlify Visual Editor cloud setup can depend on the current
Netlify project settings and repository branch. Do that after the local
files are in place and the generated page works.

The existing site's header/footer are loaded through the same:
- /script.js
- /include.js

The generated page uses /style.css.

If the existing site uses a different root path or Netlify publish
directory, adjust those paths before deploying.
