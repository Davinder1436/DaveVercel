const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require('mime-types');

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    },
    region: "ap-south-1"
});

const Project_Id = process.env.PROJECT_ID;

async function init() {
    const dirPath = path.join(__dirname, 'repo');

    const p = exec(`cd ${dirPath} && npm install && npm run build`);

    p.stdout.on('data', (data) => {
        console.log(data);
    });

    p.stderr.on('data', (data) => {
        console.error('Error:', data);
    });

    p.on('close', async (code) => {
        console.log("Build Complete");

        const distPath = path.join(__dirname, 'repo', 'build');

        try {
            const distFolderContent = fs.readdirSync(distPath, { recursive: true });
            console.log(distFolderContent);

            for (let i = 0; i < distFolderContent.length; i++) {
                const filepath = path.join(distPath, distFolderContent[i]);
                if (fs.lstatSync(filepath).isDirectory()) {
                    continue;
                }

                console.log("Uploading " + filepath);

                const command = new PutObjectCommand({
                    Bucket: "dave-vercel",
                    Key: `DaveVercel/${Project_Id}/${distFolderContent[i]}`,
                    Body: fs.createReadStream(filepath),
                    ContentType: mime.lookup(filepath) || 'application/octet-stream' // Fallback content type
                });

                await s3.send(command);
                console.log('Uploaded ' + filepath);
            }
        } catch (err) {
            console.error('Error processing files:', err.message);
        }
    });
}

init();
