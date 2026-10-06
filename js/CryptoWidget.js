import { UIComponent } from './UIComponent.js';

export class CryptoWidget extends UIComponent {
  static API = 'https://api.coingecko.com/api/v3/simple/price';
  static #counter = 0;

  #timerId = null;
  #coins;

  constructor({ id, title = '💱 Курсы криптовалют', coins, refreshInterval = 60000 } = {}) {
    super({ id: id ?? `crypto-${++CryptoWidget.#counter}`, title });
    this.#coins = coins ?? ['bitcoin', 'ethereum', 'solana'];
    this.refreshInterval = refreshInterval;
  }

  renderBody() {
    const wrap = document.createElement('div');
    wrap.className = 'crypto';
    wrap.innerHTML = `<div class="widget__loader">Загрузка курсов…</div>`;
    return wrap;
  }

  bindEvents() {
    this.#load();
    if (this.refreshInterval > 0) {
      this.#timerId = setInterval(() => this.#load(), this.refreshInterval);
    }
  }

  async #load() {
    const wrap = this.$('.crypto');
    if (!wrap) return;

    try {
      const url = `${CryptoWidget.API}?ids=${this.#coins.join(',')}`
                + `&vs_currencies=usd&include_24hr_change=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`CoinGecko: ${res.status}`);
      const data = await res.json();
      this.#render(wrap, data);
    } catch (err) {
      console.warn('CoinGecko недоступен, демо-данные:', err.message);
      this.#render(wrap, {
        bitcoin:  { usd: 67234.50, usd_24h_change: 2.45 },
        ethereum: { usd: 3456.78,  usd_24h_change: -1.23 },
        solana:   { usd: 178.90,   usd_24h_change: 5.67 }
      });
    }
  }

  #render(wrap, data) {
    const rows = this.#coins.map(symbol => {
      const coin = data[symbol];
      if (!coin) return '';
      const change = coin.usd_24h_change ?? 0;
      const cls = change >= 0 ? 'trend-up' : 'trend-down';
      const sign = change >= 0 ? '+' : '';
      return `
        <div class="crypto-row">
          <span class="crypto-row__symbol">${symbol.toUpperCase()}</span>
          <span class="crypto-row__price">
            $${coin.usd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </span>
          <span class="crypto-row__change ${cls}">
            ${sign}${change.toFixed(2)}%
          </span>
        </div>
      `;
    }).join('');

    wrap.innerHTML = `<div class="crypto-list">${rows}</div>`;
  }

  onDestroy() {
    if (this.#timerId) clearInterval(this.#timerId);
    this.#timerId = null;
  }
}