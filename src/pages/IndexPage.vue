<template>
  <q-page>
    <div style="font-size: 32px; font-weight: bold; text-align: left; margin-top: 20px; margin-left: 20px">
      CURRENCY CONVERTER
    </div>

    <div class="q-pa-md q-gutter-md" style="display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <q-card class="my-card"> <!-- First Card -->
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-5">
              <q-select
                v-model="fromCurrency"
                :options="currencyOptions"
                outlined
                class="currency-select"
                @update:model-value="handleFromCurrencyChange"
              >
                <template v-slot:selected>
                  <div class="row items-center">
                    <q-avatar size="20px" class="q-mr-sm">
                      <img :src="getFlagUrl(fromCurrency)" />
                    </q-avatar>
                    <div class="text-weight-bold">{{ fromCurrency }}</div>
                    <div class="q-ml-sm text-grey">{{ getCurrencyName(fromCurrency) }}</div>
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar size="20px">
                        <img :src="getFlagUrl(scope.opt)" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt }}</q-item-label>
                      <q-item-label caption>{{ getCurrencyName(scope.opt) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-tooltip anchor="bottom middle" self="top middle">Select the currency you want to convert from</q-tooltip>
            </div>
            <div class="col-2 flex flex-center">
              <q-btn flat round color="green" icon="swap_horiz" @click="swapCurrencies">
                <q-tooltip transition-show="rotate" transition-hide="rotate">Swap Currency</q-tooltip>
              </q-btn>
            </div>
            <div class="col-5">
              <q-select
                v-model="toCurrency"
                :options="currencyOptions"
                outlined
                class="currency-select"
                @update:model-value="handleToCurrencyChange"
              >
                <template v-slot:selected>
                  <div class="row items-center">
                    <q-avatar size="20px" class="q-mr-sm">
                      <img :src="getFlagUrl(toCurrency)" />
                    </q-avatar>
                    <div class="text-weight-bold">{{ toCurrency }}</div>
                    <div class="q-ml-sm text-grey">{{ getCurrencyName(toCurrency) }}</div>
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar size="20px">
                        <img :src="getFlagUrl(scope.opt)" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt }}</q-item-label>
                      <q-item-label caption>{{ getCurrencyName(scope.opt) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-tooltip anchor="bottom middle" self="top middle">Select the currency you want to convert to</q-tooltip>
            </div>
          </div>

          <div class="row q-mb-md">
            <div class="col-5">
              <q-input
                v-model="fromAmount"
                outlined
                type="number"
                class="text-h6"
              />
              <q-tooltip anchor="bottom middle" self="top middle">Enter the amount to convert</q-tooltip>
            </div>
            <div class="col-2"></div>
            <div class="col-5">
              <q-input
                v-model="toAmount"
                outlined
                type="number"
                class="text-h6"
                readonly=""
              />
              <q-tooltip anchor="bottom middle" self="top middle">Converted amount will be displayed here</q-tooltip>
            </div>
          </div>

          <div class="row q-mb-md">
            <div class="col-12">
              <div class="row q-gutter-sm">
                <q-btn v-for="currency in popularCurrencies" :key="currency"
                      dense outline no-caps
                      :color="isSelected(currency) ? 'primary' : 'grey'"
                      @click="selectCurrency(currency)">
                  {{ currency }}
                  <q-tooltip anchor="bottom middle" self="top middle">Quick select {{ currency }}</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>

          <div class="row q-mb-md">
            <div class="col-6">
              <q-input
                v-model="date"
                outlined
                readonly
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
                <template v-slot:append>
                  <q-btn flat dense icon="chevron_left" @click="decrementDate">
                    <q-tooltip>Previous day</q-tooltip>
                  </q-btn>
                  <q-btn flat dense icon="chevron_right" @click="incrementDate">
                    <q-tooltip>Next day</q-tooltip>
                  </q-btn>
                  <q-btn flat dense icon="calendar_today" @click="showDatePicker = true">
                    <q-tooltip>Select a date</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
              <q-dialog v-model="showDatePicker">
                <q-date v-model="selectedDate" @update:model-value="updateDate" />
              </q-dialog>
            </div>
          </div>

          <div v-if="loading" class="row justify-center q-my-md">
            <q-spinner color="primary" size="2em" />
            <span class="q-ml-sm">Loading exchange rates...</span>
          </div>

          <div v-if="error" class="row justify-center q-my-md text-negative">
            {{ error }}
          </div>

          <div v-if="isHistoricalDate" class="row justify-center q-my-md">
            <q-badge color="blue">
              Historical rates for {{ date }}
            </q-badge>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="my-card"> <!-- Second Card -->
        <q-card-section>
          <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">
            How to Use the Currency Converter
          </div>

          <ul class="q-mb-md" style="font-size: 16px; line-height: 1.5;">
            <li><b>Select the currencies:</b> Choose the currency you want to convert from and the currency you want to convert to.</li>
            <li><b>Enter an amount:</b> Type the amount in the left box; the converted value will appear in the right box.</li>
            <li><b>Swap currencies:</b> Click the swap button <q-icon name="swap_horiz" /> to switch between the selected currencies.</li>
            <li><b>Quick select:</b> Click on popular currency buttons for fast selection.</li>
            <li><b>Select a date:</b> Use the date picker to check historical exchange rates.</li>
            <li><b>Wait for updates:</b> If needed, a loading spinner will indicate when rates are being fetched.</li>
          </ul>

          <q-banner dense class="bg-blue-1 text-blue q-pa-md">
            Exchange rates are updated in real-time. Make sure to check the date if viewing historical rates.
          </q-banner>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";

const API_KEY = "b7a95d335cc96db529e873ad";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;
const HISTORICAL_API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/history/`;

const fromCurrency = ref("GBP");
const toCurrency = ref("EUR");
const currentDate = new Date();
const date = ref(formatDate(currentDate));
const selectedDate = ref(formatDateForPicker(currentDate));
const showDatePicker = ref(false);
const exchangeRates = ref({});
const historicalRates = ref({});
const exchangeRate = ref(1.15874);
const loading = ref(false);
const error = ref(null);

const isHistoricalDate = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDateObj = new Date(selectedDate.value);
  selectedDateObj.setHours(0, 0, 0, 0);
  return selectedDateObj.getTime() < today.getTime();
});

const fromAmount = ref(10000);
const toAmount = computed(() => {
  return fromAmount.value && exchangeRate.value
    ? (parseFloat(fromAmount.value) * exchangeRate.value).toFixed(1)
    : 0;
});

const popularCurrencies = ["USD", "GBP", "EUR", "BTC", "PHP"];

const currencyOptions = ref([
  "USD", "GBP", "EUR", "BTC", "CAD", "JPY", "AUD", "CHF", "CNY", "INR", "PHP"
]);

const currencyNames = {
  USD: "US Dollar",
  GBP: "British Pound",
  EUR: "Euro",
  BTC: "Bitcoin",
  CAD: "Canadian Dollar",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  INR: "Indian Rupee",
  PHP: "Philippine Peso"
};

const fetchExchangeRates = async (baseCurrency) => {
  loading.value = true;
  error.value = null;

  try {
    if (isHistoricalDate.value) {
      await fetchHistoricalRates(baseCurrency, selectedDate.value);
    } else {
      const response = await axios.get(`${API_URL}${baseCurrency}`);
      if (response.data.result === "success") {
        exchangeRates.value = response.data.conversion_rates;
        updateExchangeRate();
      } else {
        error.value = "Failed to fetch exchange rates";
      }
    }
  } catch (err) {
    error.value = "Error connecting to exchange rate API";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchHistoricalRates = async (baseCurrency, dateStr) => {
  try {
    const dateParts = dateStr.split('-');
    const apiDateFormat = dateParts.join('/');
    const cacheKey = `${baseCurrency}_${dateStr}`;

    if (historicalRates.value[cacheKey]) {
      exchangeRates.value = historicalRates.value[cacheKey];
      updateExchangeRate();
      return;
    }

    const response = await axios.get(`${HISTORICAL_API_URL}${baseCurrency}/${apiDateFormat}`);

    if (response.data.result === "success") {
      const conversion_rates = response.data.conversion_rates;
      historicalRates.value[cacheKey] = conversion_rates;
      exchangeRates.value = conversion_rates;
      updateExchangeRate();
    } else {
      error.value = "Historical data not available, using latest rates";
      const latestResponse = await axios.get(`${API_URL}${baseCurrency}`);
      if (latestResponse.data.result === "success") {
        exchangeRates.value = latestResponse.data.conversion_rates;
        updateExchangeRate();
      }
    }
  } catch (err) {
    error.value = "Failed to fetch historical rates, using latest rates";
    console.error(err);

    const latestResponse = await axios.get(`${API_URL}${baseCurrency}`);
    if (latestResponse.data.result === "success") {
      exchangeRates.value = latestResponse.data.conversion_rates;
      updateExchangeRate();
    }
  }
};

function formatDate(date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

function formatDateForPicker(date) {
  return date.toISOString().split('T')[0];
}

function updateDate() {
  const newDate = new Date(selectedDate.value);
  date.value = formatDate(newDate);
  showDatePicker.value = false;
  fetchExchangeRates(fromCurrency.value);
}

const updateExchangeRate = () => {
  if (exchangeRates.value && exchangeRates.value[toCurrency.value]) {
    exchangeRate.value = exchangeRates.value[toCurrency.value];
    convertFromTo();
  }
};

const convertFromTo = () => {
  if (fromAmount.value && exchangeRate.value) {
    toAmount.value = (parseFloat(fromAmount.value) * exchangeRate.value).toFixed(1);
  }
};

const handleFromCurrencyChange = () => {
  fetchExchangeRates(fromCurrency.value);
};

const handleToCurrencyChange = () => {
  updateExchangeRate();
};

const swapCurrencies = () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  fetchExchangeRates(fromCurrency.value);
};

const incrementDate = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + 1);
  const today = new Date();
  if (newDate > today) {
    newDate.setDate(today.getDate());
    newDate.setMonth(today.getMonth());
    newDate.setFullYear(today.getFullYear());
  }
  selectedDate.value = formatDateForPicker(newDate);
  updateDate();
};

const decrementDate = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() - 1);
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  if (newDate < fiveYearsAgo) {
    newDate.setDate(fiveYearsAgo.getDate());
    newDate.setMonth(fiveYearsAgo.getMonth());
    newDate.setFullYear(fiveYearsAgo.getFullYear());
  }

  selectedDate.value = formatDateForPicker(newDate);
  updateDate();
};

const getFlagUrl = (currencyCode) => {
  if (currencyCode === "EUR") {
    return "https://flagcdn.com/w20/eu.png";
  } else if (currencyCode === "GBP") {
    return "https://flagcdn.com/w20/gb.png";
  } else if (currencyCode === "USD") {
    return "https://flagcdn.com/w20/us.png";
  } else if (currencyCode === "CAD") {
    return "https://flagcdn.com/w20/ca.png";
  } else if (currencyCode === "AUD") {
    return "https://flagcdn.com/w20/au.png";
  } else if (currencyCode === "JPY") {
    return "https://flagcdn.com/w20/jp.png";
  } else if (currencyCode === "CHF") {
    return "https://flagcdn.com/w20/ch.png";
  } else if (currencyCode === "CNY") {
    return "https://flagcdn.com/w20/cn.png";
  } else if (currencyCode === "INR") {
    return "https://flagcdn.com/w20/in.png";
  } else if (currencyCode === "PHP") {
    return "https://flagcdn.com/w20/ph.png";
  } else if (currencyCode === "BTC") {
    return "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025";
  }
  return "https://via.placeholder.com/20";
};

const getCurrencyName = (currencyCode) => {
  return currencyNames[currencyCode] || currencyCode;
};

const isSelected = (currency) => {
  return currency === fromCurrency.value || currency === toCurrency.value;
};

const selectCurrency = (currency) => {
  if (currency !== fromCurrency.value) {
    toCurrency.value = currency;
    updateExchangeRate();
  }
};

watch(selectedDate, () => {
  updateDate();
});

onMounted(async () => {
  try {
    historicalRates.value = {};
    await fetchExchangeRates(fromCurrency.value);
  } catch (err) {
    error.value = "Failed to initialize currency converter";
    console.error(err);
  }
});
</script>


<style scoped>
.currency-select {
  width: 100%;
}
</style>
