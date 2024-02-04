"use strict";(self.webpackChunkdongsu_blog=self.webpackChunkdongsu_blog||[]).push([[84],{3204:function(e){const t=/[\p{Lu}]/u,a=/[\p{Ll}]/u,r=/^[\p{Lu}](?![\p{Lu}])/gu,i=/([\p{Alpha}\p{N}_]|$)/u,n=/[_.\- ]+/,s=new RegExp("^"+n.source),l=new RegExp(n.source+i.source,"gu"),o=new RegExp("\\d+"+i.source,"gu"),c=(e,i)=>{if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");if(i={pascalCase:!1,preserveConsecutiveUppercase:!1,...i},0===(e=Array.isArray(e)?e.map((e=>e.trim())).filter((e=>e.length)).join("-"):e.trim()).length)return"";const n=!1===i.locale?e=>e.toLowerCase():e=>e.toLocaleLowerCase(i.locale),c=!1===i.locale?e=>e.toUpperCase():e=>e.toLocaleUpperCase(i.locale);if(1===e.length)return i.pascalCase?c(e):n(e);return e!==n(e)&&(e=((e,r,i)=>{let n=!1,s=!1,l=!1;for(let o=0;o<e.length;o++){const c=e[o];n&&t.test(c)?(e=e.slice(0,o)+"-"+e.slice(o),n=!1,l=s,s=!0,o++):s&&l&&a.test(c)?(e=e.slice(0,o-1)+"-"+e.slice(o-1),l=s,s=!1,n=!0):(n=r(c)===c&&i(c)!==c,l=s,s=i(c)===c&&r(c)!==c)}return e})(e,n,c)),e=e.replace(s,""),e=i.preserveConsecutiveUppercase?((e,t)=>(r.lastIndex=0,e.replace(r,(e=>t(e)))))(e,n):n(e),i.pascalCase&&(e=c(e.charAt(0))+e.slice(1)),((e,t)=>(l.lastIndex=0,o.lastIndex=0,e.replace(l,((e,a)=>t(a))).replace(o,(e=>t(e)))))(e,c)};e.exports=c,e.exports.default=c},8032:function(e,t,a){a.d(t,{L:function(){return m},M:function(){return x},P:function(){return E},S:function(){return H},_:function(){return l},a:function(){return s},b:function(){return d},g:function(){return u},h:function(){return o}});var r=a(7294),i=(a(3204),a(5697)),n=a.n(i);function s(){return s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},s.apply(this,arguments)}function l(e,t){if(null==e)return{};var a,r,i={},n=Object.keys(e);for(r=0;r<n.length;r++)t.indexOf(a=n[r])>=0||(i[a]=e[a]);return i}const o=()=>"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;function c(e,t,a){const r={};let i="gatsby-image-wrapper";return"fixed"===a?(r.width=e,r.height=t):"constrained"===a&&(i="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:i,"data-gatsby-image-wrapper":"",style:r}}function d(e,t,a,r,i){return void 0===i&&(i={}),s({},a,{loading:r,shouldLoad:e,"data-main-image":"",style:s({},i,{opacity:t?1:0})})}function u(e,t,a,r,i,n,l,o){const c={};n&&(c.backgroundColor=n,"fixed"===a?(c.width=r,c.height=i,c.backgroundColor=n,c.position="relative"):("constrained"===a||"fullWidth"===a)&&(c.position="absolute",c.top=0,c.left=0,c.bottom=0,c.right=0)),l&&(c.objectFit=l),o&&(c.objectPosition=o);const d=s({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:s({opacity:t?0:1,transition:"opacity 500ms linear"},c)});return d}const p=["children"],g=function(e){let{layout:t,width:a,height:i}=e;return"fullWidth"===t?r.createElement("div",{"aria-hidden":!0,style:{paddingTop:i/a*100+"%"}}):"constrained"===t?r.createElement("div",{style:{maxWidth:a,display:"block"}},r.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:"data:image/svg+xml;charset=utf-8,%3Csvg%20height='"+i+"'%20width='"+a+"'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E",style:{maxWidth:"100%",display:"block",position:"static"}})):null},m=function(e){let{children:t}=e,a=l(e,p);return r.createElement(r.Fragment,null,r.createElement(g,s({},a)),t,null)},b=["src","srcSet","loading","alt","shouldLoad"],f=["fallback","sources","shouldLoad"],h=function(e){let{src:t,srcSet:a,loading:i,alt:n="",shouldLoad:o}=e,c=l(e,b);return r.createElement("img",s({},c,{decoding:"async",loading:i,src:o?t:void 0,"data-src":o?void 0:t,srcSet:o?a:void 0,"data-srcset":o?void 0:a,alt:n}))},y=function(e){let{fallback:t,sources:a=[],shouldLoad:i=!0}=e,n=l(e,f);const o=n.sizes||(null==t?void 0:t.sizes),c=r.createElement(h,s({},n,t,{sizes:o,shouldLoad:i}));return a.length?r.createElement("picture",null,a.map((e=>{let{media:t,srcSet:a,type:n}=e;return r.createElement("source",{key:t+"-"+n+"-"+a,type:n,media:t,srcSet:i?a:void 0,"data-srcset":i?void 0:a,sizes:o})})),c):c};var w;h.propTypes={src:i.string.isRequired,alt:i.string.isRequired,sizes:i.string,srcSet:i.string,shouldLoad:i.bool},y.displayName="Picture",y.propTypes={alt:i.string.isRequired,shouldLoad:i.bool,fallback:i.exact({src:i.string.isRequired,srcSet:i.string,sizes:i.string}),sources:i.arrayOf(i.oneOfType([i.exact({media:i.string.isRequired,type:i.string,sizes:i.string,srcSet:i.string.isRequired}),i.exact({media:i.string,type:i.string.isRequired,sizes:i.string,srcSet:i.string.isRequired})]))};const v=["fallback"],E=function(e){let{fallback:t}=e,a=l(e,v);return t?r.createElement(y,s({},a,{fallback:{src:t},"aria-hidden":!0,alt:""})):r.createElement("div",s({},a))};E.displayName="Placeholder",E.propTypes={fallback:i.string,sources:null==(w=y.propTypes)?void 0:w.sources,alt:function(e,t,a){return e[t]?new Error("Invalid prop `"+t+"` supplied to `"+a+"`. Validation failed."):null}};const x=function(e){return r.createElement(r.Fragment,null,r.createElement(y,s({},e)),r.createElement("noscript",null,r.createElement(y,s({},e,{shouldLoad:!0}))))};x.displayName="MainImage",x.propTypes=y.propTypes;const k=["as","className","class","style","image","loading","imgClassName","imgStyle","backgroundColor","objectFit","objectPosition"],S=["style","className"],C=e=>e.replace(/\n/g,""),L=function(e,t,a){for(var r=arguments.length,i=new Array(r>3?r-3:0),s=3;s<r;s++)i[s-3]=arguments[s];return e.alt||""===e.alt?n().string.apply(n(),[e,t,a].concat(i)):new Error('The "alt" prop is required in '+a+'. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html')},N={image:n().object.isRequired,alt:L},T=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],I=["style","className"],R=new Set;let _,j;const O=function(e){let{as:t="div",image:i,style:n,backgroundColor:d,className:u,class:p,onStartLoad:g,onLoad:m,onError:b}=e,f=l(e,T);const{width:h,height:y,layout:w}=i,v=c(h,y,w),{style:E,className:x}=v,k=l(v,I),S=(0,r.useRef)(),C=(0,r.useMemo)((()=>JSON.stringify(i.images)),[i.images]);p&&(u=p);const L=function(e,t,a){let r="";return"fullWidth"===e&&(r='<div aria-hidden="true" style="padding-top: '+a/t*100+'%;"></div>'),"constrained"===e&&(r='<div style="max-width: '+t+'px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg%20height=\''+a+"'%20width='"+t+"'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E\" style=\"max-width: 100%; display: block; position: static;\"></div>"),r}(w,h,y);return(0,r.useEffect)((()=>{_||(_=a.e(731).then(a.bind(a,6731)).then((e=>{let{renderImageToString:t,swapPlaceholderImage:a}=e;return j=t,{renderImageToString:t,swapPlaceholderImage:a}})));const e=S.current.querySelector("[data-gatsby-image-ssr]");if(e&&o())return e.complete?(null==g||g({wasCached:!0}),null==m||m({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)):(null==g||g({wasCached:!0}),e.addEventListener("load",(function t(){e.removeEventListener("load",t),null==m||m({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)}))),void R.add(C);if(j&&R.has(C))return;let t,r;return _.then((e=>{let{renderImageToString:a,swapPlaceholderImage:l}=e;S.current&&(S.current.innerHTML=a(s({isLoading:!0,isLoaded:R.has(C),image:i},f)),R.has(C)||(t=requestAnimationFrame((()=>{S.current&&(r=l(S.current,C,R,n,g,m,b))}))))})),()=>{t&&cancelAnimationFrame(t),r&&r()}}),[i]),(0,r.useLayoutEffect)((()=>{R.has(C)&&j&&(S.current.innerHTML=j(s({isLoading:R.has(C),isLoaded:R.has(C),image:i},f)),null==g||g({wasCached:!0}),null==m||m({wasCached:!0}))}),[i]),(0,r.createElement)(t,s({},k,{style:s({},E,n,{backgroundColor:d}),className:x+(u?" "+u:""),ref:S,dangerouslySetInnerHTML:{__html:L},suppressHydrationWarning:!0}))},q=(0,r.memo)((function(e){return e.image?(0,r.createElement)(O,e):null}));q.propTypes=N,q.displayName="GatsbyImage";const z=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"];function P(e){return function(t){let{src:a,__imageData:i,__error:n}=t,o=l(t,z);return n&&console.warn(n),i?r.createElement(e,s({image:i},o)):(console.warn("Image not loaded",a),null)}}const A=P((function(e){let{as:t="div",className:a,class:i,style:n,image:o,loading:p="lazy",imgClassName:g,imgStyle:b,backgroundColor:f,objectFit:h,objectPosition:y}=e,w=l(e,k);if(!o)return console.warn("[gatsby-plugin-image] Missing image prop"),null;i&&(a=i),b=s({objectFit:h,objectPosition:y,backgroundColor:f},b);const{width:v,height:L,layout:N,images:T,placeholder:I,backgroundColor:R}=o,_=c(v,L,N),{style:j,className:O}=_,q=l(_,S),z={fallback:void 0,sources:[]};return T.fallback&&(z.fallback=s({},T.fallback,{srcSet:T.fallback.srcSet?C(T.fallback.srcSet):void 0})),T.sources&&(z.sources=T.sources.map((e=>s({},e,{srcSet:C(e.srcSet)})))),r.createElement(t,s({},q,{style:s({},j,n,{backgroundColor:f}),className:O+(a?" "+a:"")}),r.createElement(m,{layout:N,width:v,height:L},r.createElement(E,s({},u(I,!1,N,v,L,R,h,y))),r.createElement(x,s({"data-gatsby-image-ssr":"",className:g},w,d("eager"===p,!1,z,p,b)))))})),M=function(e,t){for(var a=arguments.length,r=new Array(a>2?a-2:0),i=2;i<a;i++)r[i-2]=arguments[i];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?n().number.apply(n(),[e,t].concat(r)):new Error('"'+t+'" '+e[t]+" may not be passed when layout is fullWidth.")},W=new Set(["fixed","fullWidth","constrained"]),F={src:n().string.isRequired,alt:L,width:M,height:M,sizes:n().string,layout:e=>{if(void 0!==e.layout&&!W.has(e.layout))return new Error("Invalid value "+e.layout+'" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".')}};A.displayName="StaticImage",A.propTypes=F;const H=P(q);H.displayName="StaticImage",H.propTypes=F},883:function(e,t,a){a.d(t,{Z:function(){return c}});var r=a(7294),i=a(1883),n=a(8032),s=a.p+"static/github-1c95b85d86a7c25b6f3c3aef89f18afa.png",l=a.p+"static/notion-d9c1379e0d949af82eea7dde146d5243.png",o=a.p+"static/storybook-1866d65b5d0e00fb4b682b99d7c693e5.png";var c=()=>{var e;const t=null===(e=(0,i.useStaticQuery)("230163734").site.siteMetadata)||void 0===e?void 0:e.author;return r.createElement("div",{className:"bio"},r.createElement("div",{style:{display:"flex",alignItems:"center"}},r.createElement(n.S,{className:"bio-avatar",formats:["auto","webp","avif"],src:"../../static/profile-pic.png",width:90,height:90,style:{objectFit:"cover"},alt:"Profile picture",__imageData:a(8182)})),(null==t?void 0:t.name)&&r.createElement("div",null,r.createElement("h3",null,"안녕하세요 🙌🏻 동수입니다."),r.createElement("p",null,"주어진 상황에서 최고의 퍼포먼스를 내기위해 최선을 다하고 있습니다."),r.createElement("p",null,"기억보단 기록을, 기록보단 공유하는 것을 좋아합니다."),r.createElement("p",{style:{marginBottom:"1vh"}},"현재는 풀필먼트 서비스 회사에서 웹 프론트 개발을 하고 있습니다. 🎃"),r.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr",rowGap:"10px"}},r.createElement("p",{style:{marginRight:"2vw"}},"📬 : sonicce99@naver.com"),r.createElement("div",{style:{display:"flex",alignItems:"center"}},r.createElement("a",{href:"https://github.com/sonicce99",target:"_blank",rel:"noreferrer"},r.createElement("img",{src:s,style:{background:"white",borderRadius:"15px",marginRight:"15px"},width:"25px",alt:"github"})),r.createElement("a",{href:"https://sonicce99.notion.site/907ecc80c359442c910659a926d2eb30",target:"_blank",rel:"noreferrer"},r.createElement("img",{src:l,style:{background:"white",borderRadius:"15px",marginRight:"15px"},width:"25px",alt:"notion"})),r.createElement("a",{href:"https://nextjs-css-storybook.vercel.app/",target:"_blank",rel:"noreferrer"},r.createElement("img",{src:o,style:{background:"white",borderRadius:"15px"},width:"25px",alt:"storybook"}))))))}},8182:function(e){e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#080808","images":{"fallback":{"src":"/static/300e9efb654785ab2bbb3cfad0cd6ea4/25ed1/profile-pic.png","srcSet":"/static/300e9efb654785ab2bbb3cfad0cd6ea4/9a626/profile-pic.png 23w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/e4dc7/profile-pic.png 45w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/25ed1/profile-pic.png 90w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/a2c25/profile-pic.png 180w","sizes":"(min-width: 90px) 90px, 100vw"},"sources":[{"srcSet":"/static/300e9efb654785ab2bbb3cfad0cd6ea4/c914c/profile-pic.avif 23w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/804a8/profile-pic.avif 45w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/08179/profile-pic.avif 90w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/07601/profile-pic.avif 180w","type":"image/avif","sizes":"(min-width: 90px) 90px, 100vw"},{"srcSet":"/static/300e9efb654785ab2bbb3cfad0cd6ea4/65086/profile-pic.webp 23w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/29677/profile-pic.webp 45w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/5d191/profile-pic.webp 90w,\\n/static/300e9efb654785ab2bbb3cfad0cd6ea4/52f83/profile-pic.webp 180w","type":"image/webp","sizes":"(min-width: 90px) 90px, 100vw"}]},"width":90,"height":90}')}}]);
//# sourceMappingURL=cd7d5f864fc9e15ed8adef086269b0aeff617554-6d69c7b22d197cd536f5.js.map