// @flow
import * as React from 'react';
import ReactDom from 'react-dom';

import layerConfig from './LayerConfiguration.json';

import Layer from '@layerhq/web-xdk';
import '@layerhq/web-xdk/ui/adapters/react';
import '@layerhq/web-xdk/ui/messages/status/layer-status-message-view';
import '@layerhq/web-xdk/ui/messages/receipt/layer-receipt-message-view';
import '@layerhq/web-xdk/ui/messages/choice/layer-choice-message-view';
import '@layerhq/web-xdk/ui/messages/carousel/layer-carousel-message-view';
import '@layerhq/web-xdk/ui/messages/buttons/layer-buttons-message-view';
import '@layerhq/web-xdk/ui/messages/file/layer-file-message-view';
import '@layerhq/web-xdk/ui/messages/location/layer-location-message-view';
import '@layerhq/web-xdk/ui/messages/product/layer-product-message-view';
import '@layerhq/web-xdk/ui/messages/feedback/layer-feedback-message-view';
import '@layerhq/web-xdk/ui/components/layer-send-button';
import '@layerhq/web-xdk/ui/components/layer-file-upload-button';
import '@layerhq/web-xdk/ui/components/layer-notifier';
import '@layerhq/web-xdk/ui/components/layer-conversation-list';
import '@layerhq/web-xdk/ui/components/layer-identity-list';


/**
 * VERSIONING:
 *
 * For backwards compatability for `WebXDK 1.0.0-pre` apps, include the following:
 */
// import '@layerhq/web-xdk/core/models/message-type-response-summary/message-type-response-summmary-v1';

/**
 * PERSISTENCE:
 *
 * Uncomment this line and change `isPersitenceEnabled` to `true` below to enable indexedDB
 * data caching. Note that user must log in with `isTrustedDevice` as `true` as well for
 * indexedDB to be used.
 */
// import '@layerhq/web-xdk/core/db-manager';

/**
 *  THEMING:
 *
 * Pick from two themes provided:
 *
 * * The standard layer-basic-blue.css theme is the default
 * * Comment out layer-basic-blue an uncomment the two layer-groups files to enable the layer-groups theme
 */
// import '@layerhq/web-xdk/themes/layer-groups-customizations';
// import '@layerhq/web-xdk/themes/layer-groups.css'
import '@layerhq/web-xdk/themes/layer-basic-blue.css'



/**
 * INITIALIZATION:
 *
 * Initialize the Layer Client and Libraries.
 *
 * * Pass in your application ID.
 * * Note: A `challenge` event listener is required, but is provided elsewhere
 * * `isPersistenceEnabled` can be left out of typical apps. Most web applications should
 *   treat persisting of data as a security hazard. An example of an exception to this
 *   is a Cordova app installed on a phone.
 *
 * *Note*: The `google_maps_key` is not (by default) in your LayerConfiguration.json file and can
 * be added there if using Location Messages (or may be acquired through other configurations)
 */
const layerClient = Layer.init({
  appId: layerConfig[0].app_id,
  googleMapsKey: layerConfig[0].google_maps_key,
  isPersistenceEnabled: false,
});

const LayerReactComponents = Layer.UI.adapters.react(React, ReactDom);

export { LayerReactComponents };
export { Layer };
export { layerClient }
export default { Layer, LayerReactComponents, layerClient };
