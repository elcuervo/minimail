var inbox = node("inbox");
var MailParser = node("mailparser").MailParser;
var Q = require("q");

var Mailbox = function(user, pass) {
  var client = inbox.createConnection(false, "imap.gmail.com", {
    secureConnection: true,
    auth: { user: user, pass: pass }
  });

  var eventually = function(cb) {
    return function(item) { item.then(cb); };
  };

  var connect = function() {
    var deferred = new Q.defer();

    client.connect();

    client.on("connect", function(){
      client.openMailbox("INBOX", function(error, info){
        if(error) throw error;
        console.log("Message count in INBOX: " + info.count);
        deferred.resolve(info);
      });

    });

    return deferred.promise;
  }

  var getMessages = function(info) {
    var deferred = new Q.defer();

    client.listMessages(-10, function(err, messages) {
      var emails = [];

      messages.forEach(function(message){
        var deferredEmail = new Q.defer();
        var mailparser = new MailParser();

        mailparser.on("end", function(mail) { deferredEmail.resolve(mail); });

        var messageStream = client.createMessageStream(message.UID);
        var buffers = [];

        messageStream.on("data", function(b) { buffers.push(b); })
        messageStream.on("end", function() {
          var content = Buffer.concat(buffers);
          mailparser.write(content.toString());
          mailparser.end();
        });

        emails.push(deferredEmail.promise);
      });

      deferred.resolve(emails);

    });

    return deferred.promise;
  }

  this.getMessages = function(fn) {
    connect().then(getMessages).then(function(emails) {
      emails.forEach(eventually(fn))
    })
  }

}

Mailbox.prototype = {
  read: function(fn) {
    this.getMessages(fn);
  }
}

module.exports = Mailbox;
