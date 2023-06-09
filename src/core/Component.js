//абстракция, которая берет на себя отв за state и рендеринг
export class Component extends HTMLElement {
  constructor() {
    super();
    this.state = {};
    this.props = {};
    this.isShadow = false;
  }
  //cледит за изм state и обновляет рендер
  setState(callback) {
    this.state = callback(this.state);
    if (this.isShadow) {
      this.shadowRoot.innerHTML = this.render();
    } else {
      this.innerHTML = this.render();
    }
  }
  //выполняется как только наша разметка встраивается в dom-дерево
  connectedCallback() {
    if (this.isShadow) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = this.render();
    } else {
      this.innerHTML = this.render();
    }

    this.componentDidMount();
  }
  //отписка от событий(удаляемся из dom-дерева)
  disconnectedCallback() {
    this.componentWillUnmount();
  }
  //вызывается когда аттрибуты нашего компонента будут изменены
  attributeChangedCallback(name, oldValue, newValue) {
    this.componentWillUpdate(name, oldValue, newValue);
    //возвращает массив всех аттрибутов, которые мы передали
    this.getAttributeNames().forEach((attributeName) => {
      this.props[attributeName] = this.getAttribute(attributeName);
    });
  }

  componentDidMount() {}
  componentWillUnmount() {}
  componentWillUpdate() {}
  render() {}
}

customElements.define('it-component', Component);
