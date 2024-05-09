import React, { useState } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const W_DailyChart = () => {
  const [tooltip, setTooltip] = useState({ visible: false, xValue: '', yValue: '', x: 0, y: 0 });
  const screenWidth = Dimensions.get('window').width;

  // Time formatting function remains unchanged
  const getTimeForIndex = index => {
    const hour = index % 24;
    const amPm = hour < 12 ? 'ص' : 'م';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${amPm}`;
  };

  // Data in watts (kWh values are multiplied by 1,000)
  const chartData = {
    labels: ['12 AM', "", "", "", '4 AM', "", "", "", '8 AM', "", "", "", '12 PM'],
    datasets: [{
      data: [5, 4.5, 4, 5.5, 5, 3, 2, 1.5, 0.5, 1, 2.5, 1.5, 1.5].map(kWh => kWh * 1000) // Convert kWh to watts
    }]
  };

  const handleDataPointClick = (data, index) => {
    const value = chartData.datasets[0].data[index]; // Now directly using watts
    let xPos = data.x - 60;
    let yPos = data.y - 70;

    if (xPos < 0) {
      xPos = 10;
    } else if (xPos + 120 > screenWidth) {
      xPos = screenWidth - 130;
    }

    setTooltip({
      visible: true,
      xValue: getTimeForIndex(index),
      yValue: value.toString(), // Displaying in watts, no need to fix to 2 decimal places
      x: xPos,
      y: yPos
    });
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={280}
        yAxisSuffix=" واط" // Displaying yAxis values in watts
        chartConfig={styles.chartConfig}
        bezier
        onDataPointClick={({ index, value, x, y }) => handleDataPointClick({ value, x, y }, index)}
        decorator={() => {
          if (tooltip.visible) {
            return (
              <View style={styles.tooltipStyle(tooltip.x, tooltip.y)}>
                <Text style={styles.tooltipText}>{`الوقت: ${tooltip.xValue}`}</Text>
                <Text style={styles.tooltipText}>{`الاستهلاك: ${tooltip.yValue} واط`}</Text> 
              </View>
            );
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chartConfig: {
    backgroundColor: '#f2f2f2',
    backgroundGradientFrom: '#f2f2f2',
    backgroundGradientTo: '#f2f2f2',
    fillShadowGradient: '#82c8ff', 
    fillShadowGradientOpacity: 0.8,
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(0, 163, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#00A3FF"
    },
    style: { borderRadius: 16 },
  },
  tooltipStyle: (x, y) => ({
    position: 'absolute',
    left: x,
    top: y,
    backgroundColor: '#143638',
    padding: 5,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'flex-end',
  }),
  tooltipText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'right',
  }
});

export default W_DailyChart;