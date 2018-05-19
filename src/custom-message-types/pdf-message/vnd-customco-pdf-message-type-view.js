import { Layer } from '../../get-layer'
import './pdf-message-type-model';
import './vnd-customco-pdf-message-type-large-view';
const registerComponent = Layer.UI.registerComponent;
const MessageViewMixin = Layer.UI.mixins.MessageViewMixin;

registerComponent('vnd-customco-pdf-message-type-view', {
  mixins: [MessageViewMixin],
  template: `
    <div class='pdf-message-cover'></div>
    <object layer-id="pdf" type="application/pdf" width="100%" height="100%">
      <a layer-id="fallback">Download PDF</a>
    </object>
  `,
  // Every UI Component must define an initial display style
  style: `vnd-customco-pdf-message-type-view {
    display: block;
    width: 100%;
    position: relative;
  }
  vnd-customco-pdf-message-type-view .pdf-message-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background-color: black;
  }
  /* Dumbass hack to hide the PDF Viewer scrollbar */
  vnd-customco-pdf-message-type-view object {
    width: 105%;
  }
  `,

  properties: {
    height: {
      value: 350,
    },
    messageViewContainerTagName: {
      noGetterFromSetter: true,
      value: 'layer-standard-message-view-container'
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