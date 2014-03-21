var Mail = function(options) {
  this.date    = options["date"];
  this.from    = options["from"];
  this.to      = options["to"];
  this.subject = options["subject"];
  this.body    = options["body"];
}

module.exports = Mail;
