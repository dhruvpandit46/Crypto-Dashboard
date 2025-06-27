const coinContainer = document.getElementById('coinContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const currencySelect = document.getElementById('currencySelect');
const loader = document.getElementById('loader');
const chartSection = document.getElementById('chartSection');
const chartTitle = document.getElementById('chartTitle');
const watchlistContainer = document.getElementById('watchlistContainer');

let coins = [];
let currency = 'usd';
let chart; // Chart.js instance

// 🌙 Theme toggle persistence
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

document.getElementById('dark-mode').onclick = () => {
  document.body.classList.add('dark');
  localStorage.setItem('theme', 'dark');
};

document.getElementById('light-mode').onclick = () => {
  document.body.classList.remove('dark');
  localStorage.setItem('theme', 'light');
};

// 🪙 Fetch live coins data
async function fetchCoins() {
  loader.style.display = 'block';
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1`
    );
    coins = await res.json();
    displayCoins(coins);
  } catch (e) {
    coinContainer.innerHTML = `<p>⚠️ Error fetching data.</p>`;
  }
  loader.style.display = 'none';
}

// 🔍 Render all coin cards
function displayCoins(data) {
  coinContainer.innerHTML = '';
  const search = searchInput.value.toLowerCase();

  let filtered = data.filter(c =>
    c.name.toLowerCase().includes(search) || c.symbol.toLowerCase().includes(search)
  );

  // Sorting logic
  const sort = sortSelect.value;
  if (sort === 'price') {
    filtered.sort((a, b) => b.current_price - a.current_price);
  } else if (sort === 'change') {
    filtered.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  } else {
    filtered.sort((a, b) => b.market_cap - a.market_cap);
  }

  // Render each coin card
  filtered.forEach(coin => {
    const div = document.createElement('div');
    div.className = 'coin-card';

    const change = coin.price_change_percentage_24h;
    const isUp = change >= 0;
    const star = isInWatchlist(coin.id) ? '⭐' : '☆';

    div.innerHTML = `
      <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
      <p>Price: ${currency.toUpperCase()} ${coin.current_price.toLocaleString()}</p>
      <p class="${isUp ? 'price-up' : 'price-down'}">
        ${isUp ? '📈' : '📉'} ${change.toFixed(2)}%
      </p>
      <button onclick="toggleWatchlist('${coin.id}')">${star} Watchlist</button>
      <button onclick="loadChart('${coin.id}', '${coin.name}')">📊 View Chart</button>
    `;

    coinContainer.appendChild(div);
  });
}

// ⭐ Watchlist toggle
function toggleWatchlist(id) {
  let list = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (list.includes(id)) {
    list = list.filter(c => c !== id);
  } else {
    list.push(id);
  }
  localStorage.setItem('watchlist', JSON.stringify(list));
  displayCoins(coins);
}

// 🧠 Check if coin is in watchlist
function isInWatchlist(id) {
  const list = JSON.parse(localStorage.getItem('watchlist')) || [];
  return list.includes(id);
}

// 📊 Load 7-day chart
async function loadChart(coinId, coinName) {
  chartSection.style.display = 'block';
  chartTitle.textContent = `📊 7-Day Price Chart: ${coinName}`;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=7`
    );
    const data = await res.json();

    const labels = data.prices.map(p => {
      const date = new Date(p[0]);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    const prices = data.prices.map(p => p[1]);

    if (chart) chart.destroy();

    const ctx = document.getElementById("priceChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: `${coinName} Price`,
          data: prices,
          borderColor: "#00ffff",
          backgroundColor: "rgba(0,255,255,0.1)",
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { display: true },
          y: { display: true }
        }
      }
    });

  } catch (err) {
    chartSection.innerHTML = `<p>⚠️ Failed to load chart.</p>`;
  }
}

// 🔄 Event Listeners
searchInput.addEventListener('input', () => displayCoins(coins));
sortSelect.addEventListener('change', () => displayCoins(coins));
currencySelect.addEventListener('change', () => {
  currency = currencySelect.value;
  fetchCoins();
});

// 🔁 Refresh every 60s
setInterval(fetchCoins, 60000);

// 🚀 Initial run
fetchCoins();
