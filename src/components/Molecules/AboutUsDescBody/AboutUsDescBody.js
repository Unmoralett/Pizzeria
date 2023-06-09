import { Component } from '../../../core/Component';

class AboutUsDescBody extends Component {
  static get observedAttributes() {
    return ['class', 'title', 'text'];
  }

  render() {
    const className = this.props.class ? this.props.class : '';
    const contentTitle = this.props.title ? this.props.title : '';
    const contentText = this.props.text ? this.props.text : '';

    return `
        <div class='${className}'>
            <h2 class='${className}-title'>${contentTitle}</h2>
            <p class='${className}-text'>${contentText}</p>
        </div>
        `;
  }
}

customElements.define('it-aboutusdescbody', AboutUsDescBody);
