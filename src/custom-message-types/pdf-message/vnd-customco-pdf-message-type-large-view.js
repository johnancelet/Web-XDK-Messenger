import { Layer } from '../../get-layer'
const registerComponent = Layer.UI.registerComponent;
const MessageViewMixin = Layer.UI.mixins.MessageViewMixin;

registerComponent('vnd-customco-pdf-message-type-large-view', {
  mixins: [MessageViewMixin],
  template: `
    <object layer-id="pdf" type="application/pdf" width="100%" height="100%">
      <a layer-id="fallback">Download PDF</a>
    </object>
    <div class="pdf-review-panel">
      <div class="pdf-review-query">I have read this document and am signing this by typing in my name here: <input layer-id="name" type="text"/> <layer-action-button style="display: inline-block" layer-id="button" text="send"></layer-action-button></div>
      <div class="pdf-review-summary" layer-id="summary"></div>
      <div class="pdf-review-disabled">Signature not authorized for you</div>
    </div>
  `,
  // Every UI Component must define an initial display style
  style: `
    vnd-customco-pdf-message-type-large-view {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }
    vnd-customco-pdf-message-type-large-view object {
      flex-grow: 1;
    }
    layer-dialog.vnd-customco-pdf-message-type-large-view .layer-dialog-inner {
      max-width: inherit;
      max-height: inherit;
    }
    vnd-customco-pdf-message-type-large-view .pdf-review-panel {
      margin: 10px 20px;
      text-align: center;
    }
    vnd-customco-pdf-message-type-large-view.is-signed .pdf-review-query,
    vnd-customco-pdf-message-type-large-view.signature-disabled .pdf-review-query {
      display: none;
    }
    vnd-customco-pdf-message-type-large-view:not(.is-signed) .pdf-review-summary {
      display: none;
    }
    vnd-customco-pdf-message-type-large-view:not(.signature-disabled) .pdf-review-disabled {
      display: none;
    }
    vnd-customco-pdf-message-type-large-view .pdf-review-summary {
      font-weight: bold;
    }
  `,

  properties: {
  },
  methods: {
    getTitle() {
      return this.model.title;
    },
    onCreate() {
      this.nodes.button.addEventListener('click', this.handleSendEvent.bind(this));
    },
    onRender() {
      if (this.model.source.url) {
        this.nodes.pdf.data = this.model.source.url;
        this.nodes.fallback.href = this.model.source.url;
      } else {
        this.model.source.fetchStream(this.onRender.bind(this));
      }
      if (this.model.signatureEnabledFor !== Layer.client.user.id) {
        this.classList.add('signature-disabled');
      }
    },
    onRerender() {
      this.classList.toggle('is-signed', Boolean(this.model.signature));
      this.nodes.name.value = this.model.signature;
      if (this.model.signature) {
        this.nodes.summary.innerHTML = 'Signed by ' + Layer.client.getIdentity(this.model.signatureEnabledFor).displayName + ' as ' + this.model.signature;
      }
    },
    handleSendEvent(evt) {
      if (this.nodes.name.value) {
        this.model.signDocument(this.nodes.name.value);
        this.trigger('layer-container-done');
      }
    }
  }
});