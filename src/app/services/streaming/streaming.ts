import {
  PRICE_ADAPTER,
  NEWS_ADAPTER,
  ORDER_ADAPTER,
  CLIENT_ACCOUNT_MARGIN_ADAPTER,
  TRADE_MARGIN_ADAPTER,
  QUOTES_ADAPTER,
  PRICE_ALERTS_ADAPTER
} from './adapter-enum';

import {
  PRICE_ITEM_GROUP,
  NEWS_ITEM_GROUP,
  ORDER_ITEM_GROUP,
  ACCOUNT_MARGIN_ITEM_GROUP,
  TRADE_MARGIN_ITEM_GROUP,
  QUOTE_ITEM_GROUP,
  PRICE_ALERT_ITEM_GROUP
} from './item-group-enum';

let lsClient;
let subscriptionPriceArray = [];
let subscriptionNewsArray = [];
let subscriptionOrder;
let subscriptionClientAccMargin;
let subscriptionTradeMargin;
let subscriptionQuotes;
let subscriptionPriceAlerts;

let connect = (user, token, pushServerUrl, adapterSetName, connectionCallback) => {

  lsClient = new LightstreamerClient(pushServerUrl, adapterSetName);
  lsClient.connectionDetails.setUser(user);
  lsClient.connectionDetails.setPassword(token);
  lsClient.addListener({
    onServerError: function (errorCode, errorMessage) {
      connectionCallback(errorCode + errorMessage);
    },
    onStatusChange: function (status) {
      connectionCallback(status);
    }
  });
  lsClient.connect();
};

let parseDataAdapter = (str) => {

  let divisionIndex = str.indexOf('.');
  let dataAdapter = str.substring(0, divisionIndex);
  let item = str.substring(divisionIndex + 1);
  return {
    dataAdapter: dataAdapter,
    item: item
  };
};

let buildResponse = (updateObject, callback) => {

  let response = {};
  updateObject.forEachField(iterator);
  callback(JSON.stringify(response));

  function iterator(fieldName, fieldPos, fieldValue) {
    response[fieldName] = fieldValue;
  }
};

let isPriceSubscribed = (item) => {

  for (let i = 0; i < subscriptionPriceArray.length; i++) {
    if (item === subscriptionPriceArray[i].item) {
      return true;
    }
  }
  return false;
};

let unsub = (index, subscriptionArray, callback) => {

  let subscription = subscriptionArray[index].subscription;

  if (subscription && subscription.isActive()) {

    if (callback) {
      callback('Unsubscribe', 200, subscription.getDataAdapter() + '.' + subscription.getItems());
    }
    lsClient.unsubscribe(subscription);
  }
};

let subscribeToPrice = (marketId, onPricesItemUpdate, logCallback) => {

  let dataAdapterName = PRICE_ADAPTER + '.' + marketId;
  let adapter = parseDataAdapter(dataAdapterName);
  let subscriptionPrice = new Subscription('MERGE', adapter.item, PRICE_ITEM_GROUP);

  subscriptionPrice.addListener({
    onItemUpdate: function (updateObject) {
      buildResponse(updateObject, onPricesItemUpdate);
    },
    onSubscription: function () {
      subscriptionPriceArray.push({
        subscription: subscriptionPrice,
        item: adapter.item
      });
      if (logCallback) {
        logCallback('Subscribe', 200, dataAdapterName);
      }
    },
    onSubscriptionError: function (errorCode, errorMessage) {
      if (logCallback) {
        logCallback('Subscribe', errorCode, errorMessage);
      }
    }
  });

  if (!isPriceSubscribed(adapter.item)) {

    subscriptionPrice.setDataAdapter(adapter.dataAdapter);
    lsClient.subscribe(subscriptionPrice);
  }
};

let isNewsSubscribed = (item) => {

  for (let i = 0; i < subscriptionNewsArray.length; i++) {
    if (item === subscriptionNewsArray[i].item) {
      return true;
    }
  }
  return false;
};

let subscribeToNews = (source, onNewsItemUpdate, logCallback) => {

  let dataAdapterName = NEWS_ADAPTER + '.' + source;
  let adapter = parseDataAdapter(dataAdapterName);
  let subscriptionNews = new Subscription('MERGE', adapter.item, NEWS_ITEM_GROUP);

  subscriptionNews.addListener({
    onItemUpdate: function (updateObject) {
      buildResponse(updateObject, onNewsItemUpdate);
    },
    onSubscription: function () {
      subscriptionNewsArray.push({
        subscription: subscriptionNews,
        item: adapter.item
      });
      if (logCallback) {
        logCallback('Subscribe', 200, dataAdapterName);
      }
    },
    onSubscriptionError: function (errorCode, errorMessage) {
      if (logCallback) {
        logCallback('Subscribe', errorCode, errorMessage);
      }
    }
  });

  if (!isNewsSubscribed(adapter.item)) {

    subscriptionNews.setDataAdapter(adapter.dataAdapter);
    lsClient.subscribe(subscriptionNews);
  }
};

