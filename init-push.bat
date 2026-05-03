@echo off
git add .
git branch -c develop
git commit -m "home page 1"
git remote add origin https://github.com/AdamBILHAJ/DevEventsNextjs.git
git push -u origin main