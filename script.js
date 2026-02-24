// Accessing the library via the UMD bundle
const client = window.sanityClient.createClient({
  projectId: '2mcrd1vx',
  dataset: 'production',
  useCdn: false, 
  apiVersion: '2024-02-22',
});

async function fetchArchive() {
  const grid = document.getElementById('archive-grid');
  const status = document.getElementById('userStatus');
  
  try {
      const query = `*[_type == "post"] | order(_createdAt desc)`;
      const posts = await client.fetch(query);
      
      if (posts && posts.length > 0) {
          status.innerText = "System: Sync Active";
          grid.innerHTML = ''; 

          posts.forEach(post => {
              if (!post.image) return;

              // Reliable Image URL conversion
              const ref = post.image.asset._ref;
              const [_file, id, dimensions, extension] = ref.split('-');
              const imageUrl = `https://cdn.sanity.io/images/2mcrd1vx/production/${id}-${dimensions}.${extension}`;

              const card = document.createElement('div');
              card.className = "group glass-panel p-4 rounded-[2.5rem] cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1";
              card.onclick = () => openModal(imageUrl, post.location, post.body);

              card.innerHTML = `
                  <div class="relative overflow-hidden rounded-[2rem] h-80 mb-6 bg-slate-100">
                      <img src="${imageUrl}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                      <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/50">
                           <p class="text-[9px] font-black text-slate-800 tracking-tighter uppercase">${post.syncScore || '94'}% SYNC</p>
                      </div>
                  </div>
                  <div class="px-2">
                      <p class="tech-text text-slate-400 mb-1">${post.location || 'Observation'}</p>
                      <p class="text-slate-600 text-[12px] italic line-clamp-2">"${post.body || 'Observation recorded.'}"</p>
                  </div>
              `;
              grid.appendChild(card);
          });
      } else {
          status.innerText = "System: Empty";
          grid.innerHTML = `<p class="col-span-full text-center tech-text py-20 text-slate-300 italic">No published entries found.</p>`;
      }
  } catch (error) {
      console.error("Sanity Error:", error);
      status.innerText = "System: Offline";
  }
}

function openModal(img, loc, body) {
  document.getElementById('modalImg').src = img;
  document.getElementById('modalLoc').innerText = loc || 'Observation';
  document.getElementById('modalBody').innerText = body || 'No description provided.';
  document.getElementById('postModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('postModal').style.display = 'none';
}

fetchArchive();