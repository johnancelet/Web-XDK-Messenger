import Layer from '@layerhq/web-xdk';
import './pdf-message-type-model';
const registerComponent = Layer.UI.registerComponent;
const MessageViewMixin = Layer.UI.mixins.MessageViewMixin;
const Widths = Layer.UI.Constants.WIDTH;

registerComponent('vnd-customco-pdf-message-type-view', {
  mixins: [MessageViewMixin],
  template: `<object layer-id="pdf" type="application/pdf" width="100%" height="100%">
    <a layer-id="fallback">Download PDF</a>
  </object>`,

  // Every UI Component must define an initial display style
  style: `vnd-customco-pdf-message-type-view {
    display: block;
    width: 100%;
    height: 400px;
  }
  layer-message-viewer.vnd-customco-pdf-message-type-view {
    max-width: none !important;
    width: 95% !important;
    margin-right: 5px;
  }
  `,

  properties: {
    widthType: {
      value: Widths.FULL
    },
    messageViewContainerTagName: {
      noGetterFromSetter: true,
      value: 'layer-standard-message-view-container'
    },

    hideMessageItemRightAndLeftContent: {
      value: true,
    },
  },
  methods: {
    onRender() {
      if (this.model.source.url) {
        this.nodes.pdf.data = this.model.source.url;
        this.nodes.fallback.href = this.model.source.url;
      } else {
        this.model.source.fetchStream(this.onRender.bind(this));
      }
    },
    onRerender() {
    },
  }
});