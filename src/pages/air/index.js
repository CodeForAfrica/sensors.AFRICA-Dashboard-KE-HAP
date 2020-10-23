import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import DocumentHead from '../../components/DocumentHead';
import About from './About';
import Data from './Data';
import HowSensorsWork from './HowSensorsWork';
import City from './City';
import JoinNetwork from './JoinNetwork';
import Navbar from '../../components/Header/Navbar';
import AirHeader from '../../components/Air/AirHeader';
import Footer from '../../components/Footer';
import PartnerLogos from '../../components/PartnerLogos';
import Issues from '../../components/Air/Issues';
import HealthAndClimateImpacts from './HealthAndClimateImpacts';
import AfricaMap from '../../components/AfricaMap';
import Country from './Country';

const CITY_PATHNAME = '/air/city';

const COUNTRIES_OPTIONS = [
  { value: 'nairobi', label: 'Kenya' },
  { value: 'lagos', label: 'Nigeria' },
  { value: 'dar-es-salaam', label: 'Tanzania' },
  { value: 'durban', label: 'South Africa' },
  { value: 'kampala', label: 'Uganda' }
];

class AirHome extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(city) {
    const path = `${CITY_PATHNAME}/${city.value}`;
    const { history } = this.props;
    history.push(path);
  }

  render() {
    const { url } = this.props;
    return (
      <React.Fragment>
        <DocumentHead url={url} />
        <Navbar />
        <AirHeader
          handleSearch={this.handleSearch}
          placeholder="Search for country ..."
          options={COUNTRIES_OPTIONS}
        />
        <AfricaMap />
        <Issues />
        <PartnerLogos />
        <Footer />
      </React.Fragment>
    );
  }
}

AirHome.propTypes = {
  history: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired
};

export {
  About,
  HowSensorsWork,
  City,
  Country,
  JoinNetwork,
  Data,
  HealthAndClimateImpacts
};
export default withRouter(AirHome);
