@echo off
git add .
git checkout -b database-models
git commit -m "implement db models"
git remote add origin https://github.com/AdamBILHAJ/DevEvents.git 2>nul
git push --set-upstream origin database-models