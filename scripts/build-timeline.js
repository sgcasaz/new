
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
          label: "Monthly Timeline Page",

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
              name: "slug",
              label: "Page URL Name",
              type: "string",
              required: true
            },
            {
              name: "date",
              label: "Month and Year",
              type: "string"
            },
            {
              name: "intro",
              label: "Introduction",
              type: "markdown"
            },
            {
              name: "sections",
              label: "Timeline Sections",
              type: "list",
              items: {
                type: "object",
                fields: [
                  {
                    name: "heading",
                    label: "Section Heading (Optional)",
                    type: "string"
                  },
                  {
                    name: "layout",
                    label: "Photo Layout",
                    type: "enum",
                    options: [
                      { label: "Two Columns", value: "two" },
                      { label: "Single Column", value: "single" }
                    ]
                  },
                  {
                    name: "items",
                    label: "Photos",
                    type: "list",
                    items: {
                      type: "object",
                      fields: [
                        {
                          name: "image",
                          label: "Photo",
                          type: "image",
                          required: true
                        },
                        {
                          name: "alt",
                          label: "Image Description",
                          type: "string"
                        },
                        {
                          name: "description",
                          label: "Photo Caption (Optional)",
                          type: "markdown"
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      ],

      assetsConfig: {
        referenceType: "static",
        staticDir: ".",
        uploadDir: "image/timeline",
        publicPath: "/"
      }
    })
  ]
});

