// promisify specify() for the old Promise A+ testing suite that uses deprecated done()
import { it as _specify } from 'vitest';
export function specify(title, testFunction) {
  return _specify(title, function() {
    return new Promise(function(resolve, reject) {
      if (testFunction.length > 0) {
        try {
          testFunction(function(err) {
            if (err) {
              reject(err)
            } else {
              resolve();
            }
          });
        } catch (e) {
          reject(e)
        }
      } else {
        try {
          testFunction();
          resolve()
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}