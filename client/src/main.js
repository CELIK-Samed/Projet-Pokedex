const API = import.meta.env.VITE_API_URL;
let token = localStorage.getItem('token');
let allPokemons = [];
let currentEquipeId = null;

// =====================
// UTILS
// =====================
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getTypeColor(typeName) {
  const colors = {
    'feu': '#ff4422', 'eau': '#3399ff', 'plante': '#77cc55',
    'électrik': '#ffbb33', 'psy': '#ff5599', 'glace': '#77ddff',
    'dragon': '#7766ee', 'spectre': '#6666bb', 'poison': '#aa5599',
    'normal': '#bbaabb', 'roche': '#bbaa66', 'sol': '#ddbb55',
    'insecte': '#aabb22', 'acier': '#aaaabb', 'ténèbres': '#665544',
    'vol': '#6699ff', 'combat': '#bb5544'
  };
  return colors[typeName?.toLowerCase()] || '#555577';
}

function createTypeBadge(type) {
  const badge = document.createElement('span');
  badge.className = 'type-badge';
  const color = type.color ? `#${type.color}` : getTypeColor(type.name);
  badge.style.background = `${color}22`;
  badge.style.color = color;
  badge.style.border = `1px solid ${color}44`;
  badge.textContent = type.name;
  return badge;
}

// =====================
// NAVIGATION
// =====================
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  event?.target?.classList.add('active');

  if (page === 'pokemons' && allPokemons.length === 0) loadPokemons();
  if (page === 'types') loadTypes();
  if (page === 'equipes') loadEquipes();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// =====================
// AUTH
// =====================
function toggleAuth() {
  const login = document.getElementById('login-form');
  const reg = document.getElementById('register-form');
  login.style.display = login.style.display === 'none' ? 'block' : 'none';
  reg.style.display = reg.style.display === 'none' ? 'block' : 'none';
}

async function doLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion');

    token = data.token;
    localStorage.setItem('token', token);

    const me = await fetch(`${API}/auth/me`, { headers: getHeaders() });
    const user = await me.json();

    document.getElementById('username-display').textContent = `👤 ${user.username}`;
    document.getElementById('logout-btn').style.display = 'block';
    document.getElementById('main-nav').style.display = 'flex';

    showPage('pokemons');
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
    showToast('Connexion réussie !');
  } catch (e) {
    errEl.textContent = e.message;
    errEl.style.display = 'block';
  }
}

async function doRegister() {
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm').value;
  const errEl = document.getElementById('register-error');

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur inscription');

    showToast('Compte créé ! Connectez-vous.');
    toggleAuth();
  } catch (e) {
    errEl.textContent = e.message;
    errEl.style.display = 'block';
  }
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  allPokemons = [];
  document.getElementById('username-display').textContent = '';
  document.getElementById('logout-btn').style.display = 'none';
  document.getElementById('main-nav').style.display = 'none';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-auth').classList.add('active');
}

// =====================
// POKEMON
// =====================
async function loadPokemons() {
  const grid = document.getElementById('pokemon-grid');
  grid.textContent = '';
  
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Chargement';
  grid.appendChild(loading);

  try {
    const res = await fetch(`${API}/pokemons`, { headers: getHeaders() });
    allPokemons = await res.json();
    document.getElementById('pokemon-count').textContent = allPokemons.length;
    renderPokemons(allPokemons);
  } catch(e) {
    grid.textContent = '';
    const error = document.createElement('div');
    error.className = 'empty-state';
    const errorText = document.createElement('div');
    errorText.className = 'empty-state-text';
    errorText.textContent = 'Erreur de chargement';
    error.appendChild(errorText);
    grid.appendChild(error);
  }
}

