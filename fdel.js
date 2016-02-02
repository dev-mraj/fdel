#!/usr/bin/env node

'use strict';


var lib=require('./lib');
var path=require('path');
var argv=process.argv.slice(2);
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
//var ProgressBar = require('progress');

//TODO:: properly handler argumetns, its bit danger..
var dir=argv[0];
if(!dir){
    console.log('Specify path to delete.');
} else {
    dir = path.resolve(process.cwd(), dir);

    rl.question("Are you sure to delete this path? yes/[no]: ", function(answer) {
        if(answer === "yes") {
            
            //var bar = new ProgressBar('renaming [:bar] :percent', { total: 100 });
            lib.shortRenameEverything(dir,function(){
                console.log('removing directory:'+dir);
                lib.deleteFolderRecursive(dir);
            },function(done){
                //console.log('done:'+done+' total:'+100);
                //bar.tick(done);
            });
            
        } else {
            process.exit();
        }
    });
    
    
    
}