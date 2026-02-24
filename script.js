import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '2mcrd1vx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-02-22',
});

// --- AI / NPC DATA ---
const npcComments = [
    "The frequency is shifting.", "Pure Finnergy.", "The archive grows stronger.", 
    "Masterful lens.", "Truly limitless.", "Geometric perfection.", "99% Sync achieved.", 
    "A moment in the void.", "Kinetically charged.", "Observation logged."
];

let userKineticId = "KINETIC_" + Math.floor(100 + Math.random() * 899);
document.getElementById('userStatus').innerText = "ID: " + userKineticId;

// --- INITIALIZE GRID ---
async function fetchArchive() {
    const grid = document.getElementById('archive-grid');
    try {
        const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc)`);
        grid.innerHTML = '';
        posts.forEach(post => {
            const ref = post.image.asset._ref;
            const [_file, id, dimensions, extension] = ref.split('-');
            const imageUrl = `https://cdn.sanity.io/images/2mcrd1vx/production/${id}-${dimensions}.${extension}`;
            
            const card = document.createElement('div');
            card.className = "glass-card rounded-[2.5rem] p-3 cursor-pointer overflow-hidden aspect-[3/4]";
            card.innerHTML = `<img src="${imageUrl}" class="rounded-[2rem] w-full h-full object-cover shadow-sm transition-transform hover:scale-105 duration-700">`;
            card.onclick = () => openModal(imageUrl, post.location, post.syncScore || '94');
            grid.appendChild(card);
        });
    } catch (e) { console.error(e); }
}

// --- INTERACTIVE FEATURES ---
window.triggerHeart = function() {
    const container = document.getElementById('heartContainer');
    const bigHeart = document.getElementById('bigHeart');
    
    // Big Flash Heart
    bigHeart.style.opacity = '1'; bigHeart.style.transform = 'scale(1.1)';
    setTimeout(() => { bigHeart.style.opacity = '0'; bigHeart.style.transform = 'scale(0.5)'; }, 600);

    // Floating Hearts
    for(let i=0; i<6; i++) {
        setTimeout(() => {
            const h = document.createElement('div');
            h.innerHTML = '🤍'; h.className = 'live-heart';
            h.style.left = Math.random() * 80 + 10 + '%';
            h.style.bottom = '0px';
            h.style.fontSize = (Math.random() * 15 + 15) + 'px';
            container.appendChild(h);
            setTimeout(() => h.remove(), 3000);
        }, i * 100);
    }
    
    // Increment Likes
    let likes = document.getElementById('modalLikes');
    let current = parseFloat(likes.innerText);
    likes.innerText = (current + 0.1).toFixed(1) + 'k';
};

function openModal(img, loc, sync) {
    document.getElementById('modalImg').src = img;
    document.getElementById('modalStatus').innerText = "LOCATION: " + (loc || "UNKNOWN");
    document.getElementById('vibeScore').innerText = sync + "%";
    document.getElementById('vibeBar').style.width = sync + "%";
    document.getElementById('postModal').style.display = 'flex';
    
    // Clear and start NPCs
    startNPCs();
}

// AI Comment Engine
function startNPCs() {
    const list = document.getElementById('comment-list');
    list.innerHTML = '';
    // Pre-fill with 5 comments
    for(let i=0; i<5; i++) addComment(npcComments[i], "KINETIC_" + Math.floor(100 + Math.random() * 900));
}

function addComment(text, id, isUser = false) {
    const list = document.getElementById('comment-list');
    const item = document.createElement('div');
    item.className = 'comment-item';
    if(isUser) item.style.borderLeftColor = "#2563eb";
    item.innerHTML = `<span class="id-label">${id}</span><span class="quote-text">"${text}"</span>`;
    list.prepend(item);
    
    // If list gets too long, remove old ones
    if(list.children.length > 10) list.removeChild(list.lastChild);
}

// User Comment Submit
document.getElementById('submitComment').onclick = () => {
    const input = document.getElementById('commentInput');
    if(input.value.trim()) {
        addComment(input.value, userKineticId, true);
        input.value = '';
    }
};

// Auto-NPC Bot (Simulated Engagement)
setInterval(() => {
    if(document.getElementById('postModal').style.display === 'flex') {
        if(Math.random() > 0.7) { // 30% chance every 4 seconds to see a bot act
            addComment(npcComments[Math.floor(Math.random()*npcComments.length)], "KINETIC_" + Math.floor(100+Math.random()*900));
            if(Math.random() > 0.5) window.triggerHeart();
        }
    }
}, 4000);

window.closeModal = () => { document.getElementById('postModal').style.display = 'none'; };
document.getElementById('closeModalBtn').onclick = closeModal;

fetchArchive();