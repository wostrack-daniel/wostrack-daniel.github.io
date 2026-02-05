// ====== SEARCH FUNCTIONALITY ======

// Globale Filter-Variablen
let activeChapterFilter = 'all';
let activeFileTypeFilter = 'all';
let selectionMode = false;
let selectedItems = new Set();

// Sammle alle durchsuchbaren Dateien/Inhalte von der Seite
function collectSearchableContent() {
    const searchData = [];
    
    // Alle Links mit Download/href sammeln
    document.querySelectorAll('a[href]').forEach(link => {
        const text = link.textContent.trim() || link.getAttribute('title') || 'Datei';
        const href = link.getAttribute('href');
        const parentSection = link.closest('details');
        
        if (href && text && !text.startsWith('http')) {
            const chapter = parentSection ? parentSection.querySelector('h2')?.textContent || 'Datei' : 'Datei';
            const chapterId = getChapterFilter(chapter);
            const fileType = getFileType(href);
            
            searchData.push({
                title: text,
                href: href,
                category: chapter,
                chapterId: chapterId,
                type: fileType,
                element: link
            });
        }
    });
    
    // Überschriften sammeln (h3)
    document.querySelectorAll('h3').forEach(heading => {
        const text = heading.textContent.trim();
        if (text) {
            const parentSection = heading.closest('details');
            const chapter = parentSection ? parentSection.querySelector('h2')?.textContent || 'Thema' : 'Thema';
            const chapterId = getChapterFilter(chapter);
            
            searchData.push({
                title: text,
                href: '#',
                category: chapter,
                chapterId: chapterId,
                type: 'section',
                element: heading
            });
        }
    });
    
    return searchData;
}

// Map Kapitel zu Filter-ID
function getChapterFilter(chapterText) {
    if (chapterText.includes('I') && !chapterText.includes('II') && !chapterText.includes('III')) {
        return 'kapitel-1';
    }
    if (chapterText.includes('II') && !chapterText.includes('III')) {
        return 'kapitel-2';
    }
    if (chapterText.includes('III')) {
        return 'kapitel-3';
    }
    return 'all';
}

// Bestimme Dateityp basierend auf href
function getFileType(href) {
    if (href.endsWith('.pdf')) return 'pdf';
    if (href.endsWith('.zip')) return 'zip';
    if (href.endsWith('.jar')) return 'jar';
    if (href.includes('http')) return 'link';
    return 'file';
}

// Prüfe ob Item mit aktiven Filtern passt
function matchesFilters(item) {
    const chapterMatch = activeChapterFilter === 'all' || item.chapterId === activeChapterFilter;
    const typeMatch = activeFileTypeFilter === 'all' || item.type === activeFileTypeFilter;
    return chapterMatch && typeMatch;
}

// Toggle selection mode: inject/remove checkboxes
function toggleSelectionMode() {
    selectionMode = !selectionMode;
    document.body.classList.toggle('selection-mode', selectionMode);
    if (selectionMode) {
        addSelectionCheckboxes();
        showSelectionBar();
    } else {
        removeSelectionCheckboxes();
        hideSelectionBar();
    }
}

function addSelectionCheckboxes() {
    // add chapter checkboxes
    document.querySelectorAll('.chapter-card').forEach(card => {
        const summary = card.querySelector('.chapter-summary');
        if (summary && !summary.querySelector('.chapter-checkbox')) {
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'chapter-checkbox';
            cb.dataset.chapter = card.dataset.chapter || '';
            cb.addEventListener('change', onChapterCheckboxChange);
            summary.insertBefore(cb, summary.firstChild);
        }
        // add file checkboxes inside chapter
        card.querySelectorAll('.file-link').forEach(a => {
            if (!a.querySelector('.select-checkbox')) {
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'select-checkbox';
                cb.dataset.href = a.getAttribute('href');
                cb.dataset.title = a.textContent.trim();
                cb.dataset.chapter = card.dataset.chapter || '';
                cb.addEventListener('change', onFileCheckboxChange);
                a.insertBefore(cb, a.firstChild);
            }
        });
    });

    // add checkboxes for current filter-view results
    document.querySelectorAll('.filter-result').forEach(a => {
        if (!a.querySelector('.select-checkbox')) {
            const cb = document.createElement('input');
            cb.type = 'checkbox'; cb.className = 'select-checkbox';
            cb.dataset.href = a.getAttribute('href');
            cb.dataset.title = a.textContent.trim();
            a.insertBefore(cb, a.firstChild);
            cb.addEventListener('change', onFileCheckboxChange);
        }
    });

    // add checkboxes for current search-results
    document.querySelectorAll('.search-result-item').forEach(a => {
        if (!a.querySelector('.select-checkbox')) {
            const cb = document.createElement('input');
            cb.type = 'checkbox'; cb.className = 'select-checkbox';
            const href = a.getAttribute('href') || a.querySelector('a')?.getAttribute('href') || '';
            cb.dataset.href = href;
            cb.dataset.title = a.querySelector('.search-result-title')?.textContent || a.textContent.trim();
            a.insertBefore(cb, a.firstChild);
            cb.addEventListener('change', onFileCheckboxChange);
        }
    });
}

