#!/bin/bash

# Cria variáveis com o autor e email do último commit
GIT_NAME=`git show --format="%an" | head -n 1`
GIT_MAIL=`git show --format="%ae" | head -n 1`

# Configura o git
git config user.name "${GIT_NAME}"
git config user.email "${GIT_MAIL}"

# Faz push forçado no gh-pages remoto
git push --force --quiet "https://${GH_TOKEN}:x-oauth-basic@github.com/Syonet/scroll.git" master:gh-pages > /dev/null 2>&1