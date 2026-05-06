#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-ubuntu@1.14.11.94}"
REMOTE_DIR="${REMOTE_DIR:-/home/ubuntu/main-page}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/server94.pem}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Building blog..."
node "${ROOT_DIR}/scripts/build-blog.mjs"

echo "Deploying ${ROOT_DIR} -> ${REMOTE_HOST}:${REMOTE_DIR}"
ssh -o IdentitiesOnly=yes -i "${SSH_KEY}" "${REMOTE_HOST}" "mkdir -p '${REMOTE_DIR}'"
rsync -az --delete \
  -e "ssh -o IdentitiesOnly=yes -i ${SSH_KEY}" \
  --exclude ".git/" \
  --exclude ".claude/" \
  --exclude ".DS_Store" \
  "${ROOT_DIR}/" "${REMOTE_HOST}:${REMOTE_DIR}/"

echo "Deployment complete."
