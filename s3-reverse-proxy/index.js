const express = require('express');
const httpProxy = require('http-proxy');

const app = express();

const BASE_URL = "https://dave-vercel.s3.ap-south-1.amazonaws.com/DaveVercel/P1/index.html"


const proxy = httpProxy.createProxy()
app.use((req,res)=>{
    const hostName = req.hostname;
    const subDomain = hostName.split('.')[0];
    const url = `${BASE_URL}/${subDomain}`;
    proxy.web(req,res,{target:resolvesTo,changeOrigin:true})

})
proxy.on('proxyReq',(proxyReq,req,res)=>{
    const url = req.url;
    if(url==="/"){
        proxyReq.path += "index.html"
    }
})


app.listen(8000,()=>{
    console.log("reverse proxy running on 8000")
})

