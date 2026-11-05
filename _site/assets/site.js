// Site interactive enhancements. Trusted-Types-safe; progressive.
(function () {
  "use strict";

  // Mark the document JS-capable so the no-JS back-to-top CSS reveal floor (a pure
  // progressive-enhancement fallback) steps aside and this script owns the control.
  document.documentElement.classList.add("js");

  // Copy button on each cite-box / code <pre>.
  function addCopy(pre) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      if (!(navigator.clipboard && navigator.clipboard.writeText)) { return; }
      navigator.clipboard.writeText(pre.textContent).then(function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      }, function () { btn.textContent = "Copy failed"; });
    });
    pre.parentNode.insertBefore(btn, pre);
  }
  var pres = document.querySelectorAll("details.cite-this pre, article.body pre");
  for (var i = 0; i < pres.length; i++) { addCopy(pres[i]); }

  // Shared hovercard machinery. Both the citation and footnote previews are a card
  // that hover/focus opens, steps prev/next through its targets in document order (a
  // "n / N" position counter in the nav bar), and is drag-moveable by that nav bar.
  // The only genuine per-type differences come in via opts:
  //   anchors    -- array of in-body anchors (cites or footnote markers).
  //   decorative -- false: role=dialog, keyboard-reachable nav (citations). true:
  //                 aria-hidden decorative preview with nav buttons kept OUT of tab
  //                 order (tabindex=-1), so the card is never a focus/a11y trap
  //                 (footnotes; the real note is reached by activating the marker).
  //   prevLabel / nextLabel -- aria-labels for the step buttons.
  //   contentFor(id) -- a DocumentFragment for the card body (may be empty).
  //   titleFor(id)   -- native title= string for the marker (JS-off / touch fallback),
  //                     or null to leave the marker's title untouched.
  // TT-safe: the card is built with DOM APIs + cloneNode only (no HTML-string sinks),
  // so it survives a strict Content-Security-Policy.
  function makeHovercard(opts) {
    var anchors = opts.anchors;
    var order = [];               // target ids in first-reference document order (deduped)
    var seen = Object.create(null);
    for (var j = 0; j < anchors.length; j++) {
      var href = anchors[j].getAttribute("href");
      if (!href || href.charAt(0) !== "#") { continue; }
      var tid = href.slice(1);
      if (!document.getElementById(tid)) { continue; }   // skip markers with no target
      if (opts.titleFor) {
        var t = opts.titleFor(tid);
        if (t) { anchors[j].setAttribute("title", t); }
      }
      if (!seen[tid]) { seen[tid] = true; order.push(tid); }
    }
    if (!order.length) { return; }
    var card = document.createElement("div");
    card.className = "hovercard";
    if (opts.decorative) {
      // decorative preview, not a dialog: aria-hidden keeps assistive tech from
      // announcing an unreachable duplicate (the real target is reached via the marker).
      card.setAttribute("aria-hidden", "true");
    } else {
      card.setAttribute("role", "dialog");
    }
    card.hidden = true;
    var cbody = document.createElement("div");
    cbody.className = "hovercard-body";
    var cnav = document.createElement("div");
    cnav.className = "hovercard-nav";
    var cprev = document.createElement("button");
    cprev.type = "button"; cprev.className = "hovercard-navbtn";
    cprev.textContent = String.fromCharCode(0x25C0); cprev.setAttribute("aria-label", opts.prevLabel);
    var cpos = document.createElement("span");
    cpos.className = "hovercard-pos";
    var cnext = document.createElement("button");
    cnext.type = "button"; cnext.className = "hovercard-navbtn";
    cnext.textContent = String.fromCharCode(0x25B6); cnext.setAttribute("aria-label", opts.nextLabel);
    if (opts.decorative) {
      // A focusable control inside an aria-hidden card is itself an a11y trap
      // (focusable but never tabbable, and focus must never land inside aria-hidden).
      // Keep the nav pointer-operable but out of tab order, and preventDefault its
      // mousedown so a click never moves focus INTO the card (which would also drop
      // focus to <body> when step() then disables the button at an end).
      cprev.tabIndex = -1; cnext.tabIndex = -1;
      cprev.addEventListener("mousedown", function (e) { e.preventDefault(); });
      cnext.addEventListener("mousedown", function (e) { e.preventDefault(); });
    }
    cnav.appendChild(cprev); cnav.appendChild(cpos); cnav.appendChild(cnext);
    // Nav on TOP: prev/next buttons appended before the body.
    card.appendChild(cnav); card.appendChild(cbody);
    document.body.appendChild(card);

    var hideTimer = null, curIdx = -1, curAnchor = null, pinned = false, moved = false;
    function populate(idx) {
      if (idx < 0 || idx >= order.length) { return; }
      curIdx = idx;
      while (cbody.firstChild) { cbody.removeChild(cbody.firstChild); }
      var frag = opts.contentFor(order[idx]);
      if (frag) { cbody.appendChild(frag); }
      cpos.textContent = (idx + 1) + " / " + order.length;
      // A single-target card has no prev/next to show, but the nav bar is also the
      // drag grip -- keep it (and its grip) visible, hiding only the step controls, so
      // a lone-target card stays drag-moveable.
      var single = order.length < 2;
      cprev.hidden = single; cnext.hidden = single; cpos.hidden = single;
      // Mark the end buttons aria-disabled, NOT disabled: a real `disabled` on the
      // button that holds focus makes the browser drop focus to <body>, which would
      // stall keyboard arrow stepping at an end. aria-disabled greys the button and
      // tells assistive tech it is inert while keeping it focusable; step() already
      // no-ops out of range, so a click/Enter on an end button does nothing.
      setDisabled(cprev, idx === 0);
      setDisabled(cnext, idx === order.length - 1);
    }
    function setDisabled(btn, off) {
      if (off) { btn.setAttribute("aria-disabled", "true"); }
      else { btn.removeAttribute("aria-disabled"); }
    }
    function place(anchor) {
      var rect = anchor.getBoundingClientRect();
      var left = window.pageXOffset + rect.left;
      var maxLeft = window.pageXOffset + document.documentElement.clientWidth - card.offsetWidth - 8;
      if (left > maxLeft) { left = maxLeft; }
      if (left < window.pageXOffset + 8) { left = window.pageXOffset + 8; }
      card.style.left = left + "px";
      card.style.top = (window.pageYOffset + rect.bottom + 6) + "px";
    }
    function show(anchor, idx) {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      pinned = false;            // a fresh hover/focus is transient again
      moved = false;             // re-anchor to the marker (drag offset cleared)
      curAnchor = anchor;
      card.hidden = false;
      populate(idx);
      place(anchor);
    }
    // Pinned (the user clicked a nav button) overrides hover-to-hide, so stepping
    // through targets never auto-closes when the card resizes under the pointer.
    function hideSoon() { if (pinned) { return; } hideTimer = setTimeout(function () { card.hidden = true; }, 200); }
    function cancelHide() { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }
    function dismiss() { card.hidden = true; pinned = false; cancelHide(); }
    function step(delta) {
      var ni = curIdx + delta;
      if (ni < 0 || ni >= order.length) { return; }
      cancelHide();
      pinned = true;
      var hadFocusInside = card.contains(document.activeElement);
      populate(ni);
      // populate() replaces the body, so a focused body link (e.g. a reference DOI/URL
      // in the citation card) is removed and the browser drops focus to <body>, which
      // would stall further arrow stepping. If focus was inside the card, move it to the
      // nav button for the direction stepped -- it survives populate and stays focusable
      // (end buttons are aria-disabled, not disabled) -- so keyboard stepping continues.
      if (hadFocusInside && !card.contains(document.activeElement)) {
        (delta < 0 ? cprev : cnext).focus({ preventScroll: true });
      }
      // Keep a dragged card where the user put it; otherwise re-anchor on resize.
      if (curAnchor && !moved) { place(curAnchor); }
    }
    for (var c = 0; c < anchors.length; c++) {
      (function (a) {
        var h = a.getAttribute("href");
        if (!h || h.charAt(0) !== "#") { return; }
        var idx = order.indexOf(h.slice(1));
        if (idx < 0) { return; }
        a.addEventListener("mouseenter", function () { show(a, idx); });
        a.addEventListener("mouseleave", hideSoon);
        a.addEventListener("focus", function () { show(a, idx); });
        a.addEventListener("blur", hideSoon);
      })(anchors[c]);
    }
    card.addEventListener("mouseenter", cancelHide);
    card.addEventListener("mouseleave", hideSoon);
    // A pointer press anywhere inside the card pins it, so selecting text on touch
    // (no hover there) is not cut short by the blur/hideSoon closing the card.
    card.addEventListener("pointerdown", function () { pinned = true; cancelHide(); });
    cprev.addEventListener("click", function () { step(-1); });
    cnext.addEventListener("click", function () { step(1); });
    // Drag the card by its nav bar to reposition it (pointer); dragging pins it so
    // it does not auto-hide, and sets `moved` so stepping targets keeps the new spot.
    (function () {
      var dragging = false, activeId = -1, sx = 0, sy = 0, sl = 0, st = 0;
      cnav.addEventListener("pointerdown", function (e) {
        if (dragging) { return; }   // ignore a second pointer (multi-touch)
        if (e.target.closest && e.target.closest("button")) { return; }
        dragging = true; activeId = e.pointerId; pinned = true; moved = true; cancelHide();
        sx = e.clientX; sy = e.clientY;
        sl = parseFloat(card.style.left) || 0; st = parseFloat(card.style.top) || 0;
        card.classList.add("dragging");
        try { cnav.setPointerCapture(e.pointerId); } catch (ignore) {}
        e.preventDefault();
      });
      cnav.addEventListener("pointermove", function (e) {
        if (!dragging || e.pointerId !== activeId) { return; }
        var nl = sl + (e.clientX - sx), nt = st + (e.clientY - sy);
        var maxL = window.pageXOffset + document.documentElement.clientWidth - card.offsetWidth - 8;
        if (nl > maxL) { nl = maxL; }
        if (nl < window.pageXOffset + 8) { nl = window.pageXOffset + 8; }
        if (nt < window.pageYOffset + 8) { nt = window.pageYOffset + 8; }
        card.style.left = nl + "px"; card.style.top = nt + "px";
      });
      function endDrag(e) { if (dragging && (!e || e.pointerId === activeId)) { dragging = false; activeId = -1; card.classList.remove("dragging"); } }
      cnav.addEventListener("pointerup", endDrag);
      cnav.addEventListener("pointercancel", endDrag);
    })();
    // Keyboard: Escape dismisses; a plain Left/Right steps prev/next ONLY while the
    // focus is on one of this card's markers or inside the card itself. Scoping to
    // focus (populate() keeps focus inside the card across a boundary) means one arrow
    // never advances a second card on the page, a pinned-but-unfocused card never
    // hijacks arrows from another focused control, and an unpinned hover-only card
    // never hijacks page scrolling. Modified arrows are left to the browser (text
    // selection, history, word jump).
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { dismiss(); return; }
      if (card.hidden) { return; }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") { return; }
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) { return; }
      var ae = document.activeElement;
      if (!(card.contains(ae) || anchors.indexOf(ae) >= 0)) { return; }
      e.preventDefault();
      step(e.key === "ArrowLeft" ? -1 : 1);
    });
    // A pinned card is dismissed by a click outside it (the nav click that pins
    // is inside the card, so it never self-dismisses).
    document.addEventListener("click", function (e) {
      if (pinned && !card.hidden && !card.contains(e.target)) { dismiss(); }
    });
  }

  // Citation hovercards: hover/focus a [n] to preview its reference, stepping through
  // the references in document order. The native title= is kept as a JS-off fallback.
  // citeproc renders each in-text cite as <span class="citation"><a href="#ref-KEY">;
  // a grouped cite holds several such anchors. The reference list uses .csl-entry,
  // never .citation, so this selector matches in-text cites only.
  (function () {
    var cites = [].slice.call(document.querySelectorAll("article.body .citation a[href^='#ref-']"));
    function refFragment(id) {
      // Prefer the verbatim source-quote block inlined in the reference entry
      // (.csl-quote) -- a single source of the quote, shared with the reference area
      // (no duplicate hidden store); fall back to the whole reference entry when the
      // key has no quote.
      var frag = document.createDocumentFragment();
      var ref = document.getElementById(id);
      if (!ref) { return frag; }
      var r = ref.querySelector(".csl-quote") || ref;
      var kids = r.childNodes;
      for (var i = 0; i < kids.length; i++) {
        frag.appendChild(kids[i].cloneNode(true));
      }
      return frag;
    }
    function refTitle(id) {
      // Native tooltip = the reference text WITHOUT the inlined .csl-quote (the quote
      // is shown in the hovercard; repeating it in the title is noise).
      var ref = document.getElementById(id);
      if (!ref) { return null; }
      var titleSrc = ref.cloneNode(true);
      var cq = titleSrc.querySelector(".csl-quote");
      if (cq && cq.parentNode) { cq.parentNode.removeChild(cq); }
      return titleSrc.textContent.replace(/\s+/g, " ").trim();
    }
    makeHovercard({
      anchors: cites,
      decorative: false,
      prevLabel: "Previous reference",
      nextLabel: "Next reference",
      contentFor: refFragment,
      titleFor: refTitle
    });
  })();

  // Figure lightbox: click a body image to view enlarged; click or Escape closes.
  function lightbox(img) {
    var ov = document.createElement("div");
    ov.className = "lightbox";
    var big = document.createElement("img");
    big.setAttribute("src", img.getAttribute("src"));
    big.setAttribute("alt", img.getAttribute("alt") || "");
    ov.appendChild(big);
    function close() { ov.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") { close(); } }
    ov.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(ov);
  }
  var imgs = document.querySelectorAll("article.body img");
  for (var k = 0; k < imgs.length; k++) {
    imgs[k].classList.add("zoomable");
    imgs[k].addEventListener("click", function (e) { lightbox(e.currentTarget); });
  }

  // Back-to-top: reveal past 400px of scroll, auto-hide 2s after scrolling stops,
  // smooth-scroll on click. Shown/hidden via an eased opacity fade (.btt-hidden)
  // mirroring the production wiki control, not a binary display snap. Progressive --
  // the <a href="#top"> works with no JS.
  (function () {
    var btn = document.querySelector(".back-to-top");
    if (!btn) { return; }
    // Hide instantly on load, then enable the fade. Forcing a reflow between the two
    // commits the hidden state under the base (no-opacity) transition, so opacity snaps
    // to 0 with no fade; .btt-anim then enables the fade for later toggles only. (A lone
    // requestAnimationFrame batches both class adds into one style pass, so with the
    // deferred site.js the initial hide would still play as a 300ms fade-out on load.)
    btn.classList.add("btt-hidden");
    void btn.offsetHeight;
    btn.classList.add("btt-anim");
    function show() { btn.classList.remove("btt-hidden"); }
    // Never hide the control while it holds keyboard focus (a hide-timer or a
    // scroll-to-top must not steal focus from a keyboard user mid-activation, and
    // the fade-out's visibility:hidden would drop focus).
    function hide() { if (document.activeElement !== btn) { btn.classList.add("btt-hidden"); } }
    var idle = null;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      // "instant" forces the jump a reduced-motion user asked for ("auto" would honor a CSS
      // scroll-behavior:smooth if one were ever set). Then release focus so the scroll-to-top's
      // own hide() is not suppressed by the focus-guard, which would otherwise leave the control
      // at the top catching clicks over the content; moving focus on activation is WCAG-fine.
      var reduce = window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
      // Release focus only on a POINTER click (detail > 0; keyboard-activated clicks report 0),
      // so the scroll-to-top's own hide() is not suppressed by the focus-guard, leaving the
      // control at the top catching clicks. A keyboard user keeps focus (blurring would discard
      // their place rather than move it somewhere sensible).
      if (e.detail > 0) { btn.blur(); }
    });
    // On blur, re-check the threshold: hide at once near the top, else resume the idle-hide (a
    // focused control's idle timer no-ops, so without this it would linger once focus leaves).
    btn.addEventListener("blur", function () {
      if (window.scrollY < 400) { hide(); return; }
      clearTimeout(idle);
      idle = setTimeout(hide, 2000);
    });
    window.addEventListener("scroll", function () {
      if (window.scrollY < 400) { hide(); return; }
      show();
      clearTimeout(idle);
      idle = setTimeout(hide, 2000);
    }, { passive: true });
  })();

  // Footnote hovercards: hover/focus a footnote marker to preview the note inline,
  // with the same prev/next stepping and drag-to-move as the citation card (shared
  // makeHovercard). Progressive -- the marker stays a working <a href="#fnN"> with no
  // JS (click still jumps to the note at the document end); this only adds a preview.
  // The marker id namespace is pandoc's (#fnN), found by getElementById, so this is
  // agnostic to whether pandoc wrapped the notes in <section> or <aside>. The card is
  // decorative (aria-hidden, untabbable nav) so it is never an a11y trap. TT-safe:
  // DOM APIs + cloneNode only.
  (function () {
    var marks = [].slice.call(
      document.querySelectorAll("article.body a.footnote-ref[href^='#fn']"));
    function noteClone(id) {
      // A clone of the <li id="fnN"> note, minus the back-reference arrow(s)
      // (navigation chrome, noise in a preview); null if the note is missing.
      var li = document.getElementById(id);
      if (!li) { return null; }
      var clone = li.cloneNode(true);
      // Drop the back-reference arrow(s) (navigation chrome) AND any copy button that
      // addCopy() already injected into a <pre> in the note: both are noise in a preview,
      // and a .copy-btn cloned into this aria-hidden card would be a dead duplicate and a
      // focusable control inside aria-hidden (the a11y trap the href strip below avoids).
      var chrome = clone.querySelectorAll(".footnote-back, .copy-btn");
      for (var i = 0; i < chrome.length; i++) {
        if (chrome[i].parentNode) { chrome[i].parentNode.removeChild(chrome[i]); }
      }
      // The card is a DECORATIVE preview (aria-hidden, not in tab order): a keyboard
      // user reaches the note's real links by activating the marker (href="#fnN" ->
      // the note at document end, where the links ARE in tab order). So drop href from
      // the preview's own links -- a link that is focusable but can never be tabbed to
      // is the a11y trap; without href it is inert citation text, no trap, and the live
      // links stay one marker-activation away. The marker's title= carries the note
      // text for assistive tech.
      var links = clone.querySelectorAll("a[href]");
      for (var j = 0; j < links.length; j++) {
        links[j].removeAttribute("href");
      }
      return clone;
    }
    function noteFragment(id) {
      var frag = document.createDocumentFragment();
      var clone = noteClone(id);
      if (clone) { while (clone.firstChild) { frag.appendChild(clone.firstChild); } }
      return frag;
    }
    function noteTitle(id) {
      var clone = noteClone(id);
      return clone ? clone.textContent.replace(/\s+/g, " ").trim() : null;
    }
    makeHovercard({
      anchors: marks,
      decorative: true,
      prevLabel: "Previous footnote",
      nextLabel: "Next footnote",
      contentFor: noteFragment,
      titleFor: noteTitle
    });
  })();
})();
