var express = require("express");
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser())


var PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>/n");
});

// Cookie set-up
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);

  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
 res.clearCookie("username");
 res.redirect("/urls")
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {

  let shortURL = generateRandomString()
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;

  res.redirect('/urls')

});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL];
  let templateVars = {
    shortURL : shortURL,
    longURL: longURL,
    username: req.cookies["username"]
   }
  res.render("urls_show", templateVars);
})

app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = req.body.box;
  urlDatabase[shortURL] = longURL;
  // console.log("Current value", urlDatabase[shortURL])
  // console.log("shortURL", shortURL)
  // console.log("longURL", longURL)
  // console.log("request", req)
  res.redirect("/urls");
})

app.post("/urls/:id/delete", (req, res) =>{
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];

  res.redirect("/urls");
})

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
