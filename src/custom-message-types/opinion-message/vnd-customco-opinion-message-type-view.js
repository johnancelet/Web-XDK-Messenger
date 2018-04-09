import { Layer } from '../../get-layer'
import './opinion-message-type-model';

const registerComponent = Layer.UI.registerComponent;
const MessageViewMixin = Layer.UI.mixins.MessageViewMixin;
const processText = Layer.UI.handlers.text.processText;
const Widths = Layer.UI.Constants.WIDTH;

registerComponent('vnd-customco-opinion-message-type-view', {
  mixins: [MessageViewMixin],
  template: `
    <div class="user-rating" layer-id="rating"></div>
    <div class="user-comment" layer-id="comment"></div>
  `,
  style: `
    vnd-customco-opinion-message-type-view {
      display: flex;
      flex-direction: row;
      width: 100%;
    }
    vnd-customco-opinion-message-type-view .user-comment {
      line-height: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      flex-grow: 1;
      width: 100px /* Flexbox bug workaround */
    }
    vnd-customco-opinion-message-type-view .user-comment p {
      line-height: 40px;
    }

    vnd-customco-opinion-message-type-view .user-rating {
      text-align: center;
      line-height: 40px;
      width: 30px;
      border-right: solid 1px #ccc;
    }
    vnd-customco-opinion-message-type-view.rating1 .user-rating {
      background-color: light-green;
    }
    vnd-customco-opinion-message-type-view.rating2 .user-rating {
      background-color: #baefba;
      color: white;
    }
    vnd-customco-opinion-message-type-view.rating3 .user-rating {
      background-color: yellow;
    }
    vnd-customco-opinion-message-type-view.rating4 .user-rating {
      background-color: orange;
    }
    vnd-customco-opinion-message-type-view.rating5 .user-rating {
      background-color: red;
      color: white;
    }
  `,

  properties: {
    widthType: {
      value: Widths.FLEX
    },
    messageViewContainerTagName: {
      noGetterFromSetter: true,
      value: 'layer-standard-message-view-container'
    }
  },

  methods: {
    onRerender() {
      this.nodes.comment.innerHTML = processText(this.model.comment);
      this.nodes.rating.innerHTML = this.model.rating;
      this.classList.add('rating' + this.model.rating);
    }
  }
});