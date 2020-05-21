import React, {
  Component,
} from 'react';

import Grid from 'Components/Grid';
import Card from 'Components/Card';
import Loader from 'Components/Loader';
import Icon from 'Components/Icon';
import {
  getSampleEvents, getOrderedEventsList,
} from 'Services/firebase';
import Utils, {
  generateEventUrl,
  convertDateRangeToReadable,
} from 'Utils';
import config from 'Config/Config';

import styles from './Home.module.scss';

const {getSearchParams} = Utils;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    const {location: { search }} = this.props
    const searchParams = getSearchParams(search);

    // ToDo: remove testing data
    const self = this;
    setTimeout(() => {
      self.setState({
        isLoading: false,
      });
    }, 1000);

    getOrderedEventsList(config.sortBy.key, [config.filters.spe.key])
      .then((eventList) => {
        self.setState({
          events: eventList,
          isLoading: false,
        });
      });
  }

  handleCardClick(e, url) {
    e.preventDefault();
    const { history } = this.props;
    history.push(url);
  }

  getPageContent() {
    const { events } = this.state;
    if (events.length > 0) {
      const eventsData = events.map((e, i) => {
        const {
          id,
          name: title,
          logo,
          link,
          cover,
          coverBgColor,
          location,
          startDate,
          endDate,
          cfpStartDate,
          cfpEndDate,
        } = e;

        const subTitle = (
          <>
            <Icon type="location" className={styles.icon} />
            <span>{location}</span>
          </>
        );
        const description = (
          <>
            <div>{convertDateRangeToReadable(startDate, endDate)}</div>
            <div>
              CFP:
              {convertDateRangeToReadable(cfpStartDate, cfpEndDate)}
            </div>
          </>
        );
        const url = generateEventUrl(id, title);

        return {
          id,
          title,
          subTitle,
          description,
          logo,
          link,
          url,
          cover,
          coverBgColor,
          onClick: (e) => this.handleCardClick(e, url),
        };
      });
      return (
        <Grid
          items={eventsData.map((event) => (<Card {...event} />))}
        />
      );
    }
    return (
      <span className={styles.fallback}>No Event Found</span>
    );
  }

  render() {
    const { isLoading } = this.state;
    return (
      <main>
        {isLoading && <Loader />}
        {!isLoading && (this.getPageContent())}
      </main>
    );
  }
}

export default Home;
