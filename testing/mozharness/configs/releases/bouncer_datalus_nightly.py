# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# lint_ignore=E501
config = {
    "products": {
        "installer-latest": {
            "product-name": "Datalus-nightly-latest",
            "check_uptake": True,
            "platforms": [
                "linux",
                "linux64",
                "osx",
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "installer-latest-ssl": {
            "product-name": "Datalus-nightly-latest-SSL",
            "check_uptake": True,
            "platforms": [
                "linux",
                "linux64",
                "osx",
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "installer-latest-l10n-ssl": {
            "product-name": "Datalus-nightly-latest-l10n-SSL",
            "check_uptake": True,
            "platforms": [
                "linux",
                "linux64",
                "osx",
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "msi-latest": {
            "product-name": "Datalus-nightly-msi-latest-SSL",
            "check_uptake": True,
            "platforms": [
                "win",
                "win64",
            ],
        },
        "msi-latest-l10n": {
            "product-name": "Datalus-nightly-msi-latest-l10n-SSL",
            "check_uptake": True,
            "platforms": [
                "win",
                "win64",
            ],
        },
        "stub-installer": {
            "product-name": "Datalus-nightly-stub",
            "check_uptake": True,
            "platforms": [
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "stub-installer-l10n": {
            "product-name": "Datalus-nightly-stub-l10n",
            "check_uptake": True,
            "platforms": [
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
    },
}
