const solanaAPI = require('./solana-api');
const tokenInfo = require('./token-info');
const logger = require('./logger');

async function analyzeToken(address, tokenSymbol) {
    try {
        const [accountInfo, transactions, tokenDetails] = await Promise.all([
            solanaAPI.getAccountInfo(address),
            solanaAPI.getTokenTransactions(address),
            tokenInfo.getTokenInfo(tokenSymbol),
        ]);

        // Risk Analysis
        const isHoneypot = checkHoneypotLogic(accountInfo, transactions);
        const ownership = checkOwnership(accountInfo);

        return {
            honeypot: isHoneypot ? '⚠️ High Risk' : '✅ No Honeypot Detected',
            ownership,
            tokenDetails,
            transactions: transactions.slice(0, 5),
        };
    } catch (error) {
        logger.error(`Error analyzing token: ${error.message}`);
        throw new Error('Analysis failed. Check the token address and symbol.');
    }
}

// Updated checks
function checkHoneypotLogic(accountInfo, transactions) {
    if (!accountInfo || transactions.length === 0) return true;
    if (transactions.every(tx => tx.type === 'receive')) return true; // No outgoing transactions
    return false;
}

function checkOwnership(accountInfo) {
    if (!accountInfo) return '❓ Unknown';
    return accountInfo.owner === '11111111111111111111111111111111'
        ? '🚩 Centralized Ownership'
        : `✅ Owner: ${accountInfo.owner}`;
}

module.exports = { analyzeToken };
