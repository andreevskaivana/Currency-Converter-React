import './App.css'
import './CurrencyRow'
import CurrencyRow from './CurrencyRow';
import React,{useEffect,useState} from 'react';

const BASE_URL = 'http://api.exchangeratesapi.io/v1/latest';
const access_key = '52fb247aa420c7f2cd2f7e65c260aa35';
const apiUrl = `${BASE_URL}?access_key=${access_key}`;


function App() {

  const [currencyOptions,setCurrencyOptions]=useState([]);
  const [fromCurrency,setFromCurrency]=useState();
  const [toCurrency,setToCurrency]=useState();
  const [exchangeRate,setExchangeRate]=useState()
  const [amount,setAmount]=useState(1)
  const [amountInFromCurr,setAmountInFromCur]=useState(true)

  let toAmount,fromAmount
  if(amountInFromCurr){
    fromAmount=amount;
    toAmount=amount * exchangeRate;
  }else{
    toAmount=amount
    fromAmount=amount/exchangeRate;
  }

  useEffect(()=>{
    fetch(apiUrl)
    .then(res=>res.json())
    .then(data=>{
      const firstCurrency=Object.keys(data.rates)[0]
      setCurrencyOptions([data.base,...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  },[])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}/latest?access_key=${access_key}&base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
        .catch(error => {
          console.error('Error fetching exchange rate data:', error);
        });
    }
  }, [fromCurrency, toCurrency]);
  


  function handleFromAmountChange(e){
      setAmount(e.target.value)
      setAmountInFromCur(true)
  }

  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCur(false )
}

  return (
    <>
      <h1>Convert your currency:</h1>
      <CurrencyRow
      currencyOptions={currencyOptions}
      selectedCurrency={fromCurrency}
      onChangeCurrency={e=>setFromCurrency(e.target.value)}
      onChangeAmount={handleFromAmountChange}
      amount={fromAmount}
/>
      <div className='equals'>
        =
      </div>
      <CurrencyRow
      currencyOptions={currencyOptions}
      selectedCurrency={toCurrency}
      onChangeCurrency={e=>setToCurrency(e.target.value)}
      onChangeAmount={handleToAmountChange}
      amount={toAmount}
      />
    </>
  );
}

export default App;
