import { Component } from '../../../core/Component';
import { eventEmmiter } from '../../../core/EventEmmiter';
import { APP_EVENTS } from '../../../constants/appEvents';
import { authService } from '../../../services/Auth';
import { APP_ROUTES } from '../../../constants/appRoutes';
import { storageService } from '../../../services/StorageService';

import '../../Organisms/RegisterForm';
import '../../Organisms/SignInForm';
import '../../Molecules/Preloader';
import './SignInPage.scss';

class SignInPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      errorMessage: '',
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

  setError = (error) => {
    this.setState((state) => {
      return {
        ...state,
        errorMessage: error,
      };
    });
  };

  signIn = async ({ detail }) => {
    const { data } = detail;
    this.setIsLoading(true);
    try {
      const user = await authService.signIn(data.email, data.password);
      storageService.setItem('user', user);
      eventEmmiter.emit(APP_EVENTS.authorizeUser, { user });
      eventEmmiter.emit(APP_EVENTS.changeRoute, { target: APP_ROUTES.main });
      window.location.reload();
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setIsLoading(false);
    }
  };

  register = async ({ detail }) => {
    const { data } = detail;
    this.setIsLoading(true);
    try {
      const user = await authService.signUp(data.email, data.password);
      eventEmmiter.emit(APP_EVENTS.authorizeUser, { user });
      eventEmmiter.emit(APP_EVENTS.changeRoute, { target: APP_ROUTES.main });
      window.location.reload();
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setIsLoading(false);
    }
  };

  swiper() {
    const signupBtn = document.getElementById('signup');
    const loginBtn = document.getElementById('login');
    loginBtn.addEventListener('click', (evt) => {
      let parent = evt.target.parentNode.parentNode;
      Array.from(evt.target.parentNode.parentNode.classList).find((element) => {
        if (element !== 'slide-up') {
          parent.classList.add('slide-up');
        } else {
          signupBtn.parentNode.classList.add('slide-up');
          parent.classList.remove('slide-up');
        }
      });
    });
    signupBtn.addEventListener('click', (evt) => {
      let parent = evt.target.parentNode;
      Array.from(evt.target.parentNode.classList).find((element) => {
        if (element !== 'slide-up') {
          parent.classList.add('slide-up');
        } else {
          loginBtn.parentNode.parentNode.classList.add('slide-up');
          parent.classList.remove('slide-up');
        }
      });
    });
  }

  componentDidMount() {
    this.swiper();
    eventEmmiter.on(APP_EVENTS.signIn, this.signIn);
    eventEmmiter.on(APP_EVENTS.signUp, this.register);
  }

  componentWillUnmount() {
    eventEmmiter.off(APP_EVENTS.signIn, this.signIn);
    eventEmmiter.off(APP_EVENTS.signUp, this.register);
  }

  render() {
    const message = this.state.errorMessage;
    return `
    <it-preloader is-loading='${this.state.isLoading}'>
      <div class='container'>

        <div class="invalid-feedback d-block">
        ${message ? `<p>${'Ошибка при регистрации ' + message}</p>` : ''}
        </div>

        <div class="form-structor">
          <register-form></register-form>
          <sign-in-form></sign-in-form>
        </div>

      </div>
    </it-preloader>
    `;
  }
}

customElements.define('sign-in-page', SignInPage);
