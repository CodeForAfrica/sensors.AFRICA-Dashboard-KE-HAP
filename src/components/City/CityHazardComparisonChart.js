import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from 'victory';
import getRandomColor from '../../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'block',
    maxWidth: '100%',
  },
  chartContainer: {
    textAlign: 'center',
    marginBottom: '3rem',
    width: '100%',
    maxWidth: '100%',
    [theme.breakpoints.up('md')]: {
      width: '59.625rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '79.5rem',
    },
  },
}));

function CityHazardComparisonChart({ data: dataProps, width, xLabel, yLabel }) {
  const classes = useStyles();
  let chartWidth = window.innerWidth;
  let labelAngle = 45;
  if (isWidthUp('md', width)) {
    chartWidth = 59.625 * 16;
    labelAngle = 0;
    if (isWidthUp('lg', width)) {
      chartWidth = 79.5 * 8;
    }
  }
  const chartHeight = chartWidth * (14 / 16) + 40;

  let dataArray = [];
  if (!dataProps) {
    return null;
  }

  if (dataProps[0]?.data) {
    dataArray = dataProps
      .map(({ name, data }) => {
        const average =
          data.reduce((sum, datum) => sum + parseFloat(datum.averagePM), 0) /
          data.length;
        return { name, data: average };
      })
      .sort((a, b) => parseFloat(b.data) - parseFloat(a.data));
  }
  const yMax = dataArray[0].data * 1.2;
  const colors = dataArray.map(() => getRandomColor());
  return (
    <Grid
      container
      color="secondary"
      className={classes.root}
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <div className={classes.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            style={{ parent: { width: '100%' } }}
            height={chartHeight}
            width={chartWidth}
            domainPadding={{ x: 120 }}
            domain={{ y: [0, yMax] }}
          >
            <VictoryAxis
              label={xLabel}
              style={{
                axis: {
                  stroke: 'rgba(0,0,0,0.1)',
                  strokeWidth: 1,
                },
                axisLabel: {
                  padding: 30,
                  fontSize: 18,
                  fontWeight: 'bold',
                },
                grid: {
                  stroke: 'rgba(0,0,0,0.1)',
                  strokeDasharray: '',
                },
                ticks: {
                  // padding: 20
                },
                tickLabels: {
                  fontFamily: '"Montserrat", "sans-serif"',
                  fontWeight: 'bold',
                  angle: labelAngle,
                },
              }}
            />
            <VictoryAxis
              label={yLabel}
              dependentAxis
              style={{
                axis: {
                  stroke: 'rgba(0,0,0,0.1)',
                  strokeWidth: 1,
                },
                axisLabel: {
                  padding: 30,
                  fontSize: 18,
                  fontWeight: 'bold',
                },
                grid: {
                  stroke: 'rgba(0,0,0,0.1)',
                  strokeDasharray: '',
                },
                tickLabels: {
                  fontFamily: '"Montserrat", "sans-serif"',
                  fontWeight: 'bold',
                },
              }}
              fixLabelOverlap
            />

            <VictoryBar
              data={dataArray}
              x="name"
              y="data"
              style={{
                data: {
                  fill: ({ index }) => colors[index],
                },
              }}
            />
          </VictoryChart>
        </div>
      </Grid>
    </Grid>
  );
}

CityHazardComparisonChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
  ]).isRequired,
  width: PropTypes.string.isRequired,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
};

CityHazardComparisonChart.defaultProps = {
  xLabel: 'Cities',
  yLabel: 'Hazard Average',
};

export default withWidth()(CityHazardComparisonChart);
