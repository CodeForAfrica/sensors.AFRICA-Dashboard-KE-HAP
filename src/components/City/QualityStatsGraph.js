import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryAxis,
  VictoryLegend,
} from 'victory';
import getRandomColor from '../../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: '100%',
    display: 'block',
  },

  chartContainer: {
    textAlign: 'center',
    marginBottom: '3rem',
    marginLeft: '3.125rem',
    maxWidth: '100%',
    [theme.breakpoints.up('md')]: {
      width: '59.625rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '79.5rem',
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0.625rem',
    },
  },
}));

function QualityStatsGraph({ data: dataProps, width, xLabel, yLabel }) {
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
  const chartHeight = chartWidth * (6 / 16) + 20;

  let dataArray = [];
  if (!dataProps) {
    return null;
  }
  if (dataProps[0]?.data) {
    dataArray = dataProps;
  } else if (dataProps?.data) {
    dataArray = [dataProps];
  }

  const colors = dataArray.map(() => getRandomColor());
  const legend = dataArray.map((data) => ({ name: data.name }));
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
            <VictoryLegend
              x={40}
              y={chartHeight - 20}
              centerTitle
              orientation="horizontal"
              gutter={20}
              colorScale={colors}
              style={{ title: { fontSize: 15 } }}
              data={legend}
            />
            {dataArray.map((data, i) => (
              <VictoryLine
                data={data.data}
                name="sdsd"
                x="date"
                y="averagePM"
                style={{
                  data: { stroke: colors[i] },
                }}
              />
            ))}
          </VictoryChart>
        </div>
      </Grid>
    </Grid>
  );
}

QualityStatsGraph.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf(PropTypes.shape({})),
  ]).isRequired,
  width: PropTypes.string.isRequired,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
};

QualityStatsGraph.defaultProps = {
  xLabel: 'Date',
  yLabel: 'Quality',
};

export default withWidth()(QualityStatsGraph);
