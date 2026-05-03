@echo off
REM Ensure we're on master/main first
git checkout master 2>nul || git checkout main

REM Create develop branch if it doesn't exist
git show-ref --verify --quiet refs/heads/develop || git branch develop

REM Add files and commit
git add .
git commit -m "home page 1"

REM Add remote only if it doesn't exist
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/AdamBILHAJ/DevEventsNextjs.git
)

REM Push current branch to main on remote
git push -u origin HEAD:main