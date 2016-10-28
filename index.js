var is = require('is');

exports.createSandbox = function(done, defaultTimeout) {
  if (1 == arguments.length) {
    if (is.number(done)) {
      /* createSandbox(defaultTimeout) */
      defaultTimeout = done;
    }
  }
  /* a function bind with done and timeout */
  return function(fn, timeout) {
    if (!is.fn(fn)) {
      throw new Error('Parameter wrong: fn should be a function');
    }
    if (!is.number(timeout)){
      timeout = defaultTimeout;
    }
    var called = false;
    /* start timeout */
    var timeoutHandle = null;
    if (is.number(timeout)) {
      timeoutHandle = setTimeout(function(){
        if (!called) {
          called = true;
          fn(new Error('Timeout:'+fn.name+' callback is timeout.'));
        }
      }, timeout);
    }
    /* wrap fn */
    return function() {
      try{
        fn.apply(this, Array.from(arguments));
        called = true;
      }catch(e) {
        if (is.fn(done) && !called){
          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
          }
          called = true;
          done(e);
        }
      }
    }
  }
};