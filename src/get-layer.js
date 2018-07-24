// @flow
import * as React from 'react';
import ReactDom from 'react-dom';

import layerConfig from './LayerConfiguration.json';

import Layer from '@layerhq/web-xdk-prerelease';

import '@layerhq/web-xdk-prerelease/ui/adapters/react';
import '@layerhq/web-xdk-prerelease/ui/messages/receipt/layer-receipt-message-view';
import '@layerhq/web-xdk-prerelease/ui/messages/choice/layer-choice-message-view';
import '@layerhq/web-xdk-prerelease/ui/messages/carousel/layer-carousel-message-view';
import '@layerhq/web-xdk-prerelease/ui/messages/file/layer-file-message-view';
import '@layerhq/web-xdk-prerelease/ui/messages/location/layer-location-message-view';
import '@layerhq/web-xdk-prerelease/ui/messages/product/layer-product-message-view';
import '@layerhq/web-xdk-prerelease/ui/messages/feedback/layer-feedback-message-view';
import '@layerhq/web-xdk-prerelease/ui/messages/audio/layer-audio-message-view';
import '@layerhq/web-xdk-prerelease/ui/messages/video/layer-video-message-view';
import '@layerhq/web-xdk-prerelease/ui/components/layer-send-button';
import '@layerhq/web-xdk-prerelease/ui/components/layer-file-upload-button';
import '@layerhq/web-xdk-prerelease/ui/components/layer-notifier';
import '@layerhq/web-xdk-prerelease/ui/components/layer-conversation-list';
import '@layerhq/web-xdk-prerelease/ui/components/layer-identity-list';

/**
 * VERSIONING:
 *
 * For backwards compatability for `WebXDK 1.0.0-pre` apps, include the following:
 */
// import '@layerhq/web-xdk-prerelease/core/models/message-type-response-summary/message-type-response-summmary-v1';

/**
 * PERSISTENCE:
 *
 * Uncomment this line and change `isPersitenceEnabled` to `true` below to enable indexedDB
 * data caching. Note that user must log in with `isTrustedDevice` as `true` as well for
 * indexedDB to be used.
 */
// import '@layerhq/web-xdk-prerelease/core/db-manager';

/**
 *  THEMING:
 *
 * Pick from two themes provided:
 *
 * * The standard layer-basic-blue.css theme is the default
 * * Comment out layer-basic-blue an uncomment the two layer-groups files to enable the layer-groups theme
 */
// import '@layerhq/web-xdk-prerelease/themes/layer-groups-customizations';
// import '@layerhq/web-xdk-prerelease/themes/layer-groups.css'
import '@layerhq/web-xdk-prerelease/themes/layer-basic-blue.css'



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
  //logLevel: Layer.Constants.LOG.INFO,
  mixins: {

  }
});

const LayerReactComponents = Layer.UI.adapters.react(React, ReactDom);

export { LayerReactComponents };
export { Layer };
export { layerClient }
export default { Layer, LayerReactComponents, layerClient };

/*
layerClient.on('analytics', (evt) => {
  switch (evt.type) {
    case 'message-viewed':
      console.log(`Message ${evt.message.id} and its ${evt.modelName} were seen in the ${evt.inBackground ? 'background': 'foreground'} and was${evt.wasUnread ? '' : ' already '}marked as read`);
      break;
    case 'message-selected':
      console.log(`Message ${evt.message.id} clicked and its ${evt.modelName} triggered ${evt.actionEvent}`);
      break;
    case 'carousel-scrolled':
      console.log(`Carousel Message ${evt.message.id} now showing ${evt.newItems.map(item => item.model.getModelName() + ': ' + item.part.id).join(', ')}`);
      break;
  }
});
*/

// Define the component:
Layer.UI.registerComponent('tag-name', {});

// Register the component as a message handler:
Layer.UI.handlers.message.register({
    tagName: 'tag-name',
     handlesMessage: function(message, container) {
       return message.filterParts(part => part.mimeType === "application/tag-name").length;
    }
});