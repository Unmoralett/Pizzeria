import { Component } from '../../../core/Component';
import { eventEmmiter } from '../../../core/EventEmmiter';
import { APP_EVENTS } from '../../../constants/appEvents';

import './NavMenu.scss';
import '../../Atoms/Link';

class NavMenu extends Component {
  static get observedAttributes() {
    return ['links', 'current'];
  }

  onChangeCategory = (evt) => {
    evt.preventDefault();

    if (evt.target.closest('.nav-link')) {
      eventEmmiter.emit(APP_EVENTS.changeCategoryMenu, {
        label: evt.target.parentElement.dataset.label,
      });
    }
  };

  componentDidMount() {
    this.addEventListener('click', this.onChangeCategory);
  }

  componentWillUnmount() {
    this.removeEventListener('click', this.onChangeCategory);
  }

  render() {
    const links = JSON.parse(this.props.links);
    return `
        <nav class="CatalogProducts_nav nav nav-pills nav-fill">
            ${links
              .map((item) => {
                const current = this.props.current;
                const isActive = item.name === current;
                return `
                <it-link
                  classname="nav-link text-dark border border-3 border-warning m-2 ${
                    isActive ? 'active-nav bg-warning text-dark' : ''
                  }"
                  href=""
                  content='${item.name}'
                  img='${item.img}'
                  data-label='${item.name}'
                ></it-link>
                `;
              })
              .join(' ')}
        </nav>
        `;
  }
}

customElements.define('it-navmenu', NavMenu);