function removeSelectionCheckboxes() {
    document.querySelectorAll('.select-checkbox').forEach(cb => cb.remove());
    document.querySelectorAll('.chapter-checkbox').forEach(cb => cb.remove());
    selectedItems.clear();
    updateSelectionCount();
}

function onChapterCheckboxChange(e) {
    const checked = e.target.checked;
    const chapterId = e.target.dataset.chapter;
    // toggle all select-checkboxes with matching data-chapter
    document.querySelectorAll('.select-checkbox').forEach(cb => {
        if (cb.dataset.chapter === chapterId) {
            cb.checked = checked;
            const key = cb.dataset.href || cb.dataset.title;
            if (checked) selectedItems.add(key); else selectedItems.delete(key);
        }
    });
    updateSelectionCount();
}

function onFileCheckboxChange(e) {
    const cb = e.target;
    const key = cb.dataset.href || cb.dataset.title;
    if (cb.checked) selectedItems.add(key); else selectedItems.delete(key);
    updateSelectionCount();
}

function updateSelectionCount() {
    const countEl = document.getElementById('selection-count');
    if (countEl) countEl.textContent = selectedItems.size + '';
}

function showSelectionBar() {
    let bar = document.getElementById('selection-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'selection-bar';
        bar.className = 'selection-bar';
        bar.innerHTML = '<div>Ausgewählt: <strong id="selection-count">0</strong></div>' +
            '<div class="selection-actions">' +
            '<button id="download-selected">Herunterladen</button>' +
            '<button id="export-txt" class="primary">Als TXT exportieren</button>' +
            '</div>';
        const container = document.querySelector('.search-section-inner') || document.body;
        container.parentNode.insertBefore(bar, container.nextSibling);
        document.getElementById('download-selected').addEventListener('click', downloadSelected);
        document.getElementById('export-txt').addEventListener('click', exportSelectedTXT);
    }
}

function hideSelectionBar() {
    const bar = document.getElementById('selection-bar');
    if (bar) bar.remove();
}

function downloadSelected() {
    if (selectedItems.size === 0) return alert('Keine Dateien ausgewählt.');
    // selectedItems contains keys (href or title). We'll try to download anchors matching href
    const hrefs = Array.from(selectedItems);
    hrefs.forEach(href => {
        try {
            const a = document.createElement('a');
            a.href = href;
            a.download = '';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) { console.error('Download failed', e); }
    });
}

function exportSelectedTXT() {
    if (selectedItems.size === 0) return alert('Keine Dateien ausgewählt.');
    const lines = [];
    // try to map keys back to anchors for titles
    selectedItems.forEach(key => {
        // key is href, find anchor
        const el = document.querySelector(`a[href="${key}"]`);
        const title = el ? (el.textContent.trim() || el.getAttribute('href')) : key;
        lines.push(title + ' - ' + key);
    });
    const blob = new Blob([lines.join('\n')], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'selected-files.txt'; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
}

// Suche durchführen mit Filtern
function performSearch(query) {
    if (!query || query.trim().length === 0) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }
    
    const searchData = collectSearchableContent();
    const lowerQuery = query.toLowerCase();
    
    const results = searchData.filter(item => 
        matchesFilters(item) &&
        (item.title.toLowerCase().includes(lowerQuery) || 
        item.category.toLowerCase().includes(lowerQuery) ||
        item.type.toLowerCase().includes(lowerQuery))
    ).slice(0, 10);
    
    displaySearchResults(results);
}

// Zeige Suchergebnisse an
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-item no-results">Keine Ergebnisse gefunden</div>';
        return;
    }
    
    let html = '';
    results.forEach(result => {
        const icon = getIconForType(result.type);
        html += `
            <a href="${result.href}" class="search-result-item" title="${result.title}" download>
                <span class="search-result-icon">${icon}</span>
                <div class="search-result-content">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-category">${result.category}</div>
                </div>
            </a>
        `;
    });
    
    resultsContainer.innerHTML = html;
}

