const request = require('request');
const express = require('express')
const app = express();
const port = 3000;

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount = require('./key.json')

initializeApp({
    credential: cert(serviceAccount)
});

const db=getFirestore();

app.set("view engine","ejs")
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/signup', (req, res) => {
    res.render("signup");
  })
app.get('/signupsubmit',(req,res)=>{
  const Name=req.query.Name;
    
  const Email=req.query.email;
    const Password=req.query.Password;

    db.collection('users').add({
      Name:Name,
      Email:Email,
      Password:Password
    }).then(() =>{
      res.render("signin");
    })
});
  app.get('/signin', (req, res) => {
    res.render("signin");
  })
  app.get('/signinfail',(req,res)=>{
    res.render("signinfail");
  })
app.get('/signinsubmit',(req,res) =>{
  const Email=req.query.email;
    const Password=req.query.password;
     db.collection("users")
     .where("Email","==",Email)
     .where("Password","==",Password)
     .get()
     .then((docs) =>{
      if(docs.size> 0){
        res.render("Number");
      }
      else{
        res.render("signinfail");
      }
     });
});

app.get('/numbersubmit',(req,res) =>{
  const number = req.query.number;
  console.log(number);

  request.get({
    url: 'https://api.api-ninjas.com/v1/validatephone?number=' + number,
    headers: {
      'X-Api-Key': 'mn+Sw1nweghwZSmNpfWEDQ==sOlpxZFZPIuyP766'
    },
  }, function (error, response, body){
      if("error" in JSON.parse(body))
      {
        if((JSON.parse(body).error.code.toString()).length > 0)
        {
          res.render("Number");
        }
      }
      else
      {
        const is_valid= JSON.parse(body).is_valid;
        const is_formatted_properly= JSON.parse(body).is_formatted_properly;
        const country = JSON.parse(body).country;
        const location= JSON.parse(body).location;
        const timezones= JSON.parse(body).timezones;
        const format_national= JSON.parse(body).format_national;
        const format_international=JSON.parse(body).format_international;
         const format_e164=JSON.parse(body).format_e164;
         const country_code=JSON.parse(body).country_code;
        
        
       res.render('title',{
  is_valid:is_valid,
  is_formatted_properly:is_formatted_properly,
  country:country,
  location:location,
  timezones: timezones,
  format_national:format_national,
  format_international:format_international ,
  format_e164: format_e164,
  country_code:country_code,
  
});
        
      } 
    }
    );
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})