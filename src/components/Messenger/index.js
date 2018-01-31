/**
 * TODO:
 * 2. Organize CSS files
 * 3. Review design with designer
 */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { layerClient, LayerReactComponents, Layer } from '../../get-layer';
import '../../common/ui_web_style.css'
import EditConversationDialog from './EditConversationDialog';

const LayerUIUtil = Layer.UI.UIUtils;
const utils = Layer.Utils;

const { Notifier, ConversationList, ConversationView, SendButton, FileUploadButton, MenuButton, Presence } = LayerReactComponents;

class Messenger extends Component {
  constructor (props) {
    super (props)
    this.state = {};
  }

  componentWillMount() {
    if (!layerClient.isAuthenticated) {
      this.props.history.push({
        pathname: '/',
        previousLocation: { pathname: this.props.location.pathname }
      })
    } else if (this.props.match.params.conversationId) {
      this.conversation = layerClient.getConversation(this.props.match.params.conversationId, true);
      this.setupConversation();
    }
  }

  setupConversation() {
    const conversation = this.conversation;
    if (conversation && conversation.isLoading) {
      conversation.once('conversations:loaded', () => {
        this.setState({
          isLoaded: true,
        });
      });
    }

    if (conversation) {
      conversation.on('conversations:change', (evt) => {
        if (evt.hasProperty('metadata')) {
          this.setState({ random: Math.random() });
        }
      }, this);
    }

    this.setState({
      conversationId: utils.uuid(conversation.id),
      conversation,
      isLoaded: conversation && !conversation.isLoading,
    });
  }

  onConversationSelected (e) {
    if (!e.detail.item) return
    const conversation = e.detail.item.toObject()
    this.props.history.push(`/conversations/${utils.uuid(conversation.id)}`)
  }

  onConversationDeselected = () => {
    this.props.history.push('/conversations/');
    this.setState({
      conversationId: ''
    });
  }

  componentWillReceiveProps (props) {
    if (this.props.match.params.conversationId !== props.match.params.conversationId) {

      const conversationId = props.match.params.conversationId;
      const newConversation = conversationId ? layerClient.getConversation(conversationId) : null;
      if (this.conversation) this.conversation.off(null, null, this);
      this.conversation = newConversation;
      this.setupConversation();
    }
  }

