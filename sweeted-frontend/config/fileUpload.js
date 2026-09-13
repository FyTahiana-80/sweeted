import { File as ExpoFsFile } from 'expo-file-system';

// Upload compatible expo/fetch (WinterCG).
// - Les objets { uri, name, type } sont refuses (Unsupported FormDataPart).
// - Les objets File aussi : append() veut ecraser .name (lecture seule).
// - fetch(file://) renvoie un faux succes de 14 octets ('File not found').
// => lecture native via expo-file-system (arrayBuffer), envoi comme Blob
// type + filename en 3e argument (standard).
function shortUri(uri) {
  try {
    const s = String(uri || '');
    return s.split(':')[0] + ' (len=' + s.length + ')';
  } catch (e) {
    return 'unknown';
  }
}

function xhrToBlob(uri) {
  return new Promise(function (resolve, reject) {
    try {
      var xhr = new XMLHttpRequest();
      var timedOut = false;
      var timer = setTimeout(function () { timedOut = true; try { xhr.abort(); } catch (e2) {} reject(new Error('xhr timeout')); }, 30000);
      xhr.onload = function () { clearTimeout(timer); resolve({ response: xhr.response, status: xhr.status }); };
      xhr.onerror = function () { clearTimeout(timer); if (!timedOut) reject(new Error('xhr status=' + xhr.status)); };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    } catch (e) {
      reject(e);
    }
  });
}

function errMsg(e) {
  return (e && e.message ? e.message : String(e));
}

function logDebug(msg) {
function logDebug(msg) {}
}

export async function appendFilePart(formData, field, uri, name, mime) {
  const debug = [];
  debug.push('uri=' + shortUri(uri));
  let part = null;

  try {
    const f = new ExpoFsFile(uri);
    const buf = await f.arrayBuffer();
    if (buf && buf.byteLength >= 64) {
      part = new Blob([new Uint8Array(buf)], { type: mime });
      debug.push('expo-fs: ' + buf.byteLength + ' bytes');
    } else {
      debug.push('expo-fs: too small (' + (buf && buf.byteLength) + ')');
    }
  } catch (e) {
    debug.push('expo-fs: ' + errMsg(e));
  }

  if (!part) {
    try {
      const upController = new AbortController();
      const upTimeout = setTimeout(() => upController.abort(), 30000);
      let upResponse = null;
      try {
        upResponse = await fetch(uri, { signal: upController.signal });
      } finally {
        clearTimeout(upTimeout);
      }
      const response = upResponse;
      const b = await response.blob();
      if (b && b.size >= 64) {
        part = (b.type === mime) ? b : b.slice(0, b.size, mime);
        debug.push('fetch: ' + b.size + ' bytes');
      } else {
        debug.push('fetch: too small (' + (b && b.size) + ')');
      }
    } catch (e) {
      debug.push('fetch: ' + errMsg(e));
    }
  }

  if (!part) {
    try {
      const r = await xhrToBlob(uri);
      const b = r.response;
      if (b && b.size >= 64) {
        part = (b.type === mime) ? b : b.slice(0, b.size, mime);
        debug.push('xhr: ' + b.size + ' bytes');
      } else {
        debug.push('xhr: too small (' + (b && b.size) + ')');
      }
    } catch (e) {
      debug.push('xhr: ' + errMsg(e));
    }
  }

  if (!part) {
    const msg = debug.join(' | ');
    logDebug(msg);
    return { ok: false, debug: msg };
  }
  try {
    formData.append(field, part, name);
  } catch (e) {
    const msg = debug.join(' | ') + ' | append: ' + errMsg(e);
    logDebug(msg);
    return { ok: false, debug: msg };
  }
  const msg = debug.join(' | ');
  logDebug(msg);
  return { ok: true, debug: msg };
}

export function cleanUri(uri) {
  if (!uri) return uri;
  const noQuery = String(uri).split('?')[0];
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    if (noQuery.startsWith('/')) return 'file://' + noQuery;
  }
  return noQuery;
}

export function imageMime(filename) {
  const match = /\.(\w+)$/.exec(String(filename || ''));
  const ext = (match ? match[1] : 'jpg').toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'image/jpeg';
}