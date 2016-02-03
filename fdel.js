#!/usr/bin/env node

'use strict';


var lib=require('./lib');
var path=require('path');
var argv=process.argv.slice(2);
var readline = require('readline');

var ProgressBar = require('progress');

//TODO:: properly handler argumetns, its bit danger..
var dir=argv[0];
if(!dir){
    console.log('Specify path to delete.');
} else {
    dir = path.resolve(process.cwd(), dir);
    
    var rl = readline.createInterface(process.stdin, process.stdout);
    rl.question("Are you sure to delete this path? yes/[no]: ", function(answer) {
        if(answer === "yes") {
            
            var bar = new ProgressBar('renaming [:bar] :percent :etas', { 
                total: 100 ,
                complete: '=',
                incomplete: ' ',
                width: 80,
                renderThrottle:100
            });
            
            var previousProgress=0;
            lib.shortRenameEverything(dir,function(progress){
                var now=progress-previousProgress;
                previousProgress=progress;
                bar.tick(now);
                
                if(previousProgress==100){
                    previousProgress=0;
                    bar = new ProgressBar('removing [:bar] :percent :etas', {
                        total: 100 ,
                        complete: '=',
                        incomplete: ' ',
                        width: 80,
                        renderThrottle:100
                    });
                    console.log('removing directory:'+dir);

                    lib.deleteFolderRecursive(dir,function(progress){
                        var now=progress-previousProgress;
                        previousProgress=progress;
                        bar.tick(now);
                        if(previousProgress==100) {
                            console.log('everything done !');
                            process.exit();
                        }
                    });
                }
                
            });
            
        } else { 
            process.exit();
        }
    });
    
    
    
}