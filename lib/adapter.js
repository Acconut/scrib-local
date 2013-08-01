var fs      = require("fs"),
    path    = require("path"),
    mkdirp  = require("mkdirp"),
    util    = require("util"),
    EOL     = require("os").EOL;

function Adapter(logger, config, callback) {
    
    // Options
    if(!config.file) return callback(new Error("Not file given"));
    var file    = path.join(path.dirname(module.parent.parent.filename), config.file),
        format  = config.format || "raw",
        stream  = null,
        
        /**
         * %s: GMT formated time stamp
         * %d: Priority
         * %s: ID
         * %s: Category
         * %s: Message
         * %j: Data as JSON
         */
        string = "[%s] %d %s (%s): %s %j" + EOL;
    
    logger.on("log", function onLog(m) {
        stream.write(util.format(
            string,
            (new Date(m.time)).toGMTString(),
            m.priority,
            m.id,
            m.category,
            m.message,
            m.data
        ));
    });
    
    mkdirp(path.dirname(file), function dirEnsured(err) {
        if(err) return callback(err);
        
        stream = fs.createWriteStream(file, {
            flags: "a+",
            encoding: "utf8"
        });
        
        stream.on("open", function() {
            callback(null);
        });
    });
}

module.exports = Adapter;