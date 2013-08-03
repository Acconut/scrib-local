var fs      = require("fs"),
    path    = require("path"),
    mkdirp  = require("mkdirp"),
    util    = require("util"),
    EOL     = require("os").EOL;

var transformers = {
    
    raw: function(m) {
        /**
         * %s: GMT formated time stamp
         * %d: Priority
         * %s: ID
         * %s: Category
         * %s: Message
         * %j: Data as JSON
         */
        return util.format(
            "[%s] %d %s (%s): %s %j" + EOL,
            (new Date(m.time)).toGMTString(),
            m.priority,
            m.id,
            m.category,
            m.message,
            m.data
        );
    }
    
};

function Adapter(logger, config, callback) {
    
    // Options
    if(!config.file) return callback(new Error("Not file given"));
    var file    = path.join(path.dirname(module.parent.parent.filename), config.file),
        flags   = config.flags || "a+",
        filter  = config.filter || function() { return true; },
        format  = config.format || "raw",
        stream  = transform = null;
    
    if(format instanceof Function) {
        transform = format;
    } else if(format in transformers) {
        transform = transformers[format];
    } else {
        var err = new Error("Unkown format '" + format + "'");
        err.format = format;
        return callback(err);
    }
    
    logger.on("log", function onLog(m) {
        if(!filter(m)) return;
        
        stream.write(transform(m));
    });
    
    mkdirp(path.dirname(file), function dirEnsured(err) {
        
        if(err) return callback(err);
        
        stream = fs.createWriteStream(file, {
            flags: flags,
            encoding: "utf8"
        });
        
        stream.on("open", function() {
            callback(null);
        });
    });
}

module.exports = Adapter;
module.exports.transformers = transformers;