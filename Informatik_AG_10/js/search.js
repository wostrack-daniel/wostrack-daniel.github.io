// ====== SEARCH FUNCTIONALITY ======

// Globale Filter-Variablen
let activeChapterFilter = 'all';
let activeFileTypeFilter = 'all';

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
