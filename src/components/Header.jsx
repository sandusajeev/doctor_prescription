import React from "react";

function Header() {
  return (
    <header className="bg-primary text-white py-3 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <h2 className="mb-0">
          <i class="fa-solid fa-user-doctor fa-flip"></i> <span style={{ fontWeight: "bold" }}>Doctor's Prescription</span>
        </h2>
      </div>
    </header>
  );
}

export default Header;

