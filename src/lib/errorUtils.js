if (typeof console.prettyLog === 'undefined') {
  console.prettyLog = (contextMessage, error) => {
    console.error(contextMessage, error);
    if (error && error.code === 121) {
      if (error.errInfo) {
        console.error("Validation Error Details:", JSON.stringify(error.errInfo, null, 2));
      }
      if (error.writeErrors && Array.isArray(error.writeErrors)) {
        error.writeErrors.forEach((err) => {
          if (err.code === 121 && err.errInfo) {
            console.error(`Validation Error Details (Index ${err.index}):`, JSON.stringify(err.errInfo, null, 2));
          }
        });
      }
    }
  };
}