function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.onclick = () => showPokemon(pokemon.id);

  // Image
  const img = document.createElement('img');
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  img.alt = pokemon.name;
  img.style.cssText = 'width:100%;height:140px;object-fit:contain;margin-bottom:0.5rem;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.5))';
  img.onerror = () => img.style.display = 'none';
  card.appendChild(img);

  // Number
  const number = document.createElement('div');
  number.className = 'pokemon-number';
  number.textContent = `#${String(pokemon.id).padStart(3,'0')}`;
  card.appendChild(number);

  // Name
  const name = document.createElement('div');
  name.className = 'pokemon-name';
  name.textContent = pokemon.name;
  card.appendChild(name);

  // Types
  const typesContainer = document.createElement('div');
  typesContainer.className = 'pokemon-types';
  (pokemon.types || []).forEach(type => {
    typesContainer.appendChild(createTypeBadge(type));
  });
  card.appendChild(typesContainer);

  // Stats mini
  const statsContainer = document.createElement('div');
  statsContainer.className = 'pokemon-stats-mini';
  
  ['hp', 'atk', 'def', 'speed'].forEach((stat, idx) => {
    const statDiv = document.createElement('div');
    statDiv.className = 'stat-mini';
    const label = ['HP', 'ATK', 'DEF', 'SPD'][idx];
    statDiv.textContent = `${label} `;
    const span = document.createElement('span');
    span.textContent = pokemon[stat];
    statDiv.appendChild(span);
    statsContainer.appendChild(statDiv);
  });
  card.appendChild(statsContainer);

  return card;
}

function renderPokemons(list) {
  const grid = document.getElementById('pokemon-grid');
  grid.textContent = '';

  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const icon = document.createElement('div');
    icon.className = 'empty-state-icon';
    icon.textContent = '🔍';
    const text = document.createElement('div');
    text.className = 'empty-state-text';
    text.textContent = 'Aucun Pokémon trouvé';
    empty.appendChild(icon);
    empty.appendChild(text);
    grid.appendChild(empty);
    return;
  }

  list.forEach(pokemon => {
    grid.appendChild(createPokemonCard(pokemon));
  });
}

function filterPokemons() {
  const q = document.getElementById('search-input').value.toLowerCase();
  renderPokemons(allPokemons.filter(p => p.name.toLowerCase().includes(q)));
}

async function showPokemon(id) {
  const modal = document.getElementById('pokemon-modal');
  const body = document.getElementById('modal-pokemon-body');
  modal.classList.add('active');
  body.textContent = '';

  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Chargement';
  body.appendChild(loading);

  const res = await fetch(`${API}/pokemons/${id}`, { headers: getHeaders() });
  const pokemon = await res.json();

  document.getElementById('modal-pokemon-number').textContent = `#${String(pokemon.id).padStart(3,'0')}`;

  body.textContent = '';

  // Image
  const img = document.createElement('img');
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  img.alt = pokemon.name;
  img.style.cssText = 'width:180px;height:180px;object-fit:contain;display:block;margin:0 auto 1rem;filter:drop-shadow(0 8px 20px rgba(0,0,0,0.6))';
  img.onerror = () => img.style.display = 'none';
  body.appendChild(img);

  // Name
  const name = document.createElement('div');
  name.className = 'pokemon-detail-name';
  name.textContent = pokemon.name;
  body.appendChild(name);

  // Types
  const typesContainer = document.createElement('div');
  typesContainer.className = 'pokemon-types';
  typesContainer.style.marginBottom = '1.5rem';
  (pokemon.types || []).forEach(type => {
    typesContainer.appendChild(createTypeBadge(type));
  });
  body.appendChild(typesContainer);

  // Stats
  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats-grid';
  
  const stats = [
    ['HP', pokemon.hp],
    ['ATK', pokemon.atk],
    ['DEF', pokemon.def],
    ['ATK SPÉ', pokemon.atk_spe],
    ['DEF SPÉ', pokemon.def_spe],
    ['VITESSE', pokemon.speed]
  ];

  stats.forEach(([label, value]) => {
    const statItem = document.createElement('div');
    statItem.className = 'stat-item';

    const statLabel = document.createElement('div');
    statLabel.className = 'stat-label';
    statLabel.textContent = label;
    statItem.appendChild(statLabel);

    const statValue = document.createElement('div');
    statValue.className = 'stat-value';
    statValue.textContent = value;
    statItem.appendChild(statValue);

    const statBar = document.createElement('div');
    statBar.className = 'stat-bar';
    const statBarFill = document.createElement('div');
    statBarFill.className = 'stat-bar-fill';
    statBarFill.style.width = `${Math.round(value/255*100)}%`;
    statBar.appendChild(statBarFill);
    statItem.appendChild(statBar);

    statsGrid.appendChild(statItem);
  });

  body.appendChild(statsGrid);
}

