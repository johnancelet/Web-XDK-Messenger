import { Layer } from '../../get-layer'
const { Root, MessagePart, MessageTypeModel, Client } = Layer.Core;

class OpinionModel extends MessageTypeModel {
  generateParts(callback) {
    const body = this.initBodyWithMetadata(['comment', 'rating', 'description', 'author']);

    // Create the MessagePart using the static MIMEType property defined below
    this.part = new MessagePart({
      mimeType: this.constructor.MIMEType,
      body: JSON.stringify(body),
    });

    // Provide the new part via a callback
    callback([this.part]);
  }

  getTitle() {return 'Opinion about:'; }
  getDescription() { return this.description; }
  getFooter() { return this.author; }

  getOneLineSummary() {
    return `Opinion on ${this.author}'s Message`;
  }
}

OpinionModel.prototype.comment = '';
OpinionModel.prototype.rating = 0;
OpinionModel.prototype.description = '';
OpinionModel.prototype.author = '';

// Static property defines the MIME Type for this model
OpinionModel.MIMEType = 'application/vnd.customco.opinion+json';

// Static property specifies the preferred Message Type View for representing this Model
OpinionModel.messageRenderer = 'vnd-customco-opinion-message-type-view';

Root.initClass.apply(OpinionModel, [OpinionModel, 'OpinionModel']);
Client.registerMessageTypeModelClass(OpinionModel, 'OpinionModel');

export default OpinionModel;