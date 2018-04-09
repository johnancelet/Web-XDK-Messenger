function getMenuOptions() { return []; }
function customFileSelector() {}
export { getMenuOptions, customFileSelector };

/* UNCOMMENT THIS TO ENABLE CUSTOM MESSAGE TYPES
import { Layer } from '../get-layer';
import './opinion-message/vnd-customco-opinion-message-type-view';
import './opinion-react-message/vnd-customco-opinion-react-message-type-view';
import './pdf-message/vnd-customco-pdf-message-type-view';
import './pie-chart-message/vnd-customco-pie-chart-message-type-view';

function getMenuOptions(conversation: any) {
  return [
    {
      text: 'Create Custom Opinion Message (web only)',
      method: function() {
        const OpinionModel = Layer.Core.Client.getMessageTypeModelClass('OpinionModel');
        const model = new OpinionModel({
          comment: 'I love this stuff',
          rating: 4,
          description: 'Mary had a little lamb, little lamb, little lamb.  Mary had a little lamb, who made a tasty stew!',
          author: 'Frodo the Dodo',
        });
        model.send({ conversation });
      },
    },
    {
      text: 'Create Custom React Opinion Message (web only)',
      method: function() {
        const OpinionModel = Layer.Core.Client.getMessageTypeModelClass('OpinionReactModel');
        const model = new OpinionModel({
          comment: 'I love this stuff',
          rating: 4,
          description: 'Mary had a little lamb, little lamb, little lamb.  Mary had a little lamb, who made a tasty stew!',
          author: 'Frodo the Dodo',
        });
        model.send({ conversation });
      },
    },
    {
      text: 'Create Custom Pie Chart Message (web only)',
      method: function() {
        const PieChartModel = Layer.Core.Client.getMessageTypeModelClass('PieChartModel');
        const FileModel = Layer.Core.Client.getMessageTypeModelClass('FileModel');
        const model = new PieChartModel({
          title: 'Employee Salaries',
          fileModel: new FileModel({
            mimeType: 'text/csv',
            source: new Layer.Core.MessagePart({
              body: [
                'Employee Name, Salary',
                'Mike, 22500',
                'Bob, 35000',
                'Alice, 44000',
                'Frank, 27000',
                'Floyd, 92000',
                'Fritz, 18500',
              ].join('\n'),
              mimeType: 'text/csv',
            }),
          }),
        });
        model.send({ conversation });
      }
    },
  ];
}

// TODO: This handles file selection using the File Upload Button, but
// does not handle PDF files that are dragged and dropped into the Conversation View.
function customFileSelector(evt, conversation) {
  const files = evt.detail.files;
  const PDFModel = Layer.Core.Client.getMessageTypeModelClass('PDFModel');

  if (files.length === 1 && files[0].type === 'application/pdf') {
    evt.preventDefault();

    const model = new PDFModel({
      source: files[0],
      author: Layer.client.user.displayName,
      title: files[0].name,
    });
    model.send({ conversation });
    return;
  }
}

export { getMenuOptions, customFileSelector };
*/