// =====================
// TYPES
// =====================
async function loadTypes() {
  const grid = document.getElementById('types-grid');
  grid.textContent = '';

  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Chargement';
  grid.appendChild(loading);

  const res = await fetch(`${API}/types`, { headers: getHeaders() });
  const types = await res.json();

  grid.textContent = '';

  types.forEach(type => {
    const card = document.createElement('div');
    card.className = 'type-card';
    const color = type.color ? `#${type.color}` : getTypeColor(type.name);
    card.style.background = `${color}15`;
    card.style.borderColor = `${color}44`;
    card.onclick = () => showType(type.id, type.name);

    const cardName = document.createElement('div');
    cardName.className = 'type-card-name';
    cardName.style.color = color;
    cardName.textContent = type.name;
    card.appendChild(cardName);

    grid.appendChild(card);
  });
}

async function showType(id, name) {
  const modal = document.getElementById('type-modal');
  const body = document.getElementById('modal-type-body');
  document.getElementById('modal-type-title').textContent = `TYPE — ${name.toUpperCase()}`;
  modal.classList.add('active');
  body.textContent = '';

  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Chargement';
  body.appendChild(loading);

  const res = await fetch(`${API}/types/${id}/pokemons`, { headers: getHeaders() });
  const data = await res.json();
  const pokemons = data.pokemons || [];

  body.textContent = '';

  if (pokemons.length > 0) {
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.5rem';
    
    pokemons.forEach(pokemon => {
      const tag = document.createElement('div');
      tag.className = 'equipe-pokemon-tag';
      tag.style.cursor = 'pointer';
      tag.textContent = `#${String(pokemon.id).padStart(3,'0')} ${pokemon.name}`;
      tag.onclick = () => {
        closeModal('type-modal');
        showPokemon(pokemon.id);
      };
      container.appendChild(tag);
    });
    
    body.appendChild(container);
  } else {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const text = document.createElement('div');
    text.className = 'empty-state-text';
    text.textContent = 'Aucun Pokémon';
    empty.appendChild(text);
    body.appendChild(empty);
  }
}

// =====================
// EQUIPES
// =====================
async function loadEquipes() {
  const grid = document.getElementById('equipes-grid');
  grid.textContent = '';

  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Chargement';
  grid.appendChild(loading);

  const res = await fetch(`${API}/equipes`, { headers: getHeaders() });
  const equipes = await res.json();

  grid.textContent = '';

  if (!equipes.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const icon = document.createElement('div');
    icon.className = 'empty-state-icon';
    icon.textContent = '⚔️';
    const text = document.createElement('div');
    text.className = 'empty-state-text';
    text.textContent = 'Aucune équipe';
    empty.appendChild(icon);
    empty.appendChild(text);
    grid.appendChild(empty);
    return;
  }

  equipes.forEach(equipe => {
    grid.appendChild(createEquipeCard(equipe));
  });
}

