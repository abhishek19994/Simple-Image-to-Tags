var http=require('http')
var request=require('request');
var express=require('express')
var path=require('path');
var bodyParser=require('body-parser');
var app=express();
var fs=require('fs')
var engine=require('ejs-mate');
var fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(bodyParser.json());
var url = require('url');
var apiKey = 'acc_81e52491eb5b77b',
    apiSecret = '9994198225ed1ec9abd819b273de2aa3';

app.engine('ejs',engine);
app.set('view engine', 'ejs');

console.log(path.join(__dirname,"./uploads"))

var check=(data)=>{
	var re=[];
	var tags_array=['mountain', 'beach', 'wildlife', 'architecture', 'flowers','highland','hill','religion','monument']
for(var i=0;i<data.length;i++)
  {
  	if(tags_array.includes(data[i].tag.en) && data[i].confidence>50){
  		re.push(data[i].tag.en)
  	}
  }
  return re;

}

app.get("/", express.static(path.join(__dirname, "./public")));

app.post('/post',(req,res)=>{
console.log(req.body)
request.get('https://api.imagga.com/v2/tags?image_url='+req.body.link, function (error, response, body) {
// console.log(body)
var data=JSON.parse(JSON.parse(JSON.stringify(body))).result.tags;


 res.render('./image_tags',{data:check(data)})
}).auth(apiKey, apiSecret, true);


})


  app.post('/upload',(req,res)=>{
  	//var absolutePath = path.resolve();
  	// console.log(req.files)
    formData = {
        image: fs.createReadStream(req.files.fileName.name)
    };

   console.log(formData);
request.post({url:'https://api.imagga.com/v2/uploads', formData: formData},
    function (error, response, body) {
       var upload_id=JSON.parse(body).result.upload_id
        
       
        request.get('https://api.imagga.com/v2/tags?image_upload_id='+upload_id, function (error, response, bodies) {
  var data=JSON.parse(JSON.parse(JSON.stringify(bodies))).result.tags;
  
    res.render('./image_tags',{data:check(data)})
}).auth(apiKey, apiSecret, true);

            }).auth(apiKey, apiSecret, true);})

  
app.listen(3000,()=>{console.log('Server is running on 3000')})