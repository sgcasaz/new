import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,

      contentDirs: ["content"],

      models: [
        {
          name: "TimelinePage",
          type: "page",
          label: "Timeline Page",

          // The generated HTML page will be /timeline/{slug}.html
          urlPath: "/timeline/{slug}.html",
          filePath: "content/timeline/{slug}.json",

          fields: [
            {
              name: "title",
              label: "Page Heading",
              type: "string",
              required: true
            },
            {
              name: "date",
              label: "Date / Subheading",
              type: "string"
            },
            {
              name: "intro",
              label: "Introduction",
              type: "markdown"
            },
            {
              name: "sections",
              label: "Photo Sections",
              type: "list",
              items: {
                type: "object",
                fields: [
                  {
                    name: "leftImage",
                    label: "Left Photo",
                    type: "image"
                  },
                  {
                    name: "leftCaption",
                    label: "Left Caption",
                    type: "markdown"
                  },
                  {
                    name: "rightImage",
                    label: "Right Photo",
                    type: "image"
                  },
                  {
                    name: "rightCaption",
                    label: "Right Caption",
                    type: "markdown"
                  }
                ]
              }
            }
          ]
        }
      ],

      // Existing site uses a root-level "image" folder.
      // New Visual Editor uploads will go under image/timeline/.
      assetsConfig: {
        referenceType: "static",
        staticDir: ".",
        uploadDir: "image/timeline",
        publicPath: "/"
      }
    })
  ]
});
