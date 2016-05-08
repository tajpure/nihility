function closeDialog(e){$(e).css("display","none")}var dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,n=/[^-+\dA-Z]/g,r=function(e,t){for(e=String(e),t=t||2;e.length<t;)e="0"+e;return e};return function(i,a,s){var o=dateFormat;if(1!=arguments.length||"[object String]"!=Object.prototype.toString.call(i)||/\d/.test(i)||(a=i,i=void 0),i=i?new Date(i):new Date,isNaN(i))throw SyntaxError("invalid date");a=String(o.masks[a]||a||o.masks["default"]),"UTC:"==a.slice(0,4)&&(a=a.slice(4),s=!0);var l=s?"getUTC":"get",c=i[l+"Date"](),u=i[l+"Day"](),h=i[l+"Month"](),f=i[l+"FullYear"](),d=i[l+"Hours"](),g=i[l+"Minutes"](),p=i[l+"Seconds"](),v=i[l+"Milliseconds"](),m=s?0:i.getTimezoneOffset(),b={d:c,dd:r(c),ddd:o.i18n.dayNames[u],dddd:o.i18n.dayNames[u+7],m:h+1,mm:r(h+1),mmm:o.i18n.monthNames[h],mmmm:o.i18n.monthNames[h+12],yy:String(f).slice(2),yyyy:f,h:d%12||12,hh:r(d%12||12),H:d,HH:r(d),M:g,MM:r(g),s:p,ss:r(p),l:r(v,3),L:r(v>99?Math.round(v/10):v),t:12>d?"a":"p",tt:12>d?"am":"pm",T:12>d?"A":"P",TT:12>d?"AM":"PM",Z:s?"UTC":(String(i).match(t)||[""]).pop().replace(n,""),o:(m>0?"-":"+")+r(100*Math.floor(Math.abs(m)/60)+Math.abs(m)%60,4),S:["th","st","nd","rd"][c%10>3?0:(c%100-c%10!=10)*c%10]};return a.replace(e,function(e){return e in b?b[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"},dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},Date.prototype.format=function(e,t){return dateFormat(this,e,t)};var editor=null,socket=io(),snackbarContainer=document.querySelector("#snackbar"),exit=function(){location.href="/logout"},toast=function(e,t,n,r){var i={message:e,timeout:t,actionHandler:n,actionText:r};snackbarContainer.MaterialSnackbar.showSnackbar(i)},initEditor=function(){editor=ace.edit("editor"),editor.getSession().setUseWrapMode(!0),editor.$blockScrolling=1/0,sync()},sync=function(){socket.on("init",function(e){editor.setValue(e,1)}),editor.on("change",function(e){$("#done").css("display","none"),$("#loading").css("display","block");var t=TextSync.sync(editor.getValue());socket.emit("syncText",t),socket.on("syncEnd",function(e){$("#done").css("display","block"),$("#loading").css("display","none")})})},uploadImage=function(){alert("image")},insertLink=function(){editor.insert("[]()")},formatBlod=function(){var e=editor.selection.getRange(),t="**"+editor.getSelectedText()+"**";editor.session.replace(e,t)},formatItalic=function(){var e=editor.selection.getRange(),t="*"+editor.getSelectedText()+"*";editor.session.replace(e,t)},formatListNumbered=function(){var e=editor.selection.getRange(),t=editor.getSelectedText(),n=t.split("\n");t="";for(var r=1;r<=n.length;r++)t+=r+". "+n[r-1]+"\n";editor.session.replace(e,t)},formatListBulleted=function(){var e=editor.selection.getRange(),t=editor.getSelectedText(),n=t.split("\n");t="";for(var r=1;r<=n.length;r++)t+="* "+n[r-1]+"\n";editor.session.replace(e,t)},formatQuote=function(){var e=editor.selection.getRange(),t=editor.getSelectedText(),n=t.split("\n");t="";for(var r=1;r<=n.length;r++)t+="> "+n[r-1]+"\n";editor.session.replace(e,t)},formatCode=function(){var e=editor.selection.getRange(),t="```\n"+editor.getSelectedText()+"\n```";editor.session.replace(e,t)},redo=function(){editor.session.getUndoManager().redo(!0)},undo=function(){editor.session.getUndoManager().undo(!0)},doGet=function(e){$("#progress").fadeIn(),$.ajax({url:e,timeout:3e3,type:"GET",data:{},dataType:"html",error:function(e,t){$("#progress").fadeOut(),"timeout"===t?toast("Timeout!",5e3):toast("Failed!",5e3)}}).done(function(e){$("#progress").fadeOut();var t=$.parseHTML(e,!0);componentHandler.upgradeElements(t),$("#content").html(t)})},newPostPage=function(){if(editor){$("#title").val(),$("#date").val(),$("#Categories").tagit("assignedTags"),$("#Tags").tagit("assignedTags"),editor.getValue()}doGet("/editor")},preview=function(){"block"===$("#editor").css("display")?($("#preview").html(marked(editor.getValue())),$("#editor").hide(),$("#preview").show(),$("#visibility").text("visibility_off")):($("#editor").show(),$("#preview").hide(),$("#visibility").text("visibility"))},newPost=function(){var e=$("#title").val(),t=$("#date").val(),n=$("#Categories").tagit("assignedTags"),r=$("#Tags").tagit("assignedTags"),i=editor.getValue();if(""===e)toast("Please write title!",5e3);else if(""===t)toast("Please write date!",5e3);else if(""===i)toast("Please write content!",5e3);else{var a=new FormData;a.append("title",e),a.append("date",t),a.append("categories",n),a.append("tags",r),a.append("content",i),$("#progress").fadeIn(),$.ajax({url:"/newItem",timeout:3e3,type:"POST",data:a,processData:!1,contentType:!1,error:function(e,t){$("#progress").fadeOut(),"timeout"===t?toast("Timeout!",5e3):toast("Failed!",5e3)}}).done(function(e){$("#progress").fadeOut(),"success"===e?toast("Publish successful!",5e3):toast(e,5e3)})}};!function(e){function t(){return"Markdown.mk_block( "+uneval(this.toString())+", "+uneval(this.trailing)+", "+uneval(this.lineNumber)+" )"}function n(){var e=require("util");return"Markdown.mk_block( "+e.inspect(this.toString())+", "+e.inspect(this.trailing)+", "+e.inspect(this.lineNumber)+" )"}function r(e){for(var t=0,n=-1;-1!==(n=e.indexOf("\n",n+1));)t++;return t}function i(e,t){function n(e){this.len_after=e,this.name="close_"+t}var r=e+"_state",i="strong"==e?"em_state":"strong_state";return function(a,s){if(this[r][0]==t)return this[r].shift(),[a.length,new n(a.length-t.length)];var o=this[i].slice(),l=this[r].slice();this[r].unshift(t);var c=this.processInline(a.substr(t.length)),u=c[c.length-1];this[r].shift();if(u instanceof n){c.pop();var h=a.length-u.len_after;return[h,[e].concat(c)]}return this[i]=o,this[r]=l,[t.length,t]}}function s(e){for(var t=e.split(""),n=[""],r=!1;t.length;){var i=t.shift();switch(i){case" ":r?n[n.length-1]+=i:n.push("");break;case"'":case'"':r=!r;break;case"\\":i=t.shift();default:n[n.length-1]+=i}}return n}function o(e){return v(e)&&e.length>1&&"object"==typeof e[1]&&!v(e[1])?e[1]:void 0}function l(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function c(e){if("string"==typeof e)return l(e);var t=e.shift(),n={},r=[];for(!e.length||"object"!=typeof e[0]||e[0]instanceof Array||(n=e.shift());e.length;)r.push(c(e.shift()));var i="";for(var a in n)i+=" "+a+'="'+l(n[a])+'"';return"img"==t||"br"==t||"hr"==t?"<"+t+i+"/>":"<"+t+i+">"+r.join("")+"</"+t+">"}function u(e,t,n){var r;n=n||{};var i=e.slice(0);"function"==typeof n.preprocessTreeNode&&(i=n.preprocessTreeNode(i,t));var a=o(i);if(a){i[1]={};for(r in a)i[1][r]=a[r];a=i[1]}if("string"==typeof i)return i;switch(i[0]){case"header":i[0]="h"+i[1].level,delete i[1].level;break;case"bulletlist":i[0]="ul";break;case"numberlist":i[0]="ol";break;case"listitem":i[0]="li";break;case"para":i[0]="p";break;case"markdown":i[0]="html",a&&delete a.references;break;case"code_block":i[0]="pre",r=a?2:1;var s=["code"];s.push.apply(s,i.splice(r,i.length-r)),i[r]=s;break;case"inlinecode":i[0]="code";break;case"img":i[1].src=i[1].href,delete i[1].href;break;case"linebreak":i[0]="br";break;case"link":i[0]="a";break;case"link_ref":i[0]="a";var l=t[a.ref];if(!l)return a.original;delete a.ref,a.href=l.href,l.title&&(a.title=l.title),delete a.original;break;case"img_ref":i[0]="img";var l=t[a.ref];if(!l)return a.original;delete a.ref,a.src=l.href,l.title&&(a.title=l.title),delete a.original}if(r=1,a){for(var c in i[1]){r=2;break}1===r&&i.splice(r,1)}for(;r<i.length;++r)i[r]=u(i[r],t,n);return i}function h(e){for(var t=o(e)?2:1;t<e.length;)"string"==typeof e[t]?t+1<e.length&&"string"==typeof e[t+1]?e[t]+=e.splice(t+1,1)[0]:++t:(h(e[t]),++t)}var f=e.Markdown=function(e){switch(typeof e){case"undefined":this.dialect=f.dialects.Gruber;break;case"object":this.dialect=e;break;default:if(!(e in f.dialects))throw new Error("Unknown Markdown dialect '"+String(e)+"'");this.dialect=f.dialects[e]}this.em_state=[],this.strong_state=[],this.debug_indent=""};e.parse=function(e,t){var n=new f(t);return n.toTree(e)},e.toHTML=function(t,n,r){var i=e.toHTMLTree(t,n,r);return e.renderJsonML(i)},e.toHTMLTree=function(e,t,n){"string"==typeof e&&(e=this.parse(e,t));var r=o(e),i={};r&&r.references&&(i=r.references);var a=u(e,i,n);return h(a),a};var d=f.mk_block=function(e,r,i){1==arguments.length&&(r="\n\n");var a=new String(e);return a.trailing=r,a.inspect=n,a.toSource=t,void 0!=i&&(a.lineNumber=i),a};f.prototype.split_blocks=function(e,t){e=e.replace(/(\r\n|\n|\r)/g,"\n");var n,i=/([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,a=[],s=1;for(null!=(n=/^(\s*\n)/.exec(e))&&(s+=r(n[0]),i.lastIndex=n[0].length);null!==(n=i.exec(e));)"\n#"==n[2]&&(n[2]="\n",i.lastIndex--),a.push(d(n[1],n[2],s)),s+=r(n[0]);return a},f.prototype.processBlock=function(e,t){var n=this.dialect.block,r=n.__order__;if("__call__"in n)return n.__call__.call(this,e,t);for(var i=0;i<r.length;i++){var a=n[r[i]].call(this,e,t);if(a)return(!v(a)||a.length>0&&!v(a[0]))&&this.debug(r[i],"didn't return a proper array"),a}return[]},f.prototype.processInline=function(e){return this.dialect.inline.__call__.call(this,String(e))},f.prototype.toTree=function(e,t){var n=e instanceof Array?e:this.split_blocks(e),r=this.tree;try{for(this.tree=t||this.tree||["markdown"];n.length;){var i=this.processBlock(n.shift(),n);i.length&&this.tree.push.apply(this.tree,i)}return this.tree}finally{t&&(this.tree=r)}},f.prototype.debug=function(){var e=Array.prototype.slice.call(arguments);e.unshift(this.debug_indent),"undefined"!=typeof print&&print.apply(print,e),"undefined"!=typeof console&&"undefined"!=typeof console.log&&console.log.apply(null,e)},f.prototype.loop_re_over_block=function(e,t,n){for(var r,i=t.valueOf();i.length&&null!=(r=e.exec(i));)i=i.substr(r[0].length),n.call(this,r);return i},f.dialects={},f.dialects.Gruber={block:{atxHeader:function(e,t){var n=e.match(/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/);if(n){var r=["header",{level:n[1].length}];return Array.prototype.push.apply(r,this.processInline(n[2])),n[0].length<e.length&&t.unshift(d(e.substr(n[0].length),e.trailing,e.lineNumber+2)),[r]}},setextHeader:function(e,t){var n=e.match(/^(.*)\n([-=])\2\2+(?:\n|$)/);if(n){var r="="===n[2]?1:2,i=["header",{level:r},n[1]];return n[0].length<e.length&&t.unshift(d(e.substr(n[0].length),e.trailing,e.lineNumber+2)),[i]}},code:function(e,t){var n=[],r=/^(?: {0,3}\t| {4})(.*)\n?/;if(e.match(r)){e:for(;;){var i=this.loop_re_over_block(r,e.valueOf(),function(e){n.push(e[1])});if(i.length){t.unshift(d(i,e.trailing));break e}if(!t.length)break e;if(!t[0].match(r))break e;n.push(e.trailing.replace(/[^\n]/g,"").substring(2)),e=t.shift()}return[["code_block",n.join("\n")]]}},horizRule:function(e,t){var n=e.match(/^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/);if(n){var r=[["hr"]];return n[1]&&r.unshift.apply(r,this.processBlock(n[1],[])),n[3]&&t.unshift(d(n[3])),r}},lists:function(){function e(e){return new RegExp("(?:^("+l+"{0,"+e+"} {0,3})("+a+")\\s+)|(^"+l+"{0,"+(e-1)+"}[ ]{0,4})")}function t(e){return e.replace(/ {0,3}\t/g,"    ")}function n(e,t,n,r){if(t)return void e.push(["para"].concat(n));var i=e[e.length-1]instanceof Array&&"para"==e[e.length-1][0]?e[e.length-1]:e;r&&e.length>1&&n.unshift(r);for(var a=0;a<n.length;a++){var s=n[a],o="string"==typeof s;o&&i.length>1&&"string"==typeof i[i.length-1]?i[i.length-1]+=s:i.push(s)}}function r(e,t){for(var n=new RegExp("^("+l+"{"+e+"}.*?\\n?)*$"),r=new RegExp("^"+l+"{"+e+"}","gm"),i=[];t.length>0&&n.exec(t[0]);){var a=t.shift(),s=a.replace(r,"");i.push(d(s,a.trailing,a.lineNumber))}return i}function i(e,t,n){var r=e.list,i=r[r.length-1];if(!(i[1]instanceof Array&&"para"==i[1][0]))if(t+1==n.length)i.push(["para"].concat(i.splice(1,i.length-1)));else{var a=i.pop();i.push(["para"].concat(i.splice(1,i.length-1)),a)}}var a="[*+-]|\\d+\\.",s=/[*+-]/,o=new RegExp("^( {0,3})("+a+")[ 	]+"),l="(?: {0,3}\\t| {4})";return function(a,l){function c(e){var t=s.exec(e[2])?["bulletlist"]:["numberlist"];return d.push({list:t,indent:e[1]}),t}var u=a.match(o);if(u){for(var h,f,d=[],p=c(u),v=!1,m=[d[0].list];;){for(var b=a.split(/(?=\n)/),y="",_=0;_<b.length;_++){var k="",T=b[_].replace(/^\n/,function(e){return k=e,""}),M=e(d.length);if(u=T.match(M),void 0!==u[1]){y.length&&(n(h,v,this.processInline(y),k),v=!1,y=""),u[1]=t(u[1]);var $=Math.floor(u[1].length/4)+1;if($>d.length)p=c(u),h.push(p),h=p[1]=["listitem"];else{var w=!1;for(f=0;f<d.length;f++)if(d[f].indent==u[1]){p=d[f].list,d.splice(f+1,d.length-(f+1)),w=!0;break}w||($++,$<=d.length?(d.splice($,d.length-$),p=d[$-1].list):(p=c(u),h.push(p))),h=["listitem"],p.push(h)}k=""}T.length>u[0].length&&(y+=k+T.substr(u[0].length))}y.length&&(n(h,v,this.processInline(y),k),v=!1,y="");var S=r(d.length,l);S.length>0&&(g(d,i,this),h.push.apply(h,this.toTree(S,[])));var x=l[0]&&l[0].valueOf()||"";if(!x.match(o)&&!x.match(/^ /))break;a=l.shift();var C=this.dialect.block.horizRule(a,l);if(C){m.push.apply(m,C);break}g(d,i,this),v=!0}return m}}}(),blockquote:function(e,t){if(e.match(/^>/m)){var n=[];if(">"!=e[0]){for(var r=e.split(/\n/),i=[],a=e.lineNumber;r.length&&">"!=r[0][0];)i.push(r.shift()),a++;var s=d(i.join("\n"),"\n",e.lineNumber);n.push.apply(n,this.processBlock(s,[])),e=d(r.join("\n"),e.trailing,a)}for(;t.length&&">"==t[0][0];){var l=t.shift();e=d(e+e.trailing+l,l.trailing,e.lineNumber)}var c=e.replace(/^> ?/gm,""),u=(this.tree,this.toTree(c,["blockquote"])),h=o(u);return h&&h.references&&(delete h.references,m(h)&&u.splice(1,1)),n.push(u),n}},referenceDefn:function(e,t){var n=/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;if(e.match(n)){o(this.tree)||this.tree.splice(1,0,{});var r=o(this.tree);void 0===r.references&&(r.references={});var i=this.loop_re_over_block(n,e,function(e){e[2]&&"<"==e[2][0]&&">"==e[2][e[2].length-1]&&(e[2]=e[2].substring(1,e[2].length-1));var t=r.references[e[1].toLowerCase()]={href:e[2]};void 0!==e[4]?t.title=e[4]:void 0!==e[5]&&(t.title=e[5])});return i.length&&t.unshift(d(i,e.trailing)),[]}},para:function(e,t){return[["para"].concat(this.processInline(e))]}}},f.dialects.Gruber.inline={__oneElement__:function(e,t,n){var r,i;t=t||this.dialect.inline.__patterns__;var a=new RegExp("([\\s\\S]*?)("+(t.source||t)+")");if(r=a.exec(e),!r)return[e.length,e];if(r[1])return[r[1].length,r[1]];var i;return r[2]in this.dialect.inline&&(i=this.dialect.inline[r[2]].call(this,e.substr(r.index),r,n||[])),i=i||[r[2].length,r[2]]},__call__:function(e,t){function n(e){"string"==typeof e&&"string"==typeof i[i.length-1]?i[i.length-1]+=e:i.push(e)}for(var r,i=[];e.length>0;)r=this.dialect.inline.__oneElement__.call(this,e,t,i),e=e.substr(r.shift()),g(r,n);return i},"]":function(){},"}":function(){},__escape__:/^\\[\\`\*_{}\[\]()#\+.!\-]/,"\\":function(e){return this.dialect.inline.__escape__.exec(e)?[2,e.charAt(1)]:[1,"\\"]},"![":function(e){var t=e.match(/^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/);if(t){t[2]&&"<"==t[2][0]&&">"==t[2][t[2].length-1]&&(t[2]=t[2].substring(1,t[2].length-1)),t[2]=this.dialect.inline.__call__.call(this,t[2],/\\/)[0];var n={alt:t[1],href:t[2]||""};return void 0!==t[4]&&(n.title=t[4]),[t[0].length,["img",n]]}return t=e.match(/^!\[(.*?)\][ \t]*\[(.*?)\]/),t?[t[0].length,["img_ref",{alt:t[1],ref:t[2].toLowerCase(),original:t[0]}]]:[2,"!["]},"[":function b(e){var t=String(e),n=f.DialectHelpers.inline_until_char.call(this,e.substr(1),"]");if(!n)return[1,"["];var b,r,i=1+n[0],a=n[1];e=e.substr(i);var s=e.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);if(s){var o=s[1];if(i+=s[0].length,o&&"<"==o[0]&&">"==o[o.length-1]&&(o=o.substring(1,o.length-1)),!s[3])for(var l=1,c=0;c<o.length;c++)switch(o[c]){case"(":l++;break;case")":0==--l&&(i-=o.length-c,o=o.substring(0,c))}return o=this.dialect.inline.__call__.call(this,o,/\\/)[0],r={href:o||""},void 0!==s[3]&&(r.title=s[3]),b=["link",r].concat(a),[i,b]}return s=e.match(/^\s*\[(.*?)\]/),s?(i+=s[0].length,r={ref:(s[1]||String(a)).toLowerCase(),original:t.substr(0,i)},b=["link_ref",r].concat(a),[i,b]):1==a.length&&"string"==typeof a[0]?(r={ref:a[0].toLowerCase(),original:t.substr(0,i)},b=["link_ref",r,a[0]],[i,b]):[1,"["]},"<":function(e){var t;return null!=(t=e.match(/^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/))?t[3]?[t[0].length,["link",{href:"mailto:"+t[3]},t[3]]]:"mailto"==t[2]?[t[0].length,["link",{href:t[1]},t[1].substr("mailto:".length)]]:[t[0].length,["link",{href:t[1]},t[1]]]:[1,"<"]},"`":function(e){var t=e.match(/(`+)(([\s\S]*?)\1)/);return t&&t[2]?[t[1].length+t[2].length,["inlinecode",t[3]]]:[1,"`"]},"  \n":function(e){return[3,["linebreak"]]}},f.dialects.Gruber.inline["**"]=i("strong","**"),f.dialects.Gruber.inline.__=i("strong","__"),f.dialects.Gruber.inline["*"]=i("em","*"),f.dialects.Gruber.inline._=i("em","_"),f.buildBlockOrder=function(e){var t=[];for(var n in e)"__order__"!=n&&"__call__"!=n&&t.push(n);e.__order__=t},f.buildInlinePatterns=function(e){var t=[];for(var n in e)if(!n.match(/^__.*__$/)){var r=n.replace(/([\\.*+?|()\[\]{}])/g,"\\$1").replace(/\n/,"\\n");t.push(1==n.length?r:"(?:"+r+")")}t=t.join("|"),e.__patterns__=t;var i=e.__call__;e.__call__=function(e,n){return void 0!=n?i.call(this,e,n):i.call(this,e,t)}},f.DialectHelpers={},f.DialectHelpers.inline_until_char=function(e,t){for(var n=0,r=[];;){if(e.charAt(n)==t)return n++,[n,r];if(n>=e.length)return null;var i=this.dialect.inline.__oneElement__.call(this,e.substr(n));n+=i[0],r.push.apply(r,i.slice(1))}},f.subclassDialect=function(e){function t(){}function n(){}return t.prototype=e.block,n.prototype=e.inline,{block:new t,inline:new n}},f.buildBlockOrder(f.dialects.Gruber.block),f.buildInlinePatterns(f.dialects.Gruber.inline),f.dialects.Maruku=f.subclassDialect(f.dialects.Gruber),f.dialects.Maruku.processMetaHash=function(e){for(var t=s(e),n={},r=0;r<t.length;++r)if(/^#/.test(t[r]))n.id=t[r].substring(1);else if(/^\./.test(t[r]))n["class"]?n["class"]=n["class"]+t[r].replace(/./," "):n["class"]=t[r].substring(1);else if(/\=/.test(t[r])){var i=t[r].split(/\=/);n[i[0]]=i[1]}return n},f.dialects.Maruku.block.document_meta=function(e,t){if(!(e.lineNumber>1)&&e.match(/^(?:\w+:.*\n)*\w+:.*$/)){o(this.tree)||this.tree.splice(1,0,{});var n=e.split(/\n/);for(p in n){var r=n[p].match(/(\w+):\s*(.*)$/),i=r[1].toLowerCase(),a=r[2];this.tree[1][i]=a}return[]}},f.dialects.Maruku.block.block_meta=function(e,t){var n=e.match(/(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/);if(n){var r,i=this.dialect.processMetaHash(n[2]);if(""===n[1]){var s=this.tree[this.tree.length-1];if(r=o(s),"string"==typeof s)return;r||(r={},s.splice(1,0,r));for(a in i)r[a]=i[a];return[]}var l=e.replace(/\n.*$/,""),c=this.processBlock(l,[]);r=o(c[0]),r||(r={},c[0].splice(1,0,r));for(a in i)r[a]=i[a];return c}},f.dialects.Maruku.block.definition_list=function(e,t){var n,r,i=/^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,a=["dl"];if(r=e.match(i)){for(var s=[e];t.length&&i.exec(t[0]);)s.push(t.shift());for(var o=0;o<s.length;++o){var r=s[o].match(i),l=r[1].replace(/\n$/,"").split(/\n/),c=r[2].split(/\n:\s+/);for(n=0;n<l.length;++n)a.push(["dt",l[n]]);for(n=0;n<c.length;++n)a.push(["dd"].concat(this.processInline(c[n].replace(/(\n)\s+/,"$1"))))}return[a]}},f.dialects.Maruku.block.table=function y(e,t){var n,r,i=function(e,t){t=t||"\\s",t.match(/^[\\|\[\]{}?*.+^$]$/)&&(t="\\"+t);for(var n,r=[],i=new RegExp("^((?:\\\\.|[^\\\\"+t+"])*)"+t+"(.*)");n=e.match(i);)r.push(n[1]),e=n[2];return r.push(e),r},a=/^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,s=/^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/;if(r=e.match(a))r[3]=r[3].replace(/^\s*\|/gm,"");else if(!(r=e.match(s)))return;var y=["table",["thead",["tr"]],["tbody"]];r[2]=r[2].replace(/\|\s*$/,"").split("|");var o=[];for(g(r[2],function(e){e.match(/^\s*-+:\s*$/)?o.push({align:"right"}):e.match(/^\s*:-+\s*$/)?o.push({align:"left"}):e.match(/^\s*:-+:\s*$/)?o.push({align:"center"}):o.push({})}),r[1]=i(r[1].replace(/\|\s*$/,""),"|"),n=0;n<r[1].length;n++)y[1][1].push(["th",o[n]||{}].concat(this.processInline(r[1][n].trim())));return g(r[3].replace(/\|\s*$/gm,"").split("\n"),function(e){var t=["tr"];for(e=i(e,"|"),n=0;n<e.length;n++)t.push(["td",o[n]||{}].concat(this.processInline(e[n].trim())));y[2].push(t)},this),[y]},f.dialects.Maruku.inline["{:"]=function(e,t,n){if(!n.length)return[2,"{:"];var r=n[n.length-1];if("string"==typeof r)return[2,"{:"];var i=e.match(/^\{:\s*((?:\\\}|[^\}])*)\s*\}/);if(!i)return[2,"{:"];var a=this.dialect.processMetaHash(i[1]),s=o(r);s||(s={},r.splice(1,0,s));for(var l in a)s[l]=a[l];return[i[0].length,""]},f.dialects.Maruku.inline.__escape__=/^\\[\\`\*_{}\[\]()#\+.!\-|:]/,f.buildBlockOrder(f.dialects.Maruku.block),f.buildInlinePatterns(f.dialects.Maruku.inline);var g,v=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)};g=Array.prototype.forEach?function(e,t,n){return e.forEach(t,n)}:function(e,t,n){for(var r=0;r<e.length;r++)t.call(n||e,e[r],r,e)};var m=function(e){for(var t in e)if(hasOwnProperty.call(e,t))return!1;return!0};e.renderJsonML=function(e,t){t=t||{},t.root=t.root||!1;var n=[];if(t.root)n.push(c(e));else for(e.shift(),!e.length||"object"!=typeof e[0]||e[0]instanceof Array||e.shift();e.length;)n.push(c(e.shift()));return n.join("\n\n")}}(function(){return"undefined"==typeof exports?(window.markdown={},window.markdown):exports}()),function(){"use strict";function e(e,t){var n=(65535&e)+(65535&t),r=(e>>16)+(t>>16)+(n>>16);return r<<16|65535&n}function t(e,t){return e<<t|e>>>32-t}function n(n,r,i,a,s,o){return e(t(e(e(r,n),e(a,o)),s),i)}function r(e,t,r,i,a,s,o){return n(t&r|~t&i,e,t,a,s,o)}function i(e,t,r,i,a,s,o){return n(t&i|r&~i,e,t,a,s,o)}function a(e,t,r,i,a,s,o){return n(t^r^i,e,t,a,s,o)}function s(e,t,r,i,a,s,o){return n(r^(t|~i),e,t,a,s,o)}function o(t,n){t[n>>5]|=128<<n%32,t[(n+64>>>9<<4)+14]=n;var o,l,c,u,h,f=1732584193,d=-271733879,g=-1732584194,p=271733878;for(o=0;o<t.length;o+=16)l=f,c=d,u=g,h=p,f=r(f,d,g,p,t[o],7,-680876936),p=r(p,f,d,g,t[o+1],12,-389564586),g=r(g,p,f,d,t[o+2],17,606105819),d=r(d,g,p,f,t[o+3],22,-1044525330),f=r(f,d,g,p,t[o+4],7,-176418897),p=r(p,f,d,g,t[o+5],12,1200080426),g=r(g,p,f,d,t[o+6],17,-1473231341),d=r(d,g,p,f,t[o+7],22,-45705983),f=r(f,d,g,p,t[o+8],7,1770035416),p=r(p,f,d,g,t[o+9],12,-1958414417),g=r(g,p,f,d,t[o+10],17,-42063),d=r(d,g,p,f,t[o+11],22,-1990404162),f=r(f,d,g,p,t[o+12],7,1804603682),p=r(p,f,d,g,t[o+13],12,-40341101),g=r(g,p,f,d,t[o+14],17,-1502002290),d=r(d,g,p,f,t[o+15],22,1236535329),f=i(f,d,g,p,t[o+1],5,-165796510),p=i(p,f,d,g,t[o+6],9,-1069501632),g=i(g,p,f,d,t[o+11],14,643717713),d=i(d,g,p,f,t[o],20,-373897302),f=i(f,d,g,p,t[o+5],5,-701558691),p=i(p,f,d,g,t[o+10],9,38016083),g=i(g,p,f,d,t[o+15],14,-660478335),d=i(d,g,p,f,t[o+4],20,-405537848),f=i(f,d,g,p,t[o+9],5,568446438),p=i(p,f,d,g,t[o+14],9,-1019803690),g=i(g,p,f,d,t[o+3],14,-187363961),d=i(d,g,p,f,t[o+8],20,1163531501),f=i(f,d,g,p,t[o+13],5,-1444681467),p=i(p,f,d,g,t[o+2],9,-51403784),g=i(g,p,f,d,t[o+7],14,1735328473),d=i(d,g,p,f,t[o+12],20,-1926607734),f=a(f,d,g,p,t[o+5],4,-378558),p=a(p,f,d,g,t[o+8],11,-2022574463),g=a(g,p,f,d,t[o+11],16,1839030562),d=a(d,g,p,f,t[o+14],23,-35309556),f=a(f,d,g,p,t[o+1],4,-1530992060),p=a(p,f,d,g,t[o+4],11,1272893353),g=a(g,p,f,d,t[o+7],16,-155497632),d=a(d,g,p,f,t[o+10],23,-1094730640),f=a(f,d,g,p,t[o+13],4,681279174),p=a(p,f,d,g,t[o],11,-358537222),g=a(g,p,f,d,t[o+3],16,-722521979),d=a(d,g,p,f,t[o+6],23,76029189),f=a(f,d,g,p,t[o+9],4,-640364487),p=a(p,f,d,g,t[o+12],11,-421815835),g=a(g,p,f,d,t[o+15],16,530742520),d=a(d,g,p,f,t[o+2],23,-995338651),f=s(f,d,g,p,t[o],6,-198630844),p=s(p,f,d,g,t[o+7],10,1126891415),g=s(g,p,f,d,t[o+14],15,-1416354905),d=s(d,g,p,f,t[o+5],21,-57434055),f=s(f,d,g,p,t[o+12],6,1700485571),p=s(p,f,d,g,t[o+3],10,-1894986606),g=s(g,p,f,d,t[o+10],15,-1051523),d=s(d,g,p,f,t[o+1],21,-2054922799),f=s(f,d,g,p,t[o+8],6,1873313359),p=s(p,f,d,g,t[o+15],10,-30611744),g=s(g,p,f,d,t[o+6],15,-1560198380),d=s(d,g,p,f,t[o+13],21,1309151649),f=s(f,d,g,p,t[o+4],6,-145523070),p=s(p,f,d,g,t[o+11],10,-1120210379),g=s(g,p,f,d,t[o+2],15,718787259),d=s(d,g,p,f,t[o+9],21,-343485551),f=e(f,l),d=e(d,c),g=e(g,u),p=e(p,h);return[f,d,g,p]}function l(e){var t,n="";for(t=0;t<32*e.length;t+=8)n+=String.fromCharCode(e[t>>5]>>>t%32&255);return n}function c(e){var t,n=[];for(n[(e.length>>2)-1]=void 0,t=0;t<n.length;t+=1)n[t]=0;for(t=0;t<8*e.length;t+=8)n[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return n}function u(e){return l(o(c(e),8*e.length))}function h(e,t){var n,r,i=c(e),a=[],s=[];for(a[15]=s[15]=void 0,i.length>16&&(i=o(i,8*e.length)),n=0;16>n;n+=1)a[n]=909522486^i[n],s[n]=1549556828^i[n];return r=o(a.concat(c(t)),512+8*t.length),l(o(s.concat(r),640))}function f(e){var t,n,r="0123456789abcdef",i="";for(n=0;n<e.length;n+=1)t=e.charCodeAt(n),i+=r.charAt(t>>>4&15)+r.charAt(15&t);return i}function d(e){return unescape(encodeURIComponent(e))}function g(e){return u(d(e))}function p(e){return f(g(e))}function v(e,t){return h(d(e),d(t))}function m(e,t){return f(v(e,t))}function b(e,t,n){return t?n?v(t,e):m(t,e):n?g(e):p(e)}this.TextSync={dist:null,ChunkSize:64,sync:function(e){var t=this.cmp(e,this.dist);return this.dist=e,t},toChunks:function(e){for(var t=new Array,n=0,r=0;n<e.length;n+=this.ChunkSize,r++){var i=e.slice(n,n+this.ChunkSize),a=y.checksum(i,!0),s=b(i);t[r]={id:r,r:a,s:s,data:i}}return t},cmp:function(e,t){for(var n=this.toChunks(e),r=[],i=[],a=0;a<n.length;a++)r[n[a].r]=n[a];if(t)for(var s=0;s<t.length;s++){var o=t.slice(s,s+this.ChunkSize),l=y.checksum(o);if(r[l]){var c=r[l],u=b(o);u===c.s&&(c.find=!0,c.pos=s,s=s+this.ChunkSize-1)}}for(var h in r){var f=r[h];f.find?i[f.id]={id:f.id,pos:f.pos,data:null}:i[f.id]={id:f.id,pos:null,data:f.data.toString("ascii")}}return i}};var y={last:null,checksum:function(e,t){var n=this.strToBuffer(e),r=n.length,i=Math.pow(2,64),a=0,s=0,o=this.last;if(o&&!t)a=(o.a-o.buffer[0]+n[r-1])%i,s=(o.b-r*o.buffer[0]+a)%i,o={buffer:n,a:a,b:s,s:a+i*s},this.last=o;else{for(var l=0;r>=l+1;l++)a+=n[l],s+=(r-l)*n[l];a%=i,s%=i,o={buffer:n,a:a,b:s,s:a+i*s}}return o.s},strToBuffer:function(e){for(var t=[],n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}};"function"==typeof define&&define.amd?define(function(){return b}):"object"==typeof module&&module.exports?module.exports=b:$.md5=b}.call(this);