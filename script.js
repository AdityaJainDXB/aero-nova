(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clone = value => JSON.parse(JSON.stringify(value));
  let flights = clone(STARTER_FLIGHTS).map((f,i)=>({...f,id:i+1}));
  let alerts = clone(STARTER_ALERTS);
  let layer = "all";
  let soundOn = false;
  let toastTimer;
  const canvas = $("#radar"), ctx = canvas.getContext("2d");
  const typeColor = {Civilian:"#67d9e8",Cargo:"#e6bb69",Exploration:"#b69af4"};
  const statusClass = s => s.replace(/\s/g,"-");

  $("#sidebarPlanet").textContent = PLANET_CONFIG.name;
  document.documentElement.style.setProperty("--cyan", PLANET_CONFIG.accent);
  $(".planet-card span").textContent = PLANET_CONFIG.sector;
  $("#dateLabel").textContent = new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date()).toUpperCase();

  function tickClock(){
    $("#clock").textContent = new Date().toISOString().slice(11,19)+" UTC";
  }
  tickClock(); setInterval(tickClock,1000);

  function toast(message){
    const el=$("#toast"); el.textContent=message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
  }
  function renderFlights(){
    const query=$("#flightSearch").value.trim().toLowerCase();
    const status=$("#statusFilter").value;
    const visible=flights.filter(f=>(f.callsign+" "+f.destination+" "+f.type).toLowerCase().includes(query)&&(status==="all"||f.status===status));
    $("#flightRows").innerHTML=visible.map(f=>`<tr>
      <td>${escapeHTML(f.callsign)}</td><td>${escapeHTML(f.destination)}</td>
      <td><span class="type-tag ${f.type.toLowerCase()}">${f.type.toUpperCase()}</span></td>
      <td>${Number(f.altitude).toLocaleString()} KM</td><td>${Number(f.velocity).toLocaleString()} KM/H</td>
      <td><span class="status ${statusClass(f.status)}">${f.status.toUpperCase()}</span></td>
      <td><button class="row-action" data-flight="${f.id}" aria-label="Inspect ${escapeHTML(f.callsign)}" title="Inspect flight">↗</button></td></tr>`).join("") || `<tr><td colspan="7" class="empty-state">No flights match your filters.</td></tr>`;
    $("#activeCount").textContent=String(flights.length).padStart(2,"0");
    $("#manifestCount").textContent=String(flights.length).padStart(2,"0");
    $("#showingCount").textContent=visible.length; $("#totalCount").textContent=flights.length;
    $("#civilianCount").textContent=flights.filter(f=>f.type==="Civilian").length.toString().padStart(2,"0");
    $("#cargoCount").textContent=flights.filter(f=>f.type==="Cargo").length.toString().padStart(2,"0");
    $("#explorationCount").textContent=flights.filter(f=>f.type==="Exploration").length.toString().padStart(2,"0");
  }
  function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

  function renderAlerts(){
    const active=alerts.filter(a=>!a.acknowledged);
    $("#alertCount").textContent=String(active.length).padStart(2,"0");
    $("#priorityCount").textContent=String(active.length).padStart(2,"0");
    $("#alertList").innerHTML=alerts.length?alerts.map(a=>`<div class="alert-item ${a.severity} ${a.acknowledged?"acknowledged":""}">
      <div class="alert-item-top"><b>${escapeHTML(a.title)}</b><span class="severity">${a.severity.toUpperCase()}</span></div>
      <small>${escapeHTML(a.location)}</small>
      <div class="alert-item-foot"><span>${escapeHTML(a.time)} ${a.acknowledged?"· ACKNOWLEDGED":""}</span>${a.acknowledged?"":`<button class="ack-btn" data-ack="${a.id}">ACKNOWLEDGE</button>`}</div>
    </div>`).join(""):`<div class="empty-state">No active incidents. Airspace nominal.</div>`;
  }

  $("#flightRows").addEventListener("click",e=>{
    const btn=e.target.closest("[data-flight]"); if(!btn)return;
    const f=flights.find(x=>x.id===Number(btn.dataset.flight)); if(!f)return;
    toast(`${f.callsign} · ${f.destination} · ${f.status}`);
  });
  $("#alertList").addEventListener("click",e=>{
    const btn=e.target.closest("[data-ack]"); if(!btn)return;
    const a=alerts.find(x=>x.id===Number(btn.dataset.ack)); if(a){a.acknowledged=true;renderAlerts();toast("Incident acknowledged by flight director.");}
  });
  $("#flightSearch").addEventListener("input",renderFlights);
  $("#statusFilter").addEventListener("change",renderFlights);
  $("#clearAlerts").addEventListener("click",()=>{alerts=alerts.filter(a=>!a.acknowledged);renderAlerts();toast("Acknowledged incidents cleared.");});

  $("#newFlightBtn").addEventListener("click",()=>$("#flightDialog").showModal());
  $("#reportAlert").addEventListener("click",()=>$("#alertDialog").showModal());
  $("#flightForm").addEventListener("submit",e=>{
    e.preventDefault(); const fd=new FormData(e.currentTarget);
    const callsign=String(fd.get("callsign")).trim().toUpperCase();
    if(flights.some(f=>f.callsign===callsign)){toast("That callsign is already registered.");return;}
    flights.push({id:Math.max(0,...flights.map(f=>f.id))+1,callsign,destination:fd.get("destination"),type:fd.get("type"),altitude:Number(fd.get("altitude")),velocity:Math.floor(500+Math.random()*900),status:"On course",angle:Math.random()*360,radius:.45+Math.random()*.4});
    e.currentTarget.reset();$("#flightDialog").close();renderFlights();toast(`${callsign} added to flight manifest.`);
  });
  $("#alertForm").addEventListener("submit",e=>{
    e.preventDefault();const fd=new FormData(e.currentTarget);
    alerts.unshift({id:Math.max(0,...alerts.map(a=>a.id))+1,title:String(fd.get("title")).trim(),location:String(fd.get("location")).trim(),severity:fd.get("severity"),time:"JUST NOW",acknowledged:false});
    e.currentTarget.reset();$("#alertDialog").close();renderAlerts();toast("Incident transmitted to mission control.");
  });
  $$(".small-btn").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".small-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");layer=btn.dataset.layer;
  }));
  $$(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".nav-item").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
    const view=btn.dataset.view;
    if(view==="traffic"){$("#flightSearch").focus();$("#flightsPanel")?.scrollIntoView({behavior:"smooth"});$(".flights-panel").scrollIntoView({behavior:"smooth",block:"center"});}
    else if(view==="missions")toast("Mission queue: 12 planned · 4 underway · 142 complete.");
    else if(view==="spaceports")toast("6 spaceports online · 3 under maintenance.");
    else window.scrollTo({top:0,behavior:"smooth"});
  }));
  $$("[data-view]").filter(x=>!x.classList.contains("nav-item")).forEach(btn=>btn.addEventListener("click",()=>{$(".flights-panel").scrollIntoView({behavior:"smooth",block:"center"});}));
  $("#soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("#soundToggle").textContent=soundOn?"♫":"♩";toast(soundOn?"Audio alerts enabled (visual simulation only).":"Audio alerts muted.");});

  let sweep=0, last=0;
  function resizeCanvas(){
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.floor(rect.width*dpr));canvas.height=Math.max(1,Math.floor(rect.height*dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  new ResizeObserver(resizeCanvas).observe(canvas); resizeCanvas();
  function draw(now){
    const w=canvas.clientWidth,h=canvas.clientHeight,cx=w/2,cy=h/2,r=Math.min(w,h)*.405;
    ctx.clearRect(0,0,w,h);
    ctx.save();ctx.translate(cx,cy);
    // Radar rings and radial grid
    for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(0,0,r*i/4,0,Math.PI*2);ctx.strokeStyle=i===4?"#315366":"#1d3a4a";ctx.lineWidth=1;ctx.stroke();}
    for(let a=0;a<360;a+=30){const t=a*Math.PI/180;ctx.beginPath();ctx.moveTo(Math.cos(t)*r,Math.sin(t)*r);ctx.lineTo(0,0);ctx.strokeStyle="#1b3545";ctx.stroke();}
    // Sweep cone
    sweep=(now*.00023)%(Math.PI*2);
    const grad=ctx.createConicalGradient?null:null;
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,sweep-.65,sweep);ctx.closePath();ctx.fillStyle="rgba(71,204,199,.075)";ctx.fill();
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(sweep)*r,Math.sin(sweep)*r);ctx.strokeStyle="rgba(103,217,232,.45)";ctx.lineWidth=1.2;ctx.stroke();
    // Planet
    const pg=ctx.createRadialGradient(-r*.12,-r*.15,2,0,0,r*.19);pg.addColorStop(0,"#9ad8d4");pg.addColorStop(.45,"#36798b");pg.addColorStop(1,"#102a43");
    ctx.beginPath();ctx.arc(0,0,r*.19,0,Math.PI*2);ctx.fillStyle=pg;ctx.fill();
    ctx.beginPath();ctx.ellipse(0,0,r*.31,r*.075,-.3,0,Math.PI*2);ctx.strokeStyle="rgba(174,205,194,.5)";ctx.stroke();
    // Flight tracks and contacts
    flights.forEach((f,i)=>{
      if(layer!=="all"&&layer!==f.type.toLowerCase())return;
      const angle=(f.angle*Math.PI/180)+(now*.000025*(i%2?1:-1));
      const rr=r*f.radius,x=Math.cos(angle)*rr,y=Math.sin(angle)*rr;
      ctx.beginPath();ctx.arc(0,0,rr,angle-.18,angle+.18);ctx.strokeStyle=typeColor[f.type]+"55";ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.arc(x,y,f.status==="Emergency"?4.5:3,0,Math.PI*2);ctx.fillStyle=typeColor[f.type];ctx.shadowColor=typeColor[f.type];ctx.shadowBlur=9;ctx.fill();ctx.shadowBlur=0;
      if(f.status==="Emergency"){ctx.beginPath();ctx.arc(x,y,8+Math.sin(now/180)*2,0,Math.PI*2);ctx.strokeStyle="#ff6d7588";ctx.stroke();}
    });
    ctx.restore();
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  renderFlights();renderAlerts();
  // Small simulated traffic changes keep the dashboard alive without external services.
  setInterval(()=>{
    const candidates=flights.filter(f=>f.status!=="Emergency");
    if(candidates.length&&Math.random()>.55){const f=candidates[Math.floor(Math.random()*candidates.length)];f.velocity=Math.max(450,Math.min(1450,f.velocity+Math.floor(Math.random()*61-30)));renderFlights();}
  },6500);
})();