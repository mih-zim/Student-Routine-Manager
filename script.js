const STORAGE_KEY = "studentRoutineManagementSystem.routines";
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const $ = id => document.getElementById(id);

let routines = loadRoutines();
let editingId = null;

function loadRoutines(){
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
function saveRoutines(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(routines)); }
function esc(value){
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function sortRoutines(list){
  return [...list].sort((a,b) => DAYS.indexOf(a.day)-DAYS.indexOf(b.day) || a.startTime.localeCompare(b.startTime));
}
function timeLabel(value){
  if(!value) return "";
  const [h,m] = value.split(":").map(Number);
  return `${h%12 || 12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;
}
function timeRange(item){ return `${timeLabel(item.startTime)} – ${timeLabel(item.endTime)}`; }
function today(){ return DAYS[new Date().getDay()]; }

function showView(name){
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  $(`${name}View`).classList.add("active");
  document.querySelectorAll(".nav-link").forEach(b => b.classList.toggle("active", b.dataset.view===name));
  const titles = {
    dashboard:["Dashboard","Your weekly classes, organized in one place."],
    routine:["Weekly Schedule","Search, filter, edit, and manage your classes."],
    form:[editingId ? "Edit Class Routine" : "Add Class Routine","Enter your class details."]
  };
  $("pageTitle").textContent = titles[name][0];
  $("pageSubtitle").textContent = titles[name][1];
  if(name==="routine") renderRoutineTable();
  if(name==="form") $("subject").focus();
}

function renderDashboard(){
  const subjects = new Set(routines.map(r => r.subject.trim().toLowerCase()));
  const teachers = new Set(routines.map(r => r.teacher.trim().toLowerCase()));
  $("totalClasses").textContent = routines.length;
  $("totalSubjects").textContent = subjects.size;
  $("totalTeachers").textContent = teachers.size;
  const todays = sortRoutines(routines.filter(r => r.day===today()));
  $("todayClasses").textContent = todays.length;
  $("todayDate").textContent = today();

  $("todayClassList").innerHTML = todays.length ? todays.map(r => `
    <div class="today-item">
      <div class="today-time">${esc(timeLabel(r.startTime))}</div>
      <div class="today-info"><b>${esc(r.subject)}</b><p>${esc(r.teacher)}</p><small>Room ${esc(r.room)} · ${esc(timeRange(r))}</small></div>
    </div>`).join("") : `<div class="empty"><b>No classes scheduled today</b>Add a routine to see your classes here.</div>`;

  const preview = sortRoutines(routines).slice(0,6);
  $("dashboardTable").innerHTML = preview.length ? preview.map(r => `
    <tr><td>${esc(r.day)}</td><td><strong>${esc(r.subject)}</strong></td><td>${esc(r.teacher)}</td><td>${esc(r.room)}</td><td>${esc(timeRange(r))}</td></tr>
  `).join("") : `<tr><td colspan="5" class="table-empty">No routine added yet.</td></tr>`;
}

function renderRoutineTable(){
  const search = $("searchInput").value.trim().toLowerCase();
  const selectedDay = $("dayFilter").value;
  const filtered = sortRoutines(routines).filter(r => {
    const matches = r.subject.toLowerCase().includes(search) || r.teacher.toLowerCase().includes(search) || r.room.toLowerCase().includes(search);
    return matches && (!selectedDay || r.day===selectedDay);
  });
  $("routineTable").innerHTML = filtered.length ? filtered.map(r => `
    <tr>
      <td>${esc(r.day)}</td><td><strong>${esc(r.subject)}</strong></td><td>${esc(r.teacher)}</td><td>${esc(r.room)}</td><td>${esc(timeRange(r))}</td>
      <td><button class="small-btn edit-btn" data-action="edit" data-id="${esc(r.id)}">Edit</button><button class="small-btn delete-btn" data-action="delete" data-id="${esc(r.id)}">Delete</button></td>
    </tr>`).join("") : `<tr><td colspan="6" class="table-empty">No matching classes found.</td></tr>`;
}
function render(){ saveRoutines(); renderDashboard(); renderRoutineTable(); }

function openForm(id=null){
  editingId = id;
  $("routineForm").reset();
  $("formWarning").textContent = "";
  if(id){
    const r = routines.find(item => item.id===id);
    if(!r) return;
    $("subject").value=r.subject; $("teacher").value=r.teacher; $("room").value=r.room;
    $("day").value=r.day; $("startTime").value=r.startTime; $("endTime").value=r.endTime;
    $("formTitle").textContent="Edit Class Routine";
  }else{
    $("formTitle").textContent="Add Class Routine";
  }
  showView("form");
}
function detectConflict(candidate){
  return routines.find(r => r.id!==editingId && r.day===candidate.day &&
    candidate.startTime < r.endTime && candidate.endTime > r.startTime);
}

$("routineForm").addEventListener("submit", e => {
  e.preventDefault();
  const item = {
    id: editingId || (Date.now().toString()+Math.random().toString(16).slice(2)),
    subject:$("subject").value.trim(), teacher:$("teacher").value.trim(),
    room:$("room").value.trim(), day:$("day").value,
    startTime:$("startTime").value, endTime:$("endTime").value
  };
  if(item.endTime <= item.startTime){
    $("formWarning").textContent="End time must be later than start time.";
    return;
  }
  const conflict=detectConflict(item);
  if(conflict){
    const okay=confirm(`Time conflict detected with ${conflict.subject} (${conflict.day}, ${timeRange(conflict)}). Save anyway?`);
    if(!okay) return;
  }
  if(editingId) routines=routines.map(r => r.id===editingId ? item : r);
  else routines.push(item);
  editingId=null;
  render();
  showView("routine");
});

function deleteRoutine(id){
  const item=routines.find(r=>r.id===id);
  if(!item) return;
  if(!confirm(`Delete "${item.subject}" routine?`)) return;
  routines=routines.filter(r=>r.id!==id);
  render();
}

$("routineTable").addEventListener("click",e=>{
  const button=e.target.closest("button[data-action]");
  if(!button) return;
  if(button.dataset.action==="edit") openForm(button.dataset.id);
  if(button.dataset.action==="delete") deleteRoutine(button.dataset.id);
});

$("searchInput").addEventListener("input",renderRoutineTable);
$("dayFilter").addEventListener("change",renderRoutineTable);

function clearAll(){
  if(!routines.length){alert("There is no routine to clear.");return;}
  if(!confirm("Delete all saved class routines? This cannot be undone.")) return;
  routines=[];render();
}
$("clearAll").addEventListener("click",clearAll);
$("printBtn").addEventListener("click",()=>window.print());

document.querySelectorAll(".nav-link").forEach(button=>{
  button.addEventListener("click",()=>{
    if(button.dataset.view==="form") openForm();
    else showView(button.dataset.view);
  });
});
$("headerAdd").addEventListener("click",()=>openForm());
$("quickAdd").addEventListener("click",()=>openForm());
$("routineAdd").addEventListener("click",()=>openForm());
$("quickView").addEventListener("click",()=>showView("routine"));
$("dashboardViewAll").addEventListener("click",()=>showView("routine"));
$("quickSearch").addEventListener("click",()=>{showView("routine");$("searchInput").focus();});
$("cancelForm").addEventListener("click",()=>{editingId=null;showView("routine");});

// Populate day dropdowns
$("day").innerHTML=DAYS.map(d=>`<option value="${d}">${d}</option>`).join("");
$("dayFilter").innerHTML=`<option value="">All Days</option>`+DAYS.map(d=>`<option value="${d}">${d}</option>`).join("");

render();
showView("dashboard");
