var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {
  registerUser: function (formData, callback) {
    
    var userName = formData.firstname +" "+ formData.lastname;
    var randomPickNo = Math.floor(Math.random() * Math.floor(100));
    var responseData = {};
    var profilePic = "https://randomuser.me/api/portraits/men/"+randomPickNo+".jpg";

    query_check = `select * from messbox.register where \`EMAIL\` = '${formData.email}' or \`USERNAME\` = '${userName}'`;
    
    con.query(query_check, function (err,result) {
        if (err) {
          console.log(err);
          throw err;
          }

        if(result.length > 0)
        {
          responseData.error = err;
          responseData.FLAG = "USER_ALREADY_EXIST";
          responseData.message = 'User Exists';
          callback(responseData);
          return;
        }
        
          query = `INSERT INTO messbox.register( \`USERNAME\`, \`FIRST_NAME\`, \`LAST_NAME\`, \`EMAIL\`, \`PHONE\`, \`PASSWORD\`, \`PROFILE_PIC\`) 
                    VALUES ('${userName}','${formData.firstname}','${formData.lastname}','${formData.email}','${formData.phone}','${formData.password}','${profilePic}')`;
          con.query(query, function (err, result1) {
            console.log(result1);
            try{
              if (err) {
                responseData.FLAG = 'ERROR_DB_PROFILE';
                callback(responseData);
                return;
              } 
                responseData.user = {
                  USERNAME: userName,
                  FIRST_NAME:formData.firstname,
                  LAST_NAME:formData.lastname,
                  ID:result1.insertId,
                  EMAIL:formData.email,
                  PHONE:formData.phone,
                  PROFILE_PIC:profilePic
                };
                responseData.FLAG = 'PROFILE_CREATED';
                callback(responseData);
            } catch(err) {
              console.log(err);
            }
      });
    
  });
},

  loginUser: function(formData, callback){

    query3 = `SELECT * FROM messbox.register where USERNAME='${formData.username}' and password='${formData.password}'  LIMIT 1;`;
    var responseLogin = {};
    con.query(query3,function(err2, result2){
    console.log(result2);

      if(err2){
        responseLogin.FLAG = 'ERROR';
        responseLogin.error = err2;
        responseLogin.message = 'User doesn\'t exist';
        callback(responseLogin);
        return;
      }
      if(result2 && result2.length) {
          responseLogin.FLAG = 'USER_EXIST';
          responseLogin.user = result2[0];
          callback(responseLogin);
      } else {
        responseLogin.FLAG = 'USER_NOT_EXIST';
        responseLogin.error = err2;
        responseLogin.message = 'User doesn\'t exist';
        callback(responseLogin);
      }
    });
  },

  deleteUser: function(formData, callback){
    var id  =  formData.ID;
    var delResponse = {};
    con.query('DELETE FROM messbox.register WHERE ID = ?', id , (err, result) => {
        if (err) {
          delResponse.status = 400;
          delResponse.error = err;
          delResponse.message = 'Could not delete user account, try again!!!';
          callback(delResponse);
        } else {
          delResponse.status = 200;
          delResponse.user = result[0];
          delResponse.message = "User account deleted";
          callback(delResponse);
        }
  });
},

getMessages: function(formData, callback){
  var id = formData.ID;
  var messages = {};
  console.log(id);

  query_message = `select * from messbox.messages where RECIEVER_ID = '${id}'`;
  console.log(query_message);
  con.query(query_message, function (err, result) {
    console.log(result);
    try{
      if(err){
        messages.error = err;
        messages.FLAG = 'NO_MESSAGE';
        callback(messages);
        return;
      } 
        messages.messages = result;
        messages.FLAG = 'MESSAGES_EXIST';
        callback(messages);

    }catch(err){
      console.log(err);
    }
  });
},

updateMessages: function(formData, callback){
  var response = {};
  query_message = `update messbox.messages SET MESSAGE_READ = 1 where ID = ${formData.MSG_ID} and RECIEVER_ID = ${formData.USER_ID}` ;
  console.log(query_message);
  con.query(query_message, function (err, result) {
    console.log(result);
    try{
      if(err){
        response.error = err;
        response.FLAG = 'MSG_UPDATE_ERROR';
        callback(response);
        return;
      } 
        response.FLAG = 'MSG_UPDATED';
        callback(response);

    }catch(err){
      console.log(err);
    }
  });
},

displayProfile: function (formData, callback) {
  query3 = `SELECT NAME, PICTURE, ADDRESS,PHONE FROM messbox.messages where ID='${formData.MSG_ID}'`;
  var responseLogin = {};
  console.log(query3);
  con.query(query3,function(err2, result2){
  console.log(result2);

    if(err2){
      responseLogin.FLAG = 'ERROR';
      responseLogin.error = err2;
      responseLogin.message = 'User doesn\'t exist';
      callback(responseLogin);
      return;
    }
    if(result2 && result2.length) {
        responseLogin.FLAG = 'USER_EXIST';
        responseLogin.user = result2[0];
        callback(responseLogin);
    } 
  });
  
},

deleteMessage: function (formData, callback) {
  var response = {};
  query_message = `delete from messbox.messages where ID = ${formData.MSG_ID} and RECIEVER_ID = ${formData.USER_ID}` ;
  console.log(query_message);
  con.query(query_message, function (err, result) {
    console.log(result);
    try{
      if(err){
        response.error = err;
        response.FLAG = 'MSG_UPDATE_ERROR';
        callback(response);
        return;
      } 
        response.FLAG = 'MSG_DELETED';
        response.id = formData.MSG_ID;
        callback(response);

    }catch(err){
      console.log(err);
    }
  });
  }
};

return module.exports;




