import { Layer } from '../../get-layer'
const { Root, MessagePart, MessageTypeModel, Client } = Layer.Core;

class PDFModel extends MessageTypeModel {
  generateParts(callback) {
    super.generateParts(callback);
    const body = this.initBodyWithMetadata(['title', 'size', 'sourceUrl', 'author', 'signatureEnabledFor']);

    this.part = new MessagePart({
      mimeType: this.constructor.MIMEType,
      body: JSON.stringify(body),
    });

    callback([this.part].concat(this.childParts));
  }

  getTitle() {
    return this.title || ''
  }
  getDescription() {
    return this.author || '';
  }
  getFooter() {
    return Layer.UI.UIUtils.humanFileSize(this.size);
  }

  getOneLineSummary() {
    return this.title || 'PDF File';
  }

  registerAllStates() {
    this.responses.registerState('signature', Layer.Constants.CRDT_TYPES.FIRST_WRITER_WINS);
  }

  signDocument(name) {
    if (this.signatureEnabledFor !== Layer.client.user.id) return;

    const initialValue = this.signature;

    this.responses.addState('signature', name);
    this.responses.setResponseMessageText(this.title + " Signed by " + Layer.client.user.displayName + " as " + name);

    this.signature = name;
    this.trigger('message-type-model:change', {
      property: 'signature',
      newValue: name,
      oldValue: initialValue,
    });
  }

  parseModelResponses() {
    const oldSignature = this.signature;
    const signature = this.responses.getState('signature', this.signatureEnabledFor);

    if (signature !== oldSignature) {
      this.signature = signature;
      this.trigger('message-type-model:change', {
        property: 'terms',
        newValue: signature,
        oldValue: oldSignature,
      });
    }
  }
}

PDFModel.prototype.author = '';
PDFModel.prototype.title = '';

PDFModel.prototype.signature = '';
PDFModel.prototype.signatureEnabledFor = '';

MessageTypeModel.DefineFileBehaviors({
  classDef: PDFModel,
  propertyName: 'source',
  sizeProperty: 'size',
  nameProperty: 'title',
  roleName: 'source',
});

// Static property specifies the preferred Message Type View for representing this Model
PDFModel.messageRenderer = 'vnd-customco-pdf-message-type-view';
PDFModel.largeMessageRenderer = 'vnd-customco-pdf-message-type-large-view';
PDFModel.defaultAction = 'layer-show-large-message';

// Static property defines the MIME Type that will be used when creating new Messages from this Model
PDFModel.MIMEType = 'application/vnd.customco.pdf+json';

Root.initClass.apply(PDFModel, [PDFModel, 'PDFModel']);
Client.registerMessageTypeModelClass(PDFModel, 'PDFModel');

export default PDFModel;