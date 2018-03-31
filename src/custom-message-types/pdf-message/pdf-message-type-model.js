import { Layer } from '../../get-layer'
const { Root, MessagePart, MessageTypeModel, Client } = Layer.Core;

class PDFModel extends MessageTypeModel {
  generateParts(callback) {
    const body = this.initBodyWithMetadata(['title', 'author']);

    this.part = new MessagePart({
      mimeType: this.constructor.MIMEType,
      body: JSON.stringify(body),
    });

    // Replace the File/Blob source property with a proper MessagePart property.
    this.source = new MessagePart(this.source);

    // Setup this Message Part to be a Child Message Part within the Message Part Tree
    this.addChildPart(this.source, 'source');

    callback([this.part, this.source]);
  }

  parseModelChildParts({ changes, isEdit }) {
    super.parseModelChildParts({ changes, isEdit });

    // Setup this.source to refer to the MessagePart whose role=source
    this.source = this.childParts.filter(part => part.role === 'source')[0];
  }

  getTitle() { return this.title || '' }
  getDescription() { return ''; }
  getFooter() { return this.author || ''; }

  getOneLineSummary() {
    return this.title || 'PDF File';
  }
}

PDFModel.prototype.source = null;
PDFModel.prototype.author = '';
PDFModel.prototype.title = '';

// Static property specifies the preferred Message Type View for representing this Model
PDFModel.messageRenderer = 'vnd-customco-pdf-message-type-view';

// Static property defines the MIME Type that will be used when creating new Messages from this Model
PDFModel.MIMEType = 'application/vnd.customco.pdf+json';

PDFModel.defaultAction = 'vnd-open-pdf';

Root.initClass.apply(PDFModel, [PDFModel, 'PDFModel']);
Client.registerMessageTypeModelClass(PDFModel, 'PDFModel');

export default PDFModel;