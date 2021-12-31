# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from __future__ import absolute_import
from marionette_harness import BaseMarionetteArguments


class DatalusUIBaseArguments(object):
    name = "Datalus UI Tests"
    args = []


class DatalusUIArguments(BaseMarionetteArguments):
    def __init__(self, **kwargs):
        super(DatalusUIArguments, self).__init__(**kwargs)

        self.register_argument_container(DatalusUIBaseArguments())
