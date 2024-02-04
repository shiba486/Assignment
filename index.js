const multer = require('multer')
const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 5500;
const localhost = "127.0.0.1";

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "./uploads")
    },
    filename: function(req,file,cb){
        const name = Date.now() +  "-" + file.originalname;
        cb(null, name)
    }
})

const upload = multer({storage: storage}).array('myfile',5)

//server
const server = http.createServer((req,res)=>{
    //common function for handleFile
    function handleFile(statusCode,content){
        res.writeHead(statusCode,{'content-type':'text/plain'});
        res.write(content)
        res.end();
    }
    //home route
    if(req.url==="/"){
        handleFile(200,"This is Home Page")
    }
    //about route
    else if(req.url ==="/about"){
        handleFile(200,"This is About Page")
    }
    //contact route
    else if(req.url ==="/contact"){
        handleFile(200,"This is Contact Page")
    }
    //file create route
    else if(req.url === "/file-write"){
        fs.writeFile("demo.txt", "hello world",(error)=>{
            if(error){
                console.log(error);
            }else{
                console.log("File Create Successfully");
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("File Successfully Created");
            }
            res.end();
        })
    }
    //file upload route
    else if(req.method == "POST" && req.url === "/uploads" ){
          // Handle file upload using Multer
    upload(req, res, function (error) {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end("File Upload Fail");
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end("File Upload Successfully");
        }
      });
       
    }

      // default error route
  else {
    handleFile(404,"404 Not Found")
  }
    
})

server.listen(PORT,localhost,()=>{
    console.log(`The server is running successfully At = http://${localhost}:${PORT}`);
})
