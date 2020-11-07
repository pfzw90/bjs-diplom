"use strict";

const logoutButton = new LogoutButton;
const ratesBoard = new RatesBoard;
const moneyManager = new MoneyManager;
const favoritesWidget = new FavoritesWidget;



function updateProfile() {
    ApiConnector.current(response => {
        ProfileWidget.showProfile(response.data);
    });
}

function getRates() { 
    ApiConnector.getStocks(response => {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    });
}

function getFavorites() {
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

moneyManager.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            updateProfile();
            this.setMessage(response.success, "Счет успешно пополнен.");
        }
        else {
            this.setMessage(response.success, `Ошибка пополнения счета: ${response.error}`);
        }
    });
}

moneyManager.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            updateProfile();
            this.setMessage(response.success, "Валюта успешно конвертирована.");
        }
        else {
            this.setMessage(response.success, `Ошибка конвертации: ${response.error}`);
        }
    });
}

moneyManager.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            updateProfile();
            this.setMessage(response.success, "Операция перевода успешна.");
        }
        else {
            this.setMessage(response.success, `Ошибка перевода: ${response.error}`);
        }
    });
}

favoritesWidget.addUserCallback = function(data) {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            getFavorites();
            this.setMessage(response.success, "Пользователь успешно добавлен в список избранных.");
        }
        else {
            this.setMessage(response.success, `Пользователь не был добавлен в избранное: ${response.error}`);
        }
    });
}

favoritesWidget.removeUserCallback = function(data) {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            getFavorites();
            this.setMessage(response.success, "Пользователь успешно удален из списка избранных.");
        }
        else {
            this.setMessage(response.success, `Ошибка удаления пользователя из списка избранных: ${response.error}`);
        }
    });
}

updateProfile();
getRates();
getFavorites();
let ratesInterval = setInterval(getRates, 60000);


