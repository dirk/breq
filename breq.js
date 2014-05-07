// (MIT License)
// 
// Copyright (c) 2014 Dirk Gadsden
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
      };
  return {
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
      // Send the request and return the XHR object
      xhr.send(data)
      return xhr
    }//request(options)
  }//return {}
})();
