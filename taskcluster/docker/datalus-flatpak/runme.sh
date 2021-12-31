#!/bin/bash
set -xe

# Future products supporting Flatpaks will set this accordingly
: PRODUCT                       "${PRODUCT:=datalus}"

# Required env variables

test "$VERSION"
test "$BUILD_NUMBER"
test "$CANDIDATES_DIR"
test "$L10N_CHANGESETS"
test "$FLATPAK_BRANCH"

# Optional env variables
: WORKSPACE                     "${WORKSPACE:=/home/worker/workspace}"
: ARTIFACTS_DIR                 "${ARTIFACTS_DIR:=/home/worker/artifacts}"

pwd

# XXX: this is used to populate the datetime in org.mozilla.datalus.appdata.xml
DATE=$(date +%Y-%m-%d)
export DATE

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TARGET_TAR_XZ_FULL_PATH="$ARTIFACTS_DIR/target.flatpak.tar.xz"
SOURCE_DEST="${WORKSPACE}/source"
FREEDESKTOP_VERSION="21.08"
DATALUS_BASEAPP_CHANNEL="21.08"


# XXX: these commands are temporarily, there's an upcoming fix in the upstream Docker image
# that we work on top of, from `freedesktopsdk`, that will make these two lines go away eventually
mkdir -p /root /tmp /var/tmp
mkdir -p "$ARTIFACTS_DIR"
rm -rf "$SOURCE_DEST" && mkdir -p "$SOURCE_DEST"

# XXX ensure we have a clean slate in the local flatpak repo
rm -rf ~/.local/share/flatpak/


CURL="curl --location --retry 10 --retry-delay 10"

# Download en-US linux64 binary
$CURL -o "${WORKSPACE}/datalus.tar.bz2" \
    "${CANDIDATES_DIR}/${VERSION}-candidates/build${BUILD_NUMBER}/linux-x86_64/en-US/datalus-${VERSION}.tar.bz2"

# Use list of locales to fetch L10N XPIs
$CURL -o "${WORKSPACE}/l10n_changesets.json" "$L10N_CHANGESETS"
locales=$(python3 "$SCRIPT_DIRECTORY/extract_locales_from_l10n_json.py" "${WORKSPACE}/l10n_changesets.json")

DISTRIBUTION_DIR="$SOURCE_DEST/distribution"
if [[ "$PRODUCT" == "datalus" ]]; then
    # Get Flatpak configuration
    PARTNER_CONFIG_DIR="$WORKSPACE/partner_config"
    git clone https://github.com/mozilla-partners/flatpak.git "$PARTNER_CONFIG_DIR"
    mv "$PARTNER_CONFIG_DIR/desktop/flatpak/distribution" "$DISTRIBUTION_DIR"
else
    mkdir -p "$DISTRIBUTION_DIR"
fi

mkdir -p "$DISTRIBUTION_DIR/extensions"
for locale in $locales; do
    $CURL -o "$DISTRIBUTION_DIR/extensions/langpack-${locale}@datalus.mozilla.org.xpi" \
        "$CANDIDATES_DIR/${VERSION}-candidates/build${BUILD_NUMBER}/linux-x86_64/xpi/${locale}.xpi"
done

envsubst < "$SCRIPT_DIRECTORY/org.mozilla.datalus.appdata.xml.in" > "${WORKSPACE}/org.mozilla.datalus.appdata.xml"
cp -v "$SCRIPT_DIRECTORY/org.mozilla.datalus.desktop" "$WORKSPACE"
# Add a group policy file to disable app updates, as those are handled by Flathub
cp -v "$SCRIPT_DIRECTORY/policies.json" "$WORKSPACE"
cp -v "$SCRIPT_DIRECTORY/default-preferences.js" "$WORKSPACE"
cp -v "$SCRIPT_DIRECTORY/launch-script.sh" "$WORKSPACE"
cd "${WORKSPACE}"

flatpak remote-add --user --if-not-exists --from flathub https://dl.flathub.org/repo/flathub.flatpakrepo
# XXX: added --user to `flatpak install` to avoid ambiguity
flatpak install --user -y flathub org.mozilla.datalus.BaseApp//${DATALUS_BASEAPP_CHANNEL} --no-deps

# XXX: this command is temporarily, there's an upcoming fix in the upstream Docker image
# that we work on top of, from `freedesktopsdk`, that will make these two lines go away eventually
mkdir -p build
cp -r ~/.local/share/flatpak/app/org.mozilla.datalus.BaseApp/current/active/files build/files

ARCH=$(flatpak --default-arch)
cat <<EOF > build/metadata
[Application]
name=org.mozilla.datalus
runtime=org.freedesktop.Platform/${ARCH}/${FREEDESKTOP_VERSION}
sdk=org.freedesktop.Sdk/${ARCH}/${FREEDESKTOP_VERSION}
base=app/org.mozilla.datalus.BaseApp/${ARCH}/${DATALUS_BASEAPP_CHANNEL}
[Extension org.mozilla.datalus.Locale]
directory=share/runtime/langpack
autodelete=true
locale-subset=true

