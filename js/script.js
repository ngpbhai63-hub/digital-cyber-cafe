const form=document.getElementById("contactForm");
const formMessage=document.getElementById("formMessage");
const menuToggle=document.getElementById("menuToggle");
const navMenu=document.getElementById("navMenu");
const filterButtons=document.querySelectorAll(".filter-btn");
const serviceCards=document.querySelectorAll(".service-card");

if(menuToggle && navMenu){
  menuToggle.addEventListener("click",()=>{
    const open=navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  navMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false");
  }));
}

filterButtons.forEach(button=>{
  button.addEventListener("click",()=>{
    filterButtons.forEach(btn=>btn.classList.remove("active"));
    button.classList.add("active");
    const filter=button.dataset.filter;
    serviceCards.forEach(card=>{
      card.classList.toggle("is-hidden", filter!=="all" && card.dataset.category!==filter);
    });
  });
});

if(form){
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const name=document.getElementById("name").value.trim();
    const phone=document.getElementById("phone").value.replace(/\D/g,"");
    const service=document.getElementById("service").value;
    const message=document.getElementById("message").value.trim();

    if(name.length<2){formMessage.textContent="कृपया सही नाम डालें।";return;}
    if(phone.length<10){formMessage.textContent="कृपया सही mobile number डालें।";return;}
    if(!service){formMessage.textContent="कृपया service select करें।";return;}
    if(message.length<3){formMessage.textContent="कृपया अपनी requirement लिखें।";return;}

    const serviceName=document.getElementById("service").selectedOptions[0].textContent;
    const text="Hello Digital Cyber Cafe,%0A%0AName: "+encodeURIComponent(name)+"%0AMobile: "+encodeURIComponent(phone)+"%0AService: "+encodeURIComponent(serviceName)+"%0ARequirement: "+encodeURIComponent(message);
    formMessage.innerHTML='✅ Enquiry तैयार है — WhatsApp पर भेजें: <a href="https://wa.me/919810252413?text='+text+'" target="_blank" rel="noopener">Send on WhatsApp</a>';
  });
}

// Premium UI interactions
document.querySelectorAll("section, .quick-card, .service-card, .plan-card, .repair-card, .why-card, .contact-form").forEach(el=>{
  if(!el.classList.contains("reveal")) el.classList.add("reveal");
});
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));
