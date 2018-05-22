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
  /* Prevent clicks from interacting with the PDF document in the Standard Message View */
   vnd-customco-pdf-message-type-view .pdf-message-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.02;
    background-color: black;
  }
  /* Dumbass hack to hide the PDF Viewer scrollbar */
  vnd-customco-pdf-message-type-view object {
    width: 105%;
  }
  layer-message-viewer.vnd-customco-pdf-message-type-view .pdf-checkmark {
    opacity: 0.1;
    margin-right: 20px;
  }
  layer-message-viewer.vnd-customco-pdf-message-type-view .pdf-checkmark.pdf-signed {
    opacity: 1.0;
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
    onAfterCreate() {
      this.nodes.checkmark = document.createElement('div');
      this.nodes.checkmark.innerHTML = '✅';
      this.nodes.checkmark.classList.add('pdf-checkmark');

      // Pass the dom node to the Standard Message Container's customControls property
      this.parentComponent.customControls = this.nodes.checkmark;
    },
    onRender() {
      this.model.source.fetchStream((url) => {
        this.nodes.pdf.data = url;
        this.nodes.fallback.href = url;
      });
    },
    onRerender() {
      this.nodes.checkmark.classList.toggle('pdf-signed', Boolean(this.model.signature));
    },
  }
});