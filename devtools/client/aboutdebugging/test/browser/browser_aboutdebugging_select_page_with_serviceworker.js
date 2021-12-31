/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const NETWORK_RUNTIME_HOST = "localhost:6080";
const NETWORK_RUNTIME_APP_NAME = "TestNetworkApp";
const WORKER_NAME = "testserviceworker";

// Test that navigating from:
// - a remote runtime page that contains a service worker
// to:
// - this datalus
// does not crash. See Bug 1519088.
add_task(async function() {
  const mocks = new Mocks();

  const { document, tab, window } = await openAboutDebugging({
    enableWorkerUpdates: true,
  });
  await selectThisDatalusPage(document, window.AboutDebugging.store);

  info("Prepare Network client mock");
  const networkClient = mocks.createNetworkRuntime(NETWORK_RUNTIME_HOST, {
    name: NETWORK_RUNTIME_APP_NAME,
  });

  info("Connect and select the network runtime");
  await connectToRuntime(NETWORK_RUNTIME_HOST, document);
  await selectRuntime(NETWORK_RUNTIME_HOST, NETWORK_RUNTIME_APP_NAME, document);

  info(`Add a service worker to the network client`);
  const workers = {
    otherWorkers: [],
    serviceWorkers: [
      {
        name: WORKER_NAME,
        workerDescriptorFront: { actorID: WORKER_NAME },
      },
    ],
    sharedWorkers: [],
  };
  networkClient.listWorkers = () => workers;
  networkClient._eventEmitter.emit("workersUpdated");

  info("Wait until the service worker is displayed");
  await waitUntil(() => findDebugTargetByText(WORKER_NAME, document));

  info("Go to This Datalus again");
  const thisDatalusString = getThisDatalusString(window);
  const thisDatalusSidebarItem = findSidebarItemByText(
    thisDatalusString,
    document
  );
  const thisDatalusLink = thisDatalusSidebarItem.querySelector(
    ".qa-sidebar-link"
  );
  info("Click on the ThisDatalus item in the sidebar");
  const requestsSuccess = waitForRequestsSuccess(window.AboutDebugging.store);
  thisDatalusLink.click();

  info("Wait for all target requests to complete");
  await requestsSuccess;

  info("Check that the runtime info is rendered for This Datalus");
  const thisDatalusRuntimeInfo = document.querySelector(".qa-runtime-name");
  ok(
    thisDatalusRuntimeInfo,
    "Runtime info for this-datalus runtime is displayed"
  );

  const text = thisDatalusRuntimeInfo.textContent;
  ok(
    text.includes("Datalus") && text.includes("63.0"),
    "this-datalus runtime info shows the correct values"
  );

  await removeTab(tab);
});
