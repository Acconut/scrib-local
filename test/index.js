var Scrib = require("scrib"),
    rimraf = require("rimraf"),
    fs = require("fs"),
    EOL = require("os").EOL,
    path = require("path").join(__dirname, "./data/log.txt"),
    Tests = module.exports,
    logger = null,
    c = null;

Tests.setUp = function(cb) {
    
    // Make sure there's nothing
    rimraf.sync(path);
    
    logger = new Scrib({
        "../": {
            file: "./data/log.txt"
        }
    }, function(e) {
        if(e) throw e;
        
        logger.put("Message", { 42: true }, 3, "MSG", "Logs");
        logger.put("Message2", { node: "up" }, 0, "MSG_2", "Logs");
        
        fs.readFile(path, function(er, data) {
            if(er) throw er;
            
            c = data.toString();
            
            cb();
        });
        
    });
};

Tests.tearDown = function(cb) {
    
    // Clean it up
    rimraf.sync(path);
    
    cb();
    
};

Tests.write = function(test) {
    
    var entries = c.split(EOL);
        
    test.equal(entries.length, 3, "Two entries");
    test.ok(/GMT\] 3 MSG \(Logs\): Message \{"42":true\}$/.test(entries[0]), "Right format"); 
    test.ok(/GMT\] 0 MSG_2 \(Logs\): Message2 \{"node":"up"\}$/.test(entries[1]), "Right format (2)"); 

    test.done();
    
};