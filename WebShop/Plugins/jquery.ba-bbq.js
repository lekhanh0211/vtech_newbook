!function(e,t){var n,r,a,o,i,c,u,f,l,s,p,h,d,g=Array.prototype.slice,v=decodeURIComponent,m=e.param,y=e.bbq=e.bbq||{},b=e.event.special,$="querystring",x="fragment",j=/^.*\?|#.*$/g,A={};function w(e){return"string"==typeof e}function C(e){var t=g.call(arguments,1);return function(){return e.apply(this,t.concat(g.call(arguments)))}}function N(t,a,i,c,u){var f,h,g,m,y;return c!==n?(y=(g=i.match(t?s:/^([^#?]*)\??([^#]*)(#?.*)/))[3]||"",2===u&&w(c)?h=c.replace(t?l:j,""):(m=o(g[2]),c=w(c)?o[t?x:$](c):c,h=2===u?c:1===u?e.extend({},c,m):e.extend({},m,c),h=r(h),t&&(h=h.replace(p,v))),f=g[1]+(t?d:h||!g[1]?"?":"")+h+y):f=a(i!==n?i:location.href),f}function U(e,t,r){return t===n||"boolean"==typeof t?(r=t,t=m[e?x:$]()):t=w(t)?t.replace(e?l:j,""):t,o(t,r)}function S(t,r,a,o){return w(a)||"object"==typeof a||(o=a,a=r,r=n),this.each(function(){var n=e(this),i=r||f()[(this.nodeName||"").toLowerCase()]||"",c=i&&n.attr(i)||"";n.attr(i,m[t](c,a,o))})}m[$]=C(N,0,function(e){return e.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}),m[x]=a=C(N,1,function(e){return e.replace(s,"$2")}),m.sorted=r=function(t,n){var r=[],a={};return e.each(m(t,n).split("&"),function(e,t){var n=t.replace(/(?:%5B|=).*$/,""),o=a[n];o||(o=a[n]=[],r.push(n)),o.push(t)}),e.map(r.sort(),function(e){return a[e]}).join("&")},a.noEscape=function(t){t=t||"";var n=e.map(t.split(""),encodeURIComponent);p=new RegExp(n.join("|"),"g")},a.noEscape(",/"),a.ajaxCrawlable=function(e){return e!==n&&(e?(l=/^.*(?:#!|#)/,s=/^([^#]*)(?:#!|#)?(.*)$/,d="#!"):(l=/^.*#/,s=/^([^#]*)#?(.*)$/,d="#"),h=!!e),h},a.ajaxCrawlable(0),e.deparam=o=function(t,r){var a={},o={true:!0,false:!1,null:null};return e.each(t.replace(/\+/g," ").split("&"),function(t,i){var c,u=i.split("="),f=v(u[0]),l=a,s=0,p=f.split("]["),h=p.length-1;if(/\[/.test(p[0])&&/\]$/.test(p[h])?(p[h]=p[h].replace(/\]$/,""),h=(p=p.shift().split("[").concat(p)).length-1):h=0,2===u.length)if(c=v(u[1]),r&&(c=c&&!isNaN(c)?+c:"undefined"===c?n:o[c]!==n?o[c]:c),h)for(;s<=h;s++)l=l[f=""===p[s]?l.length:p[s]]=s<h?l[f]||(p[s+1]&&isNaN(p[s+1])?{}:[]):c;else e.isArray(a[f])?a[f].push(c):a[f]!==n?a[f]=[a[f],c]:a[f]=c;else f&&(a[f]=r?n:"")}),a},o[$]=C(U,0),o[x]=i=C(U,1),e.elemUrlAttr||(e.elemUrlAttr=function(t){return e.extend(A,t)})({a:"href",base:"href",iframe:"src",img:"src",input:"src",form:"action",link:"href",script:"src"}),f=e.elemUrlAttr,e.fn[$]=C(S,$),e.fn[x]=C(S,x),y.pushState=c=function(e,t){w(e)&&/^#/.test(e)&&t===n&&(t=2);var r=e!==n,o=a(location.href,r?e:{},r?t:2);location.href=o},y.getState=u=function(e,t){return e===n||"boolean"==typeof e?i(e):i(t)[e]},y.removeState=function(t){var r={};t!==n&&(r=u(),e.each(e.isArray(t)?t:arguments,function(e,t){delete r[t]})),c(r,2)},b.hashchange=e.extend(b.hashchange,{add:function(t){var r;function i(e){var t=e[x]=a();e.getState=function(e,r){return e===n||"boolean"==typeof e?o(t,e):o(t,r)[e]},r.apply(this,arguments)}if(e.isFunction(t))return r=t,i;r=t.handler,t.handler=i}})}(jQuery),function(e,t,n){var r,a="hashchange",o=document,i=e.event.special,c=o.documentMode,u="on"+a in t&&(void 0===c||c>7);function f(e){return"#"+(e=e||location.href).replace(/^[^#]*#?(.*)$/,"$1")}e.fn[a]=function(e){return e?this.bind(a,e):this.trigger(a)},e.fn[a].delay=50,i[a]=e.extend(i[a],{setup:function(){if(u)return!1;e(r.start)},teardown:function(){if(u)return!1;e(r.stop)}}),r=function(){var n,r={},o=f(),i=function(e){return e},c=i,u=i;function l(){var r=f(),i=u(o);r!==o?(c(o=r,i),e(t).trigger(a)):i!==o&&(location.href=location.href.replace(/#.*/,"")+i),n=setTimeout(l,e.fn[a].delay)}return r.start=function(){n||l()},r.stop=function(){n&&clearTimeout(n),n=void 0},r}()}(jQuery,this);