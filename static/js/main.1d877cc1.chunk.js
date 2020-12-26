(this["webpackJsonpnetprobus.github.io"]=this["webpackJsonpnetprobus.github.io"]||[]).push([[0],{60:function(e,t,a){"use strict";a.r(t);var i=a(7),n=a(2),s=a(3),o=a(9),d=a(4),l=a(5),r=a(10),c=a.n(r),p=a(58),u=a.n(p),b=a(50);a(69);function h(e,t,a){return fetch(e).then((function(e){if(e.status>=400)throw new Error(e.status+" "+e.body);return e.json()})).then((function(e){a(e)})).catch((function(a){console.log(a),t.setState({feedback:"Error loading data from: "+e+"\nError was: "+a,isLoading:!1})}))}function f(e){return e.feedback?Object(i.jsx)("div",{className:"netprobe-feedback",children:e.feedback}):Object(i.jsx)("div",{className:"netprobe-feedback",children:e.isLoading?"Please wait...":""})}function m(e){if(e.data&&e.data.length>0){var t={table:e.data};return Object(i.jsx)("div",{className:"netprobe-graph",children:Object(i.jsx)(b.a,{spec:{width:400,height:200,data:{name:"table"},title:"Ping Results",transform:[{calculate:"round(100*datum.loss)",as:"pct_loss"},{calculate:"time(datum.tstamp)",as:"time"}],mark:"area",encoding:{row:{field:"host"},x:{field:"tstamp",type:"temporal",axis:{title:"Time"}},y:{field:"avg",type:"quantitative",axis:{title:"Average (ms)"}},color:{field:"host",type:"nominal",legend:null},tooltip:[{field:"min",type:"quantitative",title:"Min (ms)"},{field:"avg",type:"quantitative",title:"Avg (ms)"},{field:"max",type:"quantitative",title:"Max (ms)"},{field:"pct_loss",type:"quantitative",title:"Percent Loss"},{field:"tstr",type:"ordinal",title:"Time"},{field:"tstamp",type:"ordinal",title:"Timestamp"}]}},data:t})})}return Object(i.jsx)("div",{className:"netprobe-graph-nodata"})}function j(e){if(e.data&&e.data.length>0){var t={table:e.data};return Object(i.jsx)("div",{className:"netprobe-graph",children:Object(i.jsx)(b.a,{spec:{width:400,height:200,data:{name:"table"},title:"Network Speed Results",mark:"area",encoding:{x:{field:"tstamp",type:"temporal",axis:{title:"Time"}},tooltip:[{field:"down_mbps",type:"quantitative",title:"Down (Mbps)"},{field:"up_mbps",type:"quantitative",title:"Up (Mbps)"},{field:"ping",type:"quantitative",title:"Ping (ms)"},{field:"tstr",type:"ordinal",title:"Time"},{field:"tstamp",type:"ordinal",title:"Timestamp"}]},layer:[{mark:{type:"area",color:"green"},encoding:{y:{field:"down_mbps",type:"quantitative",axis:{title:"Mbps"}}}},{mark:{type:"area",color:"blue"},encoding:{y:{field:"up_mbps",type:"quantitative"}}}]},data:t})})}return Object(i.jsx)("div",{className:"netprobe-graph-nodata"})}function g(e){if(e.data&&e.data.length>0){var t={table:e.data};return Object(i.jsx)("div",{className:"netprobe-graph",children:Object(i.jsx)(b.a,{spec:{width:400,height:200,data:{name:"table"},title:"WiFi Network Results",mark:{type:"circle",opacity:.8,stroke:"black",strokeWidth:1},encoding:{x:{field:"chan",type:"ordinal",axis:{title:"Channel"}},y:{field:"str",type:"quantitative",axis:{title:"Strength"}},color:{field:"ssid",type:"nominal"},tooltip:[{field:"str",type:"quantitative",title:"Strength"},{field:"ssid",type:"nominal",title:"SSID"},{field:"chan",type:"quantitative",title:"Channel"},{field:"tstamp",type:"ordinal",title:"Timestamp"}]}},data:t})})}return Object(i.jsx)("div",{className:"netprobe-graph-nodata"})}var v=function(e){Object(d.a)(a,e);var t=Object(l.a)(a);function a(e){var i;return Object(n.a)(this,a),(i=t.call(this,e)).processChange=i.processChange.bind(Object(o.a)(i)),i}return Object(s.a)(a,[{key:"processChange",value:function(e){this.props.selector(e.target.value)}},{key:"render",value:function(){var e=this.props.nodes.map((function(e,t){return Object(i.jsx)("option",{value:e,children:e},t)}));return e&&e.length>0?Object(i.jsx)("div",{className:"netprobe-nodes",children:Object(i.jsxs)("label",{children:["Select a node:",Object(i.jsxs)("select",{name:"nodes",id:"node-selector",onChange:this.processChange,children:[Object(i.jsx)("option",{value:"NONE",children:"---Please select a node---"}),e]})]})}):Object(i.jsx)("div",{className:"netprobe-nodes",children:"No nodes are currently available. Please wait..."})}}]),a}(c.a.Component),y=function(e){Object(d.a)(a,e);var t=Object(l.a)(a);function a(e){var i;return Object(n.a)(this,a),(i=t.call(this,e)).state={selectedNode:null,feedback:null,nodes:[],isLoading:!1,pings:[],speeds:[]},i}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.setState({isLoading:!0,feedback:"Loading node list..."});h("https://us-central1-netprobeme.cloudfunctions.net/nodelist",this,(function(t){e.setState({nodes:t,isLoading:!1,feedback:null})}))}},{key:"processNodeSelection",value:function(e){var t,a,i=this;this.state.nodes.forEach((function(i,n){i===e&&(t=e,a=n)})),this.setState({selectedNode:a,feedback:"Current node: "+t,isLoading:!0});var n="https://us-central1-netprobeme.cloudfunctions.net/getNetprobeData?nodeId="+t+"&dataset=",s=h(n+"ping",this,(function(e){i.setState({pings:e,feedback:"Ping data loaded."})})),o=h(n+"speed",this,(function(e){i.setState({speeds:e,feedback:"Network speed data loaded."})})),d=h(n+"wifi",this,(function(e){i.setState({wifis:e,feedback:"WiFi networks loaded."})}));Promise.all([s,o,d]).then((function(e){i.setState({isLoading:!1,feedback:"All data loaded for: "+t})}))}},{key:"render",value:function(){var e=this;return Object(i.jsxs)("div",{className:"netprobe",children:[Object(i.jsx)("div",{className:"netprobe-header",children:Object(i.jsx)(v,{nodes:this.state.nodes,selector:function(t){return e.processNodeSelection(t)}})}),Object(i.jsxs)("div",{className:"netprobe-graphs",children:[Object(i.jsx)(m,{data:this.state.pings}),Object(i.jsx)(j,{data:this.state.speeds}),Object(i.jsx)(g,{data:this.state.wifis})]}),Object(i.jsx)("div",{className:"netprobe-status",children:Object(i.jsx)(f,{isLoading:this.state.isLoading,feedback:this.state.feedback})})]})}}]),a}(c.a.Component);u.a.render(Object(i.jsx)(c.a.StrictMode,{children:Object(i.jsx)(y,{})}),document.getElementById("root"))},69:function(e,t,a){}},[[60,1,2]]]);
//# sourceMappingURL=main.1d877cc1.chunk.js.map