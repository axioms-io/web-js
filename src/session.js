import {
    Cookie,
    Cookies
} from 'js-cookie';

class AuthSession {
    constructor(config) {
        this.config = config
        this.userInfo = null
    }

    get state() {
        return this.getItem('_axioms.auth.state');
    }

    set state(state) {
        this.saveItem('_axioms.auth.state', state);
    }

    get org() {
        return this.getItem('_axioms.auth.org', 'local');
    }

    set org(org) {
        this.saveItem('_axioms.auth.org', org, 'local');
    }

    get org_uri() {
        return this.getItem('_axioms.auth.org_uri', 'local');
    }

    set org_uri(org_uri) {
        this.saveItem('_axioms.auth.org_uri', org_uri, 'local');
    }

    get nonce() {
        return this.getItem('_axioms.auth.nonce');
    }

    set nonce(nonce) {
        this.saveItem('_axioms.auth.nonce', nonce);
    }

    get id_token() {
        return this.getItem('_axioms.auth.id_token');
    }

    set id_token(id_token) {
        this.saveItem('_axioms.auth.id_token', id_token);
    }

    get is_valid_id_token() {
        return JSON.parse(this.getItem('_axioms.auth.is_valid_id_token'));
    }

    set is_valid_id_token(is_valid_id_token) {
        this.saveItem('_axioms.auth.is_valid_id_token', is_valid_id_token);
    }

    get id_payload() {
        return JSON.parse(this.getItem('_axioms.auth.id_payload'));
    }

    set id_payload(id_payload) {
        this.saveItem('_axioms.auth.id_payload', JSON.stringify(id_payload));
    }

    get id_exp() {
        return JSON.parse(this.getItem('_axioms.auth.id_exp'));
    }

    set id_exp(id_exp) {
        this.saveItem('_axioms.auth.id_exp', id_exp);
    }

    get id_scope() {
        return JSON.parse(this.getItem('_axioms.auth.id_scope'));
    }

    set id_scope(id_scope) {
        this.saveItem('_axioms.auth.id_scope', id_scope);
    }

    get access_token() {
        return this.getItem('_axioms.auth.access_token');
    }

    set access_token(access_token) {
        this.saveItem('_axioms.auth.access_token', access_token);
    }

    get is_valid_access_token() {
        return JSON.parse(this.getItem('_axioms.auth.is_valid_access_token'));
    }

    set is_valid_access_token(is_valid_access_token) {
        this.saveItem('_axioms.auth.is_valid_access_token', is_valid_access_token);
    }

    get access_exp() {
        return JSON.parse(this.getItem('_axioms.auth.access_exp'));
    }

    set access_exp(access_exp) {
        this.saveItem('_axioms.auth.access_exp', access_exp);
    }

    get access_scope() {
        return this.getItem('_axioms.auth.access_scope');
    }

    set access_scope(access_scope) {
        this.saveItem('_axioms.auth.access_scope', access_scope);
    }

    get access_payload() {
        return JSON.parse(this.getItem('_axioms.auth.access_payload'));
    }

    set access_payload(access_payload) {
        this.saveItem('_axioms.auth.access_payload', JSON.stringify(access_payload));
    }

    get token_type() {
        return this.getItem('_axioms.auth.token_type')
    }

    set token_type(token_type) {
        this.saveItem('_axioms.auth.token_type', token_type)
    }

    get code() {
        return this.getItem('_axioms.auth.code');
    }

    set code(code) {
        this.saveItem('_axioms.auth.code', code);
    }

    get expires_in() {
        const expires_in = this.getItem('salte.auth.expires_in');
        return expires_in ? Number(expires_in) : null;
    }

    set expires_in(expires_in) {
        this.saveItem('_axioms.auth.expires_in', expires_in);
    }

    get error() {
        return this.getItem('_axioms.auth.error');
    }

    set error(error) {
        this.saveItem('_axioms.auth.error', error);
    }

    get error_description() {
        return this.getItem('_axioms.auth.error_description');
    }

    set error_description(error_description) {
        this.saveItem('_axioms.auth.error_description', error_description);
    }

    getItem(key, storage_type = 'session') {
        let value;
        switch (storage_type) {
            case 'cookie':
                value = Cookie.get(key);
                break;

            case 'session':
                value = sessionStorage.getItem(key);
                break;

            case 'local':
                value = localStorage.getItem(key);
                break;
        }
        return [undefined, null].indexOf(value) === -1 ? value : null;
    }

    saveItem(key, value, storage_type = 'session') {
        switch (storage_type) {
            case 'cookie':
                if ([undefined, null].indexOf(value) !== -1) {
                    Cookie.remove(key);
                } else {
                    Cookie.set(key, value);
                }
                break;

            case 'session':
                if ([undefined, null].indexOf(value) !== -1) {
                    sessionStorage.removeItem(key);
                } else {
                    sessionStorage.setItem(key, value);
                }
                break;

            case 'local':
                if ([undefined, null].indexOf(value) !== -1) {
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, value);
                }
                break;
        }
    }

    parse(key, value) {
        switch (key) {
            case 'token_type':
                this.token_type = value;
                break;
            case 'expires_in':
                this.expires_in = value;
                break;
            case 'access_token':
                this.access_token = value;
                break;
            case 'id_token':
                this.id_token = value;
                break;
            case 'state':
                // Validated state sent is same as recived
                // else set to undefined
                if (this.state == value) {
                    this.state = value;
                } else {
                    this.state = undefined
                }
                break;
            case 'code':
                this.code = value;
                break;
            case 'error':
                this.error = value;
                break;
            case 'error_description':
                this.error_description = value;
                break;
        }
    }

    is_authenticated() {
        try {
            if (Math.floor(Date.now() / 1000) < this.id_exp && this.is_valid_id_token == true) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error); // eslint-disable-line no-console
            return false;
        }
    }

    clear_errors(storage_type = 'session') {
        switch (storage_type) {
            case 'cookie':
                Cookie.remove('_axioms.auth.error');
                Cookie.remove('_axioms.auth.error_description');
                break;

            case 'session':
                sessionStorage.removeItem('_axioms.auth.error');
                sessionStorage.removeItem('_axioms.auth.error_description');
                break;

            case 'local':
                localStorage.removeItem('_axioms.auth.error');
                localStorage.removeItem('_axioms.auth.error_description');
                break;
        }
    }

    clear_all(storage_type = 'session') {
        switch (storage_type) {
            case 'cookie':
                Object.keys(Cookies.get()).forEach(function(cookieName) {
                    if (cookieName !== '_axioms.auth.state') {
                        Cookies.remove(cookieName);
                    }
                });
                break;

            case 'session':
                sessionStorage.clear();
                break;

            case 'local':
                localStorage.clear();
                break;
        }
    }
}

export {
    AuthSession
};
export default AuthSession;