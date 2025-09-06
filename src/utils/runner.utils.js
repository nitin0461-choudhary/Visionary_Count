// src/utils/runner.utils.js
import fs from "fs";
import path from "path";
import https from "https";
import crypto from "crypto";
import { spawn } from "child_process";;

export const TEMP_DIR=path.resolve("./public/temp");
(function ensureTempDir(){
    try{
        if(!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR,{recursive:true});
    }
    catch{}
}
)();
export const safeUnlink=(p)=>{
    try{
        if (p && fs.existsSync(p)) fs.unlinkSync(p);
    }
    catch{

    }
};
export function downloadToTemp(url,ext=".mp4",timeoutMs=60_000){
    return new Promise((resolve,reject)=>{
        const out=path.join(TEMP_DIR,`tmp-${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
        const file=fs.createWriteStream(out);
        const req=https.get(url,(res)=>{
            if(res.statusCode && res.statusCode >=400){
                file.close(()=>safeUnlink(out));
                return reject(new Error(`Download failed:${res.statusCode}`));
            }
            res.pipe(file);
            file.on("finish",()=>file.close(()=>resolve(out)));
        });
        req.on("error",(err)=>{
            file.close(()=>safeUnlink(out));
            reject(err);
        });
        req.setTimeout(timeoutMs,()=>{
            req.destroy(new Error("Download timeout"));
            file.close(()=>safeUnilink(out));
        });
    });
}
export function runPython(scriptName,args=[],{PYTHON_BIN="python3",PY_SCRIPTS_DIR="./python"}={}){
    const scriptPath=path.resolve(PY_SCRIPTS_DIR,scriptName);
    return new Promise((resolve,reject)=>{
        const child=spawn(PYTHON_BIN,[scriptPath,...args],{env:process.env});
        let stdout="",stderr="";
        child.stdout.on("data",(d)=>(stdout+=d.toString()));
        child.stderr.on("data",(d)=>(stderr+=d.toString()));
        child.on("close",(code)=>{
            if(code !==0){
                return reject(new Error(`Python ${scriptName} exited ${code}:${stderr || stdout}`));
            }
            resolve({stdout,stderr});
        });

    });
}

export function parseTaggedJson(stdout,marker){
    const idx=stdout.lastIndexOf(marker);
    if(idx ===-1) throw new Error(`Marker not found:${marker}`);
    const jsonStr=stdout.slice(idx+marker.length).trim();
    return JSON.parse(jsonStr);
}
