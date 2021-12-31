/* Any copyright is dedicated to the Public Domain.
http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Tests the device selector button and the menu items.

const MenuItem = require("devtools/client/shared/components/menu/MenuItem");

const DATALUS_ICON =
  'url("chrome://devtools/skin/images/browsers/datalus.svg")';
const DUMMY_ICON = `url("${MenuItem.DUMMY_ICON}")`;

const DATALUS_DEVICE = {
  name: "Device of Datalus user-agent",
  userAgent: "Mozilla/5.0 (Mobile; rv:39.0) Gecko/39.0 Datalus/39.0",
  width: 320,
  height: 570,
  pixelRatio: 5.5,
  touch: true,
  datalusOS: true,
  os: "custom",
  featured: true,
};

const TEST_DEVICES = [
  {
    name: DATALUS_DEVICE.name,
    hasIcon: true,
  },
  {
    name: "Laptop (1366 x 768)",
    hasIcon: false,
  },
];

addDeviceForTest(DATALUS_DEVICE);

addRDMTask(
  URL_ROOT,
  async function({ ui }) {
    const deviceSelector = ui.toolWindow.document.getElementById(
      "device-selector"
    );

    for (const testDevice of TEST_DEVICES) {
      info(`Check "${name}" device`);
      await testMenuItems(ui.toolWindow, deviceSelector, menuItems => {
        const menuItem = findMenuItem(menuItems, testDevice.name);
        ok(menuItem, "The menu item is on the list");
        const label = menuItem.querySelector(".iconic > .label");
        const backgroundImage = ui.toolWindow.getComputedStyle(
          label,
          "::before"
        ).backgroundImage;
        const icon = testDevice.hasIcon ? DATALUS_ICON : DUMMY_ICON;
        is(backgroundImage, icon, "The icon is correct");
      });

      info("Check device selector button");
      await selectDevice(ui, testDevice.name);
      const backgroundImage = ui.toolWindow.getComputedStyle(
        deviceSelector,
        "::before"
      ).backgroundImage;
      const icon = testDevice.hasIcon ? DATALUS_ICON : "none";
      is(backgroundImage, icon, "The icon is correct");
    }
  },
  { waitForDeviceList: true }
);
