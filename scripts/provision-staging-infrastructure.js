const fs = require('fs')
try {
    fs.unlinkSync(".env")
} catch(error) {
    // Swallow errors (happens when there is no .env)
    // Could also happen for permission and other issues, so this may cause issues
}

fs.copyFileSync(".env.staging", ".env")

require('dotenv').config()

const execSync = require('child_process').execSync

execSync(`cd iac && npm install && npm run build && cdk synth StagingStack && cdk deploy StagingStack`, {stdio: 'inherit'})

fs.unlinkSync(".env")
