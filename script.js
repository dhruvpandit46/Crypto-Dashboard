const coinContainer = document.getElementById('coinContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const currencySelect = document.getElementById('currencySelect');
const loader = document.getElementById('loader');

const chartModal = document.getElementById('chartModal');
const chartTitle = document.getElementById('chartTitle');
const chartCanvas = document.getElementById('priceChart');

let coins = [];
let currency = 'usd';
let chartInstance = null;

// 🌙 Theme toggle
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

// 🔁 Fetch live data
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

// 🧠 Watchlist check
function isInWatchlist(id) {
  const list = JSON.parse(localStorage.getItem('watchlist')) || [];
  return list.includes(id);
}

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

// 💹 Show coins
function displayCoins(data) {
  coinContainer.innerHTML = '';
  const search = searchInput.value.toLowerCase();
  let filtered = data.filter(c =>
    c.name.toLowerCase().includes(search) || c.symbol.toLowerCase().includes(search)
  );

  const sort = sortSelect.value;
  if (sort === 'price') {
    filtered.sort((a, b) => b.current_price - a.current_price);
  } else if (sort === 'change') {
    filtered.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  } else {
    filtered.sort((a, b) => b.market_cap - a.market_cap);
  }

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

// 📈 Load chart inside modal
function loadChart(coinId, coinName, range = '7d') {
  const ranges = { '7d': 7, '30d': 30, '1y': 365 };

  chartModal.style.display = 'flex';
  chartTitle.innerHTML = `
    📊 ${coinName} Price Chart 
    <span style="float:right;">
      <button class="range-btn" onclick="loadChart('${coinId}', '${coinName}', '7d')">7d</button>
      <button class="range-btn" onclick="loadChart('${coinId}', '${coinName}', '30d')">30d</button>
      <button class="range-btn" onclick="loadChart('${coinId}', '${coinName}', '1y')">1y</button>
      <button class="close-btn" onclick="closeChart()">❌</button>
    </span>
  `;

  fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${ranges[range]}`)
    .then(res => res.json())
    .then(data => {
      const labels = data.prices.map(p => {
        const d = new Date(p[0]);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      });
      const prices = data.prices.map(p => p[1]);

      if (chartInstance) chartInstance.destroy();
      const ctx = chartCanvas.getContext("2d");

      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: `${coinName} (${range})`,
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
    })
    .catch(() => {
      chartTitle.innerHTML = `<p>⚠️ Failed to load chart.</p>`;
    });
}

function closeChart() {
  chartModal.style.display = 'none';
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
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

// 🚀 Start
fetchCoins();
