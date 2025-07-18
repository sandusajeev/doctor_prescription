import React from "react";

function Footer() {
  return (
    <footer className="bg-light text-center text-muted py-3 mt-5 border-top">
      <div className="container">
        <small>
          © {new Date().getFullYear()} Doctor's Prescription App. All rights reserved.
        </small>
      </div>
    </footer>
  );
}

export default Footer;

