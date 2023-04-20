import { Component } from '../../../core/Component';
import { databaseService } from '../../../services/DatabaseService';
import { forms, menuItems } from './constants';
import { eventEmmiter } from '../../../core/EventEmmiter';
import { APP_EVENTS } from '../../../constants/appEvents';

import './AdminPage.scss';
import '../../Molecules/Tabs';
import '../../Molecules/Preloader';
import '../../Organisms/CategoryForm';
import '../../Organisms/ProductForm';
import '../../Organisms/SalesForm';
import { FIRESTORE_KEYS } from '../../../constants/firestoreKeys';
import { firebaseStorageService } from '../../../services/FirebaseStorageService';

class AdminPage extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: menuItems[0],
      isLoading: false,
    };
  }

  setIsLoading = (isLoading) => {
    this.setState((state) => {
      return {
        ...state,
        isLoading,
      };
    });
  };

  setActiveTab = (activeTab) => {
    this.setState((state) => {
      return {
        ...state,
        activeTab,
      };
    });
  };

  createCategory = ({ detail }) => {
    databaseService.createDocument(FIRESTORE_KEYS.categories, detail.data);
  };

  onChangeTab = ({ detail }) => {
    this.setActiveTab(detail.activeItem);
  };

  createProduct = ({ detail }) => {
    this.setIsLoading(true);
    const { data } = detail;
    firebaseStorageService
      .uploapFile(data.preview, 'products')
      .then((snapshop) => {
        firebaseStorageService.downloadURL(snapshop.ref).then((url) => {
          databaseService.createDocument('products', {
            ...data,
            preview: url,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => this.setIsLoading(false));
  };

  componentDidMount() {
    eventEmmiter.on(APP_EVENTS.changeTab, this.onChangeTab);
    eventEmmiter.on(APP_EVENTS.createCategory, this.createCategory);
    eventEmmiter.on(APP_EVENTS.createProduct, this.createProduct);
  }

  componentWillUnmount() {
    eventEmmiter.off(APP_EVENTS.changeTab, this.onChangeTab);
    eventEmmiter.off(APP_EVENTS.createCategory, this.createCategory);
    eventEmmiter.off(APP_EVENTS.createProduct, this.createProduct);
  }
  render() {
    return `
      <it-preloader is-loading='${this.state.isLoading}'>
        <div class='container'>
            <div class="mt-5">
                <it-tabs 
                  menu-items='${JSON.stringify(menuItems)}'
                  active-item='${JSON.stringify(this.state.activeTab)}'>
                </it-tabs>
              <div class='mb-3 border-end border-bottom border-start p-3'>
                ${forms[this.state.activeTab.id]}
              </div>  
            </div>
        </div>
      </it-preloader>
        `;
  }
}

customElements.define('admin-page', AdminPage);