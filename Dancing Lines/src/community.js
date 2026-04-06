// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE SETUP INSTRUCTIONS
// ─────────────────────────────────────────────────────────────────────────────
//
// To enable community path sharing:
//
// 1. Go to https://supabase.com and create a free project
// 2. In the dashboard, go to SQL Editor and run this query:
//
//    CREATE TABLE community_paths (
//      id BIGSERIAL PRIMARY KEY,
//      name TEXT NOT NULL,
//      geometry JSONB NOT NULL,
//      user_name TEXT,
//      created_at BIGINT NOT NULL,
//      created_at_readable TEXT,
//      score INTEGER DEFAULT 0
//    );
//
//    CREATE INDEX idx_community_paths_created_at ON community_paths(created_at DESC);
//    CREATE OR REPLACE FUNCTION check_community_paths_limit()
//    RETURNS TRIGGER AS $$
//    BEGIN
//      IF (SELECT COUNT(*) FROM community_paths) >= 1000 THEN
//        RAISE EXCEPTION 'Community paths limit reached (1000 paths max)';
//      END IF;
//      RETURN NEW;
//    END;
//    $$ LANGUAGE plpgsql;
//
//    DROP TRIGGER IF EXISTS community_paths_limit_trigger ON community_paths;
//    CREATE TRIGGER community_paths_limit_trigger
//    BEFORE INSERT ON community_paths
//    FOR EACH ROW
//    EXECUTE FUNCTION check_community_paths_limit();
//
// 3. In Supabase, go to Settings → API and copy:
//    - Project URL
//    - anon public key
//
// 4. Replace the SUPABASE_URL and SUPABASE_KEY below
//
// 5. In Supabase, go to Authentication → Policies and set:
//    - Allow INSERT for anon (anonymous users)
//    - Allow SELECT for anon (so anyone can browse)
//
// If Supabase is not configured, the community features will be disabled
// and the app will continue to work normally with local import/export.
//
// ─────────────────────────────────────────────────────────────────────────────

// Supabase configuration (replace with your own project credentials)
const SUPABASE_URL = 'https://vwmnwviqlpouorviijiz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h9T6ngkRX1NI9qolKKLQng_ubQqWxll';

let communityPaths = [];
let selectedPathIdx = -1;
let supabaseAvailable = false; // Flag to track if Supabase is accessible

// Check if user disabled the replace warning
function shouldWarnBeforeLoad() {
    const stored = localStorage.getItem('skip_replace_warning');
    return stored !== 'true';
}

// Set the skip warning preference
function setSkipReplaceWarning(skip) {
    localStorage.setItem('skip_replace_warning', skip ? 'true' : 'false');
}

// Rate limiting constants (in milliseconds)
const UPLOAD_COOLDOWN = 60 * 1000;  // 1 minute
const UPVOTE_COOLDOWN = 10 * 1000;  // 10 seconds

// Get last upload time from localStorage
function getLastUploadTime() {
    const stored = localStorage.getItem('last_path_upload');
    return stored ? parseInt(stored) : 0;
}

// Set last upload time in localStorage
function setLastUploadTime() {
    localStorage.setItem('last_path_upload', Date.now().toString());
}

// Get last upvote time for a specific path ID
function getLastUpvoteTime(pathId) {
    const stored = localStorage.getItem(`last_upvote_${pathId}`);
    return stored ? parseInt(stored) : 0;
}

// Set last upvote time for a specific path ID
function setLastUpvoteTime(pathId) {
    localStorage.setItem(`last_upvote_${pathId}`, Date.now().toString());
}

// Check if user can upload (respects cooldown)
function canUpload() {
    const lastUpload = getLastUploadTime();
    const timeSinceLastUpload = Date.now() - lastUpload;
    return timeSinceLastUpload >= UPLOAD_COOLDOWN;
}

// Check if user can upvote a specific path
function canUpvote(pathId) {
    const lastUpvote = getLastUpvoteTime(pathId);
    const timeSinceLastUpvote = Date.now() - lastUpvote;
    return timeSinceLastUpvote >= UPVOTE_COOLDOWN;
}

