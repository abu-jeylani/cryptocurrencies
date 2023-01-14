import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

import axios from "axios";
import { useEffect } from "react";
import { Crypto } from "../../types/index";
import moment from "moment";
import PriceDisplay from "../../components/price-display";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CryptoSummary: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[] | null>();
  const [selected, setSelected] = useState<Crypto | null>();
  const [range, setRange] = useState(30);
  const [data, setData] = useState<ChartData<"line">>();
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  });

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
    axios
      .get(url)
      .then((res) => {
        setCryptos(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const fetchUrl = `https://api.coingecko.com/api/v3/coins/${
      selected?.id
    }/market_chart?vs_currency=usd&days=${range === 1 ? range : range - 1}&${
      range === 1 ? "interval=hourly" : "interval=daily"
    }`;
    axios
      .get(fetchUrl)
      .then((res) => {
        console.log("getting crypto prices..");
        console.log(res.data);
        setData({
          labels: res.data.prices.map((price: number) => {
            return moment
              .unix(price[0] / 1000)
              .format(range === 1 ? "HH:MM" : "MM-DD");
          }),
          datasets: [
            {
              label: selected.id,
              data: res.data.prices.map((price: number) => {
                return price[1];
              }),
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        });
        setOptions({
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: `Price over last ${range} day(s) `,
            },
          },
        });
      })
      .catch((err) => console.log("error: ", err));
  }, [selected, range]);

  return (
    <>
      <div className="App">
        <h1>Crypto</h1>
        <select
          onChange={(e) => {
            const c = cryptos.find((x) => x.id === e.target.value);
            setSelected(c);
          }}
          defaultValue="default"
        >
          <option value="default">Choose an option</option>
          {cryptos &&
            cryptos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <select
          onChange={(e) => setRange(parseInt(e.target.value))}
          defaultValue="30"
        >
          <option value="30">30</option>
          <option value="7">7</option>
          <option value="1">1</option>
        </select>
      </div>
      {selected && <PriceDisplay crypto={selected} />}
      {data && (
        <div style={{ width: 600 }}>
          <Line data={data} options={options} />
        </div>
      )}
    </>
  );
};

export default CryptoSummary;