  getMenuOptions() {
    const conversation = layerClient.getConversation(this.state.conversationId)
    return [
      {
        text: "Create Text Message",
        method: function() {
          const TextModel = Layer.Core.Client.getMessageTypeModelClass('TextModel');
          const model = new TextModel({
            text: 'And the Lord spake, saying, "First shalt thou take out the Holy Pin. Then shalt thou count to three, no more, no less. Three shall be the number thou shalt count, and the number of the counting shall be three. Four shalt thou not count, neither count thou two, excepting that thou then proceed to three. Five is right out! Once the number three, being the third number, be reached, then lobbest thou thy Holy Hand Grenade of Antioch towards thy foe, who, being naughty in my sight, shall snuff it.',
            title: 'The Holy Hand Grenade',
            author: 'King Arthur'
          });
          model.generateMessage(conversation, message => message.send());
        }.bind(this)
      },
      {
        text: 'Create Link Message',
        method: function() {
          const LinkModel = Layer.Core.Client.getMessageTypeModelClass('LinkModel');
          const model = new LinkModel({
            url: "https://layer.com/introducing-the-layer-conversation-design-system/",
            title: "Introducing the Layer Conversation Design System",
            imageUrl: "https://layer.com/wp-content/uploads/2017/07/bezier-blog-header-2x.png",
            description: "The Layer Conversation Design System helps you imagine and design the perfect customer conversation across devices."
          });
          model.generateMessage(conversation, message => message.send());
        }.bind(this),
      },
      {
        text: 'Create Image Message',
        method: function() {
          const ImageModel = Layer.Core.Client.getMessageTypeModelClass('ImageModel');
          const model = new ImageModel({
            sourceUrl: "https://78.media.tumblr.com/1b019b4237ab18f789381941eca98784/tumblr_nlmlir7Lhk1u0k6deo1_400.gif",
            artist: "Monty Python",
            title: "Tis only a flesh wound",
            subtitle: "Your arm's off!"
          });
          model.generateMessage(conversation, message => message.send())
        }.bind(this),
      },
      {
        text: 'Create File Message',
        method: function() {
          const FileModel = Layer.Core.Client.getMessageTypeModelClass('FileModel');
          const model = new FileModel({
            sourceUrl: "https://raw.githubusercontent.com/layerhq/web-xdk/master/README.md?token=AAPUfjxdAz2WZ_0AcEaMHgD4w8yPi2v7ks5Z8h15wA%3D%3D",
            mimeType: "text/markdown",
            title: "Web XDK Readme",
            author: "layer.com"
          })
          model.generateMessage(conversation, message => message.send())
        }.bind(this),
      },
      {
        text: 'Create Location Message',
        method: function() {
          if (!window.googleMapsAPIKey) {
            alert('Please add a Google Maps API Key to your LayerConfiguration.json file using the key name "google_maps_key"');
          } else {
            const LocationModel = Layer.Core.Client.getMessageTypeModelClass('LocationModel');

            const model = new LocationModel({
              latitude: 37.7734858,
              longitude: -122.3916087,
              heading: 23.45,
              altitude: 35.67,
              title: "Here I am.  Right there on the dot. I'm stuck on the dot.  Please free me.",
              description: "Dot prisoner 455 has attempted to escape.  Send in the puncutation and make a very strong point about dot prisoner escapes",
              accuracy: 0.8,
              createdAt: new Date(),
            });
            model.generateMessage(conversation, message => message.send());
          }
        }.bind(this),
      },
      {
        text: 'Create Button Message',
        method: function() {
          const ButtonsModel = Layer.Core.Client.getMessageTypeModelClass('ButtonsModel');
          const TextModel = Layer.Core.Client.getMessageTypeModelClass('TextModel');

          const model = new ButtonsModel({
            buttons: [
              {"type": "action", "text": "Kill Arthur", "event": "kill-arthur"},
              {"type": "action", "text": "Give Holy Grail", "event": "grant-grail"}
            ],
            contentModel: new TextModel({
              text: 'And the Lord spake, saying, "First shalt thou take out the Holy Pin. Then shalt thou count to three, no more, no less. Three shall be the number thou shalt count, and the number of the counting shall be three. Four shalt thou not count, neither count thou two, excepting that thou then proceed to three. Five is right out! Once the number three, being the third number, be reached, then lobbest thou thy Holy Hand Grenade of Antioch towards thy foe, who, being naughty in my sight, shall snuff it.',
              title: 'The Holy Hand Grenade',
              author: 'King Arthur'
            })
          });
          model.generateMessage(conversation, message => message.send());

          if (!this.buttonSampleSetup) {
            this.buttonSampleSetup = true;
            document.body.addEventListener('kill-arthur', function() {
              alert('Hah! Tis only a flesh wound!');
            });

            document.body.addEventListener('grant-grail', function() {
              alert('We\'ve already got one!');
            });
          }
        }.bind(this),
      },
      {
        text: 'Create Button Message with Choices',
        method: function() {
          const ButtonsModel = Layer.Core.Client.getMessageTypeModelClass('ButtonsModel');
          const TextModel = Layer.Core.Client.getMessageTypeModelClass('TextModel');

          const model = new ButtonsModel({
            buttons: [
              {
                "type": "choice",
                "choices": [
                  {"text": "Kill Arthur", "id": "kill"},
                  {"text": "Give Holy Grail", "id": "grail"}
                ],
                "data": {
                  "responseName": "deal-with-arthur",
                  "allowReselect": true
                }
              }
            ],
            contentModel: new TextModel({
              text: 'And the Lord spake, saying, "First shalt thou take out the Holy Pin. Then shalt thou count to three, no more, no less. Three shall be the number thou shalt count, and the number of the counting shall be three. Four shalt thou not count, neither count thou two, excepting that thou then proceed to three. Five is right out! Once the number three, being the third number, be reached, then lobbest thou thy Holy Hand Grenade of Antioch towards thy foe, who, being naughty in my sight, shall snuff it.',
              title: 'The Holy Hand Grenade',
              author: 'King Arthur'
            })
          });
          model.generateMessage(conversation, message => message.send());

          if (!this.buttonSampleSetup) {
            this.buttonSampleSetup = true;
            document.body.addEventListener('kill-arthur', function() {
              alert('Hah! Tis only a flesh wound!');
            });

            document.body.addEventListener('grant-grail', function() {
              alert('We\'ve already got one!');
            });
          }
        }.bind(this),
      },
      {
        text: 'Create Product Message',
        method: function() {
          const ProductModel = Layer.Core.Client.getMessageTypeModelClass('ProductModel');
          const ChoiceModel = Layer.Core.Client.getMessageTypeModelClass('ChoiceModel')

          const model = new ProductModel({
             customData: {
               product_id: "Frodo-the-dodo",
               sku: "frodo-is-ascew"
             },
             url: 'https://static.giantbomb.com/uploads/original/0/7465/1296890-apple3.jpg',
             currency: 'USD',
             price: 175,
             quantity: 3,
             brand: 'Apple',
             name: 'Apple 2 plus desktop computer',
             description: 'This computer will last you a lifetime.  Its processing power far outweighs your old calculator.  Its DOS based interface is the most modern available anywhere in the world. Keyboard is built-in and ergonomic.',
             imageUrls: ['https://static.giantbomb.com/uploads/original/0/7465/1296890-apple3.jpg'],
             options: [
               new ChoiceModel({
                 label: 'RAM',
                 type: 'label',
                 allowReselect: true,
                 preselectedChoice: 'large',
                 choices: [
                   {text:  "2K", id: "small"},
                   {text:  "4K", id: "medium"},
                   {text:  "8K", id: "large"},
                 ]
               }),
               new ChoiceModel({
                 label: 'Color',
                 type: 'label',
                 allowReselect: true,
                 preselectedChoice: 'offwhite',
                 choices: [
                   {text:  "Off White", id: "offwhite"},
                   {text:  "Awful White", id: "awfwhite"}
                 ]
               }),
             ]
         });
         model.generateMessage(conversation, message => message.send());
        }.bind(this)
      },
      {
        text: 'Create Receipt Message',
        method: function() {
          const ReceiptModel = Layer.Core.Client.getMessageTypeModelClass('ReceiptModel')
          const LocationModel = Layer.Core.Client.getMessageTypeModelClass('LocationModel')
          const ListModel =   Layer.Core.Client.getMessageTypeModelClass('ListModel')
          const ProductModel =Layer.Core.Client.getMessageTypeModelClass('ProductModel')
          const ImageModel =  Layer.Core.Client.getMessageTypeModelClass('ImageModel')
          const ChoiceModel = Layer.Core.Client.getMessageTypeModelClass('ChoiceModel')

          const model = new ReceiptModel({
            currency: 'USD',
            order: {
              number: 'FRODO-DODO-ONE'
            },
            paymentMethod: 'VISA ****1234',
            summary: {
              subtitle: 'Your Purchase is Complete',
              shippingCost: 350.01,
              totalTax: 0.01,
              totalCost: 350.02
            },
            shippingAddress: new LocationModel({
              city: 'San Francisco',
              name: 'Layer Inc',
              postalCode: '94107',
              administrativeArea: 'CA',
              street1: '655 4th st',
              description: 'Description should not show'
            }),
            items: [
                new ProductModel({
                    url: 'http://l7.alamy.com/zooms/e33f19042cbe4ec1807bba7f3720ba62/executive-in-a-strait-jacket-aakafp.jpg',
                    price: 525,
                    quantity: 1,
                    currency: 'USD',
                    brand: 'Prison Garb Inc',
                    name: 'Formal Strait Jacket',
                    description: 'The right choice for special occasions with your crazed inlaws.  This will make you feel like you at last belong.',
                    imageUrls: [ 'http://l7.alamy.com/zooms/e33f19042cbe4ec1807bba7f3720ba62/executive-in-a-strait-jacket-aakafp.jpg' ],
                    options: [
                      new ChoiceModel({
                        label: 'Size',
                        type: 'label',
                        preselectedChoice: 'small',
                        choices: [
                          {text:  'Small', id: 'small'},
                          {text:  'Medium', id: 'medium'},
                          {text:  'Large', id: 'large'},
                        ]
                      }),
                      new ChoiceModel({
                        label: 'Color',
                        type: 'label',
                        preselectedChoice: 'white',
                        choices: [
                          {text:  'White', id: 'white'},
                          {text:  'Black', id: 'black'},
                          {text:  'Gold', id: 'gold'},
                        ]
                      })
                    ]
                }),
                new ProductModel({
                    url: 'http://l7.alamy.com/zooms/e33f19042cbe4ec1807bba7f3720ba62/executive-in-a-strait-jacket-aakafp.jpg',
                    price: 525,
                    quantity: 1,
                    currency: 'USD',
                    brand: 'Prison Garb Inc',
                    name: 'Formal Strait Jacket',
                    description: 'The right choice for special occasions with your crazed inlaws.  This will make you feel like you at last belong.',
                    imageUrls: [ 'http://l7.alamy.com/zooms/e33f19042cbe4ec1807bba7f3720ba62/executive-in-a-strait-jacket-aakafp.jpg' ],
                    options: [
                      new ChoiceModel({
                        label: 'Size',
                        type: 'label',
                        preselectedChoice: '',
                        choices: [
                          {text:  'Small', id: 'small'},
                          {text:  'Medium', id: 'medium'},
                          {text:  'Large', id: 'large'},
                        ]
                      }),
                      new ChoiceModel({
                        label: 'Color',
                        type: 'label',
                        preselectedChoice: 'gold',
                        choices: [
                          {text:  'White', id: 'white'},
                          {text:  'Black', id: 'black'},
                          {text:  'Gold', id: 'gold'},
                        ]
                      })
                    ]
                }),
                new ProductModel({
                  url: 'http://l7.alamy.com/zooms/e33f19042cbe4ec1807bba7f3720ba62/executive-in-a-strait-jacket-aakafp.jpg',
                  price: 525,
                  quantity: 3,
                  currency: 'USD',
                  brand: 'Prison Garb Inc',
                  name: 'Formal Strait Jacket',
                  description: 'The right choice for special occasions with your crazed inlaws.  This will make you feel like you at last belong.',
                  imageUrls: [ 'http://l7.alamy.com/zooms/e33f19042cbe4ec1807bba7f3720ba62/executive-in-a-strait-jacket-aakafp.jpg' ],
                  options: [
                    new ChoiceModel({
                      label: 'Size',
                      type: 'label',
                      preselectedChoice: 'medium',
                      choices: [
                        {text:  'Small', id: 'small'},
                        {text:  'Medium', id: 'medium'},
                        {text:  'Large', id: 'large'},
                      ]
                    }),
                    new ChoiceModel({
                      label: 'Color',
                      type: 'label',
                      choices: [
                        {text:  'White', id: 'white'},
                        {text:  'Black', id: 'black'},
                        {text:  'Gold', id: 'gold'},
                      ]
                    })
                  ]
              })
            ]
          })
          model.generateMessage(conversation, message => message.send());
        }.bind(this),
      },
      {
        text: 'Create Choice Message',
        method: function() {
          const ChoiceModel = Layer.Core.Client.getMessageTypeModelClass('ChoiceModel')
          const model = new ChoiceModel({
            label: 'What is the airspeed velocity of an unladen swallow?',
            responseName: 'airspeedselection',
            choices: [
               {text:  'Zero, it can not get off the ground!', id: 'zero'},
               {text:  'Are we using Imperial or Metric units?', id: 'clever bastard'},
               {text:  'What do you mean? African or European swallow?', id: 'just a smart ass'},
             ],
          });
          model.generateMessage(conversation, message => message.send())
        }.bind(this),
      },
      {
        text: 'Create Carousel Message',
        method: function() {
          const CarouselModel = Layer.Core.Client.getMessageTypeModelClass('CarouselModel');
          const FileModel = Layer.Core.Client.getMessageTypeModelClass('FileModel');

          const model = new CarouselModel({
            items: [
              new FileModel({
                sourceUrl: 'https://raw.githubusercontent.com/layerhq/web-xdk/master/README.md?token=AAPUfjxdAz2WZ_0AcEaMHgD4w8yPi2v7ks5Z8h15wA%3D%3D',
                mimeType: 'text/markdown',
                title: 'Web XDK Readme',
                author: 'layer.com'
              }),
              new FileModel({
                sourceUrl: 'https://raw.githubusercontent.com/layerhq/web-xdk/master/LICENSE?token=AAPUfnbqKuuGEE-LceF93on0O8nSKpdMks5Z8h7AwA%3D%3D',
                mimeType: 'text/plain',
                title: 'Web XDK License',
                author: 'Apache'
              }),
              new FileModel({
                sourceUrl: 'https://raw.githubusercontent.com/layerhq/web-xdk/master/CHANGELOG.md?token=AAPUfnbZwMpC-aul50GSng2SkX-174Rbks5Z8h8VwA%3D%3D',
                mimeType: 'text/markdown',
                title: 'Web XDK Changelog',
                author: 'layer.com'
              })
            ]
          });
          model.generateMessage(conversation, message => message.send());
        }.bind(this),
      },
      {
        text: 'Create Status Message',
        method: function() {
          const StatusModel = Layer.Core.Client.getMessageTypeModelClass('StatusModel');
          const model = new StatusModel({
            text: 'You have just received a status message. This could be something important.'
          });
          model.generateMessage(conversation, message => message.send());
        }.bind(this),
      },
      {
        text: 'Create Feedback Message',
        method: function() {
          const FeedbackModel = Layer.Core.Client.getMessageTypeModelClass('FeedbackModel');
          const model = new FeedbackModel({
            enabledFor: [layerClient.user.id],
          });
          model.generateMessage(conversation, message => message.send());
        }.bind(this),
      }
    ];
  }

