var expect = require('expect');
var createSandbox = require('../').createSandbox;

describe('createSandbox', function() {
  it('should return a function', function(){
    var sandbox = createSandbox(function(err){ expect.assert('should not be here.'); });
    expect(sandbox).toBeA('function');
  });

  it('cloud take (timeout) as input', function(done){
    this.timeout(5000);

    var sandbox = createSandbox(1000);

    var fn = sandbox(function(){
      expect.assert('should not be here')
    });
    
    setTimeout(fn, 1500);
    setTimeout(done, 2000);
  });
});

describe('sandbox', function() {
  it('should not taken a non-function parameter', function() {
    var sandbox = createSandbox();
    expect(function(){
      sandbox(1);
    }).toThrow(/Parameter wrong/);
  });

  it('should call throgh', function() {
    var called = false;
    var sandbox = createSandbox();
    var fn = sandbox(function(){
      called = true;
    });
    expect(called).toBe(false);
    fn();
    expect(called).toBe(true);
  });

  it('should block throw', function() {
    var sandbox = createSandbox();
    var fn = sandbox(function(){
      throw new Error('something wrong happen');
    });
    expect(fn).toNotThrow();
  });

  it('should callback when timeout', function(done) {
    this.timeout(5000);

    var called = false;
    var sandbox = createSandbox(function(err){
      called = true;
      expect(err).toBeAn(Error);
      expect(err.message).toMatch(/Timeout/);
      done();
    }, 2000);
    var fn = sandbox(function(){});
    setTimeout(function(){
      expect(called).toBe(false);
    },1000);
  });

  it('should block second call', function(){
    var called = false;
    var sandbox = createSandbox();
    var fn = sandbox(function(){
      expect(called).toBe(false);
      called = true;
    });
    expect(called).toBe(false);
    fn();
    expect(called).toBe(true);
    fn();
  });

  it('should block timeout after being called', function(done){
    this.timeout(5000);

    var called = false;

    var sandbox = createSandbox(function(){
      expect.assert('shoue not be here');
    }, 1000);

    var fn = sandbox(function(){
      expect(called).toBe(false);
      called = true;
    });
    
    expect(called).toBe(false);
    fn();
    setTimeout(done, 2000);
  });

  it('should block being called after timeout', function(done){
    this.timeout(5000);

    var called = false;

    var sandbox = createSandbox(function(err){
      expect(called).toBe(false);
      expect(err).toBeAn(Error);
      expect(err.message).toMatch(/Timeout/);
      called = true;
    }, 1000);

    var fn = sandbox(function(){
      expect.assert('should not be here')
    });
    
    expect(called).toBe(false);
    setTimeout(fn, 2000);
    setTimeout(done, 3000);
  });

  it('could overwrite default when wrap function', function(done){
    this.timeout(5000);

    var sandbox = createSandbox(1000);
    /* default timeout */
    var fn0 = sandbox(function(){
      expect.assert('should not be here')
    });
    
    setTimeout(fn0, 1500);
    /* overwrite timeout */
    var called = false;
    var fn1 = sandbox(function(){
      expect(called).toBe(false);
      called = true;
    }, 2000);
    
    setTimeout(fn1, 1500);
    setTimeout(function(){
       expect(called).toBe(true);
       done();
    }, 3000);
  });

});