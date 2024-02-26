
import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]); //배열로 받음
  const [selectValue, setselectValue] = useState(""); // input에 넣을것
  const [exchangeRate, setExchangeRate] = useState({date: "", krw: 0}); //환율

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
    setselectValue(event.target.value);
  };


  const filterOption = coins.filter((coins) => coins.name
  .toLowerCase().startsWith(selectValue.toLowerCase()));

  return (
    <div>
      <h1>Coin converter</h1>
      {loading ? <strong><h1>Loading...</h1></strong> : null}
      <div>
        <h1>환율</h1>
        <div>{exchangeRate.date}</div>
        <div>{exchangeRate.krw}</div>
        </div>
      <div>
        <input
          type="text"
          value={selectValue}
          onChange={inputChange}
        />
        <select 
        value={selectValue} 
        onChange={(event) => setselectValue(event.target.value)}
        > 
          {filterOption.map((item, index) => (
            <option key={index} value={item.name}>{item.name} : {item.symbol}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;
