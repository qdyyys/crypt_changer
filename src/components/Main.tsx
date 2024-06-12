import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import CryptoJS from "crypto-js";

const Main = () => {
  const apiKey = "1d0cmvA5wNqO86TRexQ6AIa9Gxaq4qvJOBKD0iVX";
  const apiSecret = "pJRF3YAUcsqqJ8rwvoZOzCHXzdKPUGJW8WAumkQU";

  function showListOfCrypt() {
    const data = JSON.stringify({}); // Ваши данные запроса в формате JSON
    const sign = CryptoJS.HmacSHA256(data, apiSecret).toString(
      CryptoJS.enc.Hex
    );

    fetch("https://ff.io/api/v2/ccies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-API-KEY": apiKey,
        "X-API-SIGN": sign,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }

  showListOfCrypt();

  const [receivedCurrency, setReceivedCurrency] = useState("ETH");
  const [sendCurrency, setSendCurrency] = useState("BTC");

  const [visibReceived, setVisibReceived] = useState(false);
  const [visibSend, setVisibSend] = useState(false);

  const [inputSendValue, setInputSendValue] = useState<string>("");
  let handleInputSend = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputSendValue(event.target.value);

  const [inputRecivedValue, setInputReceivedValue] = useState<string>("");
  let handleInputReceived = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputReceivedValue(event.target.value);

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
                <div className="absolute bottom-full pl-1 pb-2">Получаете</div>
                <input
                  type="text"
                  className={`border border-r-0 rounded-tl-lg rounded-bl-lg outline-none px-4 py-2.5 focus:border-green-400 transition font-MontserratRegular bg-black/50 text-2xl ${
                    visibSend === true ? "border-r-0" : ""
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
                    className={`bg-black/50 rounded-tr-lg rounded-br-lg cursor-pointer font-MontserratSemiBold h-full flex flex-col w-32 z-0 relative items-center justify-center ${
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
                      className="font-MontserratSemiBold"
                      onClick={setSendValue}
                    >
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        BTC
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        ETH
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        CNS
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        BNB
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        CRB
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        USDT
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <FaExchangeAlt className="cursor-pointer text-2xl active:scale-90 transition hover:text-green-300" />

              <div className="flex relative">
                <div className="absolute bottom-full pl-1 pb-2">Получаете</div>
                <input
                  type="text"
                  className={`border border-r-0 rounded-tl-lg rounded-bl-lg outline-none px-4 py-2.5 focus:border-green-400 transition font-MontserratRegular bg-black/50 text-xl ${
                    visibReceived === true ? "border-r-0" : ""
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
                    className={`bg-black/50 rounded-tr-lg rounded-br-lg cursor-pointer font-MontserratSemiBold h-full flex flex-col justify-center w-32 z-0 relative items-center ${
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
                      className="font-MontserratSemiBold"
                      onClick={setRecievedValue}
                    >
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        BTC
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        ETH
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        CNS
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        BNB
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        CRB
                      </li>
                      <li className="transition hover:bg-green-600 cursor-pointer px-3 py-1">
                        USDT
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full relative" onClick={handleAdressInput}>
              <input
                type="text"
                className="border rounded-lg outline-none px-4 py-2.5 focus:border-green-400 transition font-MontserratRegular bg-black/50 w-full text-xl"
                placeholder={`Ваш ${receivedCurrency} адресс`}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <IoClose className="cursor-pointer hover:text-green-300" />
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

              <button className="bg-green-600/90 font-MontserratSemiBold px-5 py-2 rounded-md active:scale-95 transition">
                Начать обмен
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Main;
