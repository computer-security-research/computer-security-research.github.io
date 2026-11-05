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

  // Citation hovercards: hover/focus a [n] to preview its reference, with prev/next
  // stepping through the references in document order. The native title= is kept as a
  // JS-off fallback. TT-safe: the card is built with DOM APIs + cloneNode only (no
  // HTML-string sinks), so it survives a strict Content-Security-Policy.
  // citeproc renders each in-text cite as <span class="citation"><a href="#ref-KEY">;
  // a grouped cite holds several such anchors. The reference list uses .csl-entry,
  // never .citation, so this selector matches in-text cites only.
  var cites = [].slice.call(document.querySelectorAll("article.body .citation a[href^='#ref-']"));
  var refOrder = [];            // ref ids in first-citation document order (deduped)
  var seen = Object.create(null);
  for (var j = 0; j < cites.length; j++) {
    var href = cites[j].getAttribute("href");
    if (!href || href.charAt(0) !== "#") { continue; }
    var rid = href.slice(1);
    var ref = document.getElementById(rid);
    if (!ref) { continue; }
    // Native tooltip = the reference text WITHOUT the inlined .csl-quote (the
    // quote is shown in the hovercard; repeating it in the title is noise).
    var titleSrc = ref.cloneNode(true);
    var cq = titleSrc.querySelector(".csl-quote");
    if (cq && cq.parentNode) { cq.parentNode.removeChild(cq); }
    cites[j].setAttribute("title", titleSrc.textContent.replace(/\s+/g, " ").trim());
    if (!seen[rid]) { seen[rid] = true; refOrder.push(rid); }
  }
  if (refOrder.length) {
    var card = document.createElement("div");
    card.className = "hovercard";
    card.setAttribute("role", "dialog");
    card.hidden = true;
    var cbody = document.createElement("div");
    cbody.className = "hovercard-body";
    var cnav = document.createElement("div");
    cnav.className = "hovercard-nav";
    var cprev = document.createElement("button");
    cprev.type = "button"; cprev.className = "hovercard-navbtn";
    cprev.textContent = String.fromCharCode(0x25C0); cprev.setAttribute("aria-label", "Previous reference");
    var cpos = document.createElement("span");
    cpos.className = "hovercard-pos";
    var cnext = document.createElement("button");
    cnext.type = "button"; cnext.className = "hovercard-navbtn";
    cnext.textContent = String.fromCharCode(0x25B6); cnext.setAttribute("aria-label", "Next reference");
    cnav.appendChild(cprev); cnav.appendChild(cpos); cnav.appendChild(cnext);
    // Nav on TOP: prev/next buttons appended before the reference body.
    card.appendChild(cnav); card.appendChild(cbody);
    document.body.appendChild(card);

    var hideTimer = null, curIdx = -1, curAnchor = null, pinned = false, moved = false;
    function refFragment(id) {
      var frag = document.createDocumentFragment();
      // id is "ref-<key>". Prefer the verbatim source-quote block inlined in the
      // reference entry (.csl-quote) -- a single source of the quote, shared with
      // the reference area (no duplicate hidden store); fall back to the whole
      // reference entry when the key has no quote.
      var ref = document.getElementById(id);
      if (!ref) { return frag; }
      var r = ref.querySelector(".csl-quote") || ref;
      var kids = r.childNodes;
      for (var i = 0; i < kids.length; i++) {
        frag.appendChild(kids[i].cloneNode(true));
      }
      return frag;
    }
    function populate(idx) {
      if (idx < 0 || idx >= refOrder.length) { return; }
      curIdx = idx;
      while (cbody.firstChild) { cbody.removeChild(cbody.firstChild); }
      cbody.appendChild(refFragment(refOrder[idx]));
      cpos.textContent = (idx + 1) + " / " + refOrder.length;
      cnav.hidden = refOrder.length < 2;
      cprev.disabled = idx === 0;
      cnext.disabled = idx === refOrder.length - 1;
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
      moved = false;             // re-anchor to the citation (drag offset cleared)
      curAnchor = anchor;
      card.hidden = false;
      populate(idx);
      place(anchor);
    }
    // Pinned (the user clicked a nav button) overrides hover-to-hide, so stepping
    // through refs never auto-closes when the card resizes under the pointer.
    function hideSoon() { if (pinned) { return; } hideTimer = setTimeout(function () { card.hidden = true; }, 200); }
    function cancelHide() { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }
    function dismiss() { card.hidden = true; pinned = false; cancelHide(); }
    function step(delta) {
      var ni = curIdx + delta;
      if (ni < 0 || ni >= refOrder.length) { return; }
      cancelHide();
      pinned = true;
      populate(ni);
      // Keep a dragged card where the user put it; otherwise re-anchor on resize.
      if (curAnchor && !moved) { place(curAnchor); }
    }
    for (var c = 0; c < cites.length; c++) {
      (function (a) {
        var h = a.getAttribute("href");
        if (!h || h.charAt(0) !== "#") { return; }
        var idx = refOrder.indexOf(h.slice(1));
        if (idx < 0) { return; }
        a.addEventListener("mouseenter", function () { show(a, idx); });
        a.addEventListener("mouseleave", hideSoon);
        a.addEventListener("focus", function () { show(a, idx); });
        a.addEventListener("blur", hideSoon);
      })(cites[c]);
    }
    card.addEventListener("mouseenter", cancelHide);
    card.addEventListener("mouseleave", hideSoon);
    // A pointer press anywhere inside the card pins it, so selecting text on touch
    // (no hover there) is not cut short by the blur/hideSoon closing the card.
    card.addEventListener("pointerdown", function () { pinned = true; cancelHide(); });
    cprev.addEventListener("click", function () { step(-1); });
    cnext.addEventListener("click", function () { step(1); });
    // Drag the card by its nav bar to reposition it (pointer); dragging pins it so
    // it does not auto-hide, and sets `moved` so stepping refs keeps the new spot.
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
    // Keyboard: Escape dismisses; Left/Right step prev/next while the card is
    // open and either pinned or the focus is on a cite anchor / inside the card
    // (so arrow keys are not hijacked from ordinary page scrolling).
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { dismiss(); return; }
      if (card.hidden) { return; }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") { return; }
      var ae = document.activeElement;
      if (!(pinned || card.contains(ae) || cites.indexOf(ae) >= 0)) { return; }
      e.preventDefault();
      step(e.key === "ArrowLeft" ? -1 : 1);
    });
    // A pinned card is dismissed by a click outside it (the nav click that pins
    // is inside the card, so it never self-dismisses).
    document.addEventListener("click", function (e) {
      if (pinned && !card.hidden && !card.contains(e.target)) { dismiss(); }
    });
  }

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
      btn.blur();
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
  // mirroring the citation hovercard above. Progressive -- the marker stays a
  // working <a href="#fnN"> with no JS (click still jumps to the note at the
  // document end); this only adds a preview. The marker id namespace is pandoc's
  // (#fnN), found by getElementById, so this is agnostic to whether pandoc wrapped
  // the notes in <section> or <aside>. TT-safe: DOM APIs + cloneNode only.
  (function () {
    var marks = [].slice.call(
      document.querySelectorAll("article.body a.footnote-ref[href^='#fn']"));
    if (!marks.length) { return; }
    function noteClone(id) {
      // A clone of the <li id="fnN"> note, minus the back-reference arrow(s)
      // (navigation chrome, noise in a preview); null if the note is missing.
      var li = document.getElementById(id);
      if (!li) { return null; }
      var clone = li.cloneNode(true);
      var backs = clone.querySelectorAll(".footnote-back");
      for (var i = 0; i < backs.length; i++) {
        if (backs[i].parentNode) { backs[i].parentNode.removeChild(backs[i]); }
      }
      // The card is a DECORATIVE preview (aria-hidden, body-appended, not in tab
      // order): a keyboard user reaches the note's real links by activating the
      // marker (href="#fnN" -> the note at document end, where the links ARE in
      // tab order). So drop href from the preview's own links -- a link that is
      // focusable but can never be tabbed to is the a11y trap; without href it is
      // inert citation text, no trap, and the live links stay one marker-activation
      // away. The marker's title= carries the note text for assistive tech.
      var links = clone.querySelectorAll("a[href]");
      for (var j = 0; j < links.length; j++) {
        links[j].removeAttribute("href");
      }
      return clone;
    }
    var card = document.createElement("div");
    card.className = "hovercard";
    // decorative preview, not a dialog: aria-hidden keeps assistive tech from
    // announcing an unreachable duplicate of the note (reached via the marker).
    card.setAttribute("aria-hidden", "true");
    card.hidden = true;
    var body = document.createElement("div");
    body.className = "hovercard-body";
    card.appendChild(body);
    document.body.appendChild(card);
    var hideTimer = null, pinned = false;
    function place(anchor) {
      var rect = anchor.getBoundingClientRect();
      var left = window.pageXOffset + rect.left;
      var maxLeft = window.pageXOffset + document.documentElement.clientWidth - card.offsetWidth - 8;
      if (left > maxLeft) { left = maxLeft; }
      if (left < window.pageXOffset + 8) { left = window.pageXOffset + 8; }
      card.style.left = left + "px";
      card.style.top = (window.pageYOffset + rect.bottom + 6) + "px";
    }
    function show(anchor, id) {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      pinned = false;
      var clone = noteClone(id);
      if (!clone) { return; }
      while (body.firstChild) { body.removeChild(body.firstChild); }
      while (clone.firstChild) { body.appendChild(clone.firstChild); }
      card.hidden = false;
      place(anchor);
    }
    function hideSoon() { if (pinned) { return; } hideTimer = setTimeout(function () { card.hidden = true; }, 200); }
    function cancelHide() { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }
    function dismiss() { card.hidden = true; pinned = false; cancelHide(); }
    for (var m = 0; m < marks.length; m++) {
      (function (a) {
        var h = a.getAttribute("href");
        if (!h || h.charAt(0) !== "#") { return; }
        var id = h.slice(1);
        var clone = noteClone(id);
        if (clone) {
          // Native tooltip as the JS-off-independent fallback (and for touch).
          a.setAttribute("title", clone.textContent.replace(/\s+/g, " ").trim());
        }
        a.addEventListener("mouseenter", function () { show(a, id); });
        a.addEventListener("mouseleave", hideSoon);
        a.addEventListener("focus", function () { show(a, id); });
        a.addEventListener("blur", hideSoon);
      })(marks[m]);
    }
    card.addEventListener("mouseenter", cancelHide);
    card.addEventListener("mouseleave", hideSoon);
    // A pointer press inside the card pins it, so selecting text on touch (no
    // hover there) is not cut short by the blur/hideSoon closing the card.
    card.addEventListener("pointerdown", function () { pinned = true; cancelHide(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { dismiss(); } });
    // A pinned card is dismissed by a click outside it.
    document.addEventListener("click", function (e) { if (pinned && !card.hidden && !card.contains(e.target)) { dismiss(); } });
  })();
})();
