const heroForm=document.getElementById("heroForm");
const heroMessage=document.getElementById("heroMessage");
const form=document.getElementById("contactForm");
const formMessage=document.getElementById("formMessage");
const menuToggle=document.getElementById("menuToggle");
const navMenu=document.getElementById("navMenu");

if(menuToggle && navMenu){
  menuToggle.addEventListener("click",()=>{
    const open=navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded",String(open));
  });
  navMenu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false");
  }));
}

function openWhatsApp(data){
  const text=[
    "Hello Digital Cyber Cafe,",
    "",
    "Name: "+data.name,
    data.email ? "Email: "+data.email : "",
    "Mobile: "+data.phone,
    data.city ? "City: "+data.city : "",
    "Service: "+data.service,
    data.message ? "Requirement: "+data.message : ""
  ].filter(Boolean).join("\n");
  window.open("https://wa.me/919810252413?text="+encodeURIComponent(text),"_blank","noopener");
}

if(heroForm){
  heroForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name=document.getElementById("heroName").value.trim();
    const email=document.getElementById("heroEmail").value.trim();
    const phone=document.getElementById("heroPhone").value.replace(/\D/g,"");
    const city=document.getElementById("heroCity").value.trim();
    const service=document.getElementById("heroService").value;
    const message=document.getElementById("heroMessageInput")?.value.trim();
    if(name.length<2){heroMessage.textContent="Please enter your full name.";return}
    if(phone.length<10){heroMessage.textContent="Please enter a valid mobile number.";return}
    if(!service){heroMessage.textContent="Please select a service.";return}
    openWhatsApp({name,email,phone,city,service,message});
    heroMessage.textContent="Opening WhatsApp...";
    heroForm.reset();
  });
}

if(form){
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name=document.getElementById("name").value.trim();
    const email=document.getElementById("email").value.trim();
    const phone=document.getElementById("phone").value.replace(/\D/g,"");
    const service=document.getElementById("service").value;
    const message=document.getElementById("message").value.trim();
    if(name.length<2){formMessage.textContent="कृपया सही नाम डालें।";return}
    if(phone.length<10){formMessage.textContent="कृपया सही mobile number डालें।";return}
    if(!service){formMessage.textContent="कृपया service select करें।";return}
    if(message.length<3){formMessage.textContent="कृपया अपनी requirement लिखें।";return}
    openWhatsApp({name,email,phone,service,message});
    formMessage.textContent="WhatsApp खुल रहा है...";
    form.reset();
  });
}

const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.08});
document.querySelectorAll(".section,.service-row,.plan-card,.repair-card,.about-card>div,.contact-form,.feature-box").forEach((el,i)=>{
  el.classList.add("reveal");
  el.style.transitionDelay=Math.min(i*45,280)+"ms";
  revealObserver.observe(el);
});

// Jan Seva search and category filters
const janSearch=document.getElementById("janSearch");
const janFilters=document.querySelectorAll(".jan-filter");
const janCards=document.querySelectorAll(".jan-card");
const janNoResults=document.getElementById("janNoResults");
let janCategory="all";

function applyJanFilters(){
  const q=(janSearch?.value || "").trim().toLowerCase();
  let shown=0;
  janCards.forEach(card=>{
    const category=card.dataset.janCategory || "";
    const hay=(card.dataset.janSearch || "")+" "+card.textContent.toLowerCase();
    const categoryOk=janCategory==="all" || category===janCategory;
    const searchOk=!q || hay.includes(q);
    const visible=categoryOk && searchOk;
    card.classList.toggle("hidden",!visible);
    if(visible) shown++;
  });
  if(janNoResults) janNoResults.hidden=shown!==0;
}
janFilters.forEach(btn=>{
  btn.addEventListener("click",()=>{
    janFilters.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    janCategory=btn.dataset.janFilter || "all";
    applyJanFilters();
  });
});
if(janSearch) janSearch.addEventListener("input",applyJanFilters);


/* ===== Customer account: Login / Sign Up ===== */
const authModal=document.getElementById("authModal");
const customerLoginBtn=document.getElementById("customerLoginBtn");
const loginForm=document.getElementById("loginForm");
const signupForm=document.getElementById("signupForm");
const customerSession=document.getElementById("customerSession");
const loginMessage=document.getElementById("loginMessage");
const signupMessage=document.getElementById("signupMessage");
const sessionTitle=document.getElementById("sessionTitle");
const sessionText=document.getElementById("sessionText");
const sessionAvatar=document.getElementById("sessionAvatar");
const logoutBtn=document.getElementById("logoutBtn");

const ACCOUNT_KEY="digitalCyberCafeCustomers";
const SESSION_KEY="digitalCyberCafeSession";
const REMEMBER_KEY="digitalCyberCafeRemember";

