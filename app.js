//REQUIREMENTS
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const request = require("request");
const app=express();

//VARIABLES
let states;
let districts;
let statecode;
let statename;
let country;
let selectedstate;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());

app.get("/",function(req,res) {
  res.sendFile(__dirname+"/index.html")
})

app.get("/select-state",function(req,res) {
  let url="https://api.covid19india.org/data.json";
  request.get(url,function(error,response,body) {
    states=JSON.parse(body);
    res.render("selectstate",{states:states});
  })
})

app.get("/country",function(req,res) {
  let url3="https://api.covid19api.com/summary";
  request.get(url3,function(error,response,body) {
    country=JSON.parse(body);
    // console.log(country.Global.TotalConfirmed);
    res.render("country",{countries:country});
    // res.render("state",{states:states});
  })
})

app.get("/state-details",function(req,res) {
  console.log(statename);
  let confirmed,recovered,deaths;


  var url2='https://api.covid19india.org/state_district_wise.json';

  request.get(url2, function (error, response,body) {
  	let district=JSON.parse(body);
    for(let i=0;i<states.statewise.length;i++) {
      if(states.statewise[i].state===statename) {
        confirmed=states.statewise[i].confirmed;
        recovered=states.statewise[i].recovered;
        deaths=states.statewise[i].deaths;
        break;
      }
    }
    res.render("district",{dis:district[statename],districtNames:( Object.keys(district[statename].districtData) ),statename:statename,confirmed:confirmed,deaths:deaths,recovered:recovered});
  });
})

app.post("/", function(req,res) {
  let btn=req.body.btn;
  if(btn=="state")
    res.redirect("/select-state");
  else
    res.redirect("/country");
})

app.post("/select-state",function(req,res) {
  statename=req.body.statepick;
  console.log(statename);
  res.redirect("/state-details");
})
app.listen(process.env.PORT || 3000, function() {
  console.log("Server running at port 3000");
})
