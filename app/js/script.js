const grid = document.getElementById("animal-cards");

//TODO: Create card for each animal in DB. Add clickable functionality to cards and navigate to detail page.
for (let i = 0; i < 6; i++) {
    grid.innerHTML += `
        <div class="card">
            <h3>This is a card</h2>
            <div class="card-image-wrapper">
                <img draggable="false" src="https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg" alt="placeholder image">
            </div>
        </div>
    `
}