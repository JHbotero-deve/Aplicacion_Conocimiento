/* Cola offline cifrada para operaciones de campo.
 * La clave vive solo durante la sesión y se deriva de la contraseña ingresada.
 */
(function () {
  const DB_NAME = 'ganaderia-pro-offline';
  const STORE = 'outbox';
  const META = 'meta';
  let key;

  const openDb = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: 'id' });
      request.result.createObjectStore(META, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  async function getMeta(name) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const request = db.transaction(META, 'readonly').objectStore(META).get(name);
      request.onsuccess = () => resolve(request.result && request.result.value);
      request.onerror = () => reject(request.error);
    });
  }

  async function setMeta(name, value) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const request = db.transaction(META, 'readwrite').objectStore(META).put({ key: name, value });
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  async function deriveKey(username, password) {
    let salt = await getMeta(`salt:${username}`);
    if (!salt) {
      salt = Array.from(crypto.getRandomValues(new Uint8Array(16)));
      await setMeta(`salt:${username}`, salt);
    }
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: new Uint8Array(salt), iterations: 210000, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encrypt(data) {
    if (!key) throw new Error('Sesión offline bloqueada. Inicia sesión de nuevo.');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(data)));
    return { iv: Array.from(iv), payload: Array.from(new Uint8Array(encrypted)) };
  }

  async function decrypt(record) {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(record.iv) }, key, new Uint8Array(record.payload));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  async function put(record) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(record);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  async function all() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => a.createdAt - b.createdAt));
      request.onerror = () => reject(request.error);
    });
  }

  async function remove(id) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  }

  function operationId() { return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`; }
  function updateBadge(count) {
    const badge = document.getElementById('offlineStatus');
    if (badge) badge.textContent = count ? `${count} registro${count === 1 ? '' : 's'} pendiente${count === 1 ? '' : 's'}` : 'Todo sincronizado';
  }

  async function refreshStatus() { const count = (await all()).length; updateBadge(count); return count; }

  async function enqueue(path, body) {
    const id = operationId();
    const secured = await encrypt({ path, body });
    await put({ id, createdAt: Date.now(), ...secured });
    await refreshStatus();
    return id;
  }

  async function send(path, body, id) {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}`, 'X-Operation-Id': id },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'El servidor rechazó el registro.');
  }

  async function submit(path, body) {
    const id = operationId();
    if (!navigator.onLine) { await enqueue(path, body); return { queued: true }; }
    try { await send(path, body, id); return { queued: false }; }
    catch (error) {
      if (error instanceof TypeError) { await enqueue(path, body); return { queued: true }; }
      throw error;
    }
  }

  async function sync() {
    if (!navigator.onLine || !key || !localStorage.getItem('token')) return;
    for (const record of await all()) {
      try { const operation = await decrypt(record); await send(operation.path, operation.body, record.id); await remove(record.id); }
      catch (error) { break; }
    }
    await refreshStatus();
  }

  window.offlineSync = { initialize: deriveKey, submit, sync, refreshStatus, getAllRecords: all };
  window.addEventListener('online', sync);
  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', '<div id="offlineStatus" role="status" class="fixed bottom-4 right-4 z-50 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold text-emerald-800 shadow-lg">Comprobando sincronización…</div>');
    refreshStatus().catch(() => updateBadge(0));
    sync();
  });
})();
