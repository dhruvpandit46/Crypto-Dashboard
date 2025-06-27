let chartInstance = null;

// Supported ranges for price history
const RANGES = {
  "7d": 7,
  "30d": 30,
  "1y": 365
};

export async function renderPriceChart(coinId, coinName, currency = 'usd', range = '7d') {
  const chartSection = document.getElementById('chartSection');
  const chartTitle = document.getElementById('chartTitle');
  const canvas = document.getElementById('priceChart');

  chartSection.style.display = 'block';
  chartTitle.innerHTML = `
    📊 ${coinName} Price Chart 
    <span style="float:right;">
      <button class="range-btn" onclick="changeChartRange('${coinId}', '${coinName}', '${currency}', '7d')">7d</button>
      <button class="range-btn" onclick="changeChartRange('${coinId}', '${coinName}', '${currency}', '30d')">30d</button>
      <button class="range-btn" onclick="changeChartRange('${coinId}', '${coinName}', '${currency}', '1y')">1y</button>
      <button class="close-btn" onclick="closeChart()">❌</button>
    </span>
  `;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${RANGES[range]}`
    );
    const data = await res.json();

    const labels = data.prices.map(p => {
      const date = new Date(p[0]);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    const prices = data.prices.map(p => p[1]);

    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");
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

  } catch (err) {
    chartSection.innerHTML = `<p>⚠️ Failed to load chart.</p>`;
  }
}

// Used by buttons in chart title
window.changeChartRange = (coinId, coinName, currency, range) => {
  renderPriceChart(coinId, coinName, currency, range);
};

// Close chart button
window.closeChart = () => {
  const chartSection = document.getElementById('chartSection');
  chartSection.style.display = 'none';
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
};
