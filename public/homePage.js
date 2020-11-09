"use strict";

const logoutButton = new LogoutButton;
const ratesBoard = new RatesBoard;
const moneyManager = new MoneyManager;
const favoritesWidget = new FavoritesWidget;

const updateProfile = () => {
    ApiConnector.current(response => {
        ProfileWidget.showProfile(response.data);
    });
}

const getRates = () => { 
    ApiConnector.getStocks(response => {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    });
}

const getFavorites = () => {
    ApiConnector.getFavorites(response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
}

logoutButton.action = () => {
    ApiConnector.logout(result => {
        if (result.success) location.reload();
    });
}

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Счет успешно пополнен.");
        }
        else {
            moneyManager.setMessage(response.success, `Ошибка пополнения счета: ${response.error}`);
        }
    });
}

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Валюта успешно конвертирована.");
        }
        else {
            moneyManager.setMessage(response.success, `Ошибка конвертации: ${response.error}`);
        }
    });
}

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, "Операция перевода успешна.");
        }
        else {
            moneyManager.setMessage(response.success, `Ошибка перевода: ${response.error}`);
        }
    });
}

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {          
            getFavorites();
            favoritesWidget.setMessage(response.success, "Пользователь успешно добавлен в список избранных.");
        }
        else {
            tfavoritesWidget.setMessage(response.success, `Пользователь не был добавлен в избранное: ${response.error}`);
        }
    });
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            getFavorites();
            favoritesWidget.setMessage(response.success, "Пользователь успешно удален из списка избранных.");
        }
        else {
            favoritesWidget.setMessage(response.success, `Ошибка удаления пользователя из списка избранных: ${response.error}`);
        }
    });
}

updateProfile();
getRates();
getFavorites();
let ratesInterval = setInterval(getRates, 60000);


