#!/usr/bin/env python

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from __future__ import absolute_import
from marionette_harness.runtests import cli as mn_cli

from datalus_ui_harness.arguments import DatalusUIArguments
from datalus_ui_harness.runners import DatalusUITestRunner


def cli(args=None):
    mn_cli(
        runner_class=DatalusUITestRunner,
        parser_class=DatalusUIArguments,
        args=args,
    )


if __name__ == "__main__":
    cli()
