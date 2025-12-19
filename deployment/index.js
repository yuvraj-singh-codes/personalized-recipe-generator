const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { exec } = require('child_process');

// Load environment variables from .env file
dotenv.config();

// Define paths
const clientBuildPath = path.join(__dirname, '../client/build');
const serverPath = path.join(__dirname, '../server');

// Function to build the React app
function buildReactApp() {
    return new Promise((resolve, reject) => {
        exec('npm run build', { cwd: path.join(__dirname, '../client') }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error building React app: ${stderr}`);
                return reject(error);
            }
            console.log(`React app built successfully: ${stdout}`);
            resolve();
        });
    });
}

// Function to copy build files to server
function copyBuildFiles() {
    return new Promise((resolve, reject) => {
        fs.copyFileSync(path.join(clientBuildPath, 'index.html'), path.join(serverPath, 'views', 'index.html'));
        fs.copyFileSync(path.join(clientBuildPath, 'static', 'css', 'main.css'), path.join(serverPath, 'public', 'css', 'main.css'));
        fs.copyFileSync(path.join(clientBuildPath, 'static', 'js', 'main.js'), path.join(serverPath, 'public', 'js', 'main.js'));
        console.log('Build files copied to server.');
        resolve();
    });
}

// Function to prepare deployment
async function prepareDeployment() {
    try {
        await buildReactApp();
        await copyBuildFiles();
        console.log('Deployment preparation completed successfully.');
    } catch (error) {
        console.error('Deployment preparation failed:', error);
        process.exit(1);
    }
}

// Execute deployment preparation
prepareDeployment();