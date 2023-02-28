  //Render a price, accordingly to the currency global state
  export default function showPrice(priceArray, selectedCurrency) {
    //Find a object that has the actual selected currency 
    const rightPriceObject = priceArray.find(({currency: {symbol}}) => symbol === selectedCurrency)
    //Return price in such currency
    const {amount} = rightPriceObject;
    return amount;
    
  }
