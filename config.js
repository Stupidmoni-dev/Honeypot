require('dotenv').config();

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    SOLSCAN_API_KEY: process.env.SOLSCAN_API_KEY || '',
    SOLSCAN_API_URL: 'https://api.solscan.io',
    COINGECKO_API_URL: 'https://api.coingecko.com/api/v3',
};
