import { Layer } from '../../get-layer'
import './pie-chart-message-type-model';

const registerComponent = Layer.UI.registerComponent;
const MessageViewMixin = Layer.UI.mixins.MessageViewMixin;
const Widths = Layer.UI.Constants.WIDTH;

// Insure that the google charting library is loaded
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://www.gstatic.com/charts/loader.js';
document.head.appendChild(script);

registerComponent('vnd-customco-pie-chart-message-type-view', {
  mixins: [MessageViewMixin],
  template: `
    <div class='vnd-customco-pie' layer-id='pie'></div>
    <layer-message-viewer layer-id='viewer'></layer-message-viewer>
  `,

  // Every UI Component must define an initial display style
  style: `vnd-customco-pie-chart-message-type-view {
    display: block;
    height: 250px;
  }
  vnd-customco-pie-chart-message-type-view .vnd-customco-pie {
    height: 100%;
  }
  vnd-customco-pie-chart-message-type-view > layer-message-viewer {
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 50px !important;
    min-width: 50px !important;
    height: 70px;
  }
  `,

  properties: {

    // Fill out to use available width
    widthType: {
      value: Widths.FULL
    },

    // Wrap this UI in a Titled Message View Container
    messageViewContainerTagName: {
      noGetterFromSetter: true,
      value: 'layer-titled-message-view-container'
    }
  },
  methods: {

    // Get the CSS Class for a title bar icon, used by <layer-titled-message-view-container />
    getIconClass() {
      return 'layer-poll-message-view-icon';
    },

    // Get the Title Text for a title bar, used by <layer-titled-message-view-container />
    getTitle() {
      return this.model.title || 'Pie Chart';
    },

    // Take care of any DOM setup that should be done before any properties are set
    // and setterse are called.
    onCreate() {
      // Disable wrapping this File Message in a Standard Message Container View
      // which would add a title and other text below the file.  Set this before any properties
      // are assigned and any rendering is done
      this.nodes.viewer.messageViewContainerTagName = '';

      // No borders around the sub-message-viewer
      this.nodes.viewer.cardBorderStyle = 'none';
    },

    // Basic setup to be done after properties are all available
    onAfterCreate() {
      // Pass the File Model to the Viewer for it to render
      this.nodes.viewer.model = this.model.fileModel;
    },

    // Note that the change event in the Model's _parseCSV method
    // will automatically cause onRerender to be called. This is also
    // called automatically after onRender completes.
    onRerender() {
      this._renderPieData();
    },

    // The UI does not know its size until this method is called;
    // use this opportunity to rerender the chart
    onAttach() {
      this._renderPieData();
    },

    _renderPieData() {
      /* eslint-disable */

      // Make sure that the google visualization library has loaded
      if (typeof google === 'undefined') {
        google.charts.setOnLoadCallback(this._renderPieData.bind(this));
      }

      // If the visualization library hasn't yet loaded, make sure its loaded, and then wait until its ready
      else if (!google.visualization || !google.visualization.PieChart) {
        if (!this.properties.loadCalled) {
          google.charts.load('current', {'packages':['corechart']});
          this.properties.loadCalled = true;
        }
        setTimeout(this._renderPieData.bind(this), 500);
      }

      // If ready to draw, then instantiate google's chart and pass it the data
      else {
        this._drawPieData();
      }
    },

    // Adapted from https://google-developers.appspot.com/chart/interactive/docs/gallery/piechart
    _drawPieData() {
      if (!this.properties.chart) this.properties.chart = new google.visualization.PieChart(this.nodes.pie);
      const data = google.visualization.arrayToDataTable(this.model.data);
      this.properties.chart.draw(data, {});
    }
  }
});
