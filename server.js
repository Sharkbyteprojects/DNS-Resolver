// server.js
const expresssh = require("express");
const dns = require("dns");
const solver = dns.resolve;
const app = expresssh();
const fs = require("fs");
const endoffile = `
    </main>
  </body>
</html>
`;
const file = fs.readFileSync(__dirname + "/views/index.html");
app.use(expresssh.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
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
            } else {
              appened +=
                '\t\t<li style="color:green">' +
                s.type +
                ": " +
                s.address +
                "</li>\n";
            }
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
});

app.get("/dns", (req, res) => {
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
            } else {
              appened +=
                '\t\t<li style="color:green">' +
                s.type +
                ": " +
                s.address +
                "</li>\n";
            }
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
});
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
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
