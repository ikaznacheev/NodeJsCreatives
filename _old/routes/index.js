var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

    res.send(
      `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Регистрация</title>
            <meta charset="utf-8" />
        </head>
        <body>
            <h1>Введите данные</h1>
            <form action="/" method="post">
                <label>Имя</label><br>
                <input type="text" name="userName" /><br><br>
                <label>Возраст</label><br>
                <input type="number" name="userAge" /><br><br>
                <input type="submit" value="Отправить" />
            </form>
        </body>
        </html>
      `
    );

  // res.download()
});



// router.get('/', function(req, res){
//   res.send('<ul>'
//     + '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
//     + '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
//     + '<li>Download <a href="/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>'
//     + '</ul>');
// });

// router.get('/files/:file(*)', function(req, res, next){
//   var filePath = path.join(__dirname, 'files', req.params.file);

//   res.download(filePath, function (err) {
//     if (!err) return; // file sent
//     if (err.status !== 404) return next(err); // non-404 error
//     // file for download not found
//     res.statusCode = 404;
//     res.send('Cant find that file, sorry!');
//   });
// });

// /* istanbul ignore next */
// if (!module.parent) {
//   router.listen(3000);
//   console.log('Express started on port 3000');
// }

module.exports = router;
