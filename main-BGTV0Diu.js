(function(){const A=document.createElement("link").relList;if(A&&A.supports&&A.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(t){if(t.ep)return;t.ep=!0;const s=e(t);fetch(t.href,s)}})();const q=new Map,v=new Set(["ArrowDown","ArrowUp"]),Q={ArrowUp:"previousSibling",ArrowDown:"nextSibling"},U="Make a selection",B="",Z={scrollBehavior:{behavior:"smooth",block:"nearest"},triggerImmediately:!0},D=new Map,c="simple-dropdown",S={libraryName:c},H=2;function h(r,A,e,i){return r.addEventListener(A,e,i),()=>r.removeEventListener(A,e)}function G(r){throw new Error(`${c}: ${r}`)}function y(r,A){return A.some(e=>r.classList.contains(e))}function Y(r,A){let{scrollTop:e,offsetHeight:i}=A,{offsetTop:t,offsetHeight:s}=r,o=t+s,l=e+i+H;return e-H<=t&&o<=l}function j(r){return r?.constructor===Object}function C(r,A){for(let[e,i]of Object.entries(A)){if(j(i)){let t=r[e];if(j(t)){C(t,i);continue}}r[e]=i}return r}function $(r){console.warn(`${c}: ${r}`)}const z=`simple-dropdown {\r
  display: inline-block;\r
  width: 300px;\r
  position: relative;\r
  user-select: none;\r
\r
  &:focus {\r
    outline: none;\r
\r
    .simple-dropdown-selector::before {\r
      display: block;\r
    }\r
  }\r
\r
  &:not([required]).simple-dropdown-selected .simple-dropdown-clearer {\r
    display: block;\r
  }\r
\r
  &:disabled {\r
    pointer-events: none;\r
    opacity: 0.6;\r
  }\r
\r
  .simple-dropdown-selector-wrapper {\r
    height: 36px;\r
    container-type: size;\r
    position: relative;\r
  }\r
\r
  .simple-dropdown-selector {\r
    display: flex;\r
    container-type: size;\r
    align-items: center;\r
    width: 100%;\r
    height: 100%;\r
    border: 1px solid #888;\r
    border-radius: 20cqh;\r
    box-sizing: border-box;\r
    user-select: none;\r
    position: relative;\r
\r
    &::before {\r
      content: "";\r
      position: absolute;\r
      width: calc(100% + 2px);\r
      height: calc(100% + 2px);\r
      border: 2px solid #000;\r
      border-radius: inherit;\r
      left: -1px;\r
      top: -1px;\r
      pointer-events: none;\r
      display: none;\r
      box-sizing: border-box;\r
    }\r
\r
    .simple-dropdown-chevron::before,\r
    .simple-dropdown-clearer::before {\r
      content: "\\e901";\r
      font-family: 'icomoon' !important;\r
      speak: never;\r
      font-style: normal;\r
      font-weight: normal;\r
      font-variant: normal;\r
      text-transform: none;\r
      line-height: 1;\r
      -webkit-font-smoothing: antialiased;\r
      -moz-osx-font-smoothing: grayscale;\r
    }\r
\r
    .simple-dropdown-clearer {\r
      padding: 0;\r
      text-align: center;\r
      display: none;\r
      cursor: pointer;\r
      font-size: 40cqh;\r
      position: absolute;\r
      top: 50%;\r
      right: 60cqh;\r
      transform: translateY(calc(-50% + 5cqh));\r
      color: rgb(178, 3, 3);\r
      z-index: 1;\r
      display: none;\r
\r
      &:hover {\r
        color: rgb(255, 61, 61);\r
      }\r
    }\r
\r
    .simple-dropdown-clearer::before {\r
      content: "\\e902";\r
      cursor: inherit;\r
    }\r
\r
    > span {\r
      font-size: 50cqh;\r
      line-height: 50cqh;\r
    }\r
\r
    > .simple-dropdown-choice {\r
      margin-left: 20cqh;\r
      flex-grow: 1;\r
      font-family: sans-serif;\r
\r
      &.simple-dropdown-placeholder {\r
        color: #666;\r
      }\r
    }\r
\r
    > .simple-dropdown-chevron {\r
      padding: 0 15cqh;\r
      position: relative;\r
      top: 5cqh;\r
    }\r
  }\r
\r
  .simple-dropdown-selector:focus {\r
    outline: none;\r
    border-color: rgb(102, 175, 233);\r
    pointer-events: none;\r
    border-bottom-left-radius: 0;\r
    border-bottom-right-radius: 0;\r
\r
    .simple-dropdown-chevron::before {\r
      content: "\\e900";\r
    }\r
\r
    .simple-dropdown-clearer {\r
      pointer-events: all;\r
    }\r
  }\r
\r
  .simple-dropdown-selections-wrapper {\r
    position: absolute;\r
    border: 1px solid #ddd;\r
    width: 100%;\r
    box-sizing: border-box;\r
    border-top: none;\r
    max-height: 120px;\r
    overflow-y: auto;\r
    overflow-x: hidden;\r
    scrollbar-width: thin;\r
    scrollbar-color: rgb(102, 175, 233) #fefefe;\r
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), \r
                0 10px 10px -5px rgba(0, 0, 0, 0.04);\r
    background-color: #fff;\r
    opacity: 0;\r
    pointer-events: none;\r
  }\r
\r
  .simple-dropdown-selection {\r
    height: 30px;\r
    container-type: size;\r
    display: flex;\r
    align-items: center;\r
    width: calc(100% + 2px);\r
    position: relative;\r
    left: -1px;\r
    cursor: pointer;\r
\r
    > span {\r
      font-family: sans-serif;\r
      pointer-events: none;\r
      font-size: 50cqh;\r
      margin-left: 20cqh\r
    }\r
\r
    &.simple-dropdown-selection-hovered {\r
      background-color: #ccc;\r
    }\r
\r
    &.simple-dropdown-selection-disabled {\r
      color: #888;\r
\r
      &:hover {\r
        background-color: transparent;\r
      }\r
    }\r
\r
    &.simple-dropdown-selection-selected {\r
      color: #fff;\r
      background-color: #2c528c;\r
\r
      &.simple-dropdown-selection-disabled {\r
        background-color: #98b8e9;\r
      }\r
\r
      &.simple-dropdown-selection-hovered:not(.simple-dropdown-selection-disabled) {\r
        background-color: #3266b3;\r
      }\r
    }\r
  }\r
\r
  .simple-dropdown-selector-wrapper:focus-within + .simple-dropdown-selections-wrapper {\r
    opacity: 1;\r
    pointer-events: all;\r
  }\r
\r
  .simple-dropdown-selections-wrapper:focus-within {\r
    display: none;\r
  }\r
}\r
\r
@font-face {\r
  font-family: 'icomoon';\r
  src: url('data:font/ttf;base64,AAEAAAALAIAAAwAwT1MvMg8SBawAAAC8AAAAYGNtYXAXVtKJAAABHAAAAFRnYXNwAAAAEAAAAXAAAAAIZ2x5ZkfnCeAAAAF4AAAA+GhlYWQtqm3nAAACcAAAADZoaGVhBuQDyAAAAqgAAAAkaG10eBIAAAAAAALMAAAAHGxvY2EAbgDCAAAC6AAAABBtYXhwAAkAIwAAAvgAAAAgbmFtZZlKCfsAAAMYAAABhnBvc3QAAwAAAAAEoAAAACAAAwOAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpAgPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAOAAAAAoACAACAAIAAQAg6QL//f//AAAAAAAg6QD//f//AAH/4xcEAAMAAQAAAAAAAAAAAAAAAQAB//8ADwABAAD/wAAAA8AAAgAANzkBAAAAAAEAAP/AAAADwAACAAA3OQEAAAAAAQAA/8AAAAPAAAIAADc5AQAAAAABAAD/wAMiA8AABgAAAScBFzcXNwIkJP7eSdnZSQJkJP7eSNnZSAAAAQAA/8ADIgPAAAYAAAEXAScHJwcB3CQBIknZ2UkBNiQBIUna2kkAAAEAAP/AAt8DwAAgAAAlBiIvAQcGIicmND8BJyY0NzYyHwE3NjIXFhQPARcWFAcC3xIzEoiIEjMSEhKOjhISEjMSiIgSMxISEo6OEhLVEhKbmxISEjISoqESMxISEpubEhISMxKhohIyEgAAAAEAAAAAAACg8V4HXw889QALBAAAAAAA5bUUtQAAAADltRS1AAD/wAMiA8AAAAAIAAIAAAAAAAAAAQAAA8D/wAAABAAAAAAAAyIAAQAAAAAAAAAAAAAAAAAAAAcEAAAAAAAAAAAAAAACAAAABAAAAAQAAAAEAAAAAAAAAAAKABQAHgAyAEYAfAABAAAABwAhAAEAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEABwAAAAEAAAAAAAIABwBgAAEAAAAAAAMABwA2AAEAAAAAAAQABwB1AAEAAAAAAAUACwAVAAEAAAAAAAYABwBLAAEAAAAAAAoAGgCKAAMAAQQJAAEADgAHAAMAAQQJAAIADgBnAAMAAQQJAAMADgA9AAMAAQQJAAQADgB8AAMAAQQJAAUAFgAgAAMAAQQJAAYADgBSAAMAAQQJAAoANACkaWNvbW9vbgBpAGMAbwBtAG8AbwBuVmVyc2lvbiAxLjAAVgBlAHIAcwBpAG8AbgAgADEALgAwaWNvbW9vbgBpAGMAbwBtAG8AbwBuaWNvbW9vbgBpAGMAbwBtAG8AbwBuUmVndWxhcgBSAGUAZwB1AGwAYQByaWNvbW9vbgBpAGMAbwBtAG8AbwBuRm9udCBnZW5lcmF0ZWQgYnkgSWNvTW9vbi4ARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAASQBjAG8ATQBvAG8AbgAuAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==') format('truetype'),\r
       url('data:font/embedded-opentype;base64,ZAUAAMAEAAABAAIAAAAAAAAAAAAAAAAAAAABAJABAAAAAExQAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAB17xoAAAAAAAAAAAAAAAAAAAAAAAAA4AaQBjAG8AbQBvAG8AbgAAAA4AUgBlAGcAdQBsAGEAcgAAABYAVgBlAHIAcwBpAG8AbgAgADEALgAwAAAADgBpAGMAbwBtAG8AbwBuAAAAAAAAAQAAAAsAgAADADBPUy8yDxIFrAAAALwAAABgY21hcBdW0okAAAEcAAAAVGdhc3AAAAAQAAABcAAAAAhnbHlmR+cJ4AAAAXgAAAD4aGVhZC2qbecAAAJwAAAANmhoZWEG5APIAAACqAAAACRobXR4EgAAAAAAAswAAAAcbG9jYQBuAMIAAALoAAAAEG1heHAACQAjAAAC+AAAACBuYW1lmUoJ+wAAAxgAAAGGcG9zdAADAAAAAASgAAAAIAADA4ABkAAFAAACmQLMAAAAjwKZAswAAAHrADMBCQAAAAAAAAAAAAAAAAAAAAEQAAAAAAAAAAAAAAAAAAAAAEAAAOkCA8D/wABAA8AAQAAAAAEAAAAAAAAAAAAAACAAAAAAAAMAAAADAAAAHAABAAMAAAAcAAMAAQAAABwABAA4AAAACgAIAAIAAgABACDpAv/9//8AAAAAACDpAP/9//8AAf/jFwQAAwABAAAAAAAAAAAAAAABAAH//wAPAAEAAP/AAAADwAACAAA3OQEAAAAAAQAA/8AAAAPAAAIAADc5AQAAAAABAAD/wAAAA8AAAgAANzkBAAAAAAEAAP/AAyIDwAAGAAABJwEXNxc3AiQk/t5J2dlJAmQk/t5I2dlIAAABAAD/wAMiA8AABgAAARcBJwcnBwHcJAEiSdnZSQE2JAEhSdraSQAAAQAA/8AC3wPAACAAACUGIi8BBwYiJyY0PwEnJjQ3NjIfATc2MhcWFA8BFxYUBwLfEjMSiIgSMxISEo6OEhISMxKIiBIzEhISjo4SEtUSEpubEhISMhKioRIzEhISm5sSEhIzEqGiEjISAAAAAQAAAAAAAKDxXgdfDzz1AAsEAAAAAADltRS1AAAAAOW1FLUAAP/AAyIDwAAAAAgAAgAAAAAAAAABAAADwP/AAAAEAAAAAAADIgABAAAAAAAAAAAAAAAAAAAABwQAAAAAAAAAAAAAAAIAAAAEAAAABAAAAAQAAAAAAAAAAAoAFAAeADIARgB8AAEAAAAHACEAAQAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAOAK4AAQAAAAAAAQAHAAAAAQAAAAAAAgAHAGAAAQAAAAAAAwAHADYAAQAAAAAABAAHAHUAAQAAAAAABQALABUAAQAAAAAABgAHAEsAAQAAAAAACgAaAIoAAwABBAkAAQAOAAcAAwABBAkAAgAOAGcAAwABBAkAAwAOAD0AAwABBAkABAAOAHwAAwABBAkABQAWACAAAwABBAkABgAOAFIAAwABBAkACgA0AKRpY29tb29uAGkAYwBvAG0AbwBvAG5WZXJzaW9uIDEuMABWAGUAcgBzAGkAbwBuACAAMQAuADBpY29tb29uAGkAYwBvAG0AbwBvAG5pY29tb29uAGkAYwBvAG0AbwBvAG5SZWd1bGFyAFIAZQBnAHUAbABhAHJpY29tb29uAGkAYwBvAG0AbwBvAG5Gb250IGdlbmVyYXRlZCBieSBJY29Nb29uLgBGAG8AbgB0ACAAZwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABJAGMAbwBNAG8AbwBuAC4AAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA') format('embedded-opentype'),\r
       url('data:font/woff;base64,d09GRgABAAAAAAUMAAsAAAAABMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxIFrGNtYXAAAAFoAAAAVAAAAFQXVtKJZ2FzcAAAAbwAAAAIAAAACAAAABBnbHlmAAABxAAAAPgAAAD4R+cJ4GhlYWQAAAK8AAAANgAAADYtqm3naGhlYQAAAvQAAAAkAAAAJAbkA8hobXR4AAADGAAAABwAAAAcEgAAAGxvY2EAAAM0AAAAEAAAABAAbgDCbWF4cAAAA0QAAAAgAAAAIAAJACNuYW1lAAADZAAAAYYAAAGGmUoJ+3Bvc3QAAATsAAAAIAAAACAAAwAAAAMDgAGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAQAAA6QIDwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAwAAAAMAAAAcAAEAAwAAABwAAwABAAAAHAAEADgAAAAKAAgAAgACAAEAIOkC//3//wAAAAAAIOkA//3//wAB/+MXBAADAAEAAAAAAAAAAAAAAAEAAf//AA8AAQAA/8AAAAPAAAIAADc5AQAAAAABAAD/wAAAA8AAAgAANzkBAAAAAAEAAP/AAAADwAACAAA3OQEAAAAAAQAA/8ADIgPAAAYAAAEnARc3FzcCJCT+3knZ2UkCZCT+3kjZ2UgAAAEAAP/AAyIDwAAGAAABFwEnBycHAdwkASJJ2dlJATYkASFJ2tpJAAABAAD/wALfA8AAIAAAJQYiLwEHBiInJjQ/AScmNDc2Mh8BNzYyFxYUDwEXFhQHAt8SMxKIiBIzEhISjo4SEhIzEoiIEjMSEhKOjhIS1RISm5sSEhIyEqKhEjMSEhKbmxISEjMSoaISMhIAAAABAAAAAAAAoPFeB18PPPUACwQAAAAAAOW1FLUAAAAA5bUUtQAA/8ADIgPAAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAMiAAEAAAAAAAAAAAAAAAAAAAAHBAAAAAAAAAAAAAAAAgAAAAQAAAAEAAAABAAAAAAAAAAACgAUAB4AMgBGAHwAAQAAAAcAIQABAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAcAAAABAAAAAAACAAcAYAABAAAAAAADAAcANgABAAAAAAAEAAcAdQABAAAAAAAFAAsAFQABAAAAAAAGAAcASwABAAAAAAAKABoAigADAAEECQABAA4ABwADAAEECQACAA4AZwADAAEECQADAA4APQADAAEECQAEAA4AfAADAAEECQAFABYAIAADAAEECQAGAA4AUgADAAEECQAKADQApGljb21vb24AaQBjAG8AbQBvAG8AblZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMGljb21vb24AaQBjAG8AbQBvAG8Abmljb21vb24AaQBjAG8AbQBvAG8AblJlZ3VsYXIAUgBlAGcAdQBsAGEAcmljb21vb24AaQBjAG8AbQBvAG8AbkZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=') format('woff');\r
  font-weight: normal;\r
  font-style: normal;\r
  font-display: block;\r
}\r
`,W="var-trap",N=["storeFactory","valueAdder"],x={},O=new Set(["addTraps"]),R=new Set(["delete","store"]);function K(r,A){return r.filter(e=>!A.includes(e))}function f(r){throw new Error(`${W}: ${r}`)}function M(r){return Object.prototype.toString.call(r)==="[object Object]"}function X(...r){let A=eA(r);A=Object.entries(A),A.forEach(([e,i])=>{let{methods:t}=i,s=Object.keys(i),o=K(N,s);o.length&&(o=o.join(", "),f(`provide the following trap definition properties: ${o}`)),x[e]&&f(`trap definition '${e}' already exists`);class l{constructor(d){Object.assign(this,{store:d})}}t&&Object.entries(t).forEach(([a,d])=>{if(!R.has(a)){let g={},{prototype:E}=l;if(M(d)&&({method:d,configs:g}=d),g.returnValue)var p=function(...b){return d(this.store,...b)};else p=function(...b){return d(this.store,...b),this};return E[a]=p}f(`'${a}' method name is reserved`)}),x[e]=Object.assign(i,{MethodsClass:l})})}function _(r,A,e){let i=e[A],t=x[i];return O.has(A)&&f(`'${A}' trap name is a reserved keyword`),t||f(`definition for '${i}' trap does not exist`),Object.hasOwn(r,A)&&f(`'${A}' trap name already exists`),t}function AA(r){let A={addTraps(e){if(M(e))return Object.getOwnPropertyNames(e).forEach(t=>{let s=_(A,t,e),{MethodsClass:o}=s,{storeFactory:l,valueAdder:a}=s,d=l(),p=new o(d);p.delete=function(){delete A[t]},Object.defineProperty(A,t,{get:()=>p,set:g=>a(g,d),configurable:!0})});f("trap(s) specification should be an object of trap name and trap definition name pairs")}};return r&&A.addTraps(r),new Proxy(A,{deleteProperty(e,i){return O.has(i)&&f(`'${i}' is a reserved trap property and cannot be deleted`),Object.hasOwn(e,i)&&e[i].delete(),!0}})}function eA([r,A]){return M(r)||(r={[r]:A}),r}let w=`${c}-selection`,P=`${w}s`;const n={choice:`${c}-choice`,clearer:`${c}-clearer`,dirty:`${c}-dirty`,selector:`${c}-selector`,placeholder:`${c}-placeholder`,selected:`${c}-selected`,selection:w,selections:P,selectionsWrapper:`${P}-wrapper`,selectionDisabled:`${w}-disabled`,selectionHovered:`${w}-hovered`,selectionSelected:`${w}-selected`,touched:`${c}-touched`},tA=[n.selectionDisabled,n.selectionHovered,n.selectionSelected],rA=[n.selectionDisabled,n.selectionHovered],iA=[n.selectionDisabled,n.selectionSelected];function V(r){return r.map(A=>{if(Array.isArray(A)){let{length:e}=A;return e===1?[A[0],A[0]]:e===2&&A[1]?.constructor===Object?[A[0],A[0],A[1]]:A}return[A,A]})}class sA extends HTMLElement{static formAssociated=!0;#e;constructor(A=""){super(),this._internals=this.attachInternals(),this.#e=A}get value(){return this.#e}set value(A){this.#e=A}get form(){return this._internals.form}get name(){return this.getAttribute("name")}set name(A){this.setAttribute("name",A)}get type(){return this.localName}get validity(){return this._internals.validity}get validationMessage(){return this._internals.validationMessage}get willValidate(){return this._internals.willValidate}checkValidity(){return this._internals.checkValidity()}reportValidity(){return this._internals.reportValidity()}}const nA=`<div class="simple-dropdown-selector-wrapper">\r
  <div tabindex="-1" class="simple-dropdown-selector">\r
    <span class="simple-dropdown-choice"></span>\r
    <span tabindex="-1" class="simple-dropdown-clearer"></span>\r
    <span class="simple-dropdown-chevron"></span>\r
  </div>\r
</div>\r
<div class="simple-dropdown-selections-wrapper"></div>\r
`;X("callbacks",{storeFactory:()=>[],valueAdder:(r,A)=>A.push(r),methods:{clear(r){r.forEach(A=>A()),r.splice(0)}}});class oA extends sA{static observedAttributes=["configsref","itemsref","placeholder","required","selected"];#e;#a;#m;#n=structuredClone(Z);#d;#o;#h;#g;#E;#A;#v;#t;#f;#Q;#u=(()=>{let A=document.createElement("div");return A.classList.add(n.selections),A})();#r;#c=new Map;#s;#i=AA({c:"callbacks"});#l=new Map;get configs(){return this.#n}set configs(A){this.#n=C(this.#n,A)}set configsref(A){let e=q.get(A);e||G(`no configurations exist under the "${A}" reference.`),this.#n=C(this.#n,e)}get disabled(){return this.hasAttribute("disabled")}set disabled(A){this.toggleAttribute("disabled",A)}get items(){return this.#g}set items(A){this.#J(A)}get itemsref(){return this.#E}set itemsref(A){let e=D.get(A);e||G(`no items exist under the "${A}" reference.`),this.#E=A,this.#S(e),this.#g=e}get placeholder(){return this.#v}set placeholder(A){this.#v=A}get required(){return this.#Q}set required(A){if(A===""||A&&A!==!0)A=!0;else{if(A===!1)return this.removeAttribute("required");if(A)return this.setAttribute("required","")}this.#Q=A||!1,this.#d&&this.#w()}get selected(){return this.value}set selected(A){this.#d?this.#p(A):this.#o=A}get value(){return super.value}set value(A){this.selected=A}constructor(){super()}attributeChangedCallback(A,e,i){e!==i&&(this[A]=i)}connectedCallback(){this.#d||(this.innerHTML=nA,this.#a=this.querySelector(`.${n.choice}`),this.#m=this.querySelector(`.${n.clearer}`),this.#r=this.querySelector(`.${n.selectionsWrapper}`),this.#s=this.querySelector(`.${n.selector}`),this.#r.append(this.#u),this.#d=!0,this.#o&&(this.#n.triggerImmediately?this.#p(this.#o):this.#x(this.#o),this.#o=void 0),this.#h=this.value,this.value||(this.#C(),this.#w()),this.hasAttribute("tabindex")||this.setAttribute("tabindex",0)),this.#M()}disconnectedCallback(){this.#i.c.clear()}formDisabledCallback(A){this.disabled=A}formResetCallback(){this.#y(this.#h)}#M(){this.#k(),this.#L(),this.#H(),this.#Y(),this.#j()}#k(){this.#i.c=h(this.#m,"focus",()=>{this.#I()})}#L(){this.#i.c=h(document,"touchstart",()=>{this.#D(this.#r)&&this.#s.blur()})}#H(){this.#i.c=h(this,"keydown",A=>{if(A.target===this){let{code:e}=A;if(e==="Space")return this.#s.focus();if(e==="Escape"&&this.#e&&!this.required)return this.#I();if(v.has(e)&&this.#A&&(this.#e||e==="ArrowDown")){let i=Q[e],t=this.#A;do if(this.#F(t))return this.#B(t);while(t=t[i])}}}),this.#i.c=h(this,"touchstart",A=>{A.stopPropagation()})}#Y(){let A=h(this.#r,"mousemove",e=>{let{clientX:i,clientY:t}=e;document.elementFromPoint(i,t).classList.contains(n.selection)&&(this.classList.add(n.dirty),A())});this.#i.c=h(this.#r,"pointerdown",()=>{this.#f=!0}),this.#i.c=h(this.#r,"pointerup",e=>{let{clientX:i,clientY:t}=e,s=document.elementFromPoint(i,t);if(s!==this.#r){if(!this.#b(s))return this.#B(s),this.focus();this.#s.focus()}}),this.#i.c=h(this.#r,"mousemove",e=>{let{clientX:i,clientY:t}=e,s=document.elementFromPoint(i,t),o=this.#c.has(s),l=!s.classList.contains(n.selectionHovered);o&&l&&(this.#A=s,this.#b(s)||(this.#e?.classList.remove(n.selectionHovered),this.#t?.classList.remove(n.selectionHovered),s.classList.add(n.selectionHovered),this.#t=s))}),this.#i.c=h(this.#r,"touchstart",e=>{e.stopPropagation()})}#j(){let A=h(this.#s,"keydown",({code:e})=>{v.has(e)&&(this.classList.add(n.dirty),A())});this.#s.addEventListener("focus",()=>{this.classList.add(n.touched)},{once:!0}),this.#i.c=h(this.#s,"blur",()=>{this.#s.value=B,this.#f&&(this.#s.focus(),this.#f=!1)}),this.#i.c=h(this.#s,"focus",()=>{!this.#f&&this.#A&&(this.#A.scrollIntoView({block:"nearest"}),this.#A===this.#e&&this.#e.classList.add(n.selectionHovered))}),this.#i.c=h(this.#s,"keydown",e=>{let{code:i}=e;if(i==="Space")return this.focus();if(i==="Escape")return this.#t?.classList.remove(n.selectionHovered),this.#t=void 0,this.#A=this.#e??this.#u.children[0],this.focus();if(i==="Enter"){this.#t&&this.#t!==this.#e&&(this.#B(this.#t),this.focus());return}if(v.has(i)&&this.#A)return this.#P(i)})}#y(A){this.#e?.classList.remove(n.selectionSelected),this.#e?.classList.remove(n.selectionHovered),this.#t=this.#e=void 0,this.#A=this.#u.children[0],A||this.classList.remove(n.selected),this.#p(A)}#I(A=B){this.#y(A),this.focus()}#P(A){if(this.#O(this.#A)&&A==="ArrowDown")this.#t=this.#A,this.#A.classList.add(n.selectionHovered);else if(!Y(this.#A,this.#r))this.#A.scrollIntoView(this.#n.scrollBehavior);else{let e=Q[A];if(this.#A[e]){let i=Q[A],t=this.#A;for(;t=t[i],!(!t[i]||!Y(t,this.#r)||this.#V(t)););this.#b(t)||t!==this.#t&&(this.#e?.classList.remove(n.selectionHovered),this.#t?.classList.remove(n.selectionHovered),t.classList.add(n.selectionHovered),this.#t=t),this.#A=t,t.scrollIntoView(this.#n.scrollBehavior)}}}#O(A){return!y(A,tA)}#b(A){return this.#c.get(A)?.configs.disabled}#V(A){return!y(A,rA)}#F(A){return!y(A,iA)}#D(A){return+getComputedStyle(A).getPropertyValue("opacity")}#J(A){A=V(A),this.#S(A),this.#g=A}#S(A){let e=this.#u;if(this.#t)var{value:i}=this.#c.get(this.#t);e.innerHTML="",this.#l.clear(),this.#c.clear(),this.#t=void 0,this.#A=void 0,this.#e=void 0;for(let s=0,{length:o}=A;s<o;s++){let l=A[s],a=document.createElement("div"),[d,p,g={}]=l,{disabled:E,selected:b}=g,L={value:d,label:p,selection:a,configs:g};if(a.classList.add(n.selection),E&&a.classList.add(n.selectionDisabled),b&&!t)var t=d;a.innerHTML=`<span>${p}</span>`,this.#l.set(d,L),this.#c.set(a,L),e.appendChild(a)}if(!this.#o){let s=this.value||"";s&&!this.#l.has(s)&&(s=""),!s&&t&&(s=t),this.#d?(this.#l.has(this.#h)||(s&&this.#l.has(s)?this.#h=s:this.#h=B),this.#p(s,i)):s?this.#o=s:this.#G()}}#T(A){this.#D(this.#r)&&A.scrollIntoView({block:"nearest"})}#G(){this.#A=this.#u.children[0]}#C(){this.#a.innerText=this.placeholder||U,this.#a.classList.add(n.placeholder)}#w(){if(this.value)var A={};else if(this.required){var e=this.name+" is required";A={valueMissing:!0}}this._internals.setValidity(A,e)}#p(A,e){this.#x(A,e)&&this.dispatchEvent(new Event("change"))}#B(A){let{value:e}=this.#c.get(A);this.#p(e)}#x(A,e){if(e){let l=this.#l.get(e);if(l)var{configs:i,selection:t}=l}if(A){let l=this.#l.get(A);if(l){var{label:s,selection:o}=l;this.#a.innerText=s,this.#e?.classList.remove(n.selectionSelected),this.#e?.classList.remove(n.selectionHovered),this.#e=o,this.#A=o,this.#a.classList.remove(n.placeholder),this.classList.add(n.selected),o.classList.add(n.selectionSelected)}else return $(`trying to select value "${A}" that does not exit`)}if(o||(A=B,this.#C(),this.classList.remove(n.selected)),t&&!i.disabled?(t.classList.add(n.selectionHovered),this.#t=t,this.#A=t):o?this.#T(o):this.#G(),A!==this.value)return this.#q(A),this.#w(),!0}#q(A){super.value=A,this._internals.setFormValue(A)}}function k(r,A){D.has(r)&&G(`items are already stored under "${r}".`),A=V(A),D.set(r,A)}const lA=(()=>{let r;return function(){if(!r){let e=document.createElement("style"),i=z;if(S.libraryName!==c){let t=new RegExp(`^${c}`);i=i.replace(t,S.libraryName)}e.textContent=i,document.head.appendChild(e),r=!0}}})();function cA(r=c,A=!0){arguments.length===1&&typeof r=="boolean"&&(A=r,r=c),r!==c&&(S.libraryName=r),customElements.define(r,oA),A&&lA()}let I="numbers-full",aA={"numbers-full":"numbers",numbers:"colors",colors:"numbers-full"},m=document.createElement("style");m.textContent=`
  simple-dropdown.my-dropdown {
    width: 200px;

    .simple-dropdown-selector-wrapper {
      height: 24px;
    }

    .simple-dropdown-selection {
      height: 20px;
    }
  }
`;let dA=document.getElementById("toggle-required"),hA=document.getElementById("toggle-disabled"),uA=document.getElementById("toggle-itemsref"),pA=document.getElementById("toggle-styles"),fA=document.getElementById("simple-dropdown-value"),gA=document.getElementById("form-data-value"),F=document.getElementById("disabled-value"),J=document.getElementById("itemsref-value"),T=document.getElementById("required-value"),u=document.querySelector("simple-dropdown"),bA=document.querySelector("form");setTimeout(()=>{F.innerText=u.disabled||!1,J.innerText=u.itemsref,T.innerText=u.required||!1});dA.addEventListener("click",()=>{u.required=!u.required,T.innerText=u.required});hA.addEventListener("click",()=>{u.disabled=!u.disabled,F.innerText=u.disabled});uA.addEventListener("click",()=>{I=aA[I],u.itemsref=I,J.innerText=u.itemsref});pA.addEventListener("click",()=>{m.parentNode?m.remove():document.head.appendChild(m)});u.addEventListener("change",r=>{fA.innerText=r.target.value});bA.addEventListener("submit",r=>{let A=new FormData(r.target);gA.innerText=A.get("selection"),r.preventDefault()});k("numbers-full",[["one","One"],["two","Two",{disabled:!0}],["three","Three",{disabled:!0}],["four","Four",{disabled:!0}],["five","Five",{disabled:!0}],["six","Six"],["seven","Seven",{disabled:!0}],["eight","Eight"],["nine","Nine"],["ten","Ten"],["eleven","Eleven"]]);k("numbers",[["one","One"],["two","Two"],["three","Three"]]);k("colors",[["green","Green"],["blue","Blue"],["red","Red"],["white","White"],["black","Black"]]);cA();
