#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-ubuntu@1.14.11.94}"
REMOTE_DIR="${REMOTE_DIR:-/home/ubuntu/main-page}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/server94.pem}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_OPTS=(-o IdentitiesOnly=yes -i "${SSH_KEY}")
RSYNC_SSH="ssh -o IdentitiesOnly=yes -i ${SSH_KEY}"

retry() {
  local attempt
  for attempt in 1 2 3 4 5; do
    if "$@"; then
      return 0
    fi
    echo "Attempt ${attempt} failed; retrying..."
    sleep 3
  done

  echo "Command failed after retries: $*" >&2
  return 1
}

echo "Building blog..."
node "${ROOT_DIR}/scripts/build-blog.mjs"

echo "Deploying ${ROOT_DIR} -> ${REMOTE_HOST}:${REMOTE_DIR}"
retry ssh "${SSH_OPTS[@]}" "${REMOTE_HOST}" "mkdir -p '${REMOTE_DIR}'"
retry rsync -az \
  -e "${RSYNC_SSH}" \
  "${ROOT_DIR}/README.md" \
  "${ROOT_DIR}/AGENTS.md" \
  "${ROOT_DIR}/config.json" \
  "${ROOT_DIR}/index.html" \
  "${REMOTE_HOST}:${REMOTE_DIR}/"

retry rsync -az --delete \
  -e "${RSYNC_SSH}" \
  "${ROOT_DIR}/blog/" "${REMOTE_HOST}:${REMOTE_DIR}/blog/"

retry rsync -az --delete \
  -e "${RSYNC_SSH}" \
  "${ROOT_DIR}/assets/" "${REMOTE_HOST}:${REMOTE_DIR}/assets/"

# Project homepages — one folder per project, deployed to repo root so they
# serve at https://liuxl.com.cn/<slug>/. Add new entries by following the same
# pattern: rsync the project folder to ${REMOTE_DIR}/<slug>/.
if [ -d "${ROOT_DIR}/raidbots-cn-extension" ]; then
  retry rsync -az --delete \
    -e "${RSYNC_SSH}" \
    "${ROOT_DIR}/raidbots-cn-extension/" "${REMOTE_HOST}:${REMOTE_DIR}/raidbots-cn-extension/"
fi

if [ -d "${ROOT_DIR}/ez-translate-lite" ]; then
  retry rsync -az --delete \
    -e "${RSYNC_SSH}" \
    "${ROOT_DIR}/ez-translate-lite/" "${REMOTE_HOST}:${REMOTE_DIR}/ez-translate-lite/"
fi

if [ -d "${ROOT_DIR}/CopyEnglishName" ]; then
  retry rsync -az --delete \
    -e "${RSYNC_SSH}" \
    "${ROOT_DIR}/CopyEnglishName/" "${REMOTE_HOST}:${REMOTE_DIR}/CopyEnglishName/"
fi

retry rsync -az --delete \
  -e "${RSYNC_SSH}" \
  "${ROOT_DIR}/scripts/" "${REMOTE_HOST}:${REMOTE_DIR}/scripts/"

echo "Deployment complete."
