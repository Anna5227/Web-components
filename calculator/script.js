class FinancialCalculator extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: 'open' });
        this._amount = 1000000;    
        this._rate = 12;             
        this._term = 12;            
        this._onInputChange = this._onInputChange.bind(this);
        
        console.log('[financial-calculator] Компонент создан');
    }
    
    static get observedAttributes() {
        return ['amount', 'rate', 'term'];
    }
    
    connectedCallback() {
        console.log('[financial-calculator] Компонент добавлен в DOM');
        
        this._render();
        this._readAttributes();
        this._attachEventListeners();
        this._calculate();
    }
    
    disconnectedCallback() {
        console.log('[financial-calculator] Компонент удален из DOM');
        this._detachEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        console.log(`[financial-calculator] Атрибут "${name}" изменен: ${oldValue} → ${newValue}`);
        
        const value = parseFloat(newValue);
        if (!isNaN(value) && value > 0) {
            switch (name) {
                case 'amount': this._amount = value; break;
                case 'rate':   this._rate = value;   break;
                case 'term':   this._term = value;   break;
            }
        }
        
        if (this.shadowRoot.querySelector('.calculator')) {
            this._syncInputsWithState();
            this._calculate();
        }
    }
    
    get amount() { return this._amount; }
    set amount(value) {
        this._amount = Number(value) || 0;
        this.setAttribute('amount', this._amount);
        this._syncInputsWithState();
        this._calculate();
    }
    
    get rate() { return this._rate; }
    set rate(value) {
        this._rate = Number(value) || 0;
        this.setAttribute('rate', this._rate);
        this._syncInputsWithState();
        this._calculate();
    }
    
    get term() { return this._term; }
    set term(value) {
        this._term = Number(value) || 0;
        this.setAttribute('term', this._term);
        this._syncInputsWithState();
        this._calculate();
    }
    
    _readAttributes() {
        const amount = parseFloat(this.getAttribute('amount'));
        const rate = parseFloat(this.getAttribute('rate'));
        const term = parseFloat(this.getAttribute('term'));
        
        if (!isNaN(amount) && amount > 0) this._amount = amount;
        if (!isNaN(rate) && rate > 0)     this._rate = rate;
        if (!isNaN(term) && term > 0)     this._term = term;
        
        this._syncInputsWithState();
    }
    
    _syncInputsWithState() {
        const amountInput = this.shadowRoot.querySelector('#amount');
        const rateInput = this.shadowRoot.querySelector('#rate');
        const termInput = this.shadowRoot.querySelector('#term');
        
        if (amountInput) amountInput.value = this._amount;
        if (rateInput)   rateInput.value = this._rate;
        if (termInput)   termInput.value = this._term;
    }
    
    _attachEventListeners() {
        const container = this.shadowRoot.querySelector('.calculator');
        
        if (!container) {
            console.error('[financial-calculator] Не найден .calculator в Shadow DOM');
            return;
        }
        
        container.addEventListener('input', this._onInputChange);
        console.log('[financial-calculator] Обработчики навешены');
    }
    
    _detachEventListeners() {
        const container = this.shadowRoot.querySelector('.calculator');
        if (container) {
            container.removeEventListener('input', this._onInputChange);
        }
    }
    
    _onInputChange(event) {
        const target = event.target;
        if (!target.matches('input')) return;
        
        const value = parseFloat(target.value);
        const isValid = !isNaN(value) && value > 0;
        
        target.classList.toggle('invalid', !isValid && target.value !== '');
        
        if (!isValid) {
            this._showError('Пожалуйста, введите положительные числовые значения');
            return;
        }
        
        this._clearError();
        
        switch (target.id) {
            case 'amount': this._amount = value; break;
            case 'rate':   this._rate = value;   break;
            case 'term':   this._term = value;   break;
        }
        
        console.log('[financial-calculator] Данные обновлены');
        this._calculate();
    }
    
    _calculate() {
        const { _amount: amount, _rate: rate, _term: term } = this;
        
        if (amount <= 0 || rate <= 0 || term <= 0) {
            this._updateResults({
                monthlyPayment: '—',
                totalPayment: '—',
                totalInterest: '—'
            });
            return;
        }
        
        const monthlyRate = rate / 100 / 12;
        const pow = Math.pow(1 + monthlyRate, term);
        const monthlyPayment = amount * (monthlyRate * pow) / (pow - 1);
        const totalPayment = monthlyPayment * term;
        const totalInterest = totalPayment - amount;
        
        this._updateResults({
            monthlyPayment: this._formatMoney(monthlyPayment),
            totalPayment: this._formatMoney(totalPayment),
            totalInterest: this._formatMoney(totalInterest)
        });
    }
    
    _updateResults({ monthlyPayment, totalPayment, totalInterest }) {
        const results = this.shadowRoot.querySelector('.results');
        if (!results) return;
        
        results.querySelector('[data-result="monthly"]').textContent = monthlyPayment;
        results.querySelector('[data-result="total"]').textContent = totalPayment;
        results.querySelector('[data-result="interest"]').textContent = totalInterest;
    }
    
    _formatMoney(value) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 2
        }).format(value);
    }
    
    _showError(message) {
        const errorBox = this.shadowRoot.querySelector('.error');
        if (errorBox) {
            errorBox.textContent = message;
            errorBox.style.display = 'block';
        }
    }
    
    _clearError() {
        const errorBox = this.shadowRoot.querySelector('.error');
        if (errorBox) {
            errorBox.textContent = '';
            errorBox.style.display = 'none';
        }
    }
    
    _render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="style.css">
            
            <div class="calculator">
                <h2>Финансовый калькулятор</h2>
                
                <div class="field">
                    <label for="amount">Сумма кредита (₽)</label>
                    <input type="number" id="amount" min="1" step="any" placeholder="Например, 1000000">
                </div>
                
                <div class="field">
                    <label for="rate">Процентная ставка (% годовых)</label>
                    <input type="number" id="rate" min="0.01" step="any" placeholder="Например, 12">
                </div>
                
                <div class="field">
                    <label for="term">Срок кредита (месяцев)</label>
                    <input type="number" id="term" min="1" step="1" placeholder="Например, 12">
                </div>
                
                <div class="error"></div>
                
                <div class="results">
                    <h3>Результаты расчета</h3>
                    <div class="result-row highlight">
                        <span>Ежемесячный платеж:</span>
                        <span data-result="monthly">—</span>
                    </div>
                    <div class="result-row">
                        <span>Общая сумма выплат:</span>
                        <span data-result="total">—</span>
                    </div>
                    <div class="result-row">
                        <span>Общий процент по кредиту:</span>
                        <span data-result="interest">—</span>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('financial-calculator', FinancialCalculator);