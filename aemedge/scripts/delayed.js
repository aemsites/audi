// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './aem.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
loadScript('https://cc.cdn.civiccomputing.com/8/cookieControl-8.x.min.js');
loadScript('https://www.googletagmanager.com/gtag/js?id=AW-857940293&l=dataLayer&cx=c');
loadScript('https://www.googletagmanager.com/gtag/js?id=DC-6125760');
loadScript('https://assets.adobedtm.com/6682b218fedf/80421b9e91ca/launch-a413806ac531.min.js');
loadScript('https://analytics.tiktok.com/i18n/pixel/static/main.MTE2NjEzZWI4MA.js', { 'data-id': 'BV00R85D82FVM3BDUCUG' });
loadScript('https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=BV00R85D82FVM3BDUCUG&lib=ttq');
