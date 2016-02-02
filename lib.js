var fs = require("fs");
var path = require("path");
var debug=false;
/**
 * @author Meghraj Choudhary
 */
/**
 * rename this to shorter name available.
 * @param dir
 * @param file
 * @returns {string}
 */
var renameDirecory=function(dir,file){
    var done=false;
    var i=0;
    if(debug)
        console.log('shortening :'+dir+'/'+file);
    while(!done){
        if(i>500)
            break;
        try {
            fs.renameSync(dir+'/'+file,dir+'/'+i);
            done=true;
        } catch (e){
            done=false;
        }
        i++;
    }
    return done?dir+'/'+(i-1):dir+'/'+file;
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

var shortRenameEverything = function (dir,cb) {
    fs.readdir(dir, function(err, list) {
        if (err) {
            console.error(err);
            cb();
        } else {
            var did=[];
            var checkDone=function(){
                did.push(1);
                if(list.length==0 || list.length==did.length){
                    cb();
                }
            };
            if(list.length==0)
                checkDone();

            list.forEach(function(file){
                var path = dir + "/" + file;

                // Keep renaming all directories to one..
                var stat=fs.lstatSync(path);
                if(stat.isDirectory()){
                    path=renameDirecory(dir,file);
                    // if(debug)
                    //    console.log('recursive :'+dir+'/'+file);
                    shortRenameEverything(path,checkDone);
                } else {
                    //if(debug)
                    //    console.log('removing :'+dir+'/'+file);
                    fs.unlinkSync(path);
                    checkDone();
                }
            });
        }
    });
};


module.exports={
    deleteFolderRecursive:deleteFolderRecursive,
    renameDirecory:renameDirecory,
    shortRenameEverything:shortRenameEverything
};