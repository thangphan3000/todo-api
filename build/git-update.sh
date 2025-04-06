#!/bin/bash

VERSION_TYPE=''
CURRENT_TAG_VERSION=''
INITIAL_VERSION='0.1.0'
MAJOR='major'
MINOR='minor'
PATCH='patch'

get_latest_tag() {
  git fetch --tags origin
  git tag | tail -1 2>/dev/null
}

get_latest_commit_hash() {
  git rev-parse HEAD
}

while getopts v: flag
do
  case "${flag}" in
    v) VERSION_TYPE=${OPTARG} ;;
    *)
      echo "[ERROR] Please usage: $0 -v <major|minor|patch>"
      exit 1
      ;;
  esac
done

if [[ "$VERSION_TYPE" != "$MAJOR" && "$VERSION_TYPE" != "$MINOR" && "$VERSION_TYPE" != "$PATCH" ]]; then
  echo "[ERROR] Invalid version type. Please use 'major', 'minor', or 'patch'."
  exit 1
fi

CURRENT_TAG_VERSION=$(get_latest_tag)

if [ "$CURRENT_TAG_VERSION" == '' ]
then
  CURRENT_TAG_VERSION=$INITIAL_VERSION
fi
echo "[INFO] Current version: $CURRENT_TAG_VERSION"

CURRENT_VERSION_PARTS=(${CURRENT_TAG_VERSION//./ })

MAJOR_VERSION=${CURRENT_VERSION_PARTS[0]}
MINOR_VERSION=${CURRENT_VERSION_PARTS[1]}
PATCH_VERSION=${CURRENT_VERSION_PARTS[2]}

if [ "$VERSION_TYPE" == "$MAJOR" ]
then
  MAJOR_VERSION=$((MAJOR_VERSION + 1))
elif [ "$VERSION_TYPE" == "$MINOR" ]
then
  MINOR_VERSION=$((MINOR_VERSION + 1))
elif  [ "$VERSION_TYPE" == "$PATCH" ]
then
  PATCH_VERSION=$((PATCH_VERSION + 1))
else
  echo "[ERROR] No version type (https://semver.org/) or incorrect type specified, try: -v [major, minor, patch]"
fi

NEW_TAG="$MAJOR_VERSION.$MINOR_VERSION.$PATCH_VERSION"
echo "[INFO] ($VERSION_TYPE) updating $CURRENT_TAG_VERSION to $NEW_TAG"

GIT_COMMIT=$(get_latest_commit_hash)
IS_NEED_TAG=$(git describe --contains "$GIT_COMMIT" 2>/dev/null)

if [ -z "$IS_NEED_TAG" ]; then
  git tag "$NEW_TAG"
  git push --tags

  echo "[INFO] Tagged with $NEW_TAG"
else
  echo "[ERROR] Already a tag on this commit"
fi

echo "git-tag=$NEW_TAG" >> "$GITHUB_OUTPUT"
