const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

const port=2000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));


app.listen(port || process.env.PORT ,function(){
    console.log("port: "+port);
})

app.get('/',function(req, res){
    res.sendFile(__dirname + "/index.html")
}); 

app.post('/',function(req,res){

    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    const _email = req.body.email;

    const data = { //we got this structure from the documentation of the mailchimps api
        members:[{
            email_address: _email,
            status: "subscribed",
            merge_fields:{
                FNAME:first_name,
                LNAME: last_name
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    //documentation rules ->>
    const url = 'https://us21.api.mailchimp.com/3.0/lists/c2f844a366'
    const options = {
        method: "POST",
        auth:"amir:7b57bdbdfdb5ebd5869bce8e253fd336-us21"
    }


    const request = https.request(url,options,function(response){

        response.on("data",function(data){
            parsedJSONdata = JSON.parse(data);
            console.log(parsedJSONdata.errors);


            if (parsedJSONdata.errors.length===0) {
                res.sendFile(__dirname + "/success.html");
            } else { res.sendFile(__dirname + "/error.html") }
        }); 
    });

    request.write(jsonData);
    request.end();
    

    console.log(first_name,last_name,_email);
});

app.post("/error",function(req,res){
    res.redirect("/")
})


// mailchip
// api key
// 7b57bdbdfdb5ebd5869bce8e253fd336-us21

//list id
//c2f844a366