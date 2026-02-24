import { createClient } from '@sanity/client';

// 1. SYSTEM INITIALIZATION
const client = createClient({
  projectId: '2mcrd1vx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-02-22',
});

const npcComments = [
    "The frequency is shifting.", "Pure Finnergy.", "The archive grows stronger.", 
    "Masterful lens.", "Truly limitless.", "Geometric perfection.", "99% Sync achieved.", 
    "A moment in the void.", "Kinetically charged.", "Observation logged.",
    "Architecture of the wanderer.", "Data stream optimized.", "Sublime focus."
];

// Generate or retrieve persistent User ID
let userKineticId = localStorage.getItem('fin_kinetic_id') || "KINETIC_" + Math.floor(100 + Math.random() * 899);
localStorage.setItem('fin_kinetic_id', userKineticId);
document.getElementById('userStatus').innerText = "ID: " + userKineticId;

// 2. FETCH DATA FROM SANITY
async function fetchArchive() {
    const grid = document.getElementById('archive-grid');
    try {
        const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc)`);
        
        if (!posts || posts.length === 0) {
            grid.innerHTML = `<p class="col-span-full text-center tech-text py-20 text-slate-300">Archive Empty / Awaiting Sync</p>`;
            return;
        }

        grid.innerHTML = '';
        posts.forEach(post => {
            if (!post.image || !post.image.asset) return;

            const ref = post.image.asset._ref;
            const [_file, id, dimensions, extension] = ref.split('-');
            const imageUrl = `https://cdn.sanity.io/images/2mcrd1vx/production/${id}-${dimensions}.${extension}`;
            
            const card = document.createElement('div');
            card.className = "glass-card rounded-[2.5rem] p-3 cursor-pointer overflow-hidden aspect-[3/4] group";
            card.innerHTML = `
                <div class="w-full h-full overflow-hidden rounded-[2rem] relative">
                    <img src="${imageUrl}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p class="tech-text text-white drop-shadow-md">View Entry</p>
                    </div>
                </div>
            `;
            
            // Pass unique ID to seed the randomized stats
            card.onclick = () => openModal(imageUrl, post.location, id);
            grid.appendChild(card);
        });
    } catch (e) {
        console.error("Sanity Connection Error:", e);
    }
}

// 3. INTERACTIVE MODAL LOGIC (DIVERSIFIED STATS)
window.openModal = function(img, loc, postId) {
    document.getElementById('modalImg').src = img;
    document.getElementById('modalStatus').innerText = "LOCATION: " + (loc || "ARCHIVE_UNDISCLOSED");
    
    // --- SMART DATA DIVERSIFICATION ---
    // Use the Sanity Post ID to create a "Seed" so stats stay the same for each specific photo
    const seed = postId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const uniqueLikes = ( (seed % 40) / 10 + 1.2 ).toFixed(1) + "k";
    const uniqueSync = Math.floor(88 + (seed % 11)); // Sync between 88% and 99%
    
    document.getElementById('modalLikes').innerText = uniqueLikes;
    document.getElementById('vibeScore').innerText = uniqueSync + "%";
    document.getElementById('vibeBar').style.width = uniqueSync + "%";
    
    document.getElementById('postModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Clear and fill with unique NPC starting comments
    const list = document.getElementById('comment-list');
    list.innerHTML = '';
    for(let i=0; i<3; i++) {
        const botMsg = npcComments[(seed + i) % npcComments.length];
        const botId = "KINETIC_" + ( (seed + i) % 800 + 100 );
        addComment(botMsg, botId);
    }
}

// 4. INTERACTION HELPERS
window.triggerHeart = function() {
    const container = document.getElementById('heartContainer');
    const bigHeart = document.getElementById('bigHeart');
    
    bigHeart.style.opacity = '1'; bigHeart.style.transform = 'scale(1.1)';
    setTimeout(() => { bigHeart.style.opacity = '0'; bigHeart.style.transform = 'scale(0.5)'; }, 600);

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
    
    let likes = document.getElementById('modalLikes');
    let current = parseFloat(likes.innerText);
    likes.innerText = (current + 0.1).toFixed(1) + 'k';
};

function addComment(text, id, isUser = false) {
    const list = document.getElementById('comment-list');
    const item = document.createElement('div');
    item.className = 'comment-item';
    if(isUser) item.style.borderLeftColor = "#2563eb"; // Blue border for real user
    item.innerHTML = `<span class="id-label">${id}</span><span class="quote-text">"${text}"</span>`;
    list.prepend(item);
    if(list.children.length > 8) list.removeChild(list.lastChild);
}

// 5. EVENT LISTENERS
document.getElementById('submitComment').onclick = () => {
    const input = document.getElementById('commentInput');
    if(input.value.trim()) {
        addComment(input.value, userKineticId, true);
        input.value = '';
    }
};

window.closeModal = () => { 
    document.getElementById('postModal').style.display = 'none'; 
    document.body.style.overflow = 'auto';
};

document.getElementById('closeModalBtn').onclick = closeModal;

// 6. AI ENGAGEMENT LOOP (GHOST INTERACTION)
setInterval(() => {
    if(document.getElementById('postModal').style.display === 'flex') {
        if(Math.random() > 0.85) { 
            const botId = "KINETIC_" + Math.floor(100 + Math.random() * 900);
            const botMsg = npcComments[Math.floor(Math.random() * npcComments.length)];
            addComment(botMsg, botId);
            if(Math.random() > 0.5) window.triggerHeart();
        }
    }
}, 4000);

fetchArchive();