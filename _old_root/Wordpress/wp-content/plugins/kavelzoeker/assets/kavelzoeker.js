// Robuuste form-state: per-formulier modus, debounced draft save, auto rehydrate op stapwissel/visibility change en keepalive.
(function ($) {
  $(function () {
    var CFG = window.KAVELZOEKER || {};

    $('.kavelzoeker').each(function () {
      var $root  = $(this);
      var $form  = $root.find('.kz-form');
      var $steps = $root.find('.kz-step');
      var step   = 0;

      var FORM_ID   = ($root.data('form-id') || CFG.formId || 'kz-default');
      var DRAFT_KEY = 'kavelzoeker_draft_' + FORM_ID;

      // ---------- Utils ----------
      function showStep(i) {
        $steps.removeClass('active');
        $steps.eq(i).addClass('active');
        step = i;
        // rehydrate bij elke stapwissel
        rehydrateIfNeeded();
      }

      function currentMode() {
        var v = $form.find('input[name="doel"]:checked').val();
        if (v === 'bouwkavel') return 'kavel';
        if (v === 'verbouw')   return 'verbouw';
        return 'beide';
      }

      function setMode() {
        var mode = currentMode();
        $root.removeClass('kz-mode-kavel kz-mode-verbouw kz-mode-beide')
             .addClass('kz-mode-' + mode);
      }

      function serialize($f) {
        return $f.serializeArray().reduce(function (o, i) { o[i.name] = i.value; return o; }, {});
      }

      function hydrate(obj) {
        if (!obj) return;
        Object.keys(obj).forEach(function (k) {
          var $field = $form.find('[name="'+k+'"]');
          if (!$field.length) return;
          if ($field.is(':checkbox')) {
            $field.prop('checked', !!obj[k]);
          } else if ($field.is(':radio')) {
            $form.find('input[name="'+k+'"][value="'+obj[k]+'"]').prop('checked', true);
          } else {
            $field.val(obj[k]);
          }
        });
        setMode();
      }

      var saveTimer = null;
      function saveDraft() {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
          var data = serialize($form);
          try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch(e) {}
        }, 150);
      }

      function loadDraft() {
        try {
          var raw = localStorage.getItem(DRAFT_KEY);
          if (!raw) return null;
          return JSON.parse(raw);
        } catch(e){ return null; }
      }

      function clearDraft() {
        try { localStorage.removeItem(DRAFT_KEY); } catch(e){}
      }

      function rehydrateIfNeeded() {
        var draft = loadDraft();
        if (!draft) return;
        // alleen lege velden aanvullen, laat actuele invoer met rust
        Object.keys(draft).forEach(function(name){
          var $f = $form.find('[name="'+name+'"]');
          if (!$f.length) return;
          if ($f.is(':checkbox')) {
            if (!$f.is(':checked') && draft[name]) $f.prop('checked', true);
          } else if ($f.is(':radio')) {
            if (!$form.find('input[name="'+name+'"]:checked').length && draft[name]) {
              $form.find('input[name="'+name+'"][value="'+draft[name]+'"]').prop('checked', true);
            }
          } else {
            if (!$f.val() && draft[name]) $f.val(draft[name]);
          }
        });
        setMode();
      }

      function postTo(url, payload) {
        return $.ajax({ url: url, method: 'POST', data: payload, dataType: 'json' });
      }

      function setSubmitting(on) {
        $form.find('.kz-submit').prop('disabled', !!on).text(on ? 'Versturen...' : 'Profiel versturen');
      }

      function showMessage(msg, isError) {
        var $res = $form.find('.kz-result');
        if (!$res.length) { $res = $('<div class="kz-result" />').insertAfter($form.find('.kz-steps')); }
        $res.prop('hidden', false).html('<p' + (isError ? ' style="color:#b00020"' : '') + '>' + (msg || '') + '</p>');
      }

      // ---------- Stepper ----------
      $root.on('click', '.kz-next', function () {
        if (step === 0) {
          if (!$form.find('input[name="doel"]:checked').length) { alert('Kies eerst wat je zoekt.'); return; }
          setMode();
        }
        showStep(Math.min(step + 1, $steps.length - 1));
        saveDraft();
      });

      $root.on('click', '.kz-prev', function () {
        showStep(Math.max(step - 1, 0));
        saveDraft();
      });

      $root.on('change', 'input[name="doel"]', function(){
        setMode();
        saveDraft();
      });

      // Draft opslaan bij input
      $form.on('input change', 'input, select, textarea', function(){ saveDraft(); });

      // Keepalive rehydrator – als iets/een extensie waarden wist, zetten we ze terug
      setInterval(rehydrateIfNeeded, 1000);
      document.addEventListener('visibilitychange', function(){ if (!document.hidden) rehydrateIfNeeded(); });

      // ---------- Submit ----------
      $form.on('submit', function (e) {
        e.preventDefault();
        var data = serialize($form);
        data.notify = CFG.notify || '';

        if (!data.doel) { alert('Kies wat je zoekt (kavel, verbouw of beide).'); return; }
        if (!data.regio || !String(data.regio).trim()) { alert('Vul een regio of plaats in.'); return; }
        if (!data.naam || !data.email) { alert('Vul je naam en e-mail in.'); return; }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { alert('Controleer je e-mail.'); return; }
        if (!data.toestemming) { alert('Geef toestemming voor het opslaan van je gegevens.'); return; }

        setSubmitting(true);

        function done(resp) {
          var ok  = resp && (resp.success === true || resp.success === 'true');
          var emailSent = resp && resp.data && typeof resp.data.emailSent !== 'undefined' ? !!resp.data.emailSent : null;
          var base = ok ? (CFG.successMessage || 'Bedankt! We nemen snel contact met je op.')
                        : ((resp && resp.data && resp.data.message) || 'Er ging iets mis (server).');

          if (ok && emailSent === false) {
            base += ' (Mail kon niet verzonden worden. Stel SMTP in: bv. "WP Mail SMTP" of "Post SMTP".)';
          }

          showMessage(base, !ok);

          if (ok) {
            clearDraft();
            $form[0].reset();
            $root.removeClass('kz-mode-kavel kz-mode-verbouw kz-mode-beide');
            showStep(0);
          }
        }

        function fail(xhr) {
          var msg = 'Kon niet verzenden. ';
          try { var r = xhr.responseJSON; if (r && r.data && r.data.message) msg += r.data.message; } catch(e){}
          if (xhr.status === 0) msg += '(CORS/HTTPS?)';
          showMessage(msg, true);
        }

        function always() { setSubmitting(false); }

        postTo(CFG.url, data).done(done).fail(function (xhr) {
          if (xhr && xhr.status === 404 && CFG.fallbackUrl) {
            postTo(CFG.fallbackUrl, data).done(done).fail(fail).always(always);
          } else { fail(xhr); always(); }
        }).always(always);
      });

      // Diagnose
      if (CFG.pingUrl) {
        $.getJSON(CFG.pingUrl).done(function (r) {
          console.log('[Kavelzoeker] REST ping OK', r);
        });
      }

      // Init – draft herstellen en sectie-naam voor (anti)autofill
      hydrate(loadDraft());
      $form.attr('autocomplete', 'section-' + FORM_ID); // groepeert browser-autofill per formulier
      showStep(0);
    });
  });
})(jQuery);