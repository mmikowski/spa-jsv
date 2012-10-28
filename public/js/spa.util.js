/**
 *   sl.util.js
 *   Javascript utilities which do not require a browser
 *
 *   Michael S. Mikowski - mmikowski@snaplogic.com
 *   These are routines I have created and updated
 *   since 1998, with inspiration from around the web.
 *   MIT License.
 *
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
*/

/*global $, sl */

spa.util = (function (){
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      regex_tmplt : /%!%([^%]+)%!%/g
    },
    fillTemplate, getCommaNumString, getListDiff,
    getNumSign, getVarType, getUcFirst, makeError,
    checkMatchVal, removeListVal, pushUniqVal, makeListPlus,
    makeGuidPart, makeGuidString,
    setConfigMap
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  /*jslint bitwise : true */
  makeGuidPart = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  /*jslint bitwise : false */
  //-------------------- END UTILITY METHODS -------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public utility /fillTemplate/
  fillTemplate = function ( arg_map ){
    var
      input_string = arg_map.input_string,
      lookup_map   = arg_map.lookup_map
      ;

    return input_string.replace(
      configMap.regex_tmplt,
      function ( match, name ) {
        var rv = name && lookup_map;
        $.each(name.split('.'), function( i, ename ) {
          rv = rv && rv[ename];
        });
        return (rv === undefined) ? '' : rv;
      }
    );
  };
  // End public utility /fillTemplate/

  // Begin public utility /getCommaNumString/
  getCommaNumString = function ( num ){
    var s_num;
    if ( num > 10000 ){
      return String(parseInt( (num / 1000), 10 )) + 'K';
    }
    s_num = String(parseInt( num, 10 ));
    return s_num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  };
  // End public utility /getCommaNumString/

  // Begin public utility /getListDiff/
  getListDiff = function ( first_list, second_list ){
    return first_list.filter(
      function (i) { return second_list.indexOf(i) === -1; }
    );
  };
  // End public utility /getListDiff/

  // Begin public utility /getNumSign/
  getNumSign = function ( n ){
    if ( isNaN(n) ){ return NaN; }
    if ( n < 0 ){ return -1; }
    return 1;
  };
  // End public utility /getNumSign/

  // Begin public utility /getUcFirst/
  getUcFirst = function ( s_input_in ) {
    var
      s_input = String(s_input_in),
      f   = s_input.charAt(0).toUpperCase()
      ;

    return f + s_input.substr(1);
  };
  // End public utility /getUcFirst/

  // Begin public utility /getVarType/
  // Returns 'Object', 'Array', 'String', 'Number', 'Boolean', 'Undefined'
  getVarType = function ( data ){
    if (undefined === data ){ return 'Undefined'; }
    if (data === null ){ return 'Null'; }
    return {}.toString.call(data).slice(8, -1);
  };
  // End public utility /getVarType/

  // Begin Public constructor /makeError/
  // Purpose: a convenience wrapper to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  makeError = function ( name_text, msg_text, data ) {
    var error = new Error();
    error.name = name_text;
    if ( msg_text ) { error.description = msg_text; }
    if ( data ){ error.data = data; }

    return error;
  };
  // End Public constructor /makeError/

  // Begin utiltity /makeListPlus/
  // Returns an array with much desired methods:
  //   * remove_val(value) : remove element that matches
  //     the provided value. Returns number of elements
  //     removed.
  //   * match_val(value)  : shows if a value exists
  //   * push_uniq(value)  : pushes a value onto the stack
  //     iff it does not already exist there
  // Note: the reason I need this is to compare objects to
  //   objects (perhaps jQuery has something similar?)
  checkMatchVal = function ( data ){
    var match_count = 0, idx;
    for ( idx = this.length; idx; 0 ){
      if ( this[--idx] === data ){ match_count++; }
    }
    return match_count;
  };
  removeListVal = function ( data ){
    var removed_count = 0, idx;
    for ( idx = this.length; idx; 0 ){
      if ( this[--idx] === data ){
        this.splice(idx, 1);
        removed_count++;
        idx++;
      }
    }
    return removed_count;
  };
  pushUniqVal = function ( data ){
    if ( checkMatchVal.call(this, data ) ){ return false; }
    this.push( data );
    return true;
  };
  // primary utility
  makeListPlus = function ( input_list ){
    if ( input_list && $.isArray(input_list) ){
      if ( input_list.remove_val ){
        console.warn('The array appears to already have listPlus capabilities');
        return input_list;
      }
    }
    else {
      input_list = [];
    }
    input_list.remove_val = removeListVal;
    input_list.match_val  = checkMatchVal;
    input_list.push_uniq  = pushUniqVal;

    return input_list;
  };
  // End utility /makeListPlus/

  makeGuidString = function (){
    return makeGuidPart() + makeGuidPart()
      + '-' + makeGuidPart()
      + '-' + makeGuidPart()
      + '-' + makeGuidPart()
      + '-' + makeGuidPart() + makeGuidPart() + makeGuidPart()
      ;
  };

  // Begin Public method /setConfigMap/
  // Purpose: Common code to set configs in feature modules
  // Arguments:
  //   * input_map    - map of key-values to set in config
  //   * settable_map - map of allowable keys to set
  //   * config_map   - map to apply settings to
  // Returns: true
  // Throws : Exception if input key not allowed
  //
  setConfigMap = function ( arg_map ){
    var
      input_map    = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map   = arg_map.config_map,
      key_name, error;

    for ( key_name in input_map ){
      if ( input_map.hasOwnProperty( key_name ) ){
        if ( settable_map.hasOwnProperty( key_name ) ){
          config_map[key_name] = input_map[key_name];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key_name + '| is not supported'
          );
          console.error(error);
          throw error;
        }
      }
    }
  };
  // End Public method /setConfigMap/

  return {
    fillTemplate      : fillTemplate,
    getCommaNumString : getCommaNumString,
    getListDiff       : getListDiff,
    getNumSign        : getNumSign,
    getUcFirst        : getUcFirst,
    getVarType        : getVarType,
    makeError         : makeError,
    makeGuidString    : makeGuidString,
    makeListPlus      : makeListPlus,
    setConfigMap      : setConfigMap
  };
  //------------------- END PUBLIC METHODS ---------------------
}());

