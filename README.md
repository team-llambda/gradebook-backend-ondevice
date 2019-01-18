# The Real Gradebook Backend

## Install
Build from `tsconfig.json`.

No dependencies required, browser support requires ECMA6 (aka ECMA2015).

## How to use
- Currently, there is only support for the `Gradebook` method.
- All requests returns a Promise.

```js
const services = new EDUPoint.PXPWebServices("USERID", "PASSWORD", "BASEURL")
services.getGradebook().then(gradebook => {
    console.log(gradebook)          // <==== gradebook is an instance of Gradebook.
}).catch(error => {
    console.log(error)
})
```

## Legal
```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```