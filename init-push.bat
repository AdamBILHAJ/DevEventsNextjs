@echo off
REM Set the correct remote URL
git remote set-url origin https://github.com/AdamBILHAJ/DevEventsNextjs.git

REM Stage all changes
git add .

REM Create develop branch only if it doesn't exist
git show-ref --verify --quiet refs/heads/develop || git branch develop

REM Commit (will succeed even if nothing new to commit? but fine)
git commit -m "home page 1"

REM Push the current branch to remote main
git push -u origin HEAD:main