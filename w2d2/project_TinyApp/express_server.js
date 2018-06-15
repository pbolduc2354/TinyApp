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

const users = {
  userRandomID: {
    id: "userRadomID",
    email: "user@example.com",
    password: "chat"
  } ,
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "chien",
  } ,
  user3RandomID: {
    id: "user3RandomID",
    email: "user3@example.com",
    password: "chu",
  }
}

app.get("/", (req, res) => {
  res.end("hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>/n");
});

//LOGIN end point
app.get("/login", (req, res) => {
  let templateVars = { user: req.cookies["user_id"] };
  res.render("urls_login", templateVars)
})

// Cookie set-up
app.post("/login", (req, res) => {
  let id = generateRandomString()
  if (userEmailVerificator(req) && userPasswordVerificator(req)) {
    for (let id in users){
      if (users[id].email == req.body.email) {
      // console.log(users[id].email)
      res.cookie("user_id", id)
    } else {
        users[id] = {
        id: id,
        email: req.body.email,
        password: req.body.password,
        }
      res.cookie("user_id", id)
      console.log("pas de id")
    }
    }


  } else {
    res.send(403)
  }
  res.redirect("/urls")
  console.log(req.body.id)
    console.log(user)

});

//logout
app.post("/logout", (req, res) => {
 res.clearCookie("user_id");
 res.redirect("/urls")
});

//register page
app.get("/register", (req, res) => {

  res.render("urls_register");
});

//creating a new user with register page
app.post("/register", (req, res) => {
  let id = generateRandomString()
  if(!req.body.email || !req.body.password) {
      res.send(400);
  } else if ( userEmailVerificator(req) ) {
      res.send(400);
    } else {
        users[id] = {
        id: id,
        email: req.body.email,
        password: req.body.password,
        }
      }


  res.cookie("user_id", id)
  res.redirect("/urls")
});

//Main page urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: req.cookies["user_id"] };
  console.log(templateVars.user)
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
    user: req.cookies["user_id"],
  };
  res.render("urls_new", templateVars);
});

// pages for each id
app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL];
  let templateVars = {
    shortURL : shortURL,
    longURL: longURL,
    user: req.cookies["user_id"]
   }
  res.render("urls_show", templateVars);
})


app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = req.body.box;
  urlDatabase[shortURL] = longURL;

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

  function userEmailVerificator(req) {
    var resultat = false;

    for (let user in users) {
      if (users[user].email == req.body.email){
        resultat = true;
      }
    } return resultat
  };

    function userPasswordVerificator(req) {
    var resultat = false;

    for (let user in users) {
      if (users[user].password == req.body.password){
        resultat = true;
      }
    } return resultat
  };
