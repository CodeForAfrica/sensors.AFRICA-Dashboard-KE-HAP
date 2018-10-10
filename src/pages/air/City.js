import React from 'react';

import Grid from '@material-ui/core/Grid';

import Navbar from '../../components/Header/Navbar';
import Footer from '../../components/Footer';
import KenyaMap from '../../components/Maps/KenyaMap';
import Neighbourhood from '../../components/CityComponents/Neighbourhood';
import CityHeader from '../../components/CityComponents/Header/CityHeader';
import CallToAction from '../../components/CityComponents/CallToAction';
import HostSensors from '../../components/CityComponents/HostSensors';
import QualityStats from '../../components/CityComponents/SensorsQualityStats/QualityStats';
import PollutionStats from '../../components/CityComponents/PollutionStats';

function City() {
  return (
    <Grid>
      <Navbar />
      <CityHeader />
      <HostSensors />
      <PollutionStats />
      <Neighbourhood />
      <KenyaMap />
      <QualityStats />
      <CallToAction />
      <Footer />
    </Grid>
  );
}

export default City;
