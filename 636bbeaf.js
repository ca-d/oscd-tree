System.register(["./4a52e992.js","./0df33f5b.js"],(function(e){"use strict";var t,n,r;return{setters:[function(e){t=e._,n=e.Z},function(e){r=e.r}],execute:function(){e({renderDocs:function(e,t,n,r){return function(e,t,n){return u.apply(this,arguments)}(e,t,n).then(r)},unmountDocs:function(e){r.unmountComponentAtNode(e)}});var o={fontSize:"14px",letterSpacing:"0.2px",margin:"10px 0"},a={margin:"auto",padding:30,borderRadius:10,background:"rgba(0,0,0,0.03)"},c={textAlign:"center"},l=function(){return n.createElement("div",{style:o,className:"sb-nodocs sb-wrapper"},n.createElement("div",{style:a},n.createElement("h1",{style:c},"No Docs"),n.createElement("p",null,"Sorry, but there are no docs for the selected story. To add them, set the story's ",n.createElement("code",null,"docs")," parameter. If you think this is an error:"),n.createElement("ul",null,n.createElement("li",null,"Please check the story definition."),n.createElement("li",null,"Please check the Storybook config."),n.createElement("li",null,"Try reloading the page.")),n.createElement("p",null,"If the problem persists, check the browser console, or the terminal you've run Storybook from.")))};function i(e,t,n,r,o,a,c){try{var l=e[a](c),i=l.value}catch(e){return void n(e)}l.done?t(i):Promise.resolve(i).then(r,o)}function s(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function c(e){i(a,r,o,c,l,"next",e)}function l(e){i(a,r,o,c,l,"throw",e)}c(void 0)}))}}function u(){return(u=s(t().mark((function e(o,a,c){var i,s,u,d,f,m;return t().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(null!=(u=o.parameters.docs)&&u.getPage||null!=u&&u.page)||null!=u&&u.getContainer||null!=u&&u.container){e.next=3;break}throw new Error("No `docs.container` set, did you run `addon-docs/preset`?");case 3:if(e.t1=u.container,e.t1){e.next=8;break}return e.next=7,null===(i=u.getContainer)||void 0===i?void 0:i.call(u);case 7:e.t1=e.sent;case 8:if(e.t0=e.t1,e.t0){e.next=11;break}e.t0=function(e){var t=e.children;return n.createElement(n.Fragment,null,t)};case 11:if(d=e.t0,e.t3=u.page,e.t3){e.next=17;break}return e.next=16,null===(s=u.getPage)||void 0===s?void 0:s.call(u);case 16:e.t3=e.sent;case 17:if(e.t2=e.t3,e.t2){e.next=20;break}e.t2=l;case 20:return f=e.t2,m=n.createElement(d,{key:o.componentId,context:a},n.createElement(f,null)),e.next=24,new Promise((function(e){r.render(m,c,e)}));case 24:case"end":return e.stop()}}),e)})))).apply(this,arguments)}l.displayName="NoDocs"}}}));