// Icon basierend auf Dateityp
function getIconForType(type) {
    const icons = {
        'pdf': '📄',
        'zip': '📦',
        'jar': '🔧',
        'link': '🌐',
        'section': '📚',
        'file': '📋'
    };
    return icons[type] || '📁';
}

// Filter-Funktion
function handleFilter(event) {
    const btn = event.target;
    if (!btn.classList.contains('filter-btn')) return;
    
    const filterType = btn.parentElement.classList.contains('filter-group') ? 'chapter' : 'file-type';
    const filterValue = btn.dataset.filter;
    
    // Entferne active-Klasse von Geschwistern
    btn.parentElement.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('filter-btn-active');
    });
    
    // Setze neue Filter
    btn.classList.add('filter-btn-active');
    
    if (filterValue === 'all') {
        activeChapterFilter = 'all';
        activeFileTypeFilter = 'all';
    } else if (filterValue.startsWith('kapitel-')) {
        activeChapterFilter = filterValue;
    } else {
        activeFileTypeFilter = filterValue;
    }
    
    // Re-suche mit neuen Filtern
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value) {
        performSearch(searchInput.value);
    } else {
        // wenn kein Suchbegriff, zeige gefilterte Einträge (ohne Kapitelüberschriften)
        showFilteredEntries();
    }
}

// Zeige gefilterte Einträge in der Filter-View (Kapitel ausblenden)
function showFilteredEntries() {
    const searchData = collectSearchableContent();
    const results = searchData.filter(item => matchesFilters(item));
    renderFilterView(results);
}

function renderFilterView(items) {
    const view = document.getElementById('filter-view');
    const chapters = document.querySelector('.chapters-container');
    if (!view) return;

    if (!items || items.length === 0) {
        view.innerHTML = '<div class="filter-empty">Keine Einträge für diese Filter.</div>';
    } else {
        let html = '<div class="filter-results-list">';
        items.forEach(item => {
            const icon = getIconForType(item.type);
            html += `
                <a class="file-link filter-result" href="${item.href}" title="${item.title}" download>
                    <span class="file-icon">${icon}</span>
                    <span class="file-name">${item.title}</span>
                    <span class="file-category">${item.category}</span>
                </a>
            `;
        });
        html += '</div>';
        view.innerHTML = html;
    }

    // Sichtbarkeit: Kapitel ausblenden, Filter-View zeigen
    if (chapters) chapters.style.display = 'none';
    view.style.display = 'block';
}

// Reset alle Filter und Ansicht zurücksetzen
function resetFilters() {
    activeChapterFilter = 'all';
    activeFileTypeFilter = 'all';

    // Buttons zurücksetzen
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn-active'));
    document.querySelectorAll('.filter-group').forEach(group => {
        const allBtn = group.querySelector('[data-filter="all"]');
        if (allBtn) allBtn.classList.add('filter-btn-active');
    });

    // Ansicht zurück
    const view = document.getElementById('filter-view');
    const chapters = document.querySelector('.chapters-container');
    if (view) view.style.display = 'none';
    if (chapters) chapters.style.display = '';

    // leere Suchergebnisse
    const searchResultsContainer = document.getElementById('search-results');
    const searchInput = document.getElementById('search-input');
    if (searchResultsContainer) searchResultsContainer.innerHTML = '';
    if (searchInput) searchInput.value = '';
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (!searchInput) return;
    
    // Suche beim Eingeben
    searchInput.addEventListener('input', function(e) {
        performSearch(e.target.value);
    });
    
    // Filter-Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Filter-Reset Button
    const resetBtn = document.getElementById('filter-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetFilters();
        });
    }

    // Selection toggle
    const selToggle = document.getElementById('selection-toggle-btn');
    if (selToggle) selToggle.addEventListener('click', function(e) { e.preventDefault(); toggleSelectionMode(); });
    
    // Schließe Suchergebnisse beim Klick außerhalb
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-bar-wrapper')) {
            if (searchResultsContainer) searchResultsContainer.innerHTML = '';
            if (searchInput) searchInput.value = '';
        }
    });
    
    // Erlaubt Klick auf Suchergebnisse
    if (searchResultsContainer) {
        searchResultsContainer.addEventListener('click', function(e) {
            const link = e.target.closest('.search-result-item');
            if (link && link.href !== '#') {
                link.click();
            }
        });
    }
});

// ====== ENDE SEARCH FUNCTIONALITY ======
