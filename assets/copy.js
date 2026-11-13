(function () {
  var btn = document.getElementById("copy-caption");
  var src = document.getElementById("caption-source");
  var live = document.getElementById("copy-status");
  if (!btn || !src) return;

  var idleLabel = btn.getAttribute("data-idle") || "コピー";
  var doneLabel = btn.getAttribute("data-done") || "コピーしました";
  var timer = null;

  function setLabel(text) {
    var el = btn.querySelector(".copy-label");
    if (el) el.textContent = text;
    else btn.textContent = text;
  }

  function copied() {
    setLabel(doneLabel);
    btn.setAttribute("aria-label", doneLabel);
    if (live) live.textContent = doneLabel;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      setLabel(idleLabel);
      btn.setAttribute("aria-label", idleLabel);
      if (live) live.textContent = "";
    }, 2000);
  }

  function copyFallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  btn.addEventListener("click", function () {
    var text = src.value;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(copied).catch(function () {
        if (copyFallback(text)) copied();
      });
    } else if (copyFallback(text)) {
      copied();
    }
  });
})();
