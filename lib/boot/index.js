var Mailbox = require("mailbox");
var dom = require("dom");

var form = dom("#login-form");

form.on("submit", function(e) {
  e.preventDefault();

  var user = dom("#email-user").val();
  var pass = dom("#email-pass").val();

  var mailbox = new Mailbox(user, pass);

  var addEmail = function(em) {
    console.log(em)
  }

  mailbox.read(addEmail)
});
