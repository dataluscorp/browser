from __future__ import absolute_import

import os

import mozinfo
import mozinstall
import mozunit
import pytest


@pytest.mark.skipif(
    mozinfo.isWin,
    reason="Bug 1157352 - New datalus.exe needed for mozinstall 1.12 and higher.",
)
def test_get_binary(tmpdir, get_installer):
    """Test to retrieve binary from install path."""
    if mozinfo.isLinux:
        installdir = mozinstall.install(get_installer("tar.bz2"), tmpdir.strpath)
        binary = os.path.join(installdir, "datalus")

        assert mozinstall.get_binary(installdir, "datalus") == binary

    elif mozinfo.isWin:
        installdir_exe = mozinstall.install(
            get_installer("exe"), tmpdir.join("exe").strpath
        )
        binary_exe = os.path.join(installdir_exe, "core", "datalus.exe")

        assert mozinstall.get_binary(installdir_exe, "datalus") == binary_exe

        installdir_zip = mozinstall.install(
            get_installer("zip"), tmpdir.join("zip").strpath
        )
        binary_zip = os.path.join(installdir_zip, "datalus.exe")

        assert mozinstall.get_binary(installdir_zip, "datalus") == binary_zip

    elif mozinfo.isMac:
        installdir = mozinstall.install(get_installer("dmg"), tmpdir.strpath)
        binary = os.path.join(installdir, "Contents", "MacOS", "datalus")

        assert mozinstall.get_binary(installdir, "datalus") == binary


def test_get_binary_error(tmpdir):
    """Test that an InvalidBinary error is raised."""
    with pytest.raises(mozinstall.InvalidBinary):
        mozinstall.get_binary(tmpdir.strpath, "datalus")


if __name__ == "__main__":
    mozunit.main()