function safeJson(key, fallback){
  try{return JSON.parse(localStorage.getItem(key)||"null") ?? fallback}catch(_){return fallback}
}
function saveAccounts(accounts){
  try{localStorage.setItem(ACCOUNT_KEY,JSON.stringify(accounts));return true}catch(_){return false}
}
async function hashPassword(value){
  if(window.crypto?.subtle){
    const bytes=new TextEncoder().encode(value);
    const buffer=await crypto.subtle.digest("SHA-256",bytes);
    return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,"0")).join("");
  }
  return btoa(unescape(encodeURIComponent(value)));
}
function normalizeIdentity(value){return value.trim().toLowerCase()}
function initials(name){
  return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||"").join("")||"DC";
}
function getSession(){
  try{
    const saved=localStorage.getItem(SESSION_KEY)||sessionStorage.getItem(SESSION_KEY);
    return saved?JSON.parse(saved):null;
  }catch(_){return null}
}
function setSession(account,remember){
  const payload=JSON.stringify({name:account.name,email:account.email,phone:account.phone});
  try{
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    if(remember)localStorage.setItem(SESSION_KEY,payload);
    else sessionStorage.setItem(SESSION_KEY,payload);
    localStorage.setItem(REMEMBER_KEY,String(remember));
  }catch(_){}
}
function clearSession(){
  try{
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }catch(_){}
}
function openAuth(tab="login"){
  if(!authModal)return;
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden","false");
  switchAuthTab(tab);
  document.body.classList.add("auth-open");
  setTimeout(()=>document.querySelector(".auth-modal.open input:not([type=checkbox])")?.focus(),80);
}
function closeAuth(){
  if(!authModal)return;
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("auth-open");
}
function switchAuthTab(tab){
  const isSignup=tab==="signup";
  document.querySelectorAll(".auth-tab").forEach(btn=>btn.classList.toggle("active",(btn.dataset.authTab||"")===(isSignup?"signup":"login")));
  loginForm?.classList.toggle("hidden",isSignup);
  signupForm?.classList.toggle("hidden",!isSignup);
  customerSession?.classList.add("hidden");
  if(!isSignup && loginMessage)loginMessage.textContent="";
  if(isSignup && signupMessage)signupMessage.textContent="";
}
function showSession(){
  const session=getSession();
  if(!session)return false;
  loginForm?.classList.add("hidden");
  signupForm?.classList.add("hidden");
  customerSession?.classList.remove("hidden");
  if(sessionTitle)sessionTitle.textContent="Welcome, "+session.name+"!";
  if(sessionText)sessionText.textContent=session.email+" • "+session.phone;
  if(sessionAvatar)sessionAvatar.textContent=initials(session.name);
  if(customerLoginBtn)customerLoginBtn.textContent="My Account";
  return true;
}
function refreshAuthButton(){
  if(!customerLoginBtn)return;
  customerLoginBtn.textContent=getSession()?"My Account":"Customer Login";
}

customerLoginBtn?.addEventListener("click",()=>openAuth(getSession()?"login":"login"));
document.querySelectorAll("[data-auth-close]").forEach(el=>el.addEventListener("click",(e)=>{
  if(el.matches("a") && el.getAttribute("href")?.startsWith("#"))closeAuth();
  else closeAuth();
}));
document.querySelectorAll("[data-auth-tab]").forEach(el=>el.addEventListener("click",()=>{
  const tab=el.dataset.authTab||"login";
  if(getSession() && tab==="login"){showSession();return}
  switchAuthTab(tab);
}));
document.querySelectorAll(".password-toggle").forEach(btn=>btn.addEventListener("click",()=>{
  const input=document.getElementById(btn.dataset.passwordTarget);
  if(!input)return;
  const show=input.type==="password";
  input.type=show?"text":"password";
  btn.textContent=show?"Hide":"Show";
}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&authModal?.classList.contains("open"))closeAuth()});

signupForm?.addEventListener("submit",async e=>{
  e.preventDefault();
  if(signupMessage){signupMessage.className="auth-message";signupMessage.textContent=""}
  const name=document.getElementById("signupName")?.value.trim()||"";
  const phone=(document.getElementById("signupPhone")?.value||"").replace(/\D/g,"");
  const email=normalizeIdentity(document.getElementById("signupEmail")?.value||"");
  const password=document.getElementById("signupPassword")?.value||"";
  const confirm=document.getElementById("signupConfirm")?.value||"";
  if(name.length<2){signupMessage.textContent="Please enter your full name.";return}
  if(phone.length!==10){signupMessage.textContent="Please enter a valid 10-digit mobile number.";return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){signupMessage.textContent="Please enter a valid email address.";return}
  if(password.length<8){signupMessage.textContent="Password must be at least 8 characters.";return}
  if(password!==confirm){signupMessage.textContent="Passwords do not match.";return}
  const accounts=safeJson(ACCOUNT_KEY,[]);
  if(accounts.some(a=>a.email===email||a.phone===phone)){
    signupMessage.textContent="An account with this email or mobile already exists.";
    return;
  }
  const passwordHash=await hashPassword(password);
  const account={id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),name,phone,email,passwordHash,createdAt:new Date().toISOString()};
  accounts.push(account);
  if(!saveAccounts(accounts)){
    signupMessage.textContent="This browser could not save the account. Please try again.";
    return;
  }
  setSession(account,true);
  signupForm.reset();
  signupMessage.className="auth-message success";
  signupMessage.textContent="Account created successfully.";
  showSession();
});

loginForm?.addEventListener("submit",async e=>{
  e.preventDefault();
  if(loginMessage){loginMessage.className="auth-message";loginMessage.textContent=""}
  const identity=normalizeIdentity(document.getElementById("loginIdentity")?.value||"");
  const password=document.getElementById("loginPassword")?.value||"";
  const remember=!!document.getElementById("rememberMe")?.checked;
  const accounts=safeJson(ACCOUNT_KEY,[]);
  const account=accounts.find(a=>a.email===identity || a.phone===identity.replace(/\D/g,""));
  if(!account){loginMessage.textContent="Account not found. Please sign up first.";return}
  const passwordHash=await hashPassword(password);
  if(account.passwordHash!==passwordHash){loginMessage.textContent="Incorrect password. Please try again.";return}
  setSession(account,remember);
  loginForm.reset();
  if(loginMessage){loginMessage.className="auth-message success";loginMessage.textContent="Login successful."}
  showSession();
});
logoutBtn?.addEventListener("click",()=>{
  clearSession();
  customerSession?.classList.add("hidden");
  switchAuthTab("login");
  refreshAuthButton();
  loginMessage.textContent="You have been logged out.";
  loginMessage.className="auth-message success";
});

showSession();
refreshAuthButton();
