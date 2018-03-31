import { Layer } from '../../get-layer'

const { Root, MessagePart, MessageTypeModel, Client } = Layer.Core;

class PieChartModel extends MessageTypeModel {
  generateParts(callback) {
    const body = this.initBodyWithMetadata(['title']);

    this.part = new MessagePart({
      mimeType: this.constructor.MIMEType,
      body: JSON.stringify(body),
    });

    const parts = [this.part];
    this.addChildModel(this.fileModel, 'csv', (newParts) => {
      newParts.forEach(p => parts.push(p));

      // Parse the CSV data from our input data
      this._parseCSV(this.fileModel);

      callback(parts);
    });
  }

  parseModelChildParts({ changes, isEdit }) {
    super.parseModelChildParts({ changes, isEdit });

    // Set the fileModel property to point to the csv File Model
    this.fileModel = this.getModelsByRole('csv')[0];

    this._parseCSV(this.fileModel);
  }

  _parseCSV(fileModel) {
    // getSourceBody fetches Rich Content and populates the MessagePart body if its unset
    fileModel.getSourceBody((body) => {
      const oldData = this.data;
      this.data = body.split(/\n/).map(line => line.split(/\s*,\s*/));
      this.data.forEach((row, index) => {
        if (index) this.data[index] = row.map((value, index) => index ? Number(value) : value);
      });
      this._triggerAsync('message-type-model:change', {
        property: 'data',
        newValue: this.data,
        oldValue: oldData
      });
    });
  }

  getOneLineSummary() {
    return 'Its a Pie Chart';
  }
}

PieChartModel.prototype.fileModel = null;
PieChartModel.prototype.title = '';
PieChartModel.prototype.data = null;

// Static property specifies the preferred Message Type View for representing this Model
PieChartModel.messageRenderer = 'vnd-customco-pie-chart-message-type-view';

// Static property defines the MIME Type that will be used when creating new Messages from this Model
PieChartModel.MIMEType = 'application/vnd.customco.pie+json';

Layer.Core.Root.initClass.apply(PieChartModel, [PieChartModel, 'PieChartModel']);
Client.registerMessageTypeModelClass(PieChartModel, 'PieChartModel');

MessagePart.TextualMimeTypes.push('text/csv');

export default PieChartModel;