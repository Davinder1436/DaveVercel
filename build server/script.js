const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
async function init(){

    const dirPath = path.join(__dirname, 'repo');

    const p = exec(`cd ${dirPath} && npm install && npm run build`)
    
    p.stdout.on('data',(data)=>{
        console.log(data.tostring())
    })
    p.stdout.on('error',(data)=>{
        console.log(data.tostring())
    })
    p.stdout.on('close',(data)=>{
        console.log("Build Complete")
        const distPath = path.join(__dirname, 'repo','dist')

        const distFolderContent = fs.readdirSync(distPath,{recursive:true})

        for(const filepath in distFolderContent){
            if( fs.lstatSync(filepath).isDirectory){
                continue;
            }}
            

    })
}

