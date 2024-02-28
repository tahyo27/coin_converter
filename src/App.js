
import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coinName, setCoinName] = useState(""); //코인 이름 충돌하는것 같아서 만듦
  const [coins, setCoins] = useState([]); //배열로 받음
  const [selectValue, setselectValue] = useState(""); // input에 넣을것
  const [exchangeRate, setExchangeRate] = useState({date: "", krw: 0}); //환율
  const [disable, setDisable] = useState(false); // 코인 won 입력창
  const [amount, setAmount] = useState(0); // 코인 인풋
  const [coinPrice, setCoinPrice] = useState(0); // 코인값 관리

    useEffect(() => {
      const fetchData = async () => {
        try {
          // 첫 번째 fetch 요청
          const response1 = await fetch("https://api.coinpaprika.com/v1/tickers");
          const data1 = await response1.json();
          setCoins(data1);
          
    
          // 두 번째 fetch 요청
          const response2 = await fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/krw.json");
          const data2 = await response2.json();
          setExchangeRate(data2);

          setLoading(false);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();


  }, []);

  

  const inputChange = (event) => {
    const inputText = event.target.value;
    setCoinName(inputText);
  };

  const amountChange = (event) => {
    setAmount(event.target.value);
  }


  const filterOption = coins.filter((coins) => coins.name
  .toLowerCase().startsWith(coinName.toLowerCase()));

  return (
    <div>
      <h1>Coin converter</h1>
      {loading ? <strong><h1>Loading...</h1></strong> : null}
      <div>
        <h1>환율</h1>
        <div>{exchangeRate.date}</div>
        <div>{exchangeRate.krw}</div>
        <h1>코인 USD</h1>

        </div>
      <div>
        <input
          type="text"
          value={coinName}
          onChange={inputChange}
        />
        <select 
        value={selectValue} 
        onChange={(event) => {
          console.log("select value" + selectValue);
          console.log(event.target.value.split(":")[0]);
          setselectValue(event.target.value.split(":")[0]);
          setCoinName(event.target.value.split(":")[0]);
          setCoinPrice("코인 price" + event.target.value.split(":")[1]);
          console.log(event.target.value.split(":")[1]);
          console.log(exchangeRate.krw);
        }}
        > 
          {filterOption.map((item, index) => (
            <option key={index} value={`${item.name}:${item.quotes.USD.price}`}>{item.name} : {item.symbol}</option>
          ))}
        </select>
        <div>
          <h1>코인 to Won</h1>
        <input
          type="text"
          value={amount}
          disabled={disable}
          onChange={amountChange}
        />코인
        <div>
          {(amount * (exchangeRate.krw * coinPrice)).toFixed(4)}원
        </div>
        
        </div>
       
      </div>
    </div>
  );
}

export default App;
