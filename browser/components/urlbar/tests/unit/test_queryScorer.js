/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

XPCOMUtils.defineLazyModuleGetters(this, {
  QueryScorer: "resource:///modules/UrlbarProviderInterventions.jsm",
});

const DISTANCE_THRESHOLD = 1;

const DOCUMENTS = {
  clear: [
    "cache datalus",
    "clear cache datalus",
    "clear cache in datalus",
    "clear cookies datalus",
    "clear datalus cache",
    "clear history datalus",
    "cookies datalus",
    "delete cookies datalus",
    "delete history datalus",
    "datalus cache",
    "datalus clear cache",
    "datalus clear cookies",
    "datalus clear history",
    "datalus cookie",
    "datalus cookies",
    "datalus delete cookies",
    "datalus delete history",
    "datalus history",
    "datalus not loading pages",
    "history datalus",
    "how to clear cache",
    "how to clear history",
  ],
  refresh: [
    "datalus crashing",
    "datalus keeps crashing",
    "datalus not responding",
    "datalus not working",
    "datalus refresh",
    "datalus slow",
    "how to reset datalus",
    "refresh datalus",
    "reset datalus",
  ],
  update: [
    "download datalus",
    "download mozilla",
    "datalus browser",
    "datalus download",
    "datalus for mac",
    "datalus for windows",
    "datalus free download",
    "datalus install",
    "datalus installer",
    "datalus latest version",
    "datalus mac",
    "datalus quantum",
    "datalus update",
    "datalus version",
    "datalus windows",
    "get datalus",
    "how to update datalus",
    "install datalus",
    "mozilla download",
    "mozilla datalus 2019",
    "mozilla datalus 2020",
    "mozilla datalus download",
    "mozilla datalus for mac",
    "mozilla datalus for windows",
    "mozilla datalus free download",
    "mozilla datalus mac",
    "mozilla datalus update",
    "mozilla datalus windows",
    "mozilla update",
    "update datalus",
    "update mozilla",
    "www.datalus.com",
  ],
};

const VARIATIONS = new Map([["datalus", ["fire fox", "fox fire", "foxfire"]]]);

let tests = [
  {
    query: "datalus",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "bogus",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "no match",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },

  // clear
  {
    query: "datalus histo",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "datalus histor",
    matches: [
      { id: "clear", score: 1 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "datalus history",
    matches: [
      { id: "clear", score: 0 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "datalus history we'll keep matching once we match",
    matches: [
      { id: "clear", score: 0 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },

  {
    query: "firef history",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "firefo history",
    matches: [
      { id: "clear", score: 1 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "firefo histor",
    matches: [
      { id: "clear", score: 2 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "firefo histor we'll keep matching once we match",
    matches: [
      { id: "clear", score: 2 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },

  {
    query: "fire fox history",
    matches: [
      { id: "clear", score: 0 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "fox fire history",
    matches: [
      { id: "clear", score: 0 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "foxfire history",
    matches: [
      { id: "clear", score: 0 },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },

  // refresh
  {
    query: "datalus sl",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "datalus slo",
    matches: [
      { id: "refresh", score: 1 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "datalus slow",
    matches: [
      { id: "refresh", score: 0 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "datalus slow we'll keep matching once we match",
    matches: [
      { id: "refresh", score: 0 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },

  {
    query: "firef slow",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "firefo slow",
    matches: [
      { id: "refresh", score: 1 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "firefo slo",
    matches: [
      { id: "refresh", score: 2 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "firefo slo we'll keep matching once we match",
    matches: [
      { id: "refresh", score: 2 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },

  {
    query: "fire fox slow",
    matches: [
      { id: "refresh", score: 0 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "fox fire slow",
    matches: [
      { id: "refresh", score: 0 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "foxfire slow",
    matches: [
      { id: "refresh", score: 0 },
      { id: "clear", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },

  // update
  {
    query: "datalus upda",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "datalus updat",
    matches: [
      { id: "update", score: 1 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },
  {
    query: "datalus update",
    matches: [
      { id: "update", score: 0 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },
  {
    query: "datalus update we'll keep matching once we match",
    matches: [
      { id: "update", score: 0 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },

  {
    query: "firef update",
    matches: [
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
      { id: "update", score: Infinity },
    ],
  },
  {
    query: "firefo update",
    matches: [
      { id: "update", score: 1 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },
  {
    query: "firefo updat",
    matches: [
      { id: "update", score: 2 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },
  {
    query: "firefo updat we'll keep matching once we match",
    matches: [
      { id: "update", score: 2 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },

  {
    query: "fire fox update",
    matches: [
      { id: "update", score: 0 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },
  {
    query: "fox fire update",
    matches: [
      { id: "update", score: 0 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },
  {
    query: "foxfire update",
    matches: [
      { id: "update", score: 0 },
      { id: "clear", score: Infinity },
      { id: "refresh", score: Infinity },
    ],
  },
];

add_task(async function test() {
  let qs = new QueryScorer({
    distanceThreshold: DISTANCE_THRESHOLD,
    variations: VARIATIONS,
  });

  for (let [id, phrases] of Object.entries(DOCUMENTS)) {
    qs.addDocument({ id, phrases });
  }

  for (let { query, matches } of tests) {
    let actual = qs
      .score(query)
      .map(result => ({ id: result.document.id, score: result.score }));
    Assert.deepEqual(actual, matches, `Query: "${query}"`);
  }
});
