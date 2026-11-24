/* Medium29 / reusable industry landing interactions.
   No SPA, no JS-rendered primary page text; SEO content is in static HTML.
   GSAP only enhances modal transition if loaded. Everything works without it.
*/
(() => {
  'use strict';
  const page = document.querySelector('.industry-page');
  if (!page) return;
  const $ = selector => document.querySelector(selector);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dialog = $('#industryModal');
  const industryData = window.Medium29IndustryConfig || { gallery:[], solutions:{}, solutionOrder:[] };
  const gallery = industryData.gallery;
  const solutions = industryData.solutions;
  const solutionOrder = industryData.solutionOrder;
  let mode='gallery', currentIndex=0, currentSolution='website', focusBefore=null;
  function showItem() {
    const item = mode==='gallery' ? gallery[currentIndex] : solutions[currentSolution];
    if (!item) return;
    $('#modalImage').src=item.img;
    $('#modalImage').alt=item.alt;
    $('#modalTitle').textContent=item.title;
    $('#modalDescription').textContent=item.description;
    $('#modalFigure').dataset.fit=item.fit || 'contain';
    const points=$('#modalPoints');
    points.replaceChildren();
    item.points.forEach(point => {const li=document.createElement('li');li.textContent=point;points.appendChild(li);});
    $('#modalEyebrow').textContent=mode==='gallery'?'Medium29 / Galerija':'Medium29 / Digitalna rješenja';
    $('#modalCounter').textContent=mode==='gallery'?`${currentIndex+1} / ${gallery.length}`:`${solutionOrder.indexOf(currentSolution)+1} / ${solutionOrder.length}`;
    if (!reduceMotion && window.gsap) {
      window.gsap.fromTo('.industry-modal .modal-figure img',{opacity:.65,x:9},{opacity:1,x:0,duration:.22,ease:'power2.out',overwrite:true});
    }
  }
  function openModal(type,id) {
    if (!dialog || typeof dialog.showModal!=='function') return;
    focusBefore=document.activeElement;
    mode=type;
    if (type==='gallery') currentIndex=id;
    else currentSolution=id;
    showItem();
    dialog.showModal();
    document.body.classList.add('industry-dialog-open');
    $('#modalClose').focus();
    if (!reduceMotion && window.gsap) window.gsap.fromTo('.industry-modal .modal-content',{opacity:.5,y:12},{opacity:1,y:0,duration:.25,ease:'power2.out'});
  }
  function closeModal() {if (dialog?.open) dialog.close();}
  function moveModal(direction) {
    if (mode==='gallery') currentIndex=(currentIndex+direction+gallery.length)%gallery.length;
    else currentSolution=solutionOrder[(solutionOrder.indexOf(currentSolution)+direction+solutionOrder.length)%solutionOrder.length];
    showItem();
  }
  document.querySelectorAll('[data-gallery-index]').forEach(button=>button.addEventListener('click',()=>openModal('gallery',Number(button.dataset.galleryIndex))));
  document.querySelectorAll('[data-solution]').forEach(button=>button.addEventListener('click',()=>openModal('solution',button.dataset.solution)));
  $('#modalClose')?.addEventListener('click',closeModal);
  $('#modalPrev')?.addEventListener('click',()=>moveModal(-1));
  $('#modalNext')?.addEventListener('click',()=>moveModal(1));
  $('#modalCTA')?.addEventListener('click',closeModal);
  dialog?.addEventListener('click',e=>{if (e.target===dialog) closeModal();});
  dialog?.addEventListener('close',()=>{
    document.body.classList.remove('industry-dialog-open');
    if (focusBefore && focusBefore.isConnected) focusBefore.focus({preventScroll:true});
  });
  dialog?.addEventListener('keydown',e=>{
    if (e.key==='ArrowLeft'){e.preventDefault();moveModal(-1);}
    else if (e.key==='ArrowRight'){e.preventDefault();moveModal(1);}
  });
  // Tab semantics, including roving keyboard focus.
  const routeTabs=Array.from(document.querySelectorAll('[data-route-step]'));
  function setRoute(index,withFocus=false){
    routeTabs.forEach((tab,i)=>{
      tab.setAttribute('aria-selected',String(index===i));
      tab.tabIndex=index===i?0:-1;
      const panel=document.getElementById('route-panel-'+i);
      if (panel) panel.hidden=index!==i;
    });
    const panel=document.getElementById('route-panel-'+index);
    if (panel && window.gsap && !reduceMotion) window.gsap.fromTo(panel,{opacity:0,y:6},{opacity:1,y:0,duration:.24,overwrite:true});
    if (withFocus) routeTabs[index]?.focus();
  }
  routeTabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>setRoute(i));
    tab.addEventListener('keydown',e=>{
      const keys=['ArrowRight','ArrowLeft','Home','End'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const next=e.key==='Home'?0:e.key==='End'?routeTabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+routeTabs.length)%routeTabs.length;
      setRoute(next,true);
    });
  });
  // Nav marker (pure enhancement, all anchors remain real links).
  const navLinks=Array.from(document.querySelectorAll('.chapter-links a[href^="#"]'));
  const areas=navLinks.map(link=>document.getElementById(link.getAttribute('href').slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const activeObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (!entry.isIntersecting) return;
        navLinks.forEach(link=>{
          if (link.getAttribute('href')==='#'+entry.target.id) link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      });
    },{rootMargin:'-25% 0px -58% 0px',threshold:0});
    areas.forEach(area=>activeObserver.observe(area));
  }
  // Smooth scroll provided by CSS; leave native behavior for reduced-motion users.
  // Scope optional reveal to THIS page, then honor fallback when no observer.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const nodes=Array.from(document.querySelectorAll('.industry-page .ind-reveal'));
    const watch=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');watch.unobserve(entry.target);}
    }),{threshold:0.04,rootMargin:'0px 0px 65px 0px'});
    nodes.forEach(el=>watch.observe(el));
    page.classList.add('motion-enhanced');
    // If observer is throttled, visible elements must never be invisible.
    document.querySelectorAll('.ind-reveal').forEach(el=>{
      if (el.getBoundingClientRect().top < innerHeight+90) el.classList.add('is-visible');
    });
  }
  // Same Web3Forms + hCaptcha flow as the existing Medium29 contact page.
  const form=$('#industryLeadForm');
  const status=$('#industryFormStatus');
  const submit=$('#industrySubmit');
  const originalButtonHTML=submit?.innerHTML;
  form?.addEventListener('submit',async e=>{
    e.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent='';status.classList.remove('is-error','is-success');
    const captcha=form.querySelector('textarea[name="h-captcha-response"]');
    if (!captcha?.value) {
      status.textContent='Molimo potvrdite hCaptcha provjeru prije slanja upita.';
      status.classList.add('is-error');
      return;
    }
    submit.disabled=true;
    submit.textContent='Slanje upita…';
    try {
      const response=await fetch('https://api.web3forms.com/submit',{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if (!response.ok) throw new Error('Server je nedostupan.');
      const result=await response.json();
      if (!result.success) throw new Error(result.message || 'Slanje nije uspjelo.');
      form.hidden=true;
      const success=$('#industryFormSuccess');
      success.style.display='block';
      success.focus({preventScroll:false});
    } catch(error) {
      status.classList.add('is-error');
      status.textContent='Upit nije poslan. Pokušajte ponovno ili pišite na info.medium29@gmail.com.';
      if (window.hcaptcha?.reset) window.hcaptcha.reset();
      submit.disabled=false;
      submit.innerHTML=originalButtonHTML;
    }
  });
})();