let subscribeToOrder = (onOrdersItemUpdate, logCallback) => {

  let adapter = parseDataAdapter(ORDER_ADAPTER);
  subscriptionOrder = new Subscription('RAW', adapter.item, ORDER_ITEM_GROUP);

  subscriptionOrder.addListener({
    onItemUpdate: function (updateObject) {
      buildResponse(updateObject, onOrdersItemUpdate);
    },
    onSubscription: function () {
      if (logCallback) {
        logCallback('Subscribe', 200, ORDER_ADAPTER);
      }
    },
    onSubscriptionError: function (errorCode, errorMessage) {
      if (logCallback) {
        logCallback('Subscribe', errorCode, errorMessage);
      }
    }
  });

  subscriptionOrder.setDataAdapter(adapter.dataAdapter);
  lsClient.subscribe(subscriptionOrder);
};

let subscribeToClientAccountMargins = (onClientAccMarginsItemUpdate, logCallback) => {

  let adapter = parseDataAdapter(CLIENT_ACCOUNT_MARGIN_ADAPTER);
  subscriptionClientAccMargin = new Subscription('MERGE', adapter.item, ACCOUNT_MARGIN_ITEM_GROUP);

  subscriptionClientAccMargin.addListener({
    onItemUpdate: function (updateObject) {
      buildResponse(updateObject, onClientAccMarginsItemUpdate);
    },
    onSubscription: function () {
      if (logCallback) {
        logCallback('Subscribe', 200, CLIENT_ACCOUNT_MARGIN_ADAPTER);
      }
    },
    onSubscriptionError: function (errorCode, errorMessage) {
      if (logCallback) {
        logCallback('Subscribe', errorCode, errorMessage);
      }
    }
  });

  subscriptionClientAccMargin.setDataAdapter(adapter.dataAdapter);
  lsClient.subscribe(subscriptionClientAccMargin);
};

let subscribeToTradeMargin = (onTradeMarginsItemUpdate, logCallback) => {

  let adapter = parseDataAdapter(TRADE_MARGIN_ADAPTER);
  subscriptionTradeMargin = new Subscription('RAW', adapter.item, TRADE_MARGIN_ITEM_GROUP);

  subscriptionTradeMargin.addListener({
    onItemUpdate: function (updateObject) {
      buildResponse(updateObject, onTradeMarginsItemUpdate);
    },
    onSubscription: function () {
      if (logCallback) {
        logCallback('Subscribe', 200, TRADE_MARGIN_ADAPTER);
      }
    },
    onSubscriptionError: function (errorCode, errorMessage) {
      if (logCallback) {
        logCallback('Subscribe', errorCode, errorMessage);
      }
    }
  });

  subscriptionTradeMargin.setDataAdapter(adapter.dataAdapter);
  lsClient.subscribe(subscriptionTradeMargin);
};

let subscribeToQuotes = (onQuotesItemUpdate, logCallback) => {

  let adapter = parseDataAdapter(QUOTES_ADAPTER);
  subscriptionQuotes = new Subscription('MERGE', adapter.item, QUOTE_ITEM_GROUP);

  subscriptionQuotes.addListener({
    onItemUpdate: function (updateObject) {
      buildResponse(updateObject, onQuotesItemUpdate);
    },
    onSubscription: function () {
      if (logCallback) {
        logCallback('Subscribe', 200, QUOTES_ADAPTER);
      }
    },
    onSubscriptionError: function (errorCode, errorMessage) {
      if (logCallback) {
        logCallback('Subscribe', errorCode, errorMessage);
      }
    }
  });

  subscriptionQuotes.setDataAdapter(adapter.dataAdapter);
  lsClient.subscribe(subscriptionQuotes);
};

