!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.WHATWGFetch={})}(this,(function(t){"use strict";var e="undefined"!=typeof globalThis&&globalThis||"undefined"!=typeof self&&self||void 0!==e&&e,r="URLSearchParams"in e,n="Symbol"in e&&"iterator"in Symbol,o="FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(t){return!1}}(),i="FormData"in e,s="ArrayBuffer"in e;if(s)var a=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],u=ArrayBuffer.isView||function(t){return t&&a.indexOf(Object.prototype.toString.call(t))>-1};function c(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(t)||""===t)throw new TypeError('Invalid character in header field name: "'+t+'"');return t.toLowerCase()}function f(t){return"string"!=typeof t&&(t=String(t)),t}function l(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return n&&(e[Symbol.iterator]=function(){return e}),e}function h(t){this.map={},t instanceof h?t.forEach((function(t,e){this.append(e,t)}),this):Array.isArray(t)?t.forEach((function(t){this.append(t[0],t[1])}),this):t&&Object.getOwnPropertyNames(t).forEach((function(e){this.append(e,t[e])}),this)}function p(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function d(t){return new Promise((function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}}))}function y(t){var e=new FileReader,r=d(e);return e.readAsArrayBuffer(t),r}function b(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function v(){return this.bodyUsed=!1,this._initBody=function(t){var e;this.bodyUsed=this.bodyUsed,this._bodyInit=t,t?"string"==typeof t?this._bodyText=t:o&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:i&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:r&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():s&&o&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=b(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):s&&(ArrayBuffer.prototype.isPrototypeOf(t)||u(t))?this._bodyArrayBuffer=b(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},o&&(this.blob=function(){var t=p(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){if(this._bodyArrayBuffer){var t=p(this);return t||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer))}return this.blob().then(y)}),this.text=function(){var t,e,r,n=p(this);if(n)return n;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,r=d(e),e.readAsText(t),r;if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},i&&(this.formData=function(){return this.text().then(g)}),this.json=function(){return this.text().then(JSON.parse)},this}h.prototype.append=function(t,e){t=c(t),e=f(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},h.prototype.delete=function(t){delete this.map[c(t)]},h.prototype.get=function(t){return t=c(t),this.has(t)?this.map[t]:null},h.prototype.has=function(t){return this.map.hasOwnProperty(c(t))},h.prototype.set=function(t,e){this.map[c(t)]=f(e)},h.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},h.prototype.keys=function(){var t=[];return this.forEach((function(e,r){t.push(r)})),l(t)},h.prototype.values=function(){var t=[];return this.forEach((function(e){t.push(e)})),l(t)},h.prototype.entries=function(){var t=[];return this.forEach((function(e,r){t.push([r,e])})),l(t)},n&&(h.prototype[Symbol.iterator]=h.prototype.entries);var w=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function m(t,e){if(!(this instanceof m))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var r,n,o=(e=e||{}).body;if(t instanceof m){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new h(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,o||null==t._bodyInit||(o=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new h(e.headers)),this.method=(r=e.method||this.method||"GET",n=r.toUpperCase(),w.indexOf(n)>-1?n:r),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(o),!("GET"!==this.method&&"HEAD"!==this.method||"no-store"!==e.cache&&"no-cache"!==e.cache)){var i=/([?&])_=[^&]*/;if(i.test(this.url))this.url=this.url.replace(i,"$1_="+(new Date).getTime());else{this.url+=(/\?/.test(this.url)?"&":"?")+"_="+(new Date).getTime()}}}function g(t){var e=new FormData;return t.trim().split("&").forEach((function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}})),e}function O(t,e){if(!(this instanceof O))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText=void 0===e.statusText?"":""+e.statusText,this.headers=new h(e.headers),this.url=e.url||"",this._initBody(t)}m.prototype.clone=function(){return new m(this,{body:this._bodyInit})},v.call(m.prototype),v.call(O.prototype),O.prototype.clone=function(){return new O(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new h(this.headers),url:this.url})},O.error=function(){var t=new O(null,{status:0,statusText:""});return t.type="error",t};var E=[301,302,303,307,308];O.redirect=function(t,e){if(-1===E.indexOf(e))throw new RangeError("Invalid status code");return new O(null,{status:e,headers:{location:t}})},t.DOMException=e.DOMException;try{new t.DOMException}catch(e){t.DOMException=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack},t.DOMException.prototype=Object.create(Error.prototype),t.DOMException.prototype.constructor=t.DOMException}function _(r,n){return new Promise((function(i,a){var u=new m(r,n);if(u.signal&&u.signal.aborted)return a(new t.DOMException("Aborted","AbortError"));var c=new XMLHttpRequest;function l(){c.abort()}c.onload=function(){var t,e,r={status:c.status,statusText:c.statusText,headers:(t=c.getAllResponseHeaders()||"",e=new h,t.replace(/\r?\n[\t ]+/g," ").split("\r").map((function(t){return 0===t.indexOf("\n")?t.substr(1,t.length):t})).forEach((function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}})),e)};r.url="responseURL"in c?c.responseURL:r.headers.get("X-Request-URL");var n="response"in c?c.response:c.responseText;setTimeout((function(){i(new O(n,r))}),0)},c.onerror=function(){setTimeout((function(){a(new TypeError("Network request failed"))}),0)},c.ontimeout=function(){setTimeout((function(){a(new TypeError("Network request failed"))}),0)},c.onabort=function(){setTimeout((function(){a(new t.DOMException("Aborted","AbortError"))}),0)},c.open(u.method,function(t){try{return""===t&&e.location.href?e.location.href:t}catch(e){return t}}(u.url),!0),"include"===u.credentials?c.withCredentials=!0:"omit"===u.credentials&&(c.withCredentials=!1),"responseType"in c&&(o?c.responseType="blob":s&&u.headers.get("Content-Type")&&-1!==u.headers.get("Content-Type").indexOf("application/octet-stream")&&(c.responseType="arraybuffer")),!n||"object"!=typeof n.headers||n.headers instanceof h?u.headers.forEach((function(t,e){c.setRequestHeader(e,t)})):Object.getOwnPropertyNames(n.headers).forEach((function(t){c.setRequestHeader(t,f(n.headers[t]))})),u.signal&&(u.signal.addEventListener("abort",l),c.onreadystatechange=function(){4===c.readyState&&u.signal.removeEventListener("abort",l)}),c.send(void 0===u._bodyInit?null:u._bodyInit)}))}_.polyfill=!0,e.fetch||(e.fetch=_,e.Headers=h,e.Request=m,e.Response=O),t.Headers=h,t.Request=m,t.Response=O,t.fetch=_,Object.defineProperty(t,"__esModule",{value:!0})})),function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function r(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function n(t){return n=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},n(t)}function o(t,e){return o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},o(t,e)}function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function s(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return i(t)}function a(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,o=n(t);if(e){var i=n(this).constructor;r=Reflect.construct(o,arguments,i)}else r=o.apply(this,arguments);return s(this,r)}}function u(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=n(t)););return t}function c(){return c="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(t,e,r){var n=u(t,e);if(n){var o=Object.getOwnPropertyDescriptor(n,e);return o.get?o.get.call(arguments.length<3?t:r):o.value}},c.apply(this,arguments)}var f=function(){function e(){t(this,e),Object.defineProperty(this,"listeners",{value:{},writable:!0,configurable:!0})}return r(e,[{key:"addEventListener",value:function(t,e,r){t in this.listeners||(this.listeners[t]=[]),this.listeners[t].push({callback:e,options:r})}},{key:"removeEventListener",value:function(t,e){if(t in this.listeners)for(var r=this.listeners[t],n=0,o=r.length;n<o;n++)if(r[n].callback===e)return void r.splice(n,1)}},{key:"dispatchEvent",value:function(t){if(t.type in this.listeners){for(var e=this.listeners[t.type].slice(),r=0,n=e.length;r<n;r++){var o=e[r];try{o.callback.call(this,t)}catch(t){Promise.resolve().then((function(){throw t}))}o.options&&o.options.once&&this.removeEventListener(t.type,o.callback)}return!t.defaultPrevented}}}]),e}(),l=function(e){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&o(t,e)}(u,e);var s=a(u);function u(){var e;return t(this,u),(e=s.call(this)).listeners||f.call(i(e)),Object.defineProperty(i(e),"aborted",{value:!1,writable:!0,configurable:!0}),Object.defineProperty(i(e),"onabort",{value:null,writable:!0,configurable:!0}),Object.defineProperty(i(e),"reason",{value:void 0,writable:!0,configurable:!0}),e}return r(u,[{key:"toString",value:function(){return"[object AbortSignal]"}},{key:"dispatchEvent",value:function(t){"abort"===t.type&&(this.aborted=!0,"function"==typeof this.onabort&&this.onabort.call(this,t)),c(n(u.prototype),"dispatchEvent",this).call(this,t)}}]),u}(f),h=function(){function e(){t(this,e),Object.defineProperty(this,"signal",{value:new l,writable:!0,configurable:!0})}return r(e,[{key:"abort",value:function(t){var e;try{e=new Event("abort")}catch(t){"undefined"!=typeof document?document.createEvent?(e=document.createEvent("Event")).initEvent("abort",!1,!1):(e=document.createEventObject()).type="abort":e={type:"abort",bubbles:!1,cancelable:!1}}var r=t;if(void 0===r)if("undefined"==typeof document)(r=new Error("This operation was aborted")).name="AbortError";else try{r=new DOMException("signal is aborted without reason")}catch(t){(r=new Error("This operation was aborted")).name="AbortError"}this.signal.reason=r,this.signal.dispatchEvent(e)}},{key:"toString",value:function(){return"[object AbortController]"}}]),e}();function p(t){return t.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL?(console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill"),!0):"function"==typeof t.Request&&!t.Request.prototype.hasOwnProperty("signal")||!t.AbortController}"undefined"!=typeof Symbol&&Symbol.toStringTag&&(h.prototype[Symbol.toStringTag]="AbortController",l.prototype[Symbol.toStringTag]="AbortSignal"),function(t){if(p(t))if(t.fetch){var e=function(t){"function"==typeof t&&(t={fetch:t});var e=t,r=e.fetch,n=e.Request,o=void 0===n?r.Request:n,i=e.AbortController,s=e.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL,a=void 0!==s&&s;if(!p({fetch:r,Request:o,AbortController:i,__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL:a}))return{fetch:r,Request:u};var u=o;(u&&!u.prototype.hasOwnProperty("signal")||a)&&((u=function(t,e){var r;e&&e.signal&&(r=e.signal,delete e.signal);var n=new o(t,e);return r&&Object.defineProperty(n,"signal",{writable:!1,enumerable:!1,configurable:!0,value:r}),n}).prototype=o.prototype);var c=r;return{fetch:function(t,e){var r=u&&u.prototype.isPrototypeOf(t)?t.signal:e?e.signal:void 0;if(r){var n;try{n=new DOMException("Aborted","AbortError")}catch(t){(n=new Error("Aborted")).name="AbortError"}if(r.aborted)return Promise.reject(n);var o=new Promise((function(t,e){r.addEventListener("abort",(function(){return e(n)}),{once:!0})}));return e&&e.signal&&delete e.signal,Promise.race([o,c(t,e)])}return c(t,e)},Request:u}}(t),r=e.fetch,n=e.Request;t.fetch=r,t.Request=n,Object.defineProperty(t,"AbortController",{writable:!0,enumerable:!1,configurable:!0,value:h}),Object.defineProperty(t,"AbortSignal",{writable:!0,enumerable:!1,configurable:!0,value:l})}else console.warn("fetch() is not available, cannot install abortcontroller-polyfill")}("undefined"!=typeof self?self:global)}));