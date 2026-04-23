import React from "react";

export const AnimatedRoutes = ({ children, location }: any) => {
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
};