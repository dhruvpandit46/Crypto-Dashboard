# 📊 Crypto Dashboard

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![API](https://img.shields.io/badge/API-CoinGecko-8dc63f?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

**Crypto Dashboard** is a real-time cryptocurrency tracker built with vanilla HTML, CSS, and JavaScript. It pulls live market data from the **CoinGecko API**, letting users search, sort, and track their favorite coins, switch between currencies, and dive into interactive price history charts — all wrapped in a sleek neon dark/light themed UI.

---

# 📑 Table of Contents

- Features
- Live Demo
- Technologies
- Project Structure
- How It Works
- Installation
- Future Improvements
- Contributing
- License
- Author

---

# ✨ Features

✅ Live Market Data — top 50 coins by market cap, powered by CoinGecko

✅ Search by Name or Symbol — instant client-side filtering

✅ Sort by Market Cap, Price, or 24h Change

✅ Multi-Currency Support — toggle between USD and INR

✅ ⭐ Watchlist — save favorite coins locally and filter to view only them

✅ 📈 Interactive Price Charts — powered by Chart.js, with 7d / 30d / 1y ranges

✅ 🌙 Dark / ☀️ Light Mode — theme preference saved in your browser

✅ Auto-Refresh — live prices update automatically every 60 seconds

✅ Zero Backend — fully client-side, no server needed

✅ Clean, Responsive, Mobile-Friendly UI

---

# 🚀 Live Demo

https://dhruvpandit46.github.io/Crypto-Dashboard/

---

# ⚙ Technologies Used

- HTML5
- CSS3 (CSS Variables, responsive grid layout)
- JavaScript (Vanilla, ES6)
- Chart.js (`v3.7.1`)
- CoinGecko API (`/coins/markets`, `/coins/{id}/market_chart`)

---

# 📂 Project Structure

```
Crypto-Dashboard/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

# ⚡ How It Works

1. On load, the app fetches the **top 50 coins by market cap** from the CoinGecko API in your selected currency (USD/INR).
2. Use the **search bar** to filter coins by name or symbol in real time.
3. Use the **sort dropdown** to reorder coins by market cap, price, or 24h price change.
4. Click ⭐ on any coin to add it to your **watchlist**, saved locally in your browser — toggle the watchlist button to view only saved coins.
5. Click **📊 View Chart** to open a fullscreen modal with an interactive price history chart, switchable between 7-day, 30-day, and 1-year ranges.
6. Prices auto-refresh every **60 seconds**, and your theme (dark/light) and watchlist persist across sessions via `localStorage`.

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/dhruvpandit46/Crypto-Dashboard.git
```

Go inside the project

```bash
cd Crypto-Dashboard
```

Run

Simply open `index.html` in your browser — no build step, no dependencies, no API key required.

---

# 🎯 Future Improvements

- Pagination / infinite scroll beyond top 50 coins
- More currency options (EUR, GBP, JPY, etc.)
- Portfolio tracker with profit/loss calculation
- Coin detail page with market stats (supply, ATH, volume)
- PWA / offline support
- Price alert notifications

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📜 License

Licensed under the **MIT License**.

MIT © 2026 Dhruv Pandit.

See the [LICENSE](LICENSE) file for full license details.

---

# 👨‍💻 Author

**Dhruv Pandit**

GitHub — https://github.com/dhruvpandit46

LinkedIn — https://linkedin.com/in/dhruv-pandit-755786326

Instagram — https://instagram.com/dhruv_pandit2007

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.
It helps support future development.
