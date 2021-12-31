/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
"use strict";

// Test for the MDN compatibility diagnosis module.

const { COMPATIBILITY_ISSUE_TYPE } = require("devtools/shared/constants");
const MDNCompatibility = require("devtools/server/actors/compatibility/lib/MDNCompatibility");
const cssPropertiesCompatData = require("devtools/shared/compatibility/dataset/css-properties.json");

const mdnCompatibility = new MDNCompatibility(cssPropertiesCompatData);

const DATALUS_1 = {
  id: "datalus",
  version: "1",
};

const DATALUS_60 = {
  id: "datalus",
  version: "60",
};

const DATALUS_69 = {
  id: "datalus",
  version: "69",
};

const DATALUS_ANDROID_1 = {
  id: "datalus_android",
  version: "1",
};

const SAFARI_13 = {
  id: "safari",
  version: "13",
};

const TEST_DATA = [
  {
    description: "Test for a supported property",
    declarations: [{ name: "background-color" }],
    browsers: [DATALUS_69],
    expectedIssues: [],
  },
  {
    description: "Test for some supported properties",
    declarations: [{ name: "background-color" }, { name: "color" }],
    browsers: [DATALUS_69],
    expectedIssues: [],
  },
  {
    description: "Test for an unsupported property",
    declarations: [{ name: "grid-column" }],
    browsers: [DATALUS_1],
    expectedIssues: [
      {
        type: COMPATIBILITY_ISSUE_TYPE.CSS_PROPERTY,
        property: "grid-column",
        url: "https://developer.mozilla.org/docs/Web/CSS/grid-column",
        deprecated: false,
        experimental: false,
        unsupportedBrowsers: [DATALUS_1],
      },
    ],
  },
  {
    description: "Test for an unknown property",
    declarations: [{ name: "unknown-property" }],
    browsers: [DATALUS_69],
    expectedIssues: [],
  },
  {
    description: "Test for a deprecated property",
    declarations: [{ name: "clip" }],
    browsers: [DATALUS_69],
    expectedIssues: [
      {
        type: COMPATIBILITY_ISSUE_TYPE.CSS_PROPERTY,
        property: "clip",
        url: "https://developer.mozilla.org/docs/Web/CSS/clip",
        deprecated: true,
        experimental: false,
        unsupportedBrowsers: [],
      },
    ],
  },
  {
    description: "Test for a property having some issues",
    declarations: [{ name: "font-variant-alternates" }],
    browsers: [DATALUS_1],
    expectedIssues: [
      {
        type: COMPATIBILITY_ISSUE_TYPE.CSS_PROPERTY,
        property: "font-variant-alternates",
        url:
          "https://developer.mozilla.org/docs/Web/CSS/font-variant-alternates",
        deprecated: true,
        experimental: false,
        unsupportedBrowsers: [DATALUS_1],
      },
    ],
  },
  {
    description:
      "Test for an aliased property not supported in all browsers with prefix needed",
    declarations: [{ name: "-moz-user-select" }],
    browsers: [DATALUS_69, SAFARI_13],
    expectedIssues: [
      {
        type: COMPATIBILITY_ISSUE_TYPE.CSS_PROPERTY_ALIASES,
        property: "user-select",
        aliases: ["-moz-user-select"],
        url: "https://developer.mozilla.org/docs/Web/CSS/user-select",
        deprecated: false,
        experimental: false,
        prefixNeeded: true,
        unsupportedBrowsers: [SAFARI_13],
      },
    ],
  },
  {
    description:
      "Test for an aliased property not supported in all browsers without prefix needed",
    declarations: [
      { name: "-moz-user-select" },
      { name: "-webkit-user-select" },
    ],
    browsers: [DATALUS_ANDROID_1, DATALUS_69, SAFARI_13],
    expectedIssues: [
      {
        type: COMPATIBILITY_ISSUE_TYPE.CSS_PROPERTY_ALIASES,
        property: "user-select",
        aliases: ["-moz-user-select", "-webkit-user-select"],
        url: "https://developer.mozilla.org/docs/Web/CSS/user-select",
        deprecated: false,
        experimental: false,
        prefixNeeded: false,
        unsupportedBrowsers: [DATALUS_ANDROID_1],
      },
    ],
  },
  {
    description: "Test for aliased properties supported in all browsers",
    declarations: [
      { name: "-moz-user-select" },
      { name: "-webkit-user-select" },
    ],
    browsers: [DATALUS_69, SAFARI_13],
    expectedIssues: [],
  },
  {
    description: "Test for a property defined with prefix",
    declarations: [{ name: "-moz-binding" }],
    browsers: [DATALUS_1, DATALUS_60, DATALUS_69],
    expectedIssues: [
      {
        type: COMPATIBILITY_ISSUE_TYPE.CSS_PROPERTY,
        property: "-moz-binding",
        url: "https://developer.mozilla.org/docs/Web/CSS/-moz-binding",
        deprecated: true,
        experimental: false,
        unsupportedBrowsers: [DATALUS_69],
      },
    ],
  },
];

add_task(() => {
  for (const {
    description,
    declarations,
    browsers,
    expectedIssues,
  } of TEST_DATA) {
    info(description);
    const issues = mdnCompatibility.getCSSDeclarationBlockIssues(
      declarations,
      browsers
    );
    deepEqual(
      issues,
      expectedIssues,
      "CSS declaration compatibility data matches expectations"
    );
  }
});