  filterMessages () { return true }

  /**
   * Toggle presence between BUSY and AVAILABLE
   */
  togglePresence = (event) => {
    event.preventDefault();
    layerClient.user.setStatus(layerClient.user.status === Layer.Core.Identity.STATUS.AVAILABLE ? Layer.Core.Identity.STATUS.BUSY : Layer.Core.Identity.STATUS.AVAILABLE);
  }

  startCreateConversation = (event) => {
    event.preventDefault();
    this.setState({ showEditConversationDialog: true });
  }

  startEditConversation = (event) => {
    event.preventDefault();
    this.setState({
      showEditConversationDialog: true,
      editConversationId: this.state.conversationId,
    });
  }

  cancelCreateConversation = () => {
    this.setState({ showEditConversationDialog: false });
  }

  onCreateConversation = (conversation) => {
    this.setState({
      conversationId: utils.uuid(conversation.id),
      showEditConversationDialog: false,
      editConversationId: '',
    });
  }

  logout = () => {
    layerClient.logout();
    this.props.history.push('/')
  }

  render() {

    const activeConversationId = this.state.conversationId ? 'layer:///conversations/' + this.state.conversationId : '';
    const activeConversation = activeConversationId ? layerClient.getConversation(activeConversationId, true) : null;

    var title = '← Create a new conversation or select a conversation from the list.';
    if (activeConversation) {
      if (!activeConversation.isLoading) {
        if (activeConversation.metadata.conversationName) {
          title = activeConversation.metadata.conversationName;
        } else {
          title = activeConversation.participants
          .filter(user => user !== layerClient.user)
          .map(user => user.displayName)
          .join(', ');
        }
      }
    }

    const replaceableContent = {
      composerButtonPanelRight: () => {
        return (<div>
          <SendButton />
          <FileUploadButton multiple="true" />
          <MenuButton
          getMenuOptions={this.getMenuOptions.bind(this)}
          />
        </div>);
      },
      /*messageSentRightSide: "<div>Hello World</div>",
      messageSentLeftSide: function() {
        return "<div>Goodbye World</div>";
      }*/
    };

    const dialog =  (this.state.showEditConversationDialog) ?
      <EditConversationDialog
        conversationId={this.state.editConversationId}
        onCancel={this.cancelCreateConversation}
        onSave={this.onCreateConversation}
      /> : null;


    const isMobile = navigator.userAgent.match(/android/i) || navigator.platform === 'iPhone' || navigator.platform === 'iPad';

    const rootClasses = [
      'messenger',
      this.state.conversationId ? 'has-conversation' : '',
      isMobile ? 'is-mobile' : '',
    ].filter(css => css).join(' ');

    return <div className={rootClasses}>
      {dialog}
      <div className="left-panel">
        <div className='panel-header conversations-header'>
          <a href='#' onClick={this.logout} className='logout'>
            <i className="icon fa fa-sign-out"></i>
          </a>
          <Presence
            item={layerClient.user}
            onPresenceClick={this.togglePresence} />

          <div className='title'>{layerClient.user ? layerClient.user.displayName : '************'}</div>
          <a href='#' onClick={this.startCreateConversation}>
            <i className="icon fa fa-pencil-square-o"></i>
          </a>
        </div>
        <ConversationList
          selectedConversationId={this.state.conversationId ? activeConversationId : null}
          onConversationSelected={(e) => this.onConversationSelected(e)} />
      </div>
      <div className="right-panel">
        <div className='panel-header conversation-header'>
          <a href='#' onClick={this.onConversationDeselected}>
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
          </a>
          <div className='title'>{title}</div>
          <a href='#' onClick={this.startEditConversation}>
            <i className="icon fa fa-pencil-square-o"></i>
          </a>
        </div>
        <ConversationView
          ref="conversationPanel"
          composeText={window.tmptext}
          queryFilter={() => this.filterMessages()}
          replaceableContent={replaceableContent}
          onRenderListItem={LayerUIUtil.dateSeparator}
          conversationId={activeConversationId}
        />
      </div>
    </div>
  }
}

export default Messenger
