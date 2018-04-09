import { Layer } from '../../get-layer'
const { Root, MessagePart, MessageTypeModel, Client } = Layer.Core;

class OpinionReactModel extends MessageTypeModel {
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

OpinionReactModel.prototype.comment = '';
OpinionReactModel.prototype.rating = 0;
OpinionReactModel.prototype.description = '';
OpinionReactModel.prototype.author = '';

// Static property defines the MIME Type for this model
OpinionReactModel.MIMEType = 'application/vnd.customco.opinion+json';

// Static property specifies the preferred Message Type View for representing this Model
OpinionReactModel.messageRenderer = 'vnd-customco-opinion-react-message-type-view';

Root.initClass.apply(OpinionReactModel, [OpinionReactModel, 'OpinionReactModel']);
Client.registerMessageTypeModelClass(OpinionReactModel, 'OpinionReactModel');

export default OpinionReactModel;