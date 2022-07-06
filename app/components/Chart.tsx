import React from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

type ChartDataType = {
  date: string;
  price: number;
};

const displayPrice = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function tooltipFormatter(value, name, props) {
  return [displayPrice.format(value), "Price"];
}

export default function Chart({
  data,
  small = false,
}: {
  data: Array<ChartDataType>;
  small: boolean;
}) {
  return (
    <div style={{ width: "100%", height: small ? "150px" : "300px" }}>
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
