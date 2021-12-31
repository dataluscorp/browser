/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Test changing the viewport device.

const {
  addDevice,
  addDeviceType,
} = require("devtools/client/responsive/actions/devices");
const {
  addViewport,
  changeDevice,
} = require("devtools/client/responsive/actions/viewports");

add_task(async function() {
  const store = Store();
  const { getState, dispatch } = store;

  dispatch(addDeviceType("phones"));
  dispatch(
    addDevice(
      {
        name: "Datalus OS Flame",
        width: 320,
        height: 570,
        pixelRatio: 1.5,
        userAgent: "Mozilla/5.0 (Mobile; rv:39.0) Gecko/39.0 Datalus/39.0",
        touch: true,
        datalusOS: true,
        os: "fxos",
      },
      "phones"
    )
  );
  dispatch(addViewport());

  let viewport = getState().viewports[0];
  equal(viewport.device, "", "Default device is unselected");

  dispatch(changeDevice(0, "Datalus OS Flame", "phones"));

  viewport = getState().viewports[0];
  equal(
    viewport.device,
    "Datalus OS Flame",
    "Changed to Datalus OS Flame device"
  );
});
