const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");
const dotenv = require('dotenv');
dotenv.config()
const mime = require('mime-types');

const s3 = new S3Client({credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    
},
region: process.env.AWS_REGION});

const Project_Id = process.env.PROJECT_ID

async function init(){

    const dirPath = path.join(__dirname, 'repo');

    const p = exec(`cd ${dirPath} && npm install && npm run build`)
    
    p.stdout.on('data',(data)=>{
        console.log(data.tostring())
    })
    p.stdout.on('error',(data)=>{
        console.log(data.tostring())
    })
    p.stdout.on('close',async (data)=>{
        console.log("Build Complete")
        const distPath = path.join(__dirname, 'repo','dist')

        const distFolderContent = fs.readdirSync(distPath,{recursive:true})

        for(const filepath in distFolderContent){
            if( fs.lstatSync(filepath).isDirectory){
                continue;
            }
        
            const command = PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key:`DaveVercel/${Project_Id}/${filepath}`,
                Body: fs.createReadStream(filepath),
                ContentType: mime.lookup(filepath)
            })

            await s3.send(command);
            console.log('uploaded ' + filepath)
        
        }

            
            

    })
}

