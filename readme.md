# Summary
- Basic user admin database for testing using auotmation

# Config
- Add followiong to .env

VERSION=22.10.04-1
APIAUTHKEY=abc123
LOCALHOST_PORT=3000
TOKEN_EXPIRE_MS=5000
#TOKEN_EXPIRE_MS=900000
SESSION_SECRET=sessionkey123
HOSTID=localhost:3000
MONGODB_URL=mongodb://localhost:27017/automationDemo

# Setup
- install dependnecnies: $ npm i
- run the server: $ npm run dev

# Cypress
- tutorial: https://www.youtube.com/playlist?list=PLzDWIPKHyNmK9NX9_ng2IdrkEr8L4WwB0
- Start cypress UI $ npx cypress open
- Run test case from UI: /e2e/0-mydemo/TC01.cy.js

# Git
git remote add origin https://github.com/adriangbarnett/cypress-automation-demo.git
git add .
git commit -m "add cypress demo"
git push -u origin master



