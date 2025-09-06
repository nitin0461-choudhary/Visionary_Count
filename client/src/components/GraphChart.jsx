// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";

// /**
//  * props:
//  *  frames: number[]
//  *  series: { [className: string]: number[] }
//  */
// export default function GraphChart({ frames = [], series = {} }) {
//   const rows = frames.map((frame, i) => {
//     const row = { frame };
//     for (const [cls, arr] of Object.entries(series)) row[cls] = arr[i] ?? 0;
//     return row;
//   });
//   const keys = Object.keys(series);

//   return (
//     <div style={{ height: 420 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={rows} margin={{ top: 12, right: 24, left: 0, bottom: 8 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="frame" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           {keys.map((k) => <Line key={k} type="monotone" dataKey={k} dot={false} />)}
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
// client/src/components/GraphChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraphChart = ({ data, title = "Object Counts Over Time" }) => {
  if (!data || !data.length) {
    return (
      <div className="chart-container">
        <p>No data available for chart</p>
      </div>
    );
  }

  // Transform data for recharts format
  const chartData = data.map(item => ({
    frame: item.frame,
    ...item.counts
  }));

  // Get all unique classes for lines
  const classes = [...new Set(
    data.flatMap(item => Object.keys(item.counts))
  )];

  // Colors for different object classes
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', 
    '#8dd1e1', '#d084d0', '#87ceeb', '#ffa500'
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="frame" 
            stroke="#ccc"
            label={{ value: 'Frame', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            stroke="#ccc"
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#2a2a2a', 
              border: '1px solid #555',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          {classes.map((className, index) => (
            <Line
              key={className}
              type="monotone"
              dataKey={className}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={className.charAt(0).toUpperCase() + className.slice(1)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphChart;
