// ====== LOGIN-FUNKTIONEN ======

// Globale Login-Variable
let currentUser = null;

// Lade Accounts aus JSON
async function loadAccounts() {
    try {
        // use relative path so pages served from the `html` folder can find the JSON
        const response = await fetch('../json/accounts.json');
        const data = await response.json();
        return data.accounts;
    } catch (error) {
        console.error('Fehler beim Laden der Accounts:', error);
        return [];
    }
}

// Login-Funktion mit Umleitung
async function handleLogin(username, password) {
    const accounts = await loadAccounts();
    const user = accounts.find(acc => acc.username === username && acc.password === password);
    
    if (user) {
        currentUser = { ...user };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        // Umleitung zur Account-Seite nach erfolgreichem Login
        setTimeout(() => {
            window.location.href = '/Informatik_AG_10/html/account.html';
        }, 1000);
        return { success: true, message: 'Erfolgreich angemeldet! Leite weiter...' };
    } else {
        return { success: false, message: 'Benutzername oder Passwort falsch!' };
    }
}

// Logout-Funktion
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '/Informatik_AG_10/html/index.html';
}

// UI aktualisieren
function updateLoginUI() {
    const loginForm = document.getElementById('login-form');
    const userInfo = document.getElementById('login-user-info');
    const statusMsg = document.getElementById('login-status-msg');

    // Update login form area if present
    if (loginForm) {
        if (currentUser) {
            if (userInfo) userInfo.style.display = 'block';
            loginForm.style.display = 'none';
            if (userInfo) userInfo.innerHTML = `
                <strong>Angemeldet als:</strong>
                ${currentUser.name} (${currentUser.username})
                <br><small>Rolle: ${currentUser.role}</small>
                <button class="logout-btn" onclick="handleLogout()">Abmelden</button>
            `;
            if (statusMsg) statusMsg.style.display = 'none';
        } else {
            loginForm.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
            if (statusMsg) statusMsg.style.display = 'none';
        }
    }

    // Update dashboard/account elements if present
    const dashboardUserName = document.getElementById('dashboard-user-name');
    const dashboardUserRole = document.getElementById('dashboard-user-role');
    if (currentUser) {
        if (dashboardUserName) dashboardUserName.textContent = currentUser.name;
        if (dashboardUserRole) dashboardUserRole.textContent = 'Rolle: ' + currentUser.role;
    }

    // Profile icon on account page
    const profileIcon = document.getElementById('profile-icon');
    if (profileIcon) {
        if (currentUser && currentUser.avatar) {
            profileIcon.src = currentUser.avatar;
            profileIcon.style.display = 'inline-block';
        } else {
            profileIcon.style.display = 'none';
        }
    }

    // Header profile icon (oben rechts neben dem Login-Reiter)
    const headerIcon = document.getElementById('header-profile-icon');
    if (headerIcon) {
        if (currentUser && currentUser.avatar) {
            headerIcon.src = currentUser.avatar;
            headerIcon.style.display = 'inline-block';
            headerIcon.title = currentUser.name || 'Profil';
        } else {
            headerIcon.style.display = 'none';
        }
    }

    // Update pill text / visibility
    const headerPill = document.getElementById('header-profile-pill');
    if (headerPill) {
        if (currentUser && currentUser.name) {
            headerPill.textContent = currentUser.name;
            headerPill.style.display = 'inline-block';
        } else {
            headerPill.textContent = '';
            // keep it inline-block so CSS transitions can run, but empty content keeps it hidden
            headerPill.style.display = 'inline-block';
        }
    }

    // adjust menu spacing after updating header/profile
    if (typeof adjustMenuSpacing === 'function') {
        // slight delay to allow image sizes/DOM to settle
        setTimeout(adjustMenuSpacing, 40);
    }
}

// Prüft verfügbaren Platz in der Navbar und setzt bei Bedarf die Klasse '.compact' am Menü
function adjustMenuSpacing() {
    const navbar = document.querySelector('.navbar');
    const menu = document.querySelector('.menu');
    if (!navbar || !menu) return;

    const brand = navbar.querySelector('.brand');
    const brandWidth = brand ? brand.offsetWidth : 0;
    const rightContainer = document.getElementById('header-profile-container');
    const rightWidth = rightContainer ? rightContainer.offsetWidth : 0;

    // keep a small margin for paddings and extra UI
    const margin = 48;
    const available = navbar.clientWidth - brandWidth - rightWidth - margin;

    // If the full menu (scrollWidth) is larger than available space, switch to compact mode
    if (menu.scrollWidth > available && !menu.classList.contains('compact')) {
        menu.classList.add('compact');
    } else if (menu.scrollWidth <= available && menu.classList.contains('compact')) {
        menu.classList.remove('compact');
    }
}

// setup listeners to recalc on resize and when header content changes
window.addEventListener('resize', adjustMenuSpacing);

// observe header changes (e.g., pill expand/collapse) to readjust
const headerNode = document.querySelector('.navbar');
if (headerNode && window.MutationObserver) {
    const mo = new MutationObserver(() => adjustMenuSpacing());
    mo.observe(headerNode, { attributes: true, childList: true, subtree: true });
}

// Login-Submit Handler
function handleLoginSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    handleLogin(username, password).then(result => {
        const statusMsg = document.getElementById('login-status-msg');
        statusMsg.style.display = 'block';
        statusMsg.textContent = result.message;
        statusMsg.className = 'login-status ' + (result.success ? 'success' : 'error');

        if (!result.success) {
            document.getElementById('login-form').reset();
        }
    });
}

