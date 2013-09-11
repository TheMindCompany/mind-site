var email = require('nodemailer');

var smtp = email.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "secret@gmail.com",
       pass: "secret"
   }
});

module.exports.mail = function(semail, sname, sub, content, cb) {
  smtp.sendMail({
     from: "Website <themindco@gmail.com>", // sender address
     to: "Owner <bclark@themindspot.com>", // comma separated list of receivers
     subject: sub, // Subject line
     text: sname + " <" + semail + ">   \n\n" + content // plaintext body
  }, function(error, response){
     if(error){
         cb(error);
     }else{
         cb(null);
     }
  });
};
