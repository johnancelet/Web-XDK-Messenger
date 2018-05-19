import { Layer } from '../../get-layer'
const registerComponent = Layer.UI.registerComponent;
const MessageViewMixin = Layer.UI.mixins.MessageViewMixin;

registerComponent('vnd-customco-pdf-message-type-large-view', {
  mixins: [MessageViewMixin],
  template: `
    <object layer-id="pdf" type="application/pdf" width="100%" height="100%">
      <a layer-id="fallback">Download PDF</a>
    </object>
  `,
  // Every UI Component must define an initial display style
  style: `vnd-customco-pdf-message-type-large-view {
    display: block;
    width: 100%;
    height: 100%;
  }
  vnd-customco-pdf-message-type-large-view object {
    height: 100%;
  }
  layer-dialog.vnd-customco-pdf-message-type-large-view .layer-dialog-inner {
    max-width: inherit;
    max-height: inherit;
  }
  `,

  properties: {
  },
  methods: {
    getTitle() {
      return this.model.title;
    },
    onRender() {
      if (this.model.source.url) {
        this.nodes.pdf.data = this.model.source.url;
        this.nodes.fallback.href = this.model.source.url;
      } else {
        this.model.source.fetchStream(this.onRender.bind(this));
      }
    },
  }
});