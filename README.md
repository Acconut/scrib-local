Scrib-local
====

An adapter for [Scrib](https://github.com/Acconut/scrib) to write logs into a log file.

```
npm install scrib scrib-local --save
```

```javascript
var Scrib = require("scrib"),
    logger = new Scrib({
        "local": {
            file: "./data/log.txt",
            filter: function(message) {
                // Messages with a priority lower or equal 0 won't be logged
                return message.priority > 0;
            }
        }
    }, function(e) {
        if(e) throw e;
        
        logger.put("Message", { 42: true }, 3, "MSG", "Logs");
        logger.put("Message2", { node: "up" }, 1, "MSG_2", "Logs");
        
    });
```

Then your log file will look like (you can modify it using the `format` option):

```
[Thu, 01 Aug 2013 19:21:41 GMT] 3 MSG (Logs): Message {"42":true}
[Thu, 01 Aug 2013 19:21:41 GMT] 1 MSG_2 (Logs): Message2 {"node":"up"}
```

Options
---

* `file`: A path relative to your current file to the log file
* `flags = "a+"`: File flags to open file with
* `filter = null`: A function called with every message to filter them
* `format = null`: A function called with every filtered message to return a string to write to the file

### Testing [![Build Status](https://drone.io/github.com/Acconut/scrib-local/status.png)](https://drone.io/github.com/Acconut/scrib-local/latest)

```
git clone git://github.com/Acconut/scrib-local.git
cd scrib-local
npm install
npm test
```

Licensed under [the MIT License](https://raw.github.com/Acconut/scrib/master/LICENSE).