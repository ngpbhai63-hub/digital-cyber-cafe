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
    if(name.length<2){heroMessage.textContent="Please enter your full name.";return}
    if(phone.length<10){heroMessage.textContent="Please enter a valid mobile number.";return}
    if(!service){heroMessage.textContent="Please select a service.";return}
    openWhatsApp({name,email,phone,city,service});
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
