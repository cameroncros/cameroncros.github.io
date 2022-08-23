#!/usr/bin/env bash
set -e
cd "$(dirname "$0")" || exit
pwd

if [[ ! -f ./.venv ]]; then
  python3 -m venv ./.venv
fi
source ./.venv/bin/activate
pip install sphinx
rm docs/* || true
python3 -m sphinx source/ docs/
