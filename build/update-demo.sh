#!/bin/bash

# Cria variáveis com o autor e email do último commit
GIT_NAME=`git show --format="%an" | head -n 1`
GIT_MAIL=`git show --format="%ae" | head -n 1`

# Configura o git
git config user.name "${GIT_NAME}"
git config user.email "${GIT_MAIL}"

# Faz merge do master no gh-pages e depois push
git checkout gh-pages
git merge master --no-edit
git push --force --quiet "https://${GH_TOKEN}:x-oauth-basic@github.com/Syonet/scroll.git" gh-pages:gh-pages > /dev/null 2>&1