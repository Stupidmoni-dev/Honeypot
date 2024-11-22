const Bottleneck = require('bottleneck');

// Configure rate limiter
const limiter = new Bottleneck({
    minTime: 300, // 1 request every 300ms
    maxConcurrent: 5,
});

module.exports = limiter;
