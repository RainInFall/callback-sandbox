# callback-sandbox
A function wrapper to avoid exception pop to top, or callback when timeout

## Installation
```bash
$ npm install callback-sandbox
```

## Example
```javascript
var sandbox = createSandbox(function onError(err){
  //Handle error
  console.log(err);//something wrong
}, 2000/*timeout*/);

setTimeout(sandbox(function(err){
  throw new Error("something wrong");
}, 1000);
```

## API
### createSandbox([onError][timeout])
* **onError** Call whem an unhandle exception occur in sandbox
* **timeout** Default timeout of sandbox

Create a sandbox.


### sandbox(fn, [timeout])
* **fn** Function to run in the sandbox
* **timeout** Timeout for this run.
Run function in sandbox and start timeout.