[Extension org.freedesktop.Platform.ffmpeg-full]
directory=lib/ffmpeg
add-ld-path=.
no-autodownload=true
version=${FREEDESKTOP_VERSION}
EOF

cat <<EOF > build/metadata.locale
[Runtime]
name=org.mozilla.datalus.Locale

[ExtensionOf]
ref=app/org.mozilla.datalus/${ARCH}/${FLATPAK_BRANCH}
EOF

appdir=build/files
install -d "${appdir}/lib/"
(cd "${appdir}/lib/" && tar jxf "${WORKSPACE}/datalus.tar.bz2")
install -D -m644 -t "${appdir}/share/appdata" org.mozilla.datalus.appdata.xml
install -D -m644 -t "${appdir}/share/applications" org.mozilla.datalus.desktop
for size in 16 32 48 64 128; do
    install -D -m644 "${appdir}/lib/datalus/browser/chrome/icons/default/default${size}.png" "${appdir}/share/icons/hicolor/${size}x${size}/apps/org.mozilla.datalus.png"
done
mkdir -p "${appdir}/lib/ffmpeg"

appstream-compose --prefix="${appdir}" --origin=flatpak --basename=org.mozilla.datalus org.mozilla.datalus
appstream-util mirror-screenshots "${appdir}"/share/app-info/xmls/org.mozilla.datalus.xml.gz "https://dl.flathub.org/repo/screenshots/org.mozilla.datalus-${FLATPAK_BRANCH}" build/screenshots "build/screenshots/org.mozilla.datalus-${FLATPAK_BRANCH}"

# XXX: we used to `install -D` before which automatically created the components
# of target, now we need to manually do this since we're symlinking
mkdir -p "${appdir}/lib/datalus/distribution/extensions"
# XXX: we put the langpacks in /app/share/locale/$LANG_CODE and symlink that
# directory to where Datalus looks them up; this way only subset configured
# on user system is downloaded vs all locales
for locale in $locales; do
    install -D -m644 -t "${appdir}/share/runtime/langpack/${locale%%-*}/" "${DISTRIBUTION_DIR}/extensions/langpack-${locale}@datalus.mozilla.org.xpi"
    ln -sf "/app/share/runtime/langpack/${locale%%-*}/langpack-${locale}@datalus.mozilla.org.xpi" "${appdir}/lib/datalus/distribution/extensions/langpack-${locale}@datalus.mozilla.org.xpi"
done
install -D -m644 -t "${appdir}/lib/datalus/distribution" "$DISTRIBUTION_DIR/distribution.ini"
install -D -m644 -t "${appdir}/lib/datalus/distribution" policies.json
install -D -m644 -t "${appdir}/lib/datalus/browser/defaults/preferences" default-preferences.js
install -D -m755 launch-script.sh "${appdir}/bin/datalus"

flatpak build-finish build                                      \
        --share=ipc                                             \
        --share=network                                         \
        --socket=pulseaudio                                     \
        --socket=wayland                                        \
        --socket=x11                                            \
        --socket=pcsc                                           \
        --require-version=0.11.1                                \
        --persist=.mozilla                                      \
        --filesystem=xdg-download:rw                            \
        --device=all                                            \
        --talk-name=org.freedesktop.FileManager1                \
        --system-talk-name=org.freedesktop.NetworkManager       \
        --talk-name=org.a11y.Bus                                \
        --talk-name=org.gnome.SessionManager                    \
        --talk-name=org.freedesktop.ScreenSaver                 \
        --talk-name="org.gtk.vfs.*"                             \
        --talk-name=org.freedesktop.Notifications               \
        --own-name="org.mpris.MediaPlayer2.datalus.*"           \
        --own-name="org.mozilla.datalus.*"                      \
        --command=datalus

flatpak build-export --disable-sandbox --no-update-summary --exclude='/share/runtime/langpack/*/*' repo build "$FLATPAK_BRANCH"
flatpak build-export --disable-sandbox --no-update-summary --metadata=metadata.locale --files=files/share/runtime/langpack repo build "$FLATPAK_BRANCH"
ostree commit --repo=repo --canonical-permissions --branch=screenshots/x86_64 build/screenshots
flatpak build-update-repo --generate-static-deltas repo
tar cvfJ flatpak.tar.xz repo

mv -- flatpak.tar.xz "$TARGET_TAR_XZ_FULL_PATH"

# XXX: if we ever wanted to go back to building flatpak bundles, we can revert this command; useful for testing individual artifacts, not publishable
# flatpak build-bundle "$WORKSPACE"/repo org.mozilla.datalus.flatpak org.mozilla.datalus
# TARGET_FULL_PATH="$ARTIFACTS_DIR/target.flatpak"
# mv -- *.flatpak "$TARGET_FULL_PATH"