// Get seconds until next upload is allowed
function getUploadCooldownRemaining() {
    const lastUpload = getLastUploadTime();
    const timeSinceLastUpload = Date.now() - lastUpload;
    if (timeSinceLastUpload >= UPLOAD_COOLDOWN) return 0;
    return Math.ceil((UPLOAD_COOLDOWN - timeSinceLastUpload) / 1000);
}

// Get seconds until next upvote is allowed for a path
function getUpvoteCooldownRemaining(pathId) {
    const lastUpvote = getLastUpvoteTime(pathId);
    const timeSinceLastUpvote = Date.now() - lastUpvote;
    if (timeSinceLastUpvote >= UPVOTE_COOLDOWN) return 0;
    return Math.ceil((UPVOTE_COOLDOWN - timeSinceLastUpvote) / 1000);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommunityPaths);
} else {
    loadCommunityPaths();
}

async function loadCommunityPaths() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/community_paths?order=score.desc,created_at.desc`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            console.warn('Supabase unavailable:', response.statusText);
            supabaseAvailable = false;
            disableCommunityFeatures();
            return;
        }

        communityPaths = await response.json();
        selectedPathIdx = -1;
        updatePathsList();
        supabaseAvailable = true;
    } catch (e) {
        console.warn('Supabase not available:', e.message);
        supabaseAvailable = false;
        disableCommunityFeatures();
    }
}

function disableCommunityFeatures() {
    // Disable the Community button and show that Supabase isn't configured
    const communityBtn = document.getElementById('header-community-btn');
    if (communityBtn) {
        communityBtn.disabled = true;
        communityBtn.style.opacity = '0.5';
        communityBtn.title = 'Community features not configured';
    }

    // Update the community list to show a message
    const list = document.getElementById('community-paths-list');
    if (list) {
        list.innerHTML = `
            <div style="padding: 1rem; color: var(--muted); font-size: 0.9rem;">
                <p style="margin-bottom: 0.5rem;"><strong>Community features not available</strong></p>
                <p style="font-size: 0.85rem; margin: 0;">Supabase is not configured. You can still use local Import/Export.</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem;">See the code comments in src/community.js for setup instructions.</p>
            </div>
        `;
    }
}

function updatePathsList() {
    const list = document.getElementById('community-paths-list');
    if (!list) return;

    if (communityPaths.length === 0) {
        list.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--muted);">No shared paths yet</div>';
        return;
    }

    list.innerHTML = communityPaths.map((path, idx) => {
        const userName = path.user_name ? ` by ${path.user_name}` : '';
        const date = new Date(path.created_at * 1000).toLocaleDateString();
        const score = path.score || 0;
        const label = `${path.name || 'Untitled'}${userName}`;
        const isSelected = idx === selectedPathIdx ? 'border-left: 3px solid var(--accent);' : '';
        return `
            <div onclick="selectPath(${idx})" style="padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border); cursor: pointer; ${isSelected} background: ${idx === selectedPathIdx ? 'var(--panel)' : 'transparent'}; transition: background 0.2s; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
                <div style="font-weight: 500; color: var(--text); flex: 1;">${label}</div>
                <div style="color: var(--muted); flex-shrink: 0; margin-left: 0.5rem; white-space: nowrap;">${score} ⭐ · ${date}</div>
            </div>
        `;
    }).join('');
}

async function saveToCommunity() {
    if (!supabaseAvailable) {
        alert('Community features are not available. Check your Supabase configuration.');
        return;
    }

    if (!currentGeometry) {
        alert('Start an animation first (click Restart)');
        return;
    }

    // Check upload cooldown
    if (!canUpload()) {
        const secondsLeft = getUploadCooldownRemaining();
        alert(`Please wait ${secondsLeft} seconds before uploading another path`);
        return;
    }

    const pathName = document.getElementById('path-name-input').value.trim() || 'Untitled';
    const userName = document.getElementById('user-name-input').value.trim() || null;
    const timestamp = Math.floor(Date.now() / 1000);

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/community_paths`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name: pathName,
                    geometry: currentGeometry,
                    user_name: userName,
                    created_at: timestamp,
                    created_at_readable: new Date(timestamp * 1000).toISOString(),
                    score: 0
                })
            }
        );

        if (!response.ok) {
            const error = await response.text();
            alert('Error saving: ' + error);
            return;
        }

        alert('Path saved to community!');
        document.getElementById('path-name-input').value = '';
        document.getElementById('user-name-input').value = '';
        setLastUploadTime();
        await loadCommunityPaths();
    } catch (e) {
        alert('Exception: ' + e.message);
    }
}

