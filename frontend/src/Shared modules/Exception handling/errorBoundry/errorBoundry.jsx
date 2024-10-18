// import React from "react";

// class ErrorBoundary extends React.Component {
//   state = {
//     hasError: false,
//   };

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, info) {
//     console.log(error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       return this.props.fallback;
//     }
//     return this.props.children;
//   }
// }

// export default ErrorBoundary;

import React, { useState, useEffect } from "react";

function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const setErrorBoundary = (error, errorInfo) => {
      setHasError(true);
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    };

    window.addEventListener("error", setErrorBoundary);

    return () => window.removeEventListener("error", setErrorBoundary);
  }, []);

  return (
    <>
      {hasError && fallback}
      {!hasError && children}
    </>
  );
}

export default ErrorBoundary;
