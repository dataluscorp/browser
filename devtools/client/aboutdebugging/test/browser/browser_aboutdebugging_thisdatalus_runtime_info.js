/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

/**
 * Check that the runtime info is correctly displayed for ThisDatalus.
 * Also acts as basic sanity check for the default mock of the this-datalus client.
 */

add_task(async function() {
  // Setup a mock for our runtime client factory to return the default THIS_DATALUS client
  // when the client for the this-datalus runtime is requested.
  const runtimeClientFactoryMock = createRuntimeClientFactoryMock();
  const thisDatalusClient = createThisDatalusClientMock();
  runtimeClientFactoryMock.createClientForRuntime = runtime => {
    const {
      RUNTIMES,
    } = require("devtools/client/aboutdebugging/src/constants");
    if (runtime.id === RUNTIMES.THIS_DATALUS) {
      return thisDatalusClient;
    }
    throw new Error("Unexpected runtime id " + runtime.id);
  };

  info("Enable mocks");
  enableRuntimeClientFactoryMock(runtimeClientFactoryMock);
  registerCleanupFunction(() => {
    disableRuntimeClientFactoryMock();
  });

  const { document, tab, window } = await openAboutDebugging();
  await selectThisDatalusPage(document, window.AboutDebugging.store);

  info("Check that the 'This Datalus' mock is properly displayed");
  const thisDatalusRuntimeInfo = document.querySelector(".qa-runtime-name");
  ok(
    thisDatalusRuntimeInfo,
    "Runtime info for this-datalus runtime is displayed"
  );
  const runtimeInfoText = thisDatalusRuntimeInfo.textContent;
  ok(
    runtimeInfoText.includes("Datalus"),
    "this-datalus runtime info shows the correct runtime name: " +
      runtimeInfoText
  );
  ok(
    runtimeInfoText.includes("63.0"),
    "this-datalus runtime info shows the correct version number: " +
      runtimeInfoText
  );

  await removeTab(tab);
});