function selectPath(idx) {
    selectedPathIdx = idx;
    updatePathsList();

    // Enable Upvote button
    const upvoteBtn = document.getElementById('upvote-community-btn');
    if (upvoteBtn) {
        upvoteBtn.style.opacity = '1';
        upvoteBtn.style.pointerEvents = 'auto';
    }

    const path = communityPaths[idx];

    // Skip warning if user disabled it
    if (!shouldWarnBeforeLoad()) {
        loadPath(path);
        return;
    }

    // Show custom confirmation dialog
    showLoadConfirmation(path);
}

function showLoadConfirmation(path) {
    const userName = path.user_name ? ` by ${path.user_name}` : '';
    const modalHTML = `
        <div id="load-confirmation-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 1.5rem; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                <h3 style="margin: 0 0 0.5rem 0; color: var(--text);">Load "${path.name || 'Untitled'}"${userName}?</h3>
                <p style="color: var(--muted); margin: 0.5rem 0 1.5rem 0; font-size: 0.9rem;">This will replace your current path.</p>
                <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
                    <input type="checkbox" id="skip-warn-checkbox" checked style="margin-right: 0.5rem;">
                    <label for="skip-warn-checkbox" style="color: var(--muted); font-size: 0.85rem; cursor: pointer;">Don't warn again</label>
                </div>
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button onclick="closeLoadConfirmation()" style="padding: 0.5rem 1rem; background: var(--border); border: none; border-radius: 4px; color: var(--text); cursor: pointer;">Cancel</button>
                    <button onclick="confirmLoadPath()" style="padding: 0.5rem 1rem; background: var(--accent); border: none; border-radius: 4px; color: #fff; cursor: pointer; font-weight: 500;">Load</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeLoadConfirmation() {
    const modal = document.getElementById('load-confirmation-modal');
    if (modal) modal.remove();
}

function confirmLoadPath() {
    const checkbox = document.getElementById('skip-warn-checkbox');
    if (checkbox && checkbox.checked) {
        setSkipReplaceWarning(true);
    }

    const path = communityPaths[selectedPathIdx];
    closeLoadConfirmation();
    loadPath(path);
}

function loadPath(path) {
    if (path.geometry) {
        // Populate the textarea and load
        document.getElementById('geometry-json').value = formatGeometryJson(path.geometry);
        loadGeometry();
    }
}

async function upvoteSelected() {
    if (!supabaseAvailable) {
        alert('Community features are not available. Check your Supabase configuration.');
        return;
    }

    if (selectedPathIdx < 0 || selectedPathIdx >= communityPaths.length) {
        alert('Select a path first');
        return;
    }

    const path = communityPaths[selectedPathIdx];

    // Check upvote cooldown for this specific path
    if (!canUpvote(path.id)) {
        const secondsLeft = getUpvoteCooldownRemaining(path.id);
        alert(`Please wait ${secondsLeft} seconds before upvoting this path again`);
        return;
    }

    const newScore = (path.score || 0) + 1;

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/community_paths?id=eq.${path.id}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ score: newScore })
            }
        );

        if (!response.ok) {
            alert('Error upvoting: ' + response.statusText);
            return;
        }

        alert('Upvoted!');
        setLastUpvoteTime(path.id);
        await loadCommunityPaths();
    } catch (e) {
        alert('Exception: ' + e.message);
    }
}