function createEquipeCard(equipe) {
  const card = document.createElement('div');
  card.className = 'equipe-card';
  card.id = `equipe-${equipe.id}`;

  // Header
  const header = document.createElement('div');
  header.className = 'equipe-header';

  const infoDiv = document.createElement('div');
  
  const name = document.createElement('div');
  name.className = 'equipe-name';
  name.textContent = equipe.name;
  infoDiv.appendChild(name);

  const desc = document.createElement('div');
  desc.className = 'equipe-desc';
  desc.textContent = equipe.description || '';
  infoDiv.appendChild(desc);

  header.appendChild(infoDiv);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = '✕';
  deleteBtn.onclick = () => deleteEquipe(equipe.id);
  header.appendChild(deleteBtn);

  card.appendChild(header);

  // Pokemons
  const pokemonsContainer = document.createElement('div');
  pokemonsContainer.className = 'equipe-pokemons';
  pokemonsContainer.id = `equipe-pokemons-${equipe.id}`;

  const pokemons = equipe.pokemons || [];
  if (pokemons.length > 0) {
    pokemons.forEach(pokemon => {
      const tag = document.createElement('div');
      tag.className = 'equipe-pokemon-tag';
      tag.textContent = pokemon.name + ' ';
      
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.onclick = () => removePokemon(equipe.id, pokemon.id);
      tag.appendChild(removeBtn);
      
      pokemonsContainer.appendChild(tag);
    });
  } else {
    const empty = document.createElement('span');
    empty.style.color = 'var(--text-dim)';
    empty.style.fontSize = '0.8rem';
    empty.textContent = 'Aucun Pokémon';
    pokemonsContainer.appendChild(empty);
  }

  card.appendChild(pokemonsContainer);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'equipe-actions';

  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-secondary';
  addBtn.style.fontSize = '0.75rem';
  addBtn.style.padding = '0.3rem 0.8rem';
  addBtn.textContent = '+ POKÉMON';
  addBtn.onclick = () => openAddPokemon(equipe.id);
  actions.appendChild(addBtn);

  card.appendChild(actions);

  return card;
}

async function createEquipe() {
  const name = document.getElementById('new-equipe-name').value.trim();
  const description = document.getElementById('new-equipe-desc').value.trim();
  if (!name) return showToast('Entrez un nom !', 'error');

  const res = await fetch(`${API}/equipes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, description })
  });
  if (res.ok) {
    document.getElementById('new-equipe-name').value = '';
    document.getElementById('new-equipe-desc').value = '';
    showToast('Équipe créée !');
    loadEquipes();
  } else {
    showToast('Erreur lors de la création', 'error');
  }
}

async function deleteEquipe(id) {
  if (!confirm('Supprimer cette équipe ?')) return;
  const res = await fetch(`${API}/equipes/${id}`, { method: 'DELETE', headers: getHeaders() });
  if (res.ok) { showToast('Équipe supprimée !'); loadEquipes(); }
  else showToast('Erreur lors de la suppression', 'error');
}

function openAddPokemon(equipeId) {
  currentEquipeId = equipeId;
  const select = document.getElementById('pokemon-select');
  select.textContent = '';
  
  allPokemons.forEach(pokemon => {
    const option = document.createElement('option');
    option.value = pokemon.id;
    option.textContent = pokemon.name;
    select.appendChild(option);
  });
  
  document.getElementById('add-pokemon-modal').classList.add('active');
}

async function confirmAddPokemon() {
  const pokemonId = document.getElementById('pokemon-select').value;
  const res = await fetch(`${API}/equipes/${currentEquipeId}/pokemons/${pokemonId}`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (res.ok) {
    closeModal('add-pokemon-modal');
    showToast('Pokémon ajouté !');
    loadEquipes();
  } else {
    showToast('Erreur lors de l\'ajout', 'error');
  }
}

async function removePokemon(equipeId, pokemonId) {
  const res = await fetch(`${API}/equipes/${equipeId}/pokemons/${pokemonId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (res.ok) { showToast('Pokémon retiré !'); loadEquipes(); }
  else showToast('Erreur', 'error');
}

// =====================
// INIT
// =====================
window.onclick = (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
};

// Si déjà connecté
if (token) {
  fetch(`${API}/auth/me`, { headers: getHeaders() })
    .then(r => r.json())
    .then(user => {
      document.getElementById('username-display').textContent = `👤 ${user.username}`;
      document.getElementById('logout-btn').style.display = 'block';
      document.getElementById('main-nav').style.display = 'flex';
      showPage('pokemons');
      document.querySelectorAll('.nav-btn')[0].classList.add('active');
    })
    .catch(() => logout());
}

// Rendre les fonctions accessibles dans l'HTML
window.showPage = showPage;
window.toggleAuth = toggleAuth;
window.doLogin = doLogin;
window.doRegister = doRegister;
window.logout = logout;
window.filterPokemons = filterPokemons;
window.createEquipe = createEquipe;
window.confirmAddPokemon = confirmAddPokemon;
window.removePokemon = removePokemon;
window.showPokemon = showPokemon;
window.showType = showType;
window.closeModal = closeModal;
window.openAddPokemon = openAddPokemon;