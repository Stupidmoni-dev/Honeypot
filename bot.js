const { Telegraf } = require('telegraf');
const checker = require('./checker');
const limiter = require('./rate-limiter');
const logger = require('./logger');
const config = require('./config');

const bot = new Telegraf(config.BOT_TOKEN);

// Start Command
bot.start((ctx) => {
    ctx.reply(`
        🚀 Welcome to the Honeypot Checker Bot by Stupidmoni-dev!
        Analyze Solana tokens for risks before investing.

        Use /check <TOKEN_ADDRESS> <TOKEN_SYMBOL> to analyze a token.
        Example: /check <TOKEN_ADDRESS> solana
    `);
    logger.info('Bot started by user: ' + ctx.from.id);
});

// Check Command
bot.command('check', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 2) {
        return ctx.reply('❌ Usage: /check <TOKEN_ADDRESS> <TOKEN_SYMBOL>');
    }

    const [address, symbol] = args;

    try {
        ctx.reply('🔍 Analyzing the token. Please wait...');
        const analysis = await limiter.schedule(() => checker.analyzeToken(address, symbol));

        ctx.reply(`
            🛠️ **Token Analysis:**
            - **Honeypot Risk**: ${analysis.honeypot}
            - **Ownership**: ${analysis.ownership}
            - **Token Details**: 
                Name: ${analysis.tokenDetails.name}
                Symbol: ${analysis.tokenDetails.symbol}
                Price: ${analysis.tokenDetails.price}
                Market Cap: ${analysis.tokenDetails.marketCap}
            - **Recent Transactions**: ${analysis.transactions.map(tx => `TxID: ${tx.txId}`).join('\n')}
        `);
        logger.info(`Analysis completed for token: ${symbol}, address: ${address}`);
    } catch (error) {
        ctx.reply(`❌ Error: ${error.message}`);
        logger.error(`Error during analysis for token: ${symbol}, address: ${address}`);
    }
});

// Launch the bot
bot.launch()
    .then(() => logger.info('Bot launched successfully.'))
    .catch((err) => logger.error('Bot failed to launch: ' + err.message));

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
