//sudo netstat -lpn |grep :3000
//sudo kill -9 8047(PID
var port=3000;
var express   =    require("express");
var mysql     =    require('mysql');
var logger = require('morgan');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'sairam',
    database : 'SMIP',
    debug    :  false
});

var app       =    express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

//app.use('/', require('./routes/index')); //added


var mail_settime;
var mail_tempvalue;
var mail_inclivalue;





function time(){
var now     = new Date(); 
 var epoch= Date.now();
 
 var year    = now.getFullYear();
 var month   = now.getMonth()+1;
 var day     = now.getDate(); 
 var hour    = now.getHours();
 var minute  = now.getMinutes();
 var second  = now.getSeconds(); 
 var millis  = now.getMilliseconds();

if(month.toString().length == 1) {
 month = '0'+month;
 }
 if(day.toString().length == 1) {
 day = '0'+day;
 }   
 if(hour.toString().length == 1) {
  hour = '0'+hour;
 }
 if(minute.toString().length == 1) {
  minute = '0'+minute;
 }
 if(second.toString().length == 1) {
  second = '0'+second;
 }
 //if(millis.toString().length == 1) {
 //var millis = '0'+millis;
 //}
return timestamp = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second; //+':'+millis;


};




app.get("/",function(req,res){
        pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("SELECT * from Temperature_table",function(err,rows){
            console.log(rows);
            
            if(!err) {
                res.send(JSON.stringify(rows));
            }       
            connection.release();    
        
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
        //res.sendFile(__dirname+'/public/index.html');
});



app.get("/senor_data",function(req,res){
        pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("SELECT * from sensor_data_table ",function(err,rese){
            //console.log(rese);
            
            if(!err) {
                res.send(JSON.stringify(rese));

            }       
            connection.release();    
        
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
        //res.sendFile(__dirname+'/public/index.html');

});




app.get("/setting",function(req,res){

        console.log("from get");
        

        
        var condition={id_value:"1"};

        pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query('select * from threshold_table WHERE ?', condition,function(err,rows){
        console.log(rows);
            
            if(err) {
                res.json(err);
            }       
            else{
              //res.json({"error": false});
              res.json(rows);
            }
            connection.release();    
        });
        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     });
  });
        res.setHeader('Content-Type', 'text/plain');
        //res.end('Something broke');
        //res.sendFile(__dirname+'/public/index.html');
});


app.put("/setting/edit",function(req,res){

        console.log("from put");



        this.mail_settime= time();
        this.mail_tempvalue=req.body.tempValue;
        this.mail_inclivalue=req.body.incliValue;

        var settime= time();
        var tempvalue=req.body.tempValue;
        var inclivalue=req.body.incliValue;
        var condition={id_value:"1"};

        var tempValue= ''+ tempvalue +'' ;
        var incliValue= ''+ inclivalue + '' ;
        
        //var tempValue=tempvalue;
        //var incliValue=inclivalue;

        console.log(tempValue);
        console.log(incliValue);


        var createThreshold={
        id_value:1,
        temperature_value:tempValue,
        inclination_value:incliValue,
        date_time: settime

      }

        console.log(createThreshold);

        pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query('UPDATE threshold_table set ? WHERE ?', [createThreshold,condition],function(err,rows){
        console.log(rows);
            
            if(err) {
                res.json(err);
            }       
            else{
              //res.json({"error": false});
              res.json(rows);
            }
            connection.release();    
        });
        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     });
  });
        res.setHeader('Content-Type', 'text/plain');
        //res.end('Something broke');
        //res.sendFile(__dirname+'/public/index.html');
});



app.post("/setting",function(req,res){

        console.log("from post");
        
        var settime= time();
        var tempvalue=req.body.tempValue;
        var inclivalue=req.body.incliValue;

        //var tempValue= '"' + tempvalue + '"' ;
        //var incliValue= '"' + inclivalue + '"' ;

        var tempValue=tempvalue;
        var incliValue=inclivalue;

        console.log(tempValue);
        console.log(incliValue);


        var createThreshold={
        id_value:1,
        temperature_value:tempValue,
        inclination_value:incliValue,
        date_time: settime

      }
        console.log(createThreshold);

        pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query('INSERT INTO threshold_table set ?', createThreshold,function(err,rows){
        console.log(rows);
            
            if(err) {
                res.json(err);
            }       
            else{
              //res.json({"error": false});
              res.json(rows);
            }
            connection.release();    
        });
        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     });
  });
        res.setHeader('Content-Type', 'text/plain');
        //res.end('Something broke');
        //res.sendFile(__dirname+'/public/index.html');
});




                    ///////////for sending mail///////////////////


console.log("getting data in other function");
        console.log(this.mail_settime);
        console.log(this.mail_tempvalue);
        console.log(this.mail_inclivalue);
























function redirectRouter(req,res){
  res.sendFile(__dirname+'/dist/index.html');
}

app.use(redirectRouter);











app.listen(port);

console.log('Listening on localhost port '+port);




module.exports = app;//added


//USE SMIP;
//select * from Temperature_table WHERE mac='3s-ds-23-sf-23-ce-32';

//WHERE mac='3s-ds-23-sf-23-ce-32'
