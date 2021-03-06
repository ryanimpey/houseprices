import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartDataType = {
  date: string;
  price: number;
}

const displayPrice =  new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function tooltipFormatter(value, name, props) {
  return [displayPrice.format(value), "Price",];
}

export default function Chart({data}: {data: Array<ChartDataType>}) {
  return (
    <div style={{ height: "300px", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="date" />
          <Tooltip formatter={tooltipFormatter} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#36B3FF"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
