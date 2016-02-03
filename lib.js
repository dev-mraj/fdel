var fs = require("fs");
var path = require("path");
var debug=false;
/**
 * @author Meghraj Choudhary
 */

var recursiveProgress=function(total,back){
    var did=0;
    var apart=(1/total)*100;
    var done=0;
    return function(percentage) {
        if (percentage >= 100){
            did++;
            done = (((did) / total) * 100);
            back(done);
        } else {
            back(done+((percentage/100)*apart));
        }
    };
};

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

var deleteFolderRecursive = function(path,progress) {
    if( fs.existsSync(path) ) {
        var files = fs.readdirSync(path);
        
        var del=function(){
            try {
                fs.rmdirSync(path);
                if(files.length==0)
                    progress(100);
            } catch (e){
                console.log(e);
            }
        };
        var children=recursiveProgress(files.length,function(done){
            if(done===100){
                del();
            }
            progress(done);
        });
        
        if(files.length==0)
            return del() && progress(100);
        
        for(var i=0;i<files.length;i++){
            var curPath = path + "/" + files[i];
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath,children);
            } else { // delete file
                fs.unlinkSync(curPath);
                children(100);
            }
        }       
        
    } else {
        progress(100);
    }
};



var shortRenameEverything = function (dir,progress) {

    try {
        var files=fs.readdirSync(dir);
        if(files.length==0)
            return progress(100);

        var children=recursiveProgress(files.length,progress);
        
        for(var i=0;i<files.length;i++) {
            var path = dir + "/" + files[i];

            // Keep renaming all directories to one..
            var stat=fs.lstatSync(path);
            if(stat.isDirectory()){
                path=renameDirecory(dir,files[i]);
                shortRenameEverything(path,children);
            } else {
                fs.unlinkSync(path);
                children(100);
            }
        }
        
    } catch (e) {
        console.error(e);
        progress(100);
    }
};


module.exports={
    deleteFolderRecursive:deleteFolderRecursive,
    renameDirecory:renameDirecory,
    shortRenameEverything:shortRenameEverything
};