const client = window.sanityClient.createClient({
    projectId: '2mcrd1vx',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2026-02-22',
  });
  
  async function fetchArchive() {
    const grid = document.getElementById('archive-grid');
    
    // This query grabs your photos, locations, and sync scores from Sanity
    const query = `*[_type == "post"] | order(_createdAt desc)`;
    
    const posts = await client.fetch(query);
    
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = "glass-panel p-4 rounded-[2.5rem] shadow-sm";
      
      // Sanity stores images as references; this builds the URL
      const imageUrl = `https://cdn.sanity.io/images/2mcrd1vx/production/${post.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg')}`;
  
      card.innerHTML = `
        <img src="${imageUrl}" class="w-full h-80 object-cover rounded-[2rem] mb-4">
        <div class="flex justify-between items-center px-4">
          <p class="tech-text text-slate-400 font-bold uppercase text-[9px]">${post.location}</p>
          <p class="text-[10px] font-black text-blue-600 tracking-widest">${post.syncScore || '94%'} SYNC</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  
  fetchArchive();