// Menü aus Konfiguration generieren
function generateMenuFromConfig() {
    const menuContainer = document.querySelector('.menu');
    if (!menuContainer) return;

    // Leere das alte Menü
    menuContainer.innerHTML = '';

    // Generiere das Menü aus der Konfiguration
    menuConfig.items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        
        // Menü-Link
        const link = document.createElement('a');
        link.className = 'menu-link' + (index === 0 ? ' active' : '');
        link.href = item.href;
        link.style.cursor = 'pointer';
        
        const icon = document.createElement('span');
        icon.className = 'icon';
        
        const label = document.createElement('span');
        label.textContent = item.label;
        
        link.appendChild(icon);
        link.appendChild(label);
        li.appendChild(link);

        // Spezielle Behandlung für Login
        if (item.id === 'login') {
            link.href = 'javascript:void(0)';
            link.onclick = function(e) {
                e.preventDefault();
                const dropdown = li.querySelector('.login-dropdown');
                if (dropdown) dropdown.classList.toggle('show');
            };

            const loginDropdown = document.createElement('div');
            loginDropdown.className = 'login-dropdown';
            
            loginDropdown.innerHTML = `
                <div id="login-status-msg" class="login-status" style="display: none;"></div>
                <div id="login-user-info" style="display: none;"></div>
                <form id="login-form" class="login-form" onsubmit="handleLoginSubmit(event)">
                    <input type="text" id="username" placeholder="Benutzername" required>
                    <input type="password" id="password" placeholder="Passwort" required>
                    <button type="submit">Anmelden</button>
                </form>
            `;
            
            li.appendChild(loginDropdown);
        } else if (item.submenu && item.submenu.length > 0) {
            // Submenu für andere Items
            const submenu = document.createElement('ul');
            submenu.className = 'submenu';
            
            item.submenu.forEach(subitem => {
                const subli = document.createElement('li');
                const sublink = document.createElement('a');
                sublink.href = subitem.href;
                
                const sicon = document.createElement('span');
                sicon.className = 'sicon';
                sicon.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>';
                
                const sublabel = document.createElement('span');
                sublabel.textContent = subitem.label;
                
                sublink.appendChild(sicon);
                sublink.appendChild(sublabel);
                subli.appendChild(sublink);
                submenu.appendChild(subli);
            });
            
            li.appendChild(submenu);
        }

        menuContainer.appendChild(li);
    });

    // Schließe Dropdown wenn anderswo geklickt wird
    document.addEventListener('click', function(event) {
        const loginItem = document.querySelector('.menu-item #login-form');
        if (loginItem && !event.target.closest('.menu-item')) {
            const dropdown = document.querySelector('.login-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
    });

    // Stelle sicher, dass ein Header-Profil-Container (Icon + Pill) existiert und direkt neben dem Menü steht
    (function ensureHeaderIcon() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let container = document.getElementById('header-profile-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'header-profile-container';
            container.style.display = 'inline-flex';
            container.style.alignItems = 'center';

            // Erzeuge das Icon
            const headerIcon = document.createElement('img');
            headerIcon.id = 'header-profile-icon';
            headerIcon.alt = 'Profil';
            headerIcon.style.display = 'none';
            headerIcon.width = 36;
            headerIcon.height = 36;

            // Erzeuge die Pill (Name), standardmäßig zusammengeklappt
            const pill = document.createElement('span');
            pill.id = 'header-profile-pill';
            // sichtbar im DOM, aber dank CSS standardmäßig eingeklappt (max-width: 0)
            pill.style.display = 'inline-block';

            container.appendChild(headerIcon);
            container.appendChild(pill);

            // Füge das Container-Element unmittelbar nach dem Menü ein (neben dem Login-Reiter)
            const menuContainer = document.querySelector('.menu');
            if (menuContainer && menuContainer.parentNode) {
                if (menuContainer.nextSibling) menuContainer.parentNode.insertBefore(container, menuContainer.nextSibling);
                else menuContainer.parentNode.appendChild(container);
            } else {
                navbar.appendChild(container);
            }

            // Hover: beim Überfahren wird die Pill sichtbar (CSS regelt Animation)
            container.addEventListener('mouseenter', function() {
                const p = document.getElementById('header-profile-pill');
                if (p) p.classList.add('visible');
            });
            container.addEventListener('mouseleave', function() {
                const p = document.getElementById('header-profile-pill');
                if (p) p.classList.remove('visible');
            });

            // Klick auf das Icon öffnet Account oder zeigt Login-Dropdown
            headerIcon.addEventListener('click', function() {
                if (currentUser) {
                    window.location.href = '/Informatik_AG_10/html/account.html';
                } else {
                    const loginLi = Array.from(document.querySelectorAll('.menu-item')).find(li => li.querySelector('.login-dropdown'));
                    if (loginLi) {
                        const dropdown = loginLi.querySelector('.login-dropdown');
                        if (dropdown) dropdown.classList.toggle('show');
                    }
                }
            });
        }
    })();
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        try { currentUser = JSON.parse(stored); } catch (e) { currentUser = null; }
    }
    // Falls das Menü noch nicht generiert wurde, rufe es auf
    if (typeof generateMenuFromConfig === 'function') generateMenuFromConfig();
    if (typeof updateLoginUI === 'function') updateLoginUI();
});

// ====== ENDE LOGIN-FUNKTIONEN ======
