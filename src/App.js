
import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]); //배열로 받음
  const [exchangeRate, setExchangeRate] = useState({ date: "", krw: 0 }); //환율
  const [alphabet, setAlphabet] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [input1, setInput1] = useState(0);
  const [input2, setInput2] = useState(0);
  const [disable, setDisable] = useState(false);
  

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

  useEffect(() => {
    // 알파벳에 해당하는 코인 필터링
    if (alphabet) {
      const filtered = coins.filter(coin => coin.name.startsWith(alphabet));
      setFilteredCoins(filtered);
    } else {
      setFilteredCoins([]);
    }
  }, [alphabet, coins]);

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    setInput1("");
    setInput2("");
    setAlphabet("");
  };

  const handleAlphabetClick = () => {
    setSelectedCoin(null); // 알파벳을 누르면 선택된 코인 초기화
  };

  const input1Onchange = (event) => {
    const input1 = event.target.value;
    const coinPrice = selectedCoin.quotes.USD.price;
    const toWon = input1 * coinPrice * exchangeRate.krw;
    setInput1(input1);
    setInput2(toWon.toFixed(2));
  }

  const input2Onchange = (event) => {
    const input2 = event.target.value;
    const coinPrice = selectedCoin.quotes.USD.price;
    const toCoin = (input2 / exchangeRate.krw) / coinPrice;
    setInput2(input2);
    setInput1(toCoin.toFixed(2));
  }

  const flipClick = () => {
    reset();
    setDisable((current => !current));
  }

  const reset = () => {
    setInput1(0);
    setInput2(0);
  }

  return (
    <div className="coin-converter-container">
      <h1>Coin converter</h1>
      {loading ? <strong><h1>Loading...</h1></strong> : null}

      <div className="exchange-section">
        <h1>환율</h1>
        <div>기준 날짜 {exchangeRate.date}</div>
        <div>{exchangeRate.krw}</div>
        <h1>코인</h1>
      </div>

      <div className="alphabet-buttons">
        {/* 알파벳 버튼들 */}
        {Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index)).map(item => (
          <button key={item} onClick={() => { setAlphabet(item); handleAlphabetClick(); }}>
            {item}
          </button>
        ))}

        {selectedCoin && (
          // 선택된 코인의 이름과 가격 표시
          <div className="selected-coin-info">
            <h2>{selectedCoin.name}</h2>
            <p>가격: ${selectedCoin.quotes.USD.price.toFixed(10)}</p>
          </div>
        )}

        {!selectedCoin && (
          // 선택된 알파벳에 해당하는 코인 목록
          <ul className="coin-list">
            {filteredCoins.map(coin => (
              <li key={coin.id} onClick={() => handleCoinClick(coin)}>
                {coin.name}
              </li>
            ))}
          </ul>
        )}

        {selectedCoin && (
          // 입력창 2개
          <div className="input-section">
            <div>
              <input
                type="number"
                placeholder="코인"
                value={input1}
                onChange={input1Onchange}
                disabled={disable}
              />
            </div>
            
            <div>
              <input
                type="number"
                placeholder="원"
                value={input2}
                onChange={input2Onchange}
                disabled={!disable}
              />
            </div>
            
            <button onClick={flipClick}>flip</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
