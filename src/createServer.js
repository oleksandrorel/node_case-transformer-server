const http = require('http');
const { convertToCase } = require('./convertToCase/convertToCase.js');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const errors = [];
    const normalizedUrl = new URL(req.url, 'http://localhost:5700');
    const targetCase = normalizedUrl.searchParams.get('toCase');
    const originalText = normalizedUrl.pathname.slice(1);

    try {
      if (!originalText) {
        errors.push({
          message: `Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
        });
      }

      if (!targetCase) {
        errors.push({
          message: `"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
        });
      }

      if (errors.length) {
        const errorResult = { errors };
        const serializedResult = JSON.stringify(errorResult);

        res.statusCode = 400;
        res.end(serializedResult);

        return;
      }

      const { originalCase, convertedText } = convertToCase(
        originalText,
        targetCase,
      );

      const result = {
        originalCase,
        targetCase,
        originalText,
        convertedText,
      };
      const serialized = JSON.stringify(result);

      res.end(serialized);
    } catch (error) {
      if (targetCase) {
        errors.push({
          message: `This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.`,
        });
      }

      const result = { errors };
      const serialized = JSON.stringify(result);

      res.statusCode = 400;
      res.end(serialized);
    }
  });
}

module.exports = {
  createServer,
};

// Write code here
// Also, you can create additional files in the src folder
// and import (require) them here
