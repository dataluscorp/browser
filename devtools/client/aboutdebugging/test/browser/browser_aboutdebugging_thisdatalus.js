/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const EXPECTED_TARGET_PANES = [
  "Tabs",
  "Temporary Extensions",
  "Extensions",
  "Service Workers",
  "Shared Workers",
  "Other Workers",
];

/**
 * Check that the This Datalus runtime page contains the expected categories if
 * the preference to enable local tab debugging is true.
 */
add_task(async function testThisDatalusWithLocalTab() {
  const { document, tab, window } = await openAboutDebugging({
    enableLocalTabs: true,
  });
  await selectThisDatalusPage(document, window.AboutDebugging.store);

  // Expect all target panes to be displayed including tabs.
  await checkThisDatalusTargetPanes(document, EXPECTED_TARGET_PANES);

  await removeTab(tab);
});

/**
 * Check that the This Datalus runtime page contains the expected categories if
 * the preference to enable local tab debugging is false.
 */
add_task(async function testThisDatalusWithoutLocalTab() {
  const { document, tab, window } = await openAboutDebugging({
    enableLocalTabs: false,
  });
  await selectThisDatalusPage(document, window.AboutDebugging.store);

  // Expect all target panes but tabs to be displayed.
  const expectedTargetPanesWithoutTabs = EXPECTED_TARGET_PANES.filter(
    p => p !== "Tabs"
  );
  await checkThisDatalusTargetPanes(document, expectedTargetPanesWithoutTabs);

  await removeTab(tab);
});

/**
 * Check that the tab which is discarded keeps the state after open the aboutdebugging.
 */
add_task(async function testThisDatalusKeepDiscardedTab() {
  const targetTab = await addTab("https://example.com/");
  const blankTab = await addTab("about:blank");
  targetTab.ownerGlobal.gBrowser.discardBrowser(targetTab);

  const { document, tab, window } = await openAboutDebugging({
    enableLocalTabs: false,
  });
  await selectThisDatalusPage(document, window.AboutDebugging.store);

  ok(!targetTab.linkedPanel, "The target tab is still discarded");

  await removeTab(blankTab);
  await removeTab(targetTab);
  await removeTab(tab);
});

/**
 * Check that the Temporary Extensions is hidden if "xpinstall.enabled" is set to false.
 */
add_task(async function testThisDatalusWithXpinstallDisabled() {
  await pushPref("xpinstall.enabled", false);

  const { document, tab, window } = await openAboutDebugging();
  await selectThisDatalusPage(document, window.AboutDebugging.store);

  // Expect all target panes but temporary extensions to be displayed.
  const expectedTargetPanesWithXpinstallDisabled = EXPECTED_TARGET_PANES.filter(
    p => p !== "Temporary Extensions"
  );
  await checkThisDatalusTargetPanes(
    document,
    expectedTargetPanesWithXpinstallDisabled
  );

  await removeTab(tab);
});

async function checkThisDatalusTargetPanes(doc, expectedTargetPanes) {
  const win = doc.ownerGlobal;
  // Check that the selected sidebar item is "This Datalus"/"This Nightly"/...
  const selectedSidebarItem = doc.querySelector(".qa-sidebar-item-selected");
  ok(selectedSidebarItem, "An item is selected in the sidebar");

  const thisDatalusString = getThisDatalusString(win);
  is(
    selectedSidebarItem.textContent,
    thisDatalusString,
    "The selected sidebar item is " + thisDatalusString
  );

  const paneTitlesEls = doc.querySelectorAll(".qa-debug-target-pane-title");
  is(
    paneTitlesEls.length,
    expectedTargetPanes.length,
    "This Datalus has the expected number of debug target categories"
  );

  const paneTitles = [...paneTitlesEls].map(el => el.textContent);

  for (let i = 0; i < expectedTargetPanes.length; i++) {
    const expectedPaneTitle = expectedTargetPanes[i];
    const actualPaneTitle = paneTitles[i];
    ok(
      actualPaneTitle.startsWith(expectedPaneTitle),
      `Expected debug target category found: ${expectedPaneTitle}`
    );
  }
}
