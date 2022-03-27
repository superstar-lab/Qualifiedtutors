const fs = require('fs')
try {
    fs.unlinkSync(".env")
    fs.unlinkSync("backend/build.zip")
} catch(error) {
    // Swallow errors (happens when there is no .env)
    // Could also happen for permission and other issues, so this may cause issues
}

fs.copyFileSync(".env.prod", ".env")

require('dotenv').config()
const execSync = require('child_process').execSync

execSync(`cd iac && cdk destroy ProdStack`, {stdio: 'inherit'})

fs.unlinkSync(".env")
