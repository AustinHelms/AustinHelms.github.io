(function () {
'use strict';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* ---------- Hero chute animation ----------
       Cycles through a few example automations. Each one drops through
       four steps, then shows how long the whole thing took.
       All examples are fictional — edit freely. */
    const chute    = document.querySelector('[data-chute]');
    const packet   = document.querySelector('[data-packet]');
    const fill     = document.querySelector('[data-fill]');
    const stages   = Array.from(document.querySelectorAll('[data-stage]'));
    const statusEl = document.querySelector('[data-run-status]');
    const liveEl   = document.querySelector('[data-live]');
    const nameEl   = document.querySelector('[data-flow-name]');
    const metaEl   = document.querySelector('[data-flow-meta]');
    const labelEls = Array.from(document.querySelectorAll('[data-step-label]'));

    const flows = [
      { name: 'New quote request', meta: 'Website form · Kitchen remodel', done: 'Booked',
        steps: ['Request received', 'Text reply sent', 'Added to your CRM', 'Call booked'],
        times: ['0s', '22s', '24s', '9m'], total: '9 min' },
      { name: 'Job marked complete', meta: 'HVAC service · Furnace repair', done: 'Invoiced',
        steps: ['Job closed out', 'Invoice created', 'Invoice sent to customer', 'Review request sent'],
        times: ['0s', '8s', '11s', '2h'], total: '2 hrs' },
      { name: 'New client signed', meta: 'Insurance agency · Commercial policy', done: 'Onboarded',
        steps: ['Agreement signed', 'Folder and tasks created', 'Welcome email sent', 'Kickoff call scheduled'],
        times: ['0s', '14s', '17s', '1m'], total: '1 min' },
      { name: 'New job applicant', meta: 'Job post · Service technician', done: 'Scheduled',
        steps: ['Application received', 'Resume screened', 'Added to hiring tracker', 'Interview booked'],
        times: ['0s', '31s', '33s', '4h'], total: '4 hrs' },
      { name: 'Weekly numbers report', meta: 'Every Monday · 8:00 AM', done: 'Sent',
        steps: ['Numbers pulled', 'Report built', 'Sent to your team', 'Saved to your dashboard'],
        times: ['0s', '40s', '42s', '44s'], total: '44 sec' },
    ];
    let run = 0;
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const centerOf = (stage) => stage.offsetTop + stage.offsetHeight / 2;
    function movePacketTo(y) {
      packet.style.transform = `translateY(${y - 6}px)`;
      fill.style.height = Math.max(0, y - 12) + 'px';
    }
    function setStatus(text, active) {
      statusEl.textContent = text;
      statusEl.className = 'shrink-0 rounded-full border px-2.5 py-1 text-xs ' +
        (active ? 'border-volt text-volt' : 'border-line text-mist');
    }
    function setTotal(text, active) {
      liveEl.textContent = text;
      liveEl.className = 'font-mono text-xs font-semibold ' + (active ? 'text-volt' : 'text-mist');
    }
    function loadFlow(flow) {
      nameEl.textContent = flow.name;
      metaEl.textContent = flow.meta;
      labelEls.forEach((el, i) => { el.textContent = flow.steps[i]; });
    }
    function reset(flow) {
      stages.forEach(s => { s.dataset.state = 'idle'; s.querySelector('[data-time]').textContent = '—'; });
      packet.style.opacity = '0';
      movePacketTo(0);
      setTotal('—', false);
      setStatus('Starting', false);
      loadFlow(flow);
    }

    // Reduced motion: show one finished example, no animation.
    function showFinished() {
      const flow = flows[0];
      loadFlow(flow);
      stages.forEach((s, i) => {
        s.dataset.state = 'done';
        s.querySelector('[data-time]').textContent = flow.times[i];
      });
      fill.style.height = (chute.offsetHeight - 24) + 'px';
      setStatus(flow.done, true);
      setTotal(flow.total, true);
    }

    async function play() {
      const flow = flows[run % flows.length];
      reset(flow);
      await wait(900);
      packet.style.opacity = '1';
      setStatus('Running', true);
      for (let i = 0; i < stages.length; i++) {
        const s = stages[i];
        movePacketTo(centerOf(s));
        await wait(500);
        s.dataset.state = 'running';
        s.querySelector('[data-time]').textContent = '…';
        await wait(1000);
        s.dataset.state = 'done';
        s.querySelector('[data-time]').textContent = flow.times[i];
      }
      packet.style.opacity = '0';
      fill.style.height = (chute.offsetHeight - 24) + 'px';
      setStatus(flow.done, true);
      setTotal(flow.total, true);
      run++;
      await wait(3800);
      play();
    }

    if (reduceMotion) {
      showFinished();
    } else {
      // Start only once the hero is visible.
      let started = false;
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) { started = true; play(); }
      }, { threshold: 0.3 }).observe(chute);
    }
})();
