import React, { Component } from "react";
import ReactDOM from 'react-dom';

import { Layer } from '../../get-layer'
import './opinion-react-message-type-model';

const registerComponent = Layer.UI.registerComponent;
const MessageViewMixin = Layer.UI.mixins.MessageViewMixin;
const Widths = Layer.UI.Constants.WIDTH;


class Opinion extends Component<Props, State> {
  constructor(props) {
    super(props);
    props.model.on('message-type-model:change', evt => this.setState({ lastEvent: evt }), this);
  }
  render() {
    return (
      <div className={'rating' + this.props.model.rating}>
        <div className="user-rating">{this.props.model.rating}</div>
        <div className="user-comment">{this.props.model.comment}</div>
      </div>
    );
  }
}


registerComponent('vnd-customco-opinion-react-message-type-view', {
  mixins: [MessageViewMixin],
  style: `
    vnd-customco-opinion-react-message-type-view {
      display: block;
      width: 100%;
    }
    vnd-customco-opinion-react-message-type-view > div {
      display: flex;
      flex-direction: row;
      width: 100%;
    }
    vnd-customco-opinion-react-message-type-view .user-comment {
      line-height: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      flex-grow: 1;
      width: 100px /* Flexbox bug workaround */
    }
    vnd-customco-opinion-react-message-type-view .user-comment p {
      line-height: 40px;
    }

    vnd-customco-opinion-react-message-type-view .user-rating {
      text-align: center;
      line-height: 40px;
      width: 30px;
      border-right: solid 1px #ccc;
    }
    vnd-customco-opinion-react-message-type-view. rating1 .user-rating {
      background-color: light-green;
    }
    vnd-customco-opinion-react-message-type-view .rating2 .user-rating {
      background-color: #baefba;
      color: white;
    }
    vnd-customco-opinion-react-message-type-view .rating3 .user-rating {
      background-color: yellow;
    }
    vnd-customco-opinion-react-message-type-view .rating4 .user-rating {
      background-color: orange;
    }
    vnd-customco-opinion-react-message-type-view .rating5 .user-rating {
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
    onRender() {
      ReactDOM.render(<Opinion model={this.model} />, this);
    }
  }
});
