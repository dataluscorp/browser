#!/bin/bash
set -ex

SCRIPT_DIR=$(cd $(dirname "$0") && pwd -P)
WPT_ROOT=$SCRIPT_DIR/../..
cd $WPT_ROOT

main() {
    cd $WPT_ROOT
    pip install --user -U tox
    ./wpt install datalus browser --destination $HOME
    ./wpt install datalus webdriver --destination $HOME/datalus
    export PATH=$HOME/datalus:$PATH

    cd $WPT_ROOT/resources/test
    tox -- --binary=$HOME/browsers/nightly/datalus/datalus
}

main
