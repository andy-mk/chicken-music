(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-16eafe6d"],{"1b71":function(t,e,i){"use strict";i("7f7f");var s=i("d225"),a=function t(e){var i=e.id,a=e.name,n=e.image;Object(s["a"])(this,t),this.id=i,this.name=a,this.image="".concat(n,"?param=140y140&type=webp")};e["a"]=a},"1db7":function(t,e,i){"use strict";var s=i("bf06"),a=i.n(s);a.a},"2d3b":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("transition",{attrs:{name:"slide"}},[i("div",{staticClass:"search"},[i("div",{staticClass:"header"},[i("h2",{staticClass:"title"},[t._v("搜 索")]),i("div",{staticClass:"back",on:{click:t.back}},[i("i",{staticClass:"iconfont icon-fanhui"})])]),i("div",{staticClass:"search-box-wrapper"},[i("div",{staticClass:"search-box"},[i("i",{staticClass:"iconfont icon-chaxun"}),i("input",{directives:[{name:"model",rawName:"v-model",value:t.keyword,expression:"keyword"}],staticClass:"box",attrs:{placeholder:" 搜索歌曲、歌手",type:"text"},domProps:{value:t.keyword},on:{input:function(e){e.target.composing||(t.keyword=e.target.value)}}}),i("i",{directives:[{name:"show",rawName:"v-show",value:t.keyword.length,expression:"keyword.length"}],staticClass:"iconfont icon-cha",on:{click:t.clearContent}})])]),i("div",{ref:"scrollCon",staticClass:"scroll-container"},[i("div",{staticClass:"search-shortcut"},[i("Scroll",{attrs:{data:this.hots}},[i("div",{directives:[{name:"show",rawName:"v-show",value:this.hots.length,expression:"this.hots.length"}],staticClass:"search-hot"},[i("h2",{staticClass:"title"},[t._v("热门搜索")]),i("ul",{staticClass:"list"},t._l(t.hots,function(e,s){return i("li",{key:s,staticClass:"item",on:{click:function(e){return t.selectHotShortcut(s)}}},[i("span",[t._v(t._s(e.first))])])}),0)]),i("div",{directives:[{name:"show",rawName:"v-show",value:this.history.length,expression:"this.history.length"}],staticClass:"search-history"},[i("h2",{staticClass:"title"},[i("span",{staticClass:"text"},[t._v("搜索历史")]),i("span",{staticClass:"clear",on:{click:t.confirm}},[i("i",{staticClass:"iconfont icon-lajitong"})])]),i("ul",{staticClass:"list"},t._l(t.history,function(e,s){return i("li",{key:s,staticClass:"item",on:{click:function(e){return t.selectHistoryShortcut(s)}}},[i("span",{staticClass:"name"},[t._v(t._s(e))]),i("span",{staticClass:"remove",on:{click:function(e){return e.stopPropagation(),t.remove(s)}}},[i("i",{staticClass:"iconfont icon-cha"})])])}),0)])])],1),i("div",{directives:[{name:"show",rawName:"v-show",value:t.keyword.length,expression:"keyword.length"}],staticClass:"search-content"},[i("Scroll",{attrs:{data:t.searchData}},[i("Loading",{directives:[{name:"show",rawName:"v-show",value:t.searching,expression:"searching"}]}),i("div",{directives:[{name:"show",rawName:"v-show",value:t.recommendSinger.id||t.recommendPlaylist.id,expression:"recommendSinger.id || recommendPlaylist.id"}],staticClass:"recommend"},[i("p",{staticClass:"title"},[t._v("最佳匹配")]),i("div",{directives:[{name:"show",rawName:"v-show",value:t.recommendSinger.id,expression:"recommendSinger.id"}],staticClass:"singer",on:{click:t.selectSinger}},[i("img",{staticClass:"image",attrs:{src:t.recommendSinger.image}}),i("span",{staticClass:"name"},[t._v("歌手："+t._s(t.recommendSinger.name))])]),i("div",{directives:[{name:"show",rawName:"v-show",value:t.recommendPlaylist.id,expression:"recommendPlaylist.id"}],staticClass:"playlist",on:{click:t.selectPlaylist}},[i("img",{staticClass:"image",attrs:{src:t.recommendPlaylist.image}}),i("span",{staticClass:"name"},[t._v("歌单："+t._s(t.recommendPlaylist.name))])])]),i("ul",{staticClass:"songlist"},t._l(this.searchData,function(e,s){return i("li",{key:e.id,staticClass:"item",on:{click:function(e){return t.selectSong(s)}}},[i("p",{staticClass:"name"},[t._v(t._s(e.name))]),i("p",{staticClass:"singer"},[t._v(t._s(t._formatSingerName(e.artists)))])])}),0)],1)],1)]),i("Confirm",{directives:[{name:"show",rawName:"v-show",value:t.tabWin,expression:"tabWin"}],attrs:{hint:"所有搜索历史"},on:{clear:t.clear,cancel:t.cancel}}),i("transition",{attrs:{name:"router"}},[i("router-view",{staticClass:"router-view"})],1)],1)])},a=[],n=(i("7f7f"),i("ac6a"),i("5df3"),i("cebc")),r=i("2f62"),c=i("1a55"),o=i("a381"),l=i("1b71"),h=i("675e"),u=i("351b"),d=i("bc3a"),m=i.n(d),f=i("da71");function g(){return m.a.get("".concat(f["a"],"/search/hot")).then(function(t){return t.data.result})}function v(t){return m.a.get("".concat(f["a"],"/search?keywords=").concat(t)).then(function(t){return t.data.result.songs})}function y(t){return m.a.get("".concat(f["a"],"/search/suggest?keywords=").concat(t)).then(function(t){return t.data.result})}var p=i("b3df"),w=i("e08a"),C=i("c154"),b=new u["a"]("history",15),_={mixins:[c["a"]],data:function(){return{keyword:"",tabWin:!1,searching:!1,hots:[],history:[],searchData:[],recommendSinger:{},recommendPlaylist:{},empty:!1}},computed:Object(n["a"])({},Object(r["c"])(["playlist","currentIndex","sequenceList"])),methods:Object(n["a"])({},Object(r["b"])(["setFullScreen","setCurrentSong","setPlaylist","setSequenceList","setCurrentIndex"]),{back:function(){this.$router.back(),this.keyword=""},clear:function(){this.history=[],this.tabWin=!1},cancel:function(){this.tabWin=!1},confirm:function(){this.tabWin=!0},remove:function(t){this._removeHistory(t),this.history=b.get()},clearContent:function(){this.keyword="",this.searchData=[]},selectHotShortcut:function(t){this.keyword=this.hots[t].first},selectHistoryShortcut:function(t){this.keyword=this.history[t]},selectSong:function(t){var e=this.searchData[t].id;this._getSongDetail(e),this._pushHistory()},selectSinger:function(){this.$router.push("/search/singer/".concat(this.recommendSinger.id)),this._pushHistory()},selectPlaylist:function(){this.$router.push("/search/playlist/".concat(this.recommendPlaylist.id)),this._pushHistory()},_formatSingerName:function(t){return Object(h["d"])(t)},_getData:function(){var t=this;g().then(function(e){t.hots=e.hots}),this.history=b.get()},_searchData:function(t){var e=this;Promise.all([v(t),y(t)]).then(function(t){if(!e.empty){e.searchData=t[0];var i={};t[1].artists&&(i=t[1].artists[0]);var s={};t[1].playlists&&(s=t[1].playlists[0]),e.recommendSinger=new l["a"]({id:i.id,name:i.name,image:i.picUrl+"?param=140y140&type=webp"}),e.recommendPlaylist={id:s.id,name:s.name,image:s.coverImgUrl+"?param=140y140&type=webp"},e.searching=!1}})},_getSongDetail:function(t){var e=this;o["a"].getDetail(t).then(function(t){var i=Object(o["b"])(t[0]);e._setSong(i)})},_setSong:function(t){this.setSequenceList([t]),this.setPlaylist(this.sequenceList),this.setCurrentIndex(0),this.setCurrentSong(this.playlist[this.currentIndex]),this.setFullScreen(!0)},_clearData:function(){this.searchData=[],this.recommendSinger={},this.recommendPlaylist={},this.empty=!0,clearTimeout(this.timer)},_pushHistory:function(){for(var t=b.get(),e=0;e<t.length;e++)if(t[e]===this.keyword){b.remove(e);break}b.push(this.keyword),this.history=b.get()},_removeHistory:function(t){b.remove(t)}}),watch:{playlist:function(t){this._resetScroll(t,this.$refs.scrollCon)},keyword:function(t){var e=this;if(0===t.length||""===t||" "===t)return this.searching=!1,void this._clearData();this.empty=!1,this.searching=!0,this.timer&&clearTimeout(this.timer),this.timer=setTimeout(function(){e._searchData(t)},500)}},components:{Scroll:p["a"],Confirm:w["a"],Loading:C["a"]},created:function(){this._getData()},mounted:function(){this._resetScroll(this.playlist,this.$refs.scrollCon)}},k=_,S=(i("1db7"),i("2877")),x=Object(S["a"])(k,s,a,!1,null,"11c3b2b6",null);e["default"]=x.exports},"5df3":function(t,e,i){"use strict";var s=i("02f4")(!0);i("01f9")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,i=this._i;return i>=e.length?{value:void 0,done:!0}:(t=s(e,i),this._i+=t.length,{value:t,done:!1})})},a381:function(t,e,i){"use strict";i.d(e,"a",function(){return h}),i.d(e,"b",function(){return m});i("6b54"),i("ac6a"),i("7f7f");var s=i("d225"),a=i("b0b4"),n=i("da71"),r=i("351b"),c=i("bc3a"),o=i.n(c),l=new r["a"]("like"),h=function(){function t(e){var i=e.id,a=e.name,n=e.singer,r=e.image,c=e.duration,o=e.like;Object(s["a"])(this,t),this.id=i,this.name=a,this.singer=n,this.image=r,this.duration=c,this.like=o}return Object(a["a"])(t,[{key:"getUrl",value:function(){return o.a.get("".concat(n["a"],"/song/url?id=").concat(this.id)).then(function(t){var e=t.data.data[0].url;return e})}},{key:"getLyric",value:function(){return o.a.get("".concat(n["a"],"/lyric?id=").concat(this.id)).then(function(t){if(t.data.nolyric)return"";var e=t.data.lrc.lyric;return e})}}]),t}();function u(t){var e="";return t.forEach(function(i,s){s===t.length-1?e+=i.name:e+=i.name+" / "}),e}function d(t){for(var e=l.get(),i=0;i<e.length;i++)if(e[i]===t.toString())return!0;return!1}function m(t){return new h({id:t.id,name:t.name,singer:u(t.ar),image:t.al.picUrl,duration:t.dt/1e3,like:d(t.id)})}h.getDetail=function(t){return o.a.get("".concat(n["a"],"/song/detail?ids=").concat(t)).then(function(t){return t.data.songs})}},bf06:function(t,e,i){}}]);
//# sourceMappingURL=chunk-16eafe6d.c2966429.js.map