@echo off
git init
git add .
git branch -c develop
git commit -m "home page"
git remote add origin https://github.com/AdamBILHAJ/DevEvents.git
git push -u origin main