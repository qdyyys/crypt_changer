import React, { useEffect, useRef, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Main = () => {
  const apiKey =
    "b2aa12b1fff9d5e26e8a832515e5c9519a45e4d313c966328db4070409c2dd0c";
  interface CurrencyData {
    id: string;
    name: string;
    symbol: string;
    [key: string]: any;
  }
  useEffect(() => {
    fetch("https://api.changenow.io/v1/currencies?active=true?fixed=true", {
      method: "GET",
      redirect: "follow",
    })
      .then((res) => res.json())
      .then((data: CurrencyData[]) => {
        const tickers: string[] = [];
        data.forEach((elem, i) => {
          if (i < 100) {
            tickers.push(elem.ticker);
          }
        });
        setDataTickers(tickers);
      });
  }, []);

  interface DataInt {
    send: string;
    sendAmount: number;
    receive: string;
    receiveAmount: string;
    receivedAdress: string;
    id: string;
    status?: string;
  }
  const [activeData, setActiveData] = useState<DataInt>({
    send: "",
    sendAmount: 0,
    receive: "",
    receiveAmount: "",
    receivedAdress: "",
    id: "",
  });

  const [checkMin, setCheckMin] = useState<boolean>(false);
  const [checkResMin, setCheckResMin] = useState<boolean>(false);
  const [validAdress, setValidAdress] = useState(true);

  const [dataTickers, setDataTickers] = useState<string[]>([]);

  const [receivedAdress, setReceivedAdress] = useState<string>("");
  const [userAdress, setUserAdress] = useState("");
  const resetUserAdress = () => setUserAdress("");
  const changedUserAdress = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUserAdress(event.target.value);

  const [receivedCurrency, setReceivedCurrency] = useState<string>("ETH");
  const [sendCurrency, setSendCurrency] = useState<string>("BTC");

  const [visibReceived, setVisibReceived] = useState(false);
  const [visibSend, setVisibSend] = useState(false);

  const currentInputRefSend = useRef<number>(0);
  const [inputSendValue, setInputSendValue] = useState<string>("");
  let handleInputSend = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCheckResMin(false);
    currentInputRefSend.current = Number(value);
    if (/^\d*\.?\d*$/.test(value) && Number(value) < 900000000) {
      setInputSendValue(value);
      fetch(
        `https://api.changenow.io/v1/min-amount/${sendCurrency}_${receivedCurrency}?api_key=${apiKey}`,
        {
          method: "GET",
          redirect: "follow",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const isMin = currentInputRefSend.current < data.minAmount;
          setCheckMin(isMin);

          if (!isMin) {
            fetch(
              `https://api.changenow.io/v1/exchange-amount/${currentInputRefSend.current}/${sendCurrency}_${receivedCurrency}/?api_key=${apiKey}`,
              {
                method: "GET",
                redirect: "follow",
              }
            )
              .then((res) => res.json())
              .then((data) => {
                setInputReceivedValue(data.estimatedAmount);
              });
          }
        });
    }
  };
  const currentInputRefRec = useRef<number>(0);
  const [inputRecivedValue, setInputReceivedValue] = useState<string>("");
  let handleInputReceived = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCheckMin(false);
    currentInputRefRec.current = Number(value);
    if (/^\d*\.?\d*$/.test(value) && Number(value) < 900000000) {
      setInputReceivedValue(value);
      fetch(
        `https://api.changenow.io/v1/min-amount/${receivedCurrency}_${sendCurrency}?api_key=${apiKey}`,
        {
          method: "GET",
          redirect: "follow",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.minAmount);
          const isMin = currentInputRefRec.current < data.minAmount;
          setCheckResMin(isMin);
          if (!isMin) {
            fetch(
              `https://api.changenow.io/v1/exchange-amount/${currentInputRefRec.current}/${receivedCurrency}_${sendCurrency}/?api_key=${apiKey}`,
              {
                method: "GET",
                redirect: "follow",
              }
            )
              .then((res) => res.json())
              .then((data) => {
                setInputSendValue(data.estimatedAmount);
              });
          }
        });
    }
  };

  const handleVisibReceived = () => {
    setVisibReceived(!visibReceived);
    setVisibSend(false);
  };
  const handleVisibSend = () => {
    setVisibSend(!visibSend);
    setVisibReceived(false);
  };
  const handleAdressInput = () => {
    setVisibReceived(false);
    setVisibSend(false);
  };

  function setSendValue(event: React.MouseEvent<HTMLUListElement>) {
    const target = event.target as HTMLElement;
    if (target.tagName === "LI") {
      setSendCurrency(target.innerHTML);
      handleVisibSend();
    }
  }
  function setRecievedValue(event: React.MouseEvent<HTMLUListElement>) {
    const target = event.target as HTMLElement;
    if (target.tagName === "LI") {
      setReceivedCurrency(target.innerHTML);
      handleVisibReceived();
    }
  }

  function swapCoins() {
    const tempCurrency = sendCurrency;
    setSendCurrency(receivedCurrency);
    setReceivedCurrency(tempCurrency);

    const tempInputSend = inputSendValue;
    setInputSendValue(inputRecivedValue);
    setInputReceivedValue(tempInputSend);
  }

  const [trade, setTrade] = useState(false);
  const [activeTrade, setActiveTrade] = useState(false);
  const handleVisibDetails = () => setTrade(false);

  function handleStartTrade() {
    fetch(`https://api.changenow.io/v1/transactions/${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${sendCurrency}`,
        to: `${receivedCurrency}`,
        address: `${userAdress}`,
        amount: `${currentInputRefSend.current}`,
        extraId: "",
        userId: "",
        contactEmail: "",
        refundAddress: "",
        refundExtraId: "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setReceivedAdress(data.payinAddress);
          setTrade(true);
          setActiveTrade(true);
          setValidAdress(true);

          setActiveData({
            send: sendCurrency,
            sendAmount: currentInputRefSend.current,
            receive: receivedCurrency,
            receiveAmount: data.amount,
            receivedAdress: userAdress,
            id: data.id,
          });
          const id = data.id;
          const intervalStatusTrans = setInterval(() => {
            fetch(`https://api.changenow.io/v1/transactions/${id}/${apiKey}`, {
              method: "GET",
              redirect: "follow",
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                setActiveData((prevData) => ({
                  ...prevData,
                  status: data.status,
                }));
                if (data.status === "finished") {
                  clearInterval(intervalStatusTrans);
                  console.log("Finished the transaction");
                  setTrade(false);
                  setActiveTrade(false);
                }
              });
          }, 3000);
        } else {
          setValidAdress(false);
        }
      });
  }
  return (
    <div className="text-white">
      <section>
        <h1 className="text-5xl text-center font-MontserratSemiBold mb-28">
          Моментальный обмен <br />{" "}
          <span className="text-green-400">крипто</span>валют
        </h1>
        <div className="w-full flex  items-center justify-center font-MontserratRegular">
          <div className="flex gap-5 flex-col">
            <div className="flex gap-5 items-center justify-between">
              <div className="flex relative">
                <div className="absolute bottom-full pl-1 pb-2">
                  Отправляете
                </div>
                <input
                  type="text"
                  className={`border border-r-0 rounded-tl-lg rounded-bl-lg outline-none px-4 py-2.5 focus:border-green-400 transition font-MontserratRegular bg-black/50 text-2xl ${
                    visibSend === true ? "border-r-0" : ""
                  } ${
                    checkMin === true
                      ? "focus:border-red-400 border-red-400"
                      : null
                  }`}
                  placeholder="0.0000"
                  value={inputSendValue}
                  onChange={handleInputSend}
                />
                <div
                  className={`relative ${
                    visibSend === false ? "overflow-hidden" : "overflow-visible"
                  }`}
                >
                  <div
                    className={`bg-black/50 rounded-tr-lg rounded-br-lg cursor-pointer font-MontserratSemiBold h-full flex flex-col w-40 z-0 relative items-center justify-center ${
                      visibSend === true
                        ? "border-green-400 border-t border-r rounded-br-none border-l border-b"
                        : "border"
                    }`}
                    onClick={handleVisibSend}
                  >
                    <p>{sendCurrency}</p>
                  </div>

                  <div
                    className={`rounded-br-lg rounded-bl-lg absolute w-full z-10 bg-black/50 top-full overflow-hidden transition ${
                      visibSend === false
                        ? "opacity-0"
                        : "opacity-1 border-green-400 border border-t-0"
                    }`}
                  >
                    <ul
                      className="font-MontserratSemiBold max-h-32 overflow-auto"
                      onClick={setSendValue}
                    >
                      {dataTickers.map((_: any, key) => (
                        <li
                          key={key}
                          className="transition hover:bg-green-600 cursor-pointer px-3 py-1"
                        >
                          {dataTickers[key].toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <FaExchangeAlt
                className="cursor-pointer text-2xl active:scale-90 transition hover:text-green-300"
                onClick={swapCoins}
              />

              <div className="flex relative">
                <div className="absolute bottom-full pl-1 pb-2">Получаете</div>
                <input
                  type="text"
                  className={`border border-r-0 rounded-tl-lg rounded-bl-lg outline-none px-4 py-2.5 focus:border-green-400 transition font-MontserratRegular bg-black/50 text-xl ${
                    visibReceived === true ? "border-r-0" : ""
                  } ${
                    checkResMin ? "focus:border-red-400 border-red-400" : null
                  }`}
                  placeholder="0.0000"
                  value={inputRecivedValue}
                  onChange={handleInputReceived}
                />
                <div
                  className={`relative ${
                    visibReceived === false
                      ? "overflow-hidden"
                      : "overflow-visible"
                  }`}
                >
                  <div
                    className={`bg-black/50 rounded-tr-lg rounded-br-lg cursor-pointer font-MontserratSemiBold h-full flex flex-col justify-center w-40 z-0 relative items-center ${
                      visibReceived === true
                        ? "border-green-400 border-t border-r rounded-br-none border-l border-b"
                        : "border"
                    }`}
                    onClick={handleVisibReceived}
                  >
                    <p>{receivedCurrency}</p>
                  </div>

                  <div
                    className={`rounded-br-lg rounded-bl-lg absolute w-full z-10 bg-black/50 top-full overflow-hidden transition ${
                      visibReceived === false
                        ? "opacity-0"
                        : "opacity-1 border-green-400 border border-t-0"
                    }`}
                  >
                    <ul
                      className="font-MontserratSemiBold max-h-32 overflow-auto"
                      onClick={setRecievedValue}
                    >
                      {dataTickers.map((_: any, key) => (
                        <li
                          key={key}
                          className="transition hover:bg-green-600 cursor-pointer px-3 py-1"
                        >
                          {dataTickers[key].toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full relative" onClick={handleAdressInput}>
              <input
                type="text"
                className={`border rounded-lg outline-none px-4 py-2.5 transition font-MontserratRegular bg-black/50 w-full text-xl ${
                  validAdress ? "focus:border-green-400" : "border-red-400"
                }`}
                placeholder={`Ваш ${receivedCurrency} адресс`}
                value={userAdress}
                onChange={changedUserAdress}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <IoClose
                  className="cursor-pointer hover:text-green-300 text-2xl"
                  onClick={resetUserAdress}
                />
              </div>
            </div>

            <div className="flex justify-between pr-5">
              <div className="max-w-xl">
                <p>
                  Используя сайт и создавая обмен, вы соглашаетесь с{" "}
                  <span className="text-green-400 cursor-pointer">
                    Условиями использования
                  </span>{" "}
                  и
                  <span className="text-green-400 cursor-pointer">
                    {" "}
                    Политикой конфиденциальности
                  </span>
                </p>
              </div>

              <div className="h-full gap-5 flex">
                {activeTrade && (
                  <button
                    className={`bg-slate-500 font-MontserratSemiBold px-5 py-2 rounded-md active:scale-95 transition`}
                    onClick={() => setTrade(true)}
                  >
                    Активный обмен
                  </button>
                )}
                {!activeTrade && (
                  <button
                    className="bg-green-600/90 font-MontserratSemiBold px-5 py-2 rounded-md active:scale-95 transition"
                    onClick={handleStartTrade}
                  >
                    Начать обмен
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed w-full h-screen text-black top-0 left-1/2 -translate-x-1/2 transition duration-500 origin-top ${
            trade ? "scale-100 visible" : "scale-0"
          }`}
        >
          <div
            className={` bg-white/100 max-w-3xl mx-auto text-black py-5 px-5 rounded-xl border-t-4 border-green-500 top-64 relative `}
          >
            <div className="flex items-center mb-5 font-MontserratSemiBold text-2xl justify-around">
              <h2>Детали операции</h2>
              <h2>#{activeData.id}</h2>
              <p>{activeData.status?.toUpperCase()}</p>
            </div>
            <div className="w-full">
              <div className="mb-5">
                <div
                  className={`w-full h-1 mb-8 ${
                    activeData.status != "waiting" &&
                    activeData.status != undefined
                      ? "bg-green-500"
                      : "bg-slate-400"
                  }`}
                >
                  <h3 className="font-MontserratSemiBold text-center py-2">
                    Ожидание депозита: {activeData.sendAmount} {activeData.send}
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="flex justify-between">
                    Внесите средства:{" "}
                    <p className="font-MontserratSemiBold">
                      {activeData.sendAmount} {activeData.send}
                    </p>
                  </span>

                  <span className="flex justify-between flex-wrap">
                    По следеющему адрессу:{" "}
                    <p className="font-MontserratSemiBold">{receivedAdress}</p>
                  </span>
                </div>
              </div>

              <div>
                <div
                  className={`w-full h-1 mb-8 ${
                    activeData.status === "sending"
                      ? "bg-yellow-400"
                      : activeData.status === "finished"
                      ? "bg-green-500"
                      : "bg-slate-400"
                  }`}
                >
                  <h3 className="font-MontserratSemiBold text-center py-2">
                    Отправка средств: {activeData.receive}{" "}
                    {activeData.receiveAmount}
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="flex justify-between">
                    Отправка средств:{" "}
                    <p className="font-MontserratSemiBold">
                      {activeData.receive} {activeData.receiveAmount}
                    </p>
                  </span>

                  <span className="flex justify-between flex-wrap">
                    По вашему адрессу:{" "}
                    <p className="font-MontserratSemiBold">
                      {activeData.receivedAdress}
                    </p>
                  </span>
                </div>
              </div>
            </div>
            <IoClose
              className="absolute right-0 top-0 text-3xl cursor-pointer"
              onClick={handleVisibDetails}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default Main;
