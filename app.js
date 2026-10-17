/* CHART Evidence Atlas: evidence controls and autonomous artwork motion. */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const evidence = {
    2026: { title:'Five-year follow-up', date:'Data cutoff 6 June 2025 · 2026 ASCO meeting abstract', rez:'78.8', bic:'44.8', rezWidth:98.5, bicWidth:56, hr:'0.59', low:.47, high:.73, ci:'0.47–0.73', follow:'Median follow-up: 72.8 months (IQR 69.1–77.4)', note:'Bars encode reported medians only; they are not survival curves. 95% CI: 68.3–NR vs 37.1–57.4 months.', detail:'CHART intention-to-treat population, high-volume mHSPC. Overall survival, data cutoff 6 June 2025. Median 78.8 months (95% CI 68.3–NR) for rezvilutamide + ADT and 44.8 months (95% CI 37.1–57.4) for bicalutamide + ADT. Ye et al., 2026 ASCO abstract 5090.', source:'https://ascopubs.org/doi/10.1200/JCO.2026.44.16_suppl.5090', sourceText:'Read the 2026 ASCO abstract ↗', chartLabel:'2026 median overall survival: 78.8 months with rezvilutamide plus ADT versus 44.8 months with bicalutamide plus ADT' },
    2022: { title:'Preplanned interim analysis', date:'Data cutoff 28 February 2022 · Lancet Oncology primary report', rez:'NR', bic:'NR', rezWidth:0, bicWidth:0, hr:'0.58', low:.44, high:.77, ci:'0.44–0.77', follow:'Median follow-up: 29.3 months (IQR 21.0–33.3)', note:'Median OS was not reached in either arm at this cutoff. The bicalutamide arm 95% CI was 36.2 months to NR.', detail:'CHART intention-to-treat population, high-volume mHSPC. Overall survival, data cutoff 28 February 2022. Median OS was not reached in either arm; hazard ratio 0.58 (95% CI 0.44–0.77). Gu et al., Lancet Oncology 2022.', source:'https://doi.org/10.1016/S1470-2045(22)00507-1', sourceText:'Read the 2022 primary report ↗', chartLabel:'2022 median overall survival was not reached in either randomized arm' }
  };
  function setYear(year) {
    const d=evidence[year];
    $('#analysis-title').textContent=d.title; $('#analysis-date').textContent=d.date;
    $('#value-rez').textContent=d.rez; $('#value-bic').textContent=d.bic;
    $('#bar-rez').style.width=d.rezWidth+'%'; $('#bar-bic').style.width=d.bicWidth+'%';
    $('#median-chart').setAttribute('aria-label',d.chartLabel);
    $('#chart-footnote').textContent=d.note; $('#data-detail-text').textContent=d.detail; $('#hr-value').textContent=d.hr;
    $('#hr-description').textContent='Overall survival · 95% CI '+d.ci;
    $('#ci-graphic').setAttribute('aria-label',`${year} overall survival hazard ratio ${d.hr} with 95% confidence interval ${d.low} to ${d.high}`);
    $('#ci-band').style.left=(d.low/1.5*100)+'%'; $('#ci-band').style.width=((d.high-d.low)/1.5*100)+'%';
    $('#ci-point').style.left=(((Number(d.hr)-d.low)/(d.high-d.low))*100)+'%';
    $('#evidence-context').textContent=d.follow; $('#evidence-source').href=d.source; $('#evidence-source').textContent=d.sourceText;
    document.querySelectorAll('.segmented button').forEach(b=>{const active=b.dataset.year===year;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }
  document.querySelectorAll('.segmented button').forEach(b=>b.addEventListener('click',()=>setYear(b.dataset.year)));
  setYear('2026');

  const detail=$('#study-detail');
  const studyContent={
    eligibility:['Eligibility','Adults with ECOG performance status 0–1 and high-volume mHSPC were eligible. High-volume disease was defined by visceral metastases or at least four bone lesions, including one beyond the pelvis and vertebral column. Prior chemotherapy and other localized prostate treatment were not allowed.'],
    endpoints:['Co-primary endpoints','CHART measured blinded independent review committee assessed radiographic progression-free survival and overall survival in the intention-to-treat population. The 2026 abstract reports investigator-assessed rPFS; it should not be treated as the same assessment as the 2022 primary rPFS endpoint.'],
    rez:['Selected arm: rezvilutamide + ADT','Randomized patients received rezvilutamide 240 mg orally once daily with ADT. This trial studied high-volume metastatic disease and used bicalutamide plus ADT as its comparator.'],
    bic:['Selected arm: bicalutamide + ADT','Randomized patients received bicalutamide 50 mg orally once daily with ADT. The trial does not directly compare rezvilutamide with other contemporary ARPIs.']
  };
  function showStudy(key){const [title,body]=studyContent[key];detail.innerHTML='<strong></strong><p></p>';detail.querySelector('strong').textContent=title;detail.querySelector('p').textContent=body;document.querySelectorAll('.flow-arm').forEach(b=>b.classList.toggle('active',b.dataset.arm===key));}
  document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>showStudy(b.dataset.detail)));
  document.querySelectorAll('[data-arm]').forEach(b=>b.addEventListener('click',()=>showStudy(b.dataset.arm)));

  const steps=[
    ['01 — Androgen signal','Androgen binds to the androgen receptor.'],
    ['02 — Receptor activity','Activated AR can enter the nucleus and regulate gene transcription.'],
    ['03 — AR antagonism','An AR antagonist interferes with receptor signaling.'],
    ['04 — Downstream effect','AR-driven transcriptional signaling is reduced.']
  ];
  const moa=$('#mechanism-visual'), moaToggle=$('#mechanism-toggle');
  let step=0, moaPaused=reduced.matches, moaVisible=false, moaTimer;
  function showStep(n){step=n;moa.className='mechanism-visual moa-step-'+step;$('#moa-step-count').textContent=`0${step+1} / 04`;$('#moa-step-title').textContent=steps[step][0];$('#moa-step-description').textContent=steps[step][1];$('#moa-progress-fill').style.width=((step+1)*25)+'%';document.querySelectorAll('.moa-dots button').forEach((b,i)=>{b.classList.toggle('active',i===step);b.setAttribute('aria-pressed',String(i===step));});}
  function syncMoa(){clearInterval(moaTimer);if(moaVisible&&!moaPaused&&!reduced.matches)moaTimer=setInterval(()=>showStep((step+1)%4),3300);moaToggle.innerHTML=moaPaused?'Play sequence <span>▶</span>':'Pause sequence <span>Ⅱ</span>';moaToggle.setAttribute('aria-pressed',String(moaPaused));}
  document.querySelectorAll('.moa-dots button').forEach(b=>b.addEventListener('click',()=>showStep(Number(b.dataset.step))));
  moaToggle.addEventListener('click',()=>{moaPaused=!moaPaused;syncMoa();});
  new IntersectionObserver(entries=>{moaVisible=entries[0].isIntersecting;syncMoa();},{threshold:.1}).observe(moa);
  reduced.addEventListener('change',()=>{if(reduced.matches)moaPaused=true;syncMoa();});
  showStep(0);syncMoa();

  // The selected illustration follows a gentle perspective orbit, not a 360° anatomical reconstruction.
  const hero = $('#top'), motionToggle = $('#motion-toggle');
  let heroPaused = false, heroVisible = true;
  function syncHeroMotion() {
    const stopped = heroPaused || reduced.matches;
    hero.classList.toggle('artwork-paused', stopped || !heroVisible || document.hidden);
    motionToggle.textContent = reduced.matches ? 'Reduced motion' : heroPaused ? 'Play motion' : 'Pause motion';
    motionToggle.setAttribute('aria-pressed', String(stopped));
    motionToggle.disabled = reduced.matches;
  }
  motionToggle.hidden = false;
  motionToggle.addEventListener('click', () => { heroPaused = !heroPaused; syncHeroMotion(); });
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    syncHeroMotion();
  }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', syncHeroMotion);
  reduced.addEventListener('change', syncHeroMotion);
  syncHeroMotion();
})();
