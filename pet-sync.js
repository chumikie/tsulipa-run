(function(root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TWPetSync = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null), function() {
  'use strict';

  function normalizeNick(value) { return String(value || '').trim().toLowerCase(); }
  function copy(value) {
    if (value === undefined) return null;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
  }
  function canonical(value) {
    if (value === null || value === undefined) return 'null';
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (typeof value === 'object') {
      return '{' + Object.keys(value).sort().map(function(key) {
        return JSON.stringify(key) + ':' + canonical(value[key]);
      }).join(',') + '}';
    }
    return JSON.stringify(value);
  }
  function same(a, b) { return canonical(a) === canonical(b); }

  function create(options) {
    options = options || {};
    if (typeof options.rpc !== 'function' || typeof options.getPayload !== 'function' ||
        typeof options.getNick !== 'function' || typeof options.isEnabled !== 'function') {
      throw new Error('TWPetSync: rpc, getPayload, getNick e isEnabled são obrigatórios');
    }

    var now = options.now || Date.now;
    var setTimer = options.setTimeout || setTimeout;
    var clearTimer = options.clearTimeout || clearTimeout;
    var debounceMs = Math.max(0, Number(options.debounceMs === undefined ? 8000 : options.debounceMs));
    var retryBaseMs = Math.max(100, Number(options.retryBaseMs === undefined ? 2500 : options.retryBaseMs));
    var retryMaxMs = Math.max(retryBaseMs, Number(options.retryMaxMs === undefined ? 60000 : options.retryMaxMs));
    var debounceTimer = null, retryTimer = null, inFlight = null, flushAgain = false;

    function readStored() {
      try { return typeof options.readState === 'function' ? options.readState() : null; }
      catch (_) { return null; }
    }
    var stored = readStored() || {};
    var state = {
      pending: !!stored.pending,
      pendingMs: Math.max(0, Number(stored.pendingMs) || 0),
      confirmedMs: Math.max(0, Number(stored.confirmedMs) || 0),
      nick: normalizeNick(stored.nick),
      attempts: Math.max(0, Number(stored.attempts) || 0),
      status: stored.pending ? 'pending' : 'idle',
      lastError: stored.lastError ? String(stored.lastError) : ''
    };

    function persist() {
      try { if (typeof options.writeState === 'function') options.writeState(copy(state)); } catch (_) {}
    }
    function emit(status) {
      state.status = status;
      persist();
      try { if (typeof options.onState === 'function') options.onState(status, copy(state)); } catch (_) {}
    }
    function enabled() {
      try { return !!options.isEnabled(); } catch (_) { return false; }
    }
    function currentNick() {
      try { return normalizeNick(options.getNick()); } catch (_) { return ''; }
    }
    function currentPayload() {
      return copy(options.getPayload() || { pet: null, visual: null });
    }
    function currentVersion() {
      try { return Math.max(0, Number(typeof options.getVersion === 'function' ? options.getVersion() : 0) || 0); }
      catch (_) { return 0; }
    }
    function setVersion(ms, nick) {
      try { if (typeof options.setVersion === 'function') options.setVersion(ms, nick); } catch (_) {}
    }
    function cancelDebounce() {
      if (debounceTimer !== null) clearTimer(debounceTimer);
      debounceTimer = null;
    }
    function cancelRetry() {
      if (retryTimer !== null) clearTimer(retryTimer);
      retryTimer = null;
    }
    function scheduleFlush(delay, retry) {
      if (!enabled() || !state.pending) return;
      if (retry) {
        cancelRetry();
        retryTimer = setTimer(function() {
          retryTimer = null;
          flush();
        }, delay);
      } else {
        cancelDebounce();
        debounceTimer = setTimer(function() {
          debounceTimer = null;
          flush();
        }, delay);
      }
    }
    function markDirty() {
      if (!enabled()) return false;
      var nick = currentNick();
      if (!nick) return false;
      var ms = Math.max(Number(now()) || 0, currentVersion() + 1, state.pendingMs + 1);
      setVersion(ms, nick);
      state.pending = true;
      state.pendingMs = ms;
      state.nick = nick;
      state.attempts = 0;
      state.lastError = '';
      cancelRetry();
      emit('pending');
      scheduleFlush(debounceMs, false);
      return ms;
    }
    function markPending() {
      if (!state.pending || state.nick !== currentNick()) return markDirty();
      scheduleFlush(debounceMs, false);
      return state.pendingMs;
    }
    function hasPending(nick) {
      return !!state.pending && (!nick || state.nick === normalizeNick(nick));
    }
    function clearFromCloud(ms, nick) {
      cancelDebounce();
      cancelRetry();
      var version = Math.max(0, Number(ms) || 0);
      var owner = normalizeNick(nick || currentNick());
      if (version) setVersion(version, owner);
      state.pending = false;
      state.pendingMs = 0;
      state.confirmedMs = Math.max(state.confirmedMs, version);
      state.nick = owner;
      state.attempts = 0;
      state.lastError = '';
      emit('confirmed');
    }
    function retryAfterFailure(error) {
      state.pending = true;
      state.attempts += 1;
      state.lastError = String(error && (error.message || error.code) || error || 'network');
      emit('error');
      var delay = Math.min(retryBaseMs * Math.pow(2, Math.max(0, state.attempts - 1)), retryMaxMs);
      scheduleFlush(delay, true);
      return { ok: false, retry: true, error: state.lastError, delay: delay };
    }
    function finishConfirmed(version, payload, serverMs) {
      if (!enabled() || currentNick() !== state.nick) {
        return { ok: true, late: true, confirmed: false };
      }
      var latest = currentPayload();
      if (!same(latest, payload) && (!state.pending || state.pendingMs <= version)) {
        markDirty();
      }
      state.confirmedMs = Math.max(state.confirmedMs, Number(serverMs) || version, version);
      state.attempts = 0;
      state.lastError = '';
      if (same(currentPayload(), payload) && state.pendingMs <= version) {
        state.pending = false;
        state.pendingMs = 0;
        emit('confirmed');
        return { ok: true, confirmed: true, version: state.confirmedMs };
      }
      state.pending = true;
      emit('pending');
      return { ok: true, confirmed: false, version: state.confirmedMs, newerPending: true };
    }
    function markConflict() {
      cancelRetry();
      state.pending = true;
      state.lastError = 'conflito_versao';
      emit('error');
      return { ok: false, conflict: true, error: state.lastError };
    }

    function flush() {
      cancelDebounce();
      if (!enabled()) return Promise.resolve({ ok: false, skipped: true });
      if (!state.pending || state.nick !== currentNick()) return Promise.resolve({ ok: true, skipped: true });
      if (inFlight) {
        flushAgain = true;
        return inFlight;
      }
      cancelRetry();

      var payload, version = Math.max(state.pendingMs, currentVersion()), owner = currentNick();
      try { payload = currentPayload(); }
      catch (error) { return Promise.resolve(retryAfterFailure(error)); }
      if (!version) {
        version = Math.max(Number(now()) || 0, 1);
        state.pendingMs = version;
        setVersion(version, owner);
      }
      state.pendingMs = Math.max(state.pendingMs, version);
      state.lastError = '';
      emit('syncing');

      var task;
      task = Promise.resolve().then(function() {
        return options.rpc('salvar_nuvem', {
          p_pet: payload.pet === undefined ? null : payload.pet,
          p_visual: payload.visual === undefined ? null : payload.visual,
          p_ms: version
        });
      }).then(function(result) {
        if (result && result.ok === true) return finishConfirmed(version, payload, version);
        return Promise.resolve(options.rpc('carregar_nuvem')).then(function(cloud) {
          if (cloud && Number(cloud.ms) >= version &&
              same({ pet: cloud.pet === undefined ? null : cloud.pet, visual: cloud.visual === undefined ? null : cloud.visual }, payload)) {
            return finishConfirmed(version, payload, Number(cloud.ms));
          }
          return markConflict();
        });
      }).catch(function(error) {
        return retryAfterFailure(error);
      }).finally(function() {
        if (inFlight === task) inFlight = null;
        var again = flushAgain;
        flushAgain = false;
        if (again && state.pending && enabled()) scheduleFlush(0, false);
      });
      inFlight = task;
      return task;
    }

    return {
      markDirty: markDirty,
      markPending: markPending,
      flush: flush,
      hasPending: hasPending,
      clearFromCloud: clearFromCloud,
      cancelTimers: function() { cancelDebounce(); cancelRetry(); },
      getState: function() { return copy(state); }
    };
  }

  return { create: create, same: same };
});