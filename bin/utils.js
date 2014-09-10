'use strict';

// Simplifies error object creation with passed status
exports.error = function(msg, status) {
  var err = new Error(msg);
  if (status) {
    err.status = status;
  }
  return err;
};
