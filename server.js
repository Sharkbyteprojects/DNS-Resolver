// server.js
const expresssh = require("express");
const dns = require("dns");
const solver = dns.resolve;
const rel=require("reloadsh.js");
const app = expresssh();
const fs = require("fs");
const blocktor=require("blocktor");
app.use(blocktor((res)=>{res.status(403);res.send(`<!DOCTYPE html><html lang="de"><head><link rel="stylesheet" href="https://freesoftwaredevlopment.github.io/Terminal-style/styles/linux-terminal/terminal-class.css"><link rel="shortcut icon" href="https://fire-engine-icons.github.io/shbyte-logopublishers/sharkbytelogo.ico"><title>DNS RESOLVER - Tor Blocked</title></head><body class="terminal"><h1>You are using Tor.</h1><p>We Blocking Tor for security reasons to prevent Hacking!</p><p>Tor blocked by <a href="https://www.npmjs.com/package/blocktor" target="_blank">BlockTor</a></p></body></html>`);}));
const endoffile = `
    </main>
  </body>
</html>
`;
const file = fs.readFileSync(__dirname + "/views/index.html");
app.use(expresssh.static("public"));
const fun=(req, res) => {
  if (req.query.name) {
    solver(req.query.name, "ANY", (err, records) => {
      if (err) {
        res.send(file + endoffile);
      } else {
        let appened = "";
        records.forEach(s => {
          if (s.address !== undefined) {
            if (s.type == "A") {
              appened +=
                '\t\t<li style="color:blue">IP4: ' + s.address + "</li>\n";
            } else if (s.type == "AAAA") {
              appened +=
                '\t\t<li style="color:red">IP6: ' + s.address + "</li>\n";
            } else{
              appened +=
                '\t\t<li style="color:green">' +
                s.type +
                ": " +
                s.address +
                "</li>\n";
            }
          }else if(s.value !=undefined){
              appened +=
                '\t\t<li style="color:green">' +
                s.type +
                ": " +
                s.value +
                "</li>\n";
            }
        });
        const toadd = `  <div>
        <h2>Resolved Domain ${req.query.name}</h2>
${appened}      </div>`;
        res.send(file + toadd + endoffile);
      }
    });
  } else {
    res.send(file + endoffile);
  }
};
// https://expressjs.com/en/starter/basic-routing.html
app.get("/", fun);

app.get("/dns", fun);
app.get("/api", (req, res) => {
  if (req.query.name) {
    solver(req.query.name, "ANY", (err, records) => {
      if (err) {
        res.json([]);
      } else {
        res.json(records);
      }
    });
  } else {
    res.json([]);
  }
});

// listen for requests :)
const listener = rel(app,[__dirname+"/views",__dirname+"/public"]).listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
