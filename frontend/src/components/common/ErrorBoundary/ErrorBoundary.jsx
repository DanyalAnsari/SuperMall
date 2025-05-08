import { captureException } from "@sentry/react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  <div role="alert" className="p-4 bg-[#ffe6e6] border-[#ff9999] rounded-xl">
    <h2>Something went wrong!</h2>
    <pre className="text-[#cc0000] whitespace-pre-wrap">{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try Again</button>
    <button onClick={() => window.location.assign("/")}>Go Home</button>
  </div>;
};

const logError = (error, info) => {
  captureException(error, { extra: info });
  console.error(`ErroeBoundary caught:${(error, info)}`);
};

const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={() => window.location.reload()}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
