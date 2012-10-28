/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global require, process, module, ObjectID */

module.exports = function( app ) {
  var routes = {
    set: function () {

      app.get( '/', function (req, res) {
        res.redirect( '/spa.form.html' );
      });
    }
  };

  return routes;
};
