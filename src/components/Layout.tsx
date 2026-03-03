import React, { type ReactNode } from "react";
import "./Layout.css";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  // title: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      {/* Header goes here */}
      <Header />
      {/* Main content goes here */}
      <main className="main">
        {/* <h2>{title}</h2> */}
        {children}
      </main>
      {/* Footer goes here */}
      <Footer />
    </div>
  );
};

export default Layout;
