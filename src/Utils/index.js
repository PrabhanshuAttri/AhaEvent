import React from 'react';
import moment from 'moment-timezone';
import config from 'react-global-configuration';
import {
  Route,
} from 'react-router-dom';

import Routes from './routes';

export const getRedirectUrls = () => {
  const redirectUrls = config.get('redirectUrls');

  const redirectUrlsArray = Object.keys(redirectUrls).map((k) => (
    <Route
      key={k}
      exact
      path={`/${k}`}
      render={() => {
        window.location.assign(redirectUrls[k]);
      }}
    />
  ));
  return redirectUrlsArray;
};

export const showBanner = (location) => {
  const pathsForBanner = ['/'];
  const path = Routes.getPathName(location);
  return !!pathsForBanner.includes(path);
};

export const generateRandomString = () => (Math.random().toString(36).substring(2));

export const convertDateToIso = (d) => {
    const dateFormat = 'YYYY-MM-DDThh:mm:ss+00:00';
    return moment(d).utc().format(dateFormat);
}

export const converDateToReadable = (d, showYear = true, showTime = false, showTimezone = false) => {
  let format = 'MMMM Do';
  if(showYear) {
    format += ' YYYY';
  }

  if(showTime) {
    format += ', h:mm:ss a';
  }
  return moment(d).format(format)
}

export const converDateRangeToReadable = (start, end) => {
  // if years match
  let startStr = converDateToReadable(start)
  let endStr = converDateToReadable(end)
  if(moment(start).format('YYYY') === moment(end).format('YYYY')) {
    startStr = converDateToReadable(start, false)
  }
  return `${startStr} - ${endStr}`
}

export const generateSchema = (content) => {
  const { cfpDate, date, hasCfp, ...rest } = content;

  let payload = {
    ...rest
  }
  let [startDate, endDate] = date;
  startDate = convertDateToIso(startDate);
  endDate = convertDateToIso(endDate);

  if(hasCfp) {
    let [cfpStartDate, cfpEndDate] = cfpDate;
    cfpStartDate = convertDateToIso(cfpStartDate);
    cfpEndDate = convertDateToIso(cfpEndDate);
    payload = {
      ...payload,
      cfpStartDate,
      cfpEndDate
    }
  }

  return ({
    ...payload,
    startDate,
    endDate,
  });
};

export const generateDownloadableFile = (filename, content, type) => {
  const element = document.createElement('a');
  const file = new Blob([content], {
    type,
  });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  // Required for FireFox
  document.body.appendChild(element);
  element.click();
};

export const generateDownloadableJsonFile = (filename, content) => {
  const data = generateSchema(content);
  generateDownloadableFile(filename, JSON.stringify(data, null, 2), 'application/json');
};

export const readableStringToKey = (s, separator = '_') => s.replace(' ', separator).toLowerCase();

export const generateEventUrl = (id, name) => {
  return (`/event/${readableStringToKey(name, '-')}-${id}`)
}

export const getIdFromUrlSlug = (slug, separator = '_') => {
  const tmp = slug.split(separator)
  return tmp.length > 0 ? tmp[tmp.length - 1] : null;
}

export default {
  Routes,
};
