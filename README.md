### structure of project: MVC
---

### template engin: handlebars

```
npm install express-handlebars
```
```
let express = require('express');
let exphbs  = require('express-handlebars');

let app = express();
let hbs = exphbs.create({});

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get("/", (req, res) => {
    res.render("main", {layout: false, myName: "Amir"}); 
});
```
```
// in main.handlebars:
<h1>my name is {{myName}}</h1>
```
#### linking a file to main.handlebars:

#### way 1:
```
app.use(express.static(pathOfStaticFiles));

// in main.handlebars:
<head>
    <link rel='stylesheet' href='pathOfStaticFiles/css/style.css'>
</head>
```

#### way 2:
```
app.use("/a_prefix", express.static(pathOfStaticFiles));

// in main.handlebars:
<head>
    <link rel='stylesheet' href='a_prefix/pathOfStaticFiles/css/style.css'>
</head>
```
---

### module-alias
```
npm install module-alias
```
```
// in package.json:
"_moduleAliases": {
    "@root": ".",
    "@models": "app/models",
    "@controllers": "app/controllers",
    "@routes": "app/routes",
    "@services": "app/services",
    "@database": "./database"
},
```

in index file put this import:
```
require("module_alias/register");
```

using example:
```
const db = require("@database/fileName");
```

---

### jalali-moment (moment that include persian date too):
```
npm install jalali-moment
```
```
const jm = require("jalali-moment");
posts.forEach(post => {
    post.persianCreatedAt = jm(post.created_at).locale("fa").format("YYYY/MM/DD"); 
});
```
---

### gravatar (global avatar) for avatar image
```
npm install gravatar
```

```
const gravatar = require("gravatar");
gravatar.url(userEmail, options); --> img url
```

---

### bcrypt: hash password
```
npm install bcrypt
```
```
const bcrypt = require("bcrypt");

exports.hashPassword = plainPassword => {
    return bcrypt.hashSync(plainPassword, saltRound(a number));
};

exports.comparePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
};
```

---

### connect-flash
```
npm install connect-flash
```
```
const flash = require("connect-flash);
const cookieParser = require("cookie-parser);
const session = require("express-session);

app.use(session({
        secret: "Amir`s secret key",
        saveUninitialized: true,
        cookie: { maxAge: 3600000 },
        resave: false
    }));
app.use(flash());

app.use((req, res, next) => {
    const errors = req.flash("errors");
    const success = req.flash("success");
    const hasError = Boolean(errors.length);
    const hasSuccess = Boolean(success.length);
    let user = null;
    if (req.session.user) {
        user = req.session.user;
        user.avatarURL = gravatar(user.email);
    }
    res.adminRender = (template, options) => {
        options = { ...options, layout: "admin", hasError, hasSuccess, errors, success, user };
        res.render(template, options);
    };
    res.authRender = (template, options) => {
        options = { ...options, hasError, hasSuccess, errors, success };
        res.render(template, options);
    };
    next();
});

app.get("/", (req, res) => {
    if (...) {
        req.flash("success");
    } else {
        req.flash("success")
    }
})
```

---------------------------------------

// default session store is memoryStore.

### 1: connect-redis:
#### redis a no-sql key-value DBMS (database management system).
##### first install redis database on you computer. open terminal:
##### wsl
```
sudo service redis-server start
redis-cli --> 127.0.0.1:6379> --> 127.0.0.1: localhost, 6379: port of DB
```
##### install <<redis manager>> from microsoft store. in connection tab lick on new --> host: 127.0.0.1, port 6379, password:
##### now you can see sessions in db0

### install packages:
```
npm install redis connect-redis
```
```
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

// Initialize client.
let redisClient = createClient();
redisClient.connect().catch();

// Initialize store.
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myApp:",
});

app.use(session({
    store: redisStore(),
    secret: "kl3jkh34g5l5jh645rj5v2",
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    cookie: { maxAge: 60000 },
}));
```

### 2: express-mysql-session: 
##### in big application that its session change multiple times, decrease performance.
```
npm install express-mysql-session
```
```
const session = require("express-session");
const mySQLstore = require("express-mysql-session)(session);
const mySQLOptions = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
};

const sessionStore = new mySQLstore(mySQLOptions);
app.use(cookieParser())
app.use(session({
    store: sessionStore,
    secret: "kl3jkh34g5l5jh645rj5v2",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}));
```
---

### use lodash for handling nested comments
```
npm install lodash
```
```
const _ = require("lodash");
_.groupBy(comments, "parent");
```
---

### sanitize-html: sanitize content of text editor.

---

### text editor: tinymce or ckeditor

---

### express-fileupload:
```
npm install express-fileopload
```
##### [in html form: enctype="multipart/form-data"]()

```
const fileUpload = require("express-fileupload");

```

#### UUID: universal unique identifier
```
npm instal uuid
```
```
const {v4: uuidv4} = require("uuid");
```
```
const path = require("path");

const newFileExt = path.extname(req.files.thumbnail.name);
const newFileName = uuidv4() + newFileExt;

const fileNewPath = path.join(process.cwd(), "public", "upload", "thumbnails", newFileName);

req.files.thumbnail.mv(fileNewPath, (err => {
     console.log(err);
}));
```
---

### sharp for manipulating images (like resize images)
// npm install sharp

```
const sharp = require("sharp");

sharp(addressOfImg)
    .resize(320, 240)
    .rotate()
    .png()
    .toFile("output.webP", (err, result) => ...)
```