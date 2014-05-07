// Copyright 2014 Dirk Gadsden.
// MIT Licensed, see LICENSE.txt for details.
var Breq = (function(){
  // Default parameters
  var def = function(param, deflt){
        return (param === undefined) ? deflt : param;
      },
      u = undefined,// Undefined shorthand
      nf = function() {};// None function
  // Utility functions
  var goodStatus = function(xhr, protocol){
        return (
          (xhr.status >= 200 && xhr.status < 300) ||
          (xhr.status == 304) ||
          (xhr.status == 0 && protocol == 'file:')
        )
      },
      parseProtocol = function(path){
        var m = path.match(/^([\w-]+:)\/\//)
        return (m !== null) ? m[1] : window.location.protocol;
      },
      // Naive serializer
      param = function(obj){
        var parts = [], k = null
        for(k in obj){
          parts.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k]))
        }
        return parts.join('&')
      };
  return {
    version: '0.1',
    param:   param,
    request: function(options){
      /*
      OPTIONS:
        method(GET): GET, POST, ...
        url(current URL)
        data(none): string
        timeout(0): integer
        headers(none): object
        async(true): true, false
        beforeSend(none): function(xhr)
        success(none):    function(data, status, xhr)
        error(none):      function(xhr, errorType, error)
        complete(none):   function(xhr, status)
      */
      var method  = def(options.method, 'GET'),
          url     = def(options.url, window.location.toString()),
          data    = def(options.data, null),
          timeout = def(options.timeout, 0),
          headers = def(options.headers, {}),
          async   = def(options.async, true),
          beforeSend = def(options.beforeSend, nf),
          success    = def(options.success, nf),
          error      = def(options.error, nf),
          complete   = def(options.complete, nf);
      // Internals
      var xhr = new XMLHttpRequest(),
          abortTimeout = null,
          protocol = parseProtocol(url),
          h = null;// Used by headers
      xhr.open(method, url, async)
      if(data !== u && method.toUpperCase() != 'GET') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
      for(h in headers) { xhr.setRequestHeader(h, headers[h]) }
      // Call the beforeSend handler and set up the timeout
      if(beforeSend(xhr) === false) { xhr.abort(); return false }
      if(timeout > 0) {
        abortTimeout = setTimeout(function(){
          xhr.onreadystatechange = nf
          xhr.abort()
          error(xhr, 'timeout', null)
        }, timeout)
      }
      // Setup the handler
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          xhr.onreadystatechange = nf
          if(abortTimeout) { clearTimeout(abortTimeout) }
          var result = null
          if(goodStatus(xhr, protocol)){
            result = xhr.responseText
            success(result, 'success', xhr)
          } else {
            error(xhr, xhr.status ? 'error' : 'abort', def(xhr.statusText, null))
          }
        }
      }
      if(typeof data !== 'string') { data = param(data) }
      // Send the request and return the XHR object
      xhr.send(data)
      return xhr
    }//request(options)
  }//return {}
})();
