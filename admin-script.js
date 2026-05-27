/**
 * TOY STORY ADMIN PANEL - UI INTERACTIVITY SCRIPT
 * Handles: Modals, Sidebar, Form Validation, Password Toggle, Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // LOGIN PAGE FUNCTIONALITY
    // ============================================
    
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const signInBtn = document.getElementById('signInBtn');
    const formMessages = document.getElementById('formMessages');
    
    // Password visibility toggle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const eyeIcon = this.querySelector('.eye-icon');
            eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }
    
    // Login form submission with backend integration
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            // Clear previous messages
            formMessages.innerHTML = '';
            
            // Validate inputs
            if (!username || !password) {
                showMessage('Please enter both username and password', 'error');
                return;
            }
            
            // Show loader
            const btnText = signInBtn.querySelector('.btn-text');
            const btnLoader = signInBtn.querySelector('.btn-loader');
            
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
            signInBtn.disabled = true;
            
            try {
                // Call login API
                const response = await fetch('api/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage(result.message, 'success');
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = result.redirect || 'admin-dashboard.html';
                    }, 1000);
                } else {
                    showMessage(result.message || 'Login failed. Please try again.', 'error');
                    // Reset button state
                    btnText.style.display = 'inline';
                    btnLoader.style.display = 'none';
                    signInBtn.disabled = false;
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('An error occurred. Please check your connection and try again.', 'error');
                // Reset button state
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
                signInBtn.disabled = false;
            }
        });
    }
    
    // Show validation messages
    function showMessage(text, type) {
        if (!formMessages) return;
        
        formMessages.innerHTML = `<p class="message-${type}">${text}</p>`;
        
        setTimeout(() => {
            formMessages.innerHTML = '';
        }, 5000);
    }
    
    // ============================================
    // DASHBOARD FUNCTIONALITY
    // ============================================
    
    // Sidebar toggle functionality
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && sidebar && !sidebar.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all items
            navLinks.forEach(l => l.closest('.nav-item').classList.remove('active'));
            
            // Add active class to clicked item
            this.closest('.nav-item').classList.add('active');
            
            // Update page title
            const sectionName = this.querySelector('.nav-text').textContent;
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = sectionName + ' Overview';
            }
            
            // On mobile, close sidebar after navigation
            if (window.innerWidth <= 1024 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Modal functionality
    const addMovieBtn = document.getElementById('addMovieBtn');
    const addCharacterBtn = document.getElementById('addCharacterBtn');
    const addMovieModal = document.getElementById('addMovieModal');
    const addCharacterModal = document.getElementById('addCharacterModal');
    const closeMovieModal = document.getElementById('closeMovieModal');
    const closeCharacterModal = document.getElementById('closeCharacterModal');
    const cancelMovieBtn = document.getElementById('cancelMovieBtn');
    const cancelCharacterBtn = document.getElementById('cancelCharacterBtn');
    
    // Open modals
    if (addMovieBtn && addMovieModal) {
        addMovieBtn.addEventListener('click', function() {
            openModal(addMovieModal);
        });
    }
    
    if (addCharacterBtn && addCharacterModal) {
        addCharacterBtn.addEventListener('click', function() {
            openModal(addCharacterModal);
        });
    }
    
    // Close modals
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    if (closeMovieModal) {
        closeMovieModal.addEventListener('click', () => closeModal(addMovieModal));
    }
    
    if (closeCharacterModal) {
        closeCharacterModal.addEventListener('click', () => closeModal(addCharacterModal));
    }
    
    if (cancelMovieBtn) {
        cancelMovieBtn.addEventListener('click', () => closeModal(addMovieModal));
    }
    
    if (cancelCharacterBtn) {
        cancelCharacterBtn.addEventListener('click', () => closeModal(addCharacterModal));
    }
    
    // Close modal on overlay click
    [addMovieModal, addCharacterModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (addMovieModal && addMovieModal.classList.contains('active')) {
                closeModal(addMovieModal);
            }
            if (addCharacterModal && addCharacterModal.classList.contains('active')) {
                closeModal(addCharacterModal);
            }
        }
    });
    
    // Form submissions with backend integration
    const addMovieForm = document.getElementById('addMovieForm');
    const addCharacterForm = document.getElementById('addCharacterForm');
    
    if (addMovieForm) {
        addMovieForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const movieData = Object.fromEntries(formData.entries());
            
            // Convert numeric fields
            movieData.release_year = parseInt(movieData.release_year) || 0;
            movieData.runtime_minutes = parseInt(movieData.runtime_minutes) || 0;
            
            try {
                const response = await fetch('api/save-movie.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(movieData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Movie saved successfully!');
                    closeModal(addMovieModal);
                    this.reset();
                    // Reload the movies table
                    loadMovies();
                } else {
                    alert(result.message || 'Failed to save movie');
                }
            } catch (error) {
                console.error('Save movie error:', error);
                alert('An error occurred while saving the movie');
            }
        });
    }
    
    if (addCharacterForm) {
        addCharacterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const characterData = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('api/save-character.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(characterData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Character saved successfully!');
                    closeModal(addCharacterModal);
                    this.reset();
                    // Reload the characters table
                    loadCharacters();
                } else {
                    alert(result.message || 'Failed to save character');
                }
            } catch (error) {
                console.error('Save character error:', error);
                alert('An error occurred while saving the character');
            }
        });
    }
    
    // Filter/Search functionality with debounce
    const movieFilter = document.getElementById('movieFilter');
    const characterFilter = document.getElementById('characterFilter');
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    if (movieFilter) {
        movieFilter.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterTable('moviesTableBody', searchTerm);
        }, 300));
    }
    
    if (characterFilter) {
        characterFilter.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterTable('charactersTableBody', searchTerm);
        }, 300));
    }
    
    function filterTable(tableBodyId, searchTerm) {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return;
        
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
        
        // Check for empty state
        const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
        const emptyState = document.getElementById(tableBodyId.replace('TableBody', 'EmptyState'));
        
        if (emptyState) {
            emptyState.style.display = visibleRows.length === 0 ? 'block' : 'none';
        }
    }
    
    // Sort functionality
    const movieSort = document.getElementById('movieSort');
    const characterSort = document.getElementById('characterSort');
    
    if (movieSort) {
        movieSort.addEventListener('change', function() {
            sortTable('moviesTableBody', this.value);
        });
    }
    
    if (characterSort) {
        characterSort.addEventListener('change', function() {
            sortTable('charactersTableBody', this.value);
        });
    }
    
    function sortTable(tableBodyId, sortBy) {
        const tableBody = document.getElementById(tableBodyId);
        if (!tableBody) return;
        
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            let aValue, bValue;
            
            switch(sortBy) {
                case 'title':
                case 'name':
                    aValue = a.cells[1].textContent.toLowerCase();
                    bValue = b.cells[1].textContent.toLowerCase();
                    break;
                case 'year':
                    aValue = parseInt(a.cells[2].textContent);
                    bValue = parseInt(b.cells[2].textContent);
                    break;
                case 'rating':
                    aValue = parseFloat(a.cells[3].textContent.replace(/[^\d.]/g, ''));
                    bValue = parseFloat(b.cells[3].textContent.replace(/[^\d.]/g, ''));
                    break;
                case 'role':
                    aValue = a.cells[2].textContent.toLowerCase();
                    bValue = b.cells[2].textContent.toLowerCase();
                    break;
                default:
                    return 0;
            }
            
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        });
        
        // Re-append sorted rows
        rows.forEach(row => tableBody.appendChild(row));
    }
    
    // Edit/Delete action handlers with backend integration
    document.addEventListener('click', async function(e) {
        if (e.target.closest('.btn-edit')) {
            const btn = e.target.closest('.btn-edit');
            const row = btn.closest('tr');
            const id = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            const tableType = row.closest('table').id.includes('movies') ? 'movie' : 'character';
            
            console.log('Edit item:', id, name, tableType);
            alert(`Edit functionality for: ${name} (ID: ${id})\n\nImplement edit modal with pre-populated data.`);
            // TODO: Fetch item data and open edit modal
            // fetch(`api/get-${tableType}s.php?id=${id}`)...
        }
        
        if (e.target.closest('.btn-delete')) {
            const btn = e.target.closest('.btn-delete');
            const row = btn.closest('tr');
            const id = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            const tableType = row.closest('table').id.includes('movies') ? 'movie' : 'character';
            
            if (confirm(`Are you sure you want to delete "${name}"?`)) {
                try {
                    const response = await fetch(`api/delete-${tableType}.php`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: parseInt(id) })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        row.remove();
                        alert(`${tableType === 'movie' ? 'Movie' : 'Character'} deleted successfully!`);
                        // Reload stats
                        loadStats();
                    } else {
                        alert(result.message || 'Failed to delete item');
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    alert('An error occurred while deleting the item');
                }
            }
        }
    });
    
    // Stats counter animation
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // Trigger counter animation on load
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(stat => {
        animateCounter(stat);
    });
    
    // Set last updated timestamp
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastUpdatedEl.textContent = timeString;
    }
    
    // Global search with debounce
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', debounce(function(e) {
            const query = e.target.value;
            console.log('Global search:', query);
            // Implement global search across all sections
        }, 500));
    }
    
    // Notification bell handler
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('Notifications panel (Implement dropdown with actual notifications)');
        });
    }
    
    // Profile dropdown handler
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            alert('Profile menu (Implement dropdown with user options)');
        });
    }
    
    // Scroll reveal animation for content sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe content sections
    document.querySelectorAll('.content-section, .stat-card').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);

    // ============================================
    // DATA LOADING FUNCTIONS FOR DASHBOARD
    // ============================================

    // Load dashboard stats
    async function loadStats() {
        try {
            const response = await fetch('api/get-stats.php');
            const result = await response.json();
            
            if (result.success) {
                const stats = result.data;
                
                // Update stat cards
                const movieStat = document.querySelector('[data-stat="movies"] .stat-number');
                const charStat = document.querySelector('[data-stat="characters"] .stat-number');
                const sessionsStat = document.querySelector('[data-stat="sessions"] .stat-number');
                const lastUpdatedEl = document.getElementById('lastUpdated');
                
                if (movieStat) movieStat.textContent = stats.total_movies;
                if (charStat) charStat.textContent = stats.total_characters;
                if (sessionsStat) sessionsStat.textContent = stats.active_sessions;
                if (lastUpdatedEl && stats.last_updated) {
                    const date = new Date(stats.last_updated);
                    lastUpdatedEl.textContent = date.toLocaleString();
                }
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    // Load movies table
    async function loadMovies() {
        try {
            const response = await fetch('api/get-movies.php');
            const result = await response.json();
            
            if (result.success) {
                const tableBody = document.getElementById('moviesTableBody');
                const emptyState = document.getElementById('moviesEmptyState');
                
                if (!tableBody) return;
                
                tableBody.innerHTML = '';
                
                if (result.data.length === 0) {
                    if (emptyState) emptyState.style.display = 'block';
                } else {
                    if (emptyState) emptyState.style.display = 'none';
                    
                    result.data.forEach(movie => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${movie.id}</td>
                            <td>${movie.title}</td>
                            <td>${movie.release_year}</td>
                            <td>${movie.rating || 'N/A'}</td>
                            <td><img src="${movie.poster_url || ''}" alt="${movie.title}" class="poster-preview"></td>
                            <td>
                                <button class="btn btn-sm btn-edit" data-id="${movie.id}">✏️ Edit</button>
                                <button class="btn btn-sm btn-delete" data-id="${movie.id}">🗑️ Delete</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading movies:', error);
        }
    }

    // Load characters table
    async function loadCharacters() {
        try {
            const response = await fetch('api/get-characters.php');
            const result = await response.json();
            
            if (result.success) {
                const tableBody = document.getElementById('charactersTableBody');
                const emptyState = document.getElementById('charactersEmptyState');
                
                if (!tableBody) return;
                
                tableBody.innerHTML = '';
                
                if (result.data.length === 0) {
                    if (emptyState) emptyState.style.display = 'block';
                } else {
                    if (emptyState) emptyState.style.display = 'none';
                    
                    result.data.forEach(character => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${character.id}</td>
                            <td>
                                <div class="character-cell">
                                    <img src="${character.avatar_url || ''}" alt="${character.name}" class="avatar-preview">
                                    <span>${character.name}</span>
                                </div>
                            </td>
                            <td>${character.role_title || 'N/A'}</td>
                            <td class="quote-preview">"${(character.quote || '').substring(0, 50)}..."</td>
                            <td>
                                <button class="btn btn-sm btn-edit" data-id="${character.id}">✏️ Edit</button>
                                <button class="btn btn-sm btn-delete" data-id="${character.id}">🗑️ Delete</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading characters:', error);
        }
    }

    // Load initial data on dashboard page
    if (document.getElementById('moviesTableBody')) {
        loadStats();
        loadMovies();
        loadCharacters();
    }

});
