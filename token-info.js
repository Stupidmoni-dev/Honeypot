const axios = require('axios');
const config = require('./config');
const logger = require('./logger');

async function getTokenInfo(symbol) {
    try {
        const response = await axios.get(`${config.COINGECKO_API_URL}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                ids: symbol.toLowerCase(),
            },
        });

        if (response.data.length === 0) throw new Error('Token not found.');
        const token = response.data[0];

        return {
            name: token.name,
            symbol: token.symbol,
            price: `$${token.current_price}`,
            marketCap: `$${token.market_cap.toLocaleString()}`,
        };
    } catch (error) {
        logger.error(`Error fetching token info: ${error.message}`);
        throw new Error('Failed to retrieve token info.');
    }
}

module.exports = { getTokenInfo };
