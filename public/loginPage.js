"use strict";

const userForm = new UserForm;

userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, response => {
        if (response.success) {
            location.reload();
        }
        else {
            this.setLoginErrorMessage(response.error);
        }
    });
}

userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, response => {
        if (response.success) {
            location.reload();
        }
        else {
            this.setRegisterErrorMessage(response.error);
        }
    });
}