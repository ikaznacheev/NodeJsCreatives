const express = require("express");
const bodyParser = require("body-parser");
const multer  = require("multer");
const fs = require("fs");

const archiver = require('archiver');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

const app = express();

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});
 
app.get("/", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/routes/index.html");
});

app.post("/", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
//     console.log(req.body.file);
    // let fileContent = fs.readFile(req.body.file, "utf8");
    // console.log(fileContent);
    res.sendFile(__dirname + `/routes/index.html`);

//     response.send(`${request.body.userName} - ${request.body.userAge}`);
});

const upload = multer({dest:"uploads"});
app.use(express.static(__dirname));
 
app.post("/upload/index.html", upload.single("filedata"), function (req, res, next) {
   
    let filedata = req.file;

    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else{

        const filePathOld = __dirname + `/uploads/${filedata.filename}`
        const filePath = __dirname + `/uploads/index.html`

        fs.rename(filePathOld, filePath, err => {
            if (err) throw err;
            console.log("rename completed!");

            fs.access(filePath, fs.constants.W_OK, (err) => {
                // если произошла ошибка - отправляем статусный код 404
                if (err) {
                  res.statusCode = 404
                  res.end('Resourse not found!')
                } else {
    
                   fs.readFile(filePath, (err, data) => {
                        if(err){
                            console.error(err);
                        } else {
    
                            changePage(data, res, filePath)
    
                        }
                    });
    
                }
            })

        });

    }
});

app.listen(3000);

function changePage(data, res, filePath) {
    const page = data.toString()

    const arrDeleteText = [
        `gwd-events="support"`,
        `gwd-events="handlers"`,
        `gwd-events="registration"`,
        `gwd-served-sizes=""`,
        `<meta data-template-name="gwd-CanvasMinus">\n`,
        `var parametrs = location.href.split('&mt');\n`,
        `var url = getParametr('link');\n`,
        `gwd.actions.gwdGoogleAd.exitOverride("gwd-ad", "cats", url, true, true, "page1");\n`,
    ]

    const arrAddText = [
    {
    old: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    new: `<meta name="ad.size" content="width=100%,height=100%">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">

    <script type="text/javascript" src="https://secure-ds.serving-sys.com/BurstingScript/EBLoader.js"></script>

    <style>
        * {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }
        body {
            margin: 0;
        }
    </style>`
    },
    {
    old: `window.mtSource = e.source;`,
    new: `window.mtSource = window.top;`
    },
    {
    old: `var getParametr = function(elem) {
        for (var i = 0; i < parametrs.length; i++) {
          if (parametrs[i].indexOf(elem) !== -1) {
            return (parametrs[i].split(elem + '=')[1]);
          }
        }
      }`,
    new:`EB.clickthrough();`
    },
    {
    old: `      function handleWebComponentsReady(event) {
        // Start the Ad lifecycle.
        setTimeout(function() {
          gwdAd.initAd();
        }, 0);
      }`,
    new:`
        function handleWebComponentsReady(event) {
            function initEB() {
                if (!EB.isInitialized()) {
                    EB.addEventListener(EBG.EventName.EB_INITIALIZED, startAd);
                } else {
                    startAd();
                }
            }

            initEB()

            function startAd() {
                var gwdAd = document.getElementById('gwd-ad');
                setTimeout(function() {
                    gwdAd.initAd();
                }, 0);
            }
        }`
    },

    ]

    let i = arrDeleteText.length
    let j = arrAddText.length

    deleteText(arrDeleteText, page)

    function deleteText(arr, page) {
        i--;

        if(i == -1){

            addText(arrAddText, page)

            return
        }

        if(page && page.indexOf(arr[i]) !== -1) {
            deleteText(arr, page.replace(arr[i], ('')))
        }else{
            deleteText(arr, page)
        }
    }

    function addText(arr, page) {
        j--;

        if(j == -1){

            writeFile(page)

            return
        }

        if(page && page.indexOf(arr[j].old) !== -1) {
            addText(arr, page.replace(arr[j].old, arr[j].new))
        }else{
            addText(arr, page)
        }
    }

    function writeFile(page){
        fs.writeFile(filePath, page, function(error){ 
            if(error) throw error; // если возникла ошибка

            const file = fs.createReadStream(filePath, {flags:'r', encoding: 'utf8'})    
            sendFile(file, res, filePath)

        });
    }
}

function sendFile(file, res, filePath) {

    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.writeHead(200, {'Content-Type': 'application/html'});


    // res.writeHead(200, {'Content-Type': 'application/html; charset=utf-8'});
    // res.writeHead(200, {'Content-Type': 'application/html'});

    // res.writeHead(200,.
    //     {'Content-Type': 'multipart/form-data; name=index.html'}
    // );
    // res.writeHead(200, {'Content-Type': 'multipart/form-data'});
    
    file.pipe(res)

    file.on('error', function (err) {
        res.statusCode = 500
        res.end('Server Error')
        console.error(err)
    })

    res.on('close', function (){
        file.destroy()
    })

    // fs.unlink(filePath, (err => {
    //     if (err) console.log(err);
    //     else {
    //       console.log(`Deleted file: ${filePath}`);
    //     }
    // }));
}