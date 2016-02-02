#!/usr/bin/env node

'use strict';

var fs = require("fs");
var path = require("path");
var argv=process.argv.slice(2);

//TODO:: properly handler argumetns, its bit danger..
var dir=argv[0];
if(!dir){
    console.log('Specify path to delete.');
} else {
    dir = path.resolve(__dirname, dir);

    /**
     * rename this to shorter name available.
     * @param dir
     * @param file
     * @returns {string}
     */
    var renameDirecory=function(dir,file){
        var done=false;
        var i=0;
        while(!done){
            try {
                console.log(fs.renameSync(dir+'/'+file,dir+'/'+i));
                done=true;
            } catch (e){
                done=false;
            }
            i++;
        }
        return done?dir+'/'+(i-1):dir+'/'+path;
    };
    
    /**
     * Thanks to @geedew
     * http://stackoverflow.com/questions/12627586/is-node-js-rmdir-recursive-will-it-work-on-non-empty-directories
     * @param path
     */
    
    var deleteFolderRecursive = function(path) {
        var files = [];
        if( fs.existsSync(path) ) {
            files = fs.readdirSync(path);
            files.forEach(function(file){
                var curPath = path + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
    
    var forceDelDirecory = function (dir,cb) {
        fs.readdir(dir, function(err, list) {
            if (err) {
                console.error(err);
            } else {
                var done=[];
                var checkDone=function(){
                    done.push(0);
                    if(list.length==done.length){
                        cb();
                    }
                };
                
                list.forEach(function(file){
                    var path = dir + "/" + file;
                    
                    // Keep renaming all directories to one..
                    var stat=fs.lstatSync(path);
                    if(stat.isDirectory()){
                        path=renameDirecory(dir,file);
                        forceDelDirecory(path,checkDone);
                    } else {
                        fs.unlinkSync(path);
                        checkDone();
                    }
                });
            }
        });
    };
    
    
    forceDelDirecory(dir,function(){
        deleteFolderRecursive(dir);
    });
}