let subscribeToPriceAlerts = (onPriceAlertsItemUpdate, logCallback) => {

  let adapter = parseDataAdapter(PRICE_ALERTS_ADAPTER);
  subscriptionPriceAlerts = new Subscription('MERGE', adapter.item, PRICE_ALERT_ITEM_GROUP);

  subscriptionPriceAlerts.addListener({
    onItemUpdate: function (updateObject) {
      buildResponse(updateObject, onPriceAlertsItemUpdate);
    },
    onSubscription: function () {
      if (logCallback) {
        logCallback('Subscribe', 200, PRICE_ALERTS_ADAPTER);
      }
    },
    onSubscriptionError: function (errorCode, errorMessage) {
      if (logCallback) {
        logCallback('Subscribe', errorCode, errorMessage);
      }
    }
  });

  subscriptionPriceAlerts.setDataAdapter(adapter.dataAdapter);
  lsClient.subscribe(subscriptionPriceAlerts);
};

let unsubscribeFromPrices = (marketId, logCallback) => {

  let item = 'PRICE.' + marketId;
  let subscriptionPrice;

  if (marketId === null) {
    for (let i = 0; i < subscriptionPriceArray.length; i++) {
      unsub(i, subscriptionPriceArray, logCallback);
    }
    subscriptionPriceArray = [];
  } else {
    for (let i = 0; i < subscriptionPriceArray.length; i++) {
      if (item === subscriptionPriceArray[i].item) {
        unsub(i, subscriptionPriceArray, logCallback);
        subscriptionPriceArray.splice(i, 1);
        break;
      }
    }
  }
};

let unsubscribeFromNews = (source, logCallback) => {

  let item = 'HEADLINES.' + source;
  let subscriptionNews;

  if (source === null) {
    for (let i = 0; i < subscriptionNewsArray.length; i++) {
      unsub(i, subscriptionNewsArray, logCallback);
    }
    subscriptionNewsArray = [];
  } else {
    for (let i = 0; i < subscriptionNewsArray.length; i++) {
      if (item === subscriptionNewsArray[i].item) {
        unsub(i, subscriptionNewsArray, logCallback);
        subscriptionNewsArray.splice(i, 1);
        break;
      }
    }
  }
};

let unsubscribeFromOrders = (logCallback) => {

  if (subscriptionOrder && subscriptionOrder.isActive()) {
    if (logCallback) {
      logCallback('Unsubscribe', 200, subscriptionOrder.getDataAdapter());
    }
    lsClient.unsubscribe(subscriptionOrder);
  }
};

let unsubscribeFromClientAccountMargins = (logCallback) => {

  if (subscriptionClientAccMargin && subscriptionClientAccMargin.isActive()) {
    if (logCallback) {
      logCallback('Unsubscribe', 200, subscriptionClientAccMargin.getDataAdapter());
    }
    lsClient.unsubscribe(subscriptionClientAccMargin);
  }
};

let unsubscribeFromTradeMargins = (logCallback) => {

  if (subscriptionTradeMargin && subscriptionTradeMargin.isActive()) {
    if (logCallback) {
      logCallback('Unsubscribe', 200, subscriptionTradeMargin.getDataAdapter());
    }
    lsClient.unsubscribe(subscriptionTradeMargin);
  }
};

let unsubscribeFromQuotes = (logCallback) => {

  if (subscriptionQuotes && subscriptionQuotes.isActive()) {
    if (logCallback) {
      logCallback('Unsubscribe', 200, subscriptionQuotes.getDataAdapter());
    }
    lsClient.unsubscribe(subscriptionQuotes);
  }
};

let unsubscribeFromPriceAlerts = (logCallback) => {

  if (subscriptionPriceAlerts && subscriptionPriceAlerts.isActive()) {
    if (logCallback) {
      logCallback('Unsubscribe', 200, subscriptionPriceAlerts.getDataAdapter());
    }
    lsClient.unsubscribe(subscriptionPriceAlerts);
  }
};

let disconnect = (logCallback) => {

  unsubscribeFromPrices(null, logCallback);
  unsubscribeFromNews(null, logCallback);
  unsubscribeFromOrders(logCallback);
  unsubscribeFromClientAccountMargins(logCallback);
  unsubscribeFromTradeMargins(logCallback);
  unsubscribeFromQuotes(logCallback);
  unsubscribeFromPriceAlerts(logCallback);

  lsClient.disconnect();
};

export {
  connect,
  subscribeToPrice,
  subscribeToNews,
  subscribeToOrder,
  subscribeToClientAccountMargins,
  subscribeToTradeMargin,
  subscribeToQuotes,
  subscribeToPriceAlerts,
  unsubscribeFromPrices,
  unsubscribeFromNews,
  unsubscribeFromOrders,
  unsubscribeFromClientAccountMargins,
  unsubscribeFromTradeMargins,
  unsubscribeFromQuotes,
  unsubscribeFromPriceAlerts,
  disconnect
};
