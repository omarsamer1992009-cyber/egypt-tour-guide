const search=document.querySelector('#search');
const cards=[...document.querySelectorAll('.place-card')];
const filters=[...document.querySelectorAll('.filter')];
let active='all';
function update(){const q=search.value.trim().toLowerCase();let count=0;cards.forEach(card=>{const match=(active==='all'||card.dataset.category===active)&&card.dataset.name.toLowerCase().includes(q);card.hidden=!match;if(match)count++});document.querySelector('#noResults').hidden=count!==0;}
search.addEventListener('input',update);
filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.toggle('active',b===btn));active=btn.dataset.filter;update()}));
document.querySelectorAll('.save').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('saved');btn.textContent=btn.classList.contains('saved')?'♥':'♡'}));
document.querySelector('.menu').addEventListener('click',()=>{const nav=document.querySelector('.topbar nav');const open=nav.style.display==='flex';nav.style.display=open?'none':'flex';nav.style.position='absolute';nav.style.top='68px';nav.style.left='0';nav.style.right='0';nav.style.padding='22px 7%';nav.style.background='#fbfaf6';nav.style.flexDirection='column';nav.style.borderBottom='1px solid #e7e0d4'});


// Open a bilingual YouTube search for each monument. Search results are not
// pre-verified; visitors should check that the selected video is 60 seconds or less.
const videoModal=document.querySelector('#videoModal');
const videoTitle=document.querySelector('#videoTitle');
const videoCaption=document.querySelector('#videoCaption');
const englishVideoLink=document.querySelector('#englishVideoLink');
const arabicVideoLink=document.querySelector('#arabicVideoLink');
function openDestinationVideo(trigger){
  const title=trigger.dataset.title||'Egypt monument';
  const englishQuery=`${title} explained in 60 seconds English`;
  const arabicQuery=`شرح ${title} في دقيقة عربي`;
  videoTitle.textContent=title;
  videoCaption.textContent='Choose a language to search for a short educational explanation. Check that the video duration is 60 seconds or less.';
  englishVideoLink.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(englishQuery)}`;
  arabicVideoLink.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(arabicQuery)}`;
  videoModal.classList.add('open');
  videoModal.setAttribute('aria-hidden','false');
  document.body.classList.add('video-open');
}
function closeDestinationVideo(){
  videoModal.classList.remove('open');
  videoModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('video-open');
}
document.querySelectorAll('.video-trigger').forEach(trigger=>{
  trigger.addEventListener('click',event=>{if(event.target.closest('.save'))return;openDestinationVideo(trigger)});
  trigger.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openDestinationVideo(trigger)}});
});
document.querySelectorAll('[data-close-video]').forEach(button=>button.addEventListener('click',closeDestinationVideo));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&videoModal.classList.contains('open'))closeDestinationVideo()});
document.querySelectorAll('.place-card .text-link').forEach(link=>link.addEventListener('click',event=>{
  const trigger=link.closest('.place-card').querySelector('.video-trigger');
  if(trigger){event.preventDefault();openDestinationVideo(trigger)}
}));


// Create account is the first screen on a new browser session.
// This is a front-end demo: it never stores or sends passwords.
const signupScreen=document.querySelector('#signupScreen');
const signupForm=document.querySelector('#signupForm');
const signupFeedback=document.querySelector('#signupFeedback');

function openSignup(){
  signupScreen.classList.add('open');
  signupScreen.setAttribute('aria-hidden','false');
  document.body.classList.add('signup-open');
  document.querySelector('#signupName').focus();
}
function closeSignup(){
  signupScreen.classList.remove('open');
  signupScreen.setAttribute('aria-hidden','true');
  document.body.classList.remove('signup-open');
}

// If the visitor has already completed the demo sign-up in this tab,
// show the destinations directly. Otherwise the account screen stays first.
if(sessionStorage.getItem('egyptTourGuideAccountCreated') === 'true'){
  closeSignup();
}

document.querySelector('#openSignup').addEventListener('click',openSignup);

signupForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!signupForm.reportValidity()) return;

  const name=document.querySelector('#signupName').value.trim();
  const email=document.querySelector('#signupEmail').value.trim();

  // Store only non-sensitive demo details; never store the password.
  sessionStorage.setItem('egyptTourGuideAccountCreated','true');
  sessionStorage.setItem('egyptTourGuideName',name);
  sessionStorage.setItem('egyptTourGuideEmail',email);

  signupFeedback.textContent=`Account details accepted. Welcome, ${name}!`;
  signupFeedback.style.color='#426b4d';

  // Show a personalized welcome after the account form closes.
  const welcomeToast=document.querySelector('#welcomeToast');
  document.querySelector('#welcomeName').textContent=`Welcome, ${name}!`;
  welcomeToast.hidden=false;
  closeSignup();

  // Take the visitor straight to the monuments/destinations section.
  window.location.hash='destinations';
  document.querySelector('#destinations').scrollIntoView({behavior:'smooth'});
});

// Allow the visitor to dismiss the personalized welcome message.
document.querySelector('#closeWelcome').addEventListener('click',()=>{
  document.querySelector('#welcomeToast').hidden=true;
});

// Persist favourites between visits in this browser.
document.querySelectorAll('.place-card').forEach(card=>{
  const button=card.querySelector('.save'); if(!button)return;
  const key='egyptTourGuideFavorites';
  let saved=[]; try{saved=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
  const name=card.dataset.name;
  if(saved.includes(name)){button.classList.add('saved');button.textContent='♥'}
  button.addEventListener('click',()=>{
    let list=[];try{list=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
    if(list.includes(name))list=list.filter(item=>item!==name);else list.push(name);
    localStorage.setItem(key,JSON.stringify(list));
  });
});

// Simple, editable itinerary suggestions; this is a planning aid, not a booking.
const routeIdeas={
 cairo:['Giza Plateau and the Great Pyramid','Saqqara Step Pyramid and Memphis','Coptic Cairo and Ibn Tulun Mosque','Egyptian Museum and Khan el-Khalili'],
 luxor:['Karnak Temple and Luxor Temple','Valley of the Kings and Hatshepsut Temple','Dendera Temple day trip'],
 aswan:['Philae Temple and Aswan High Dam','Abu Simbel day trip','Nubian Museum and riverside felucca area'],
 mixed:['Cairo: Giza Plateau and Saqqara','Luxor: Karnak and Luxor Temples','Luxor: Valley of the Kings and Hatshepsut Temple','Aswan: Philae Temple','Abu Simbel day trip']
};
document.querySelector('#buildTrip').addEventListener('click',()=>{
 const days=Number(document.querySelector('#tripDays').value), region=document.querySelector('#tripRegion').value;
 const ideas=routeIdeas[region];
 const chosen=Array.from({length:days},(_,i)=>ideas[i%ideas.length]);
 document.querySelector('#tripResult').innerHTML='<strong>Your '+days+'-day outline</strong><ol>'+chosen.map(x=>'<li>'+x+'</li>').join('')+'</ol><small>Check travel times, opening days and ticket availability before you go.</small>';
});

// Ticket estimator uses the visitor's own average ticket estimate.
function calculateBudget(){
 const count=Math.max(0,Math.min(30,Number(document.querySelector('#ticketCount').value)||0));
 const price=Math.max(0,Math.min(10000,Number(document.querySelector('#averageTicket').value)||0));
 const total=count*price;
 document.querySelector('#budgetResult').textContent='Estimated total: EGP '+total.toLocaleString('en-EG')+' ('+count+' attractions × EGP '+price.toLocaleString('en-EG')+'). This is an estimate, not a live ticket quote.';
}
document.querySelector('#calculateBudget').addEventListener('click',calculateBudget);
document.querySelector('#visitorType').addEventListener('change',event=>{document.querySelector('#averageTicket').value=event.target.value==='egyptian'?40:500;calculateBudget()});

// Short educational quiz.
const quizQuestions=[
 {q:'Which pharaoh commissioned the Great Pyramid of Giza?',a:['Tutankhamun','Khufu','Ramses II'],correct:1,why:'Khufu commissioned the Great Pyramid at Giza during the Fourth Dynasty.'},
 {q:'Which river was central to ancient Egyptian farming and transport?',a:['The Nile','The Tigris','The Euphrates'],correct:0,why:'The Nile provided water, fertile floodplains and a major transport route.'},
 {q:'Where is the famous temple complex of Karnak?',a:['Alexandria','Aswan','Luxor'],correct:2,why:'Karnak is on the east bank of the Nile in modern Luxor.'}
];let quizIndex=0;
function renderQuiz(){const q=quizQuestions[quizIndex];document.querySelector('#quizQuestion').textContent=q.q;const holder=document.querySelector('#quizOptions');holder.innerHTML='';q.a.forEach((answer,i)=>{const b=document.createElement('button');b.type='button';b.textContent=answer;b.addEventListener('click',()=>{holder.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add(i===q.correct?'correct-answer':'wrong-answer');if(i!==q.correct)holder.children[q.correct].classList.add('correct-answer');document.querySelector('#quizFeedback').textContent=(i===q.correct?'Correct! ':'Not quite. ')+q.why});holder.appendChild(b)});document.querySelector('#quizFeedback').textContent='Choose an answer to test your knowledge.'}
document.querySelector('#nextQuestion').addEventListener('click',()=>{quizIndex=(quizIndex+1)%quizQuestions.length;renderQuiz()});renderQuiz();

// Dark mode preference.
const themeToggle=document.querySelector('#themeToggle');
if(localStorage.getItem('egyptTourGuideTheme')==='dark')document.body.classList.add('dark-mode');
function syncThemeButton(){themeToggle.textContent=document.body.classList.contains('dark-mode')?'☀':'☾'}syncThemeButton();
themeToggle.addEventListener('click',()=>{document.body.classList.toggle('dark-mode');localStorage.setItem('egyptTourGuideTheme',document.body.classList.contains('dark-mode')?'dark':'light');syncThemeButton()});

// Arabic/English interface toggle for navigation and travel tools.
const languageToggle=document.querySelector('#languageToggle');let currentLanguage=localStorage.getItem('egyptTourGuideLanguage')||'en';
const translations={
 en:{nav:['Home','Destinations','Experiences','About'],tools:'Travel tools',plan:'Plan your journey',map:'Explore Egypt on the map',planner:'Your mini trip planner',budget:'Ticket budget calculator',quiz:'Quick Egypt history quiz',build:'Build my itinerary',calculate:'Calculate estimate'},
 ar:{nav:['الرئيسية','الوجهات','التجارب','عن مصر'],tools:'أدوات السفر',plan:'خطط لرحلتك',map:'استكشف مصر على الخريطة',planner:'مخطط رحلتك',budget:'حاسبة ميزانية التذاكر',quiz:'اختبر معلوماتك عن تاريخ مصر',build:'أنشئ خطتي',calculate:'احسب التكلفة التقديرية'}
};
function applyLanguage(lang){currentLanguage=lang;localStorage.setItem('egyptTourGuideLanguage',lang);document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';languageToggle.textContent=lang==='ar'?'English':'عربي';const nav=[...document.querySelectorAll('.topbar nav a')];nav.forEach((a,i)=>a.textContent=translations[lang].nav[i]);document.querySelector('#travel-tools .section-head h2').innerHTML=lang==='ar'?'أدوات <em>السفر</em>':'Travel <em>tools</em>';const headings=document.querySelectorAll('.tool-card h3');const keys=['map','planner','budget','quiz'];headings.forEach((h,i)=>h.textContent=translations[lang][keys[i]]);document.querySelector('#buildTrip').textContent=translations[lang].build;document.querySelector('#calculateBudget').textContent=translations[lang].calculate;}
languageToggle.addEventListener('click',()=>applyLanguage(currentLanguage==='en'?'ar':'en'));applyLanguage(currentLanguage);
