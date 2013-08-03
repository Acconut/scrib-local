var Scrib = require("scrib"),
    fs = require("fs"),
    EOL = require("os").EOL,
    path = require("path").join(__dirname, "./data/log.txt"),
    Tests = module.exports,
    tf = null,
    logger = null,
    c = null,
    i = 0;

Tests.write = function(test) {
    
    // Clean it up
    if(fs.existsSync(path)) fs.unlinkSync(path);
    
    logger = new Scrib({
        "../": {
            file: "./data/log.txt",
            filter: function(m) {
                return m.priority > 3;
            },
            format: function(m) {
                return i++ + EOL;
            }
        }
    }, function(e) {
        if(e) throw e;
        
        logger.put("Message", { 42: true }, 9, "MSG", "Logs");
        logger.put("Message2", { node: "up" }, 5, "MSG_2", "Logs");
        logger.put("TooLowPriority", {}, 2, "NO", "Logs");
        
        fs.readFile(path, function(er, data) {
            test.expect(3);
            
            var entries = data.toString().split(EOL);
            
            test.ifError(er);
            test.equal(entries.length, 3, "Two entries");
            test.equal(entries[0], "0", "Formater returned correct value");
            
            try {
                // Clean it up
                fs.unlinkSync(path);
            } catch(e) {
                test.done(e);
            }
            test.done();
        });
        
    });
    
};

Tests.transformers = {
    
    raw: function(test) {
        tf = require("../").transformers
        
        test.expect(1);
        
        var msg = {
            message: "Message",
            data: { node: "up" },
            priority: 9,
            id: "MSG",
            category: "Logs",
            time: Date.now()
        },
            val = tf.raw(msg);
        
        test.ok(val.substr(val.indexOf("GMT")) === 'GMT] 9 MSG (Logs): Message {"node":"up"}' + EOL, "Correct format"); 
        
        test.done();
    